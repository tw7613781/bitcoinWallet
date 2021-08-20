import { Response } from 'express';
import { Address } from './wallet';
export enum RESPONSE_CODE {
  SUCCESS = 200,
  BAD_REQUEST = 400,
  NOT_FOUND = 404,
  INTERNAL_SERVER_ERROR = 500,
  NOT_IMPLEMENTED = 501,
  SERVICE_UNAVAILABLE = 503
}

type result = Address;

export function successResponse(res: Response, result: result): void {
  res.status(RESPONSE_CODE.SUCCESS).json({
    status: RESPONSE_CODE.SUCCESS,
    timestamp: Date.now(),
    result
  });
}

export function badRequestResponse(res: Response, err: Error): void {
  res.status(RESPONSE_CODE.BAD_REQUEST).json({
    status: RESPONSE_CODE.BAD_REQUEST,
    timestamp: Date.now(),
    message: err.message
  });
}

export function notFoundResponse(res: Response): void {
  res.status(RESPONSE_CODE.NOT_FOUND).json({
    status: RESPONSE_CODE.NOT_FOUND,
    timestamp: Date.now(),
    message: 'Invalid route : resource not found'
  });
}

export function internalServerError(res: Response): void {
  res.status(RESPONSE_CODE.INTERNAL_SERVER_ERROR).json({
    status: RESPONSE_CODE.INTERNAL_SERVER_ERROR,
    timestamp: Date.now(),
    message: 'Internal server error'
  });
}
