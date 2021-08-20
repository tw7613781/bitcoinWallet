import express, { Router, Request, Response } from 'express';
import { Wallet, Address } from './wallet';
import { RESPONSE_CODE } from './errorCode';

export class WalletRouter {
  public readonly path: string = 'wallet';
  private readonly router: Router;
  constructor() {
    this.router = express.Router();
    this.setRoute();
  }

  public getRouter(): Router {
    return this.router;
  }

  private setRoute(): void {
    this.router.post('/segWitAddress', (req: Request, res: Response) => {
      try {
        const addr: Address = Wallet.generateSegWitAddress(req.body.seed, req.body.path);
        res.status(RESPONSE_CODE.SUCCESS).json({
          status: RESPONSE_CODE.SUCCESS,
          timestamp: Date.now(),
          result: addr
        });
      } catch (err) {
        res.status(RESPONSE_CODE.BAD_REQUEST).json({
          status: RESPONSE_CODE.BAD_REQUEST,
          message: err
        });
      }
    });

    this.router.post('/multiSigAddress', (req: Request, res: Response) => {
      try {
        const addr: Address = Wallet.generateMultiSigP2SHAddress(req.body.m, req.body.n, req.body.pubKeys);
        res.status(RESPONSE_CODE.SUCCESS).json({
          status: RESPONSE_CODE.SUCCESS,
          timestamp: Date.now(),
          result: addr
        });
      } catch (err) {
        res.status(RESPONSE_CODE.BAD_REQUEST).json({
          status: RESPONSE_CODE.BAD_REQUEST,
          message: err
        });
      }
    });
  }
}
