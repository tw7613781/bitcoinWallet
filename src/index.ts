import helmet from 'helmet';
import dotenv from 'dotenv';
import { notFoundResponse } from './customResponse';
import express, { Express, Request, Response } from 'express';
import { WalletRouter } from './walletRouter';

dotenv.config();
export class HttpServer {
  public readonly prefix: string = '/api/v1';
  public port: number | string;
  public app: Express;
  private walletRouter: WalletRouter;
  constructor() {
    this.port = process.env.PORT || 3000;
    this.app = express();
    this.walletRouter = new WalletRouter();
    this.app.use(helmet());
    this.app.use(express.json());
    this.app.use(this.prefix + this.walletRouter.path, this.walletRouter.getRouter());
    this.app.use((req: Request, res: Response) => {
      notFoundResponse(res);
    });
  }

  public start() {
    this.app.listen(this.port, () => console.log(`Running in ${this.port}`));
  }
}

if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'production') {
  const httpServer = new HttpServer();
  httpServer.start();
}
