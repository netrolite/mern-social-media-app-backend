import { NextFunction } from "express";
import ApiErr, { ErrCodes } from "../utils/errs/ApiErr";
import { TApiErrs } from "../utils/errs";
import { MongoError } from "mongodb";
import { IReq, IRes } from "../utils/reqResInterfaces";
import isErrCausedByUser from "../utils/isErrCausedByUser";

export type TErr = TApiErrs | Error | MongoError;

interface IErrObject {
  message: string,
  code?: number,
  duplicates?: string[]
}

export default function errHandler(
  err: TErr, req: IReq, res: IRes, next: NextFunction
) {
  const errObj: IErrObject = {
    message: err.message || "No error message was provided"
  }
  let code = 500;
  console.log(err);
  
  if (err.name === "ApiErr") {
    code = (err as ApiErr).code;
  } else if (isErrCausedByUser(err)) {
    code = ErrCodes.BadRequest;
  } else {
    console.error(err);
  }

  res.status(code).json(errObj);
}
