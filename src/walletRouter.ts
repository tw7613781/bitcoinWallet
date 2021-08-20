import express, { Router, Request, Response } from 'express';
import { Wallet, Address } from './wallet';
import { RESPONSE_CODE, successResponse, badRequestResponse, internalServerError } from './customResponse';
import { ApiError } from './apiError';
export class WalletRouter {
  public readonly path: string = '/wallet';
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
        successResponse(res, addr);
      } catch (err) {
        if (err.type === RESPONSE_CODE.BAD_REQUEST) {
          badRequestResponse(res, err);
        } else {
          internalServerError(res);
        }
      }
    });

    this.router.post('/multiSigAddress', (req: Request, res: Response) => {
      try {
        const m = req.body.m;
        const n = req.body.n;
        if (m > n) {
          throw new ApiError(RESPONSE_CODE.BAD_REQUEST, 'm should less or equal to n');
        }
        const addr: Address = Wallet.generateMultiSigP2SHAddress(m, n, req.body.pubKeys);
        successResponse(res, addr);
      } catch (err) {
        if (err.type === RESPONSE_CODE.BAD_REQUEST) {
          badRequestResponse(res, err);
        } else {
          internalServerError(res);
        }
      }
    });
  }
}
