import express, { Router, Request, Response } from 'express';
import { isBip32Path, isCompressedPubKey, isHexString, isPositiveNum } from './utils';
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
        const seed = req.body.seed;
        const path = req.body.path;
        if (!seed || !isHexString(seed) || seed.length < 32 || seed.length > 128) {
          throw new ApiError(RESPONSE_CODE.BAD_REQUEST, 'seed should be a hex string length varies from 32 to 128');
        }
        if (!isBip32Path(path)) {
          throw new ApiError(RESPONSE_CODE.BAD_REQUEST, `path should be a bip 32 derive path follow regexp ^m\/(\d+'?\/)*(\d+'?)$`);
        }
        const addr: Address = Wallet.generateSegWitAddress(seed, path);
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
        const pubKeys = req.body.pubKeys;
        if (!m || !isPositiveNum(m) || !n || isPositiveNum(n) || m > n) {
          throw new ApiError(RESPONSE_CODE.BAD_REQUEST, 'm and n should both be a positive number and m should less or equal to n');
        }
        if (!Array.isArray(pubKeys)) {
          throw new ApiError(RESPONSE_CODE.BAD_REQUEST, 'pubKeys should be a compressed pubkey hex (66 length long) array');
        }
        if (m > pubKeys.length) {
          throw new ApiError(RESPONSE_CODE.BAD_REQUEST, 'm should be less or equal to the pubKeys count');
        }
        for (const pubKey of pubKeys) {
          if (!isCompressedPubKey(pubKey)) {
            throw new ApiError(RESPONSE_CODE.BAD_REQUEST, 'pubKeys should be a compressed pubkey hex (66 length long) array');
          }
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
