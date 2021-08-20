import helmet from 'helmet';
import dotenv from 'dotenv';
import { RESPONSE_CODE } from './errorCode';
import express, { Express, Response } from 'express';
import { WalletRouter } from './walletRouter';

dotenv.config();
class HttpServer {
  public readonly version: string = 'v1';
  public port: number | string;
  private app: Express;
  private walletRouter: WalletRouter;
  constructor() {
    this.port = process.env.PORT || 3000;
    this.app = express();
    this.walletRouter = new WalletRouter();
  }

  public start() {
    this.app.use(helmet());
    this.app.use(express.json());
    this.app.use(this.version, express.Router());
    this.app.use(this.walletRouter.path, this.walletRouter.getRouter());
    this.app.use((res: Response) => {
      res.status(RESPONSE_CODE.NOT_FOUND).json({
        status: RESPONSE_CODE,
        timestamp: Date.now(),
        message: 'Invalid route : resource not found'
      });
    });

    this.app.listen(this.port, () => console.log(`Running in ${this.port}`));
  }
}

const httpServer = new HttpServer();
httpServer.start();
