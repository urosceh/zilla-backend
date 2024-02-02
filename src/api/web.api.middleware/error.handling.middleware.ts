import {NextFunction, Request, Response} from "express";
import {DomainError} from "../../domain/errors/BaseError";

export class ErrorHandlingMiddleware {
  public static handleErrors(err: Error, req: Request, res: Response, next: NextFunction) {
    if (err instanceof DomainError) {
      console.warn(err.message, err.details);
      res.status(err.statusCode).json(err.message);
    } else {
      res.status(500).json({error: err.message || "Unknown Error"});
    }
  }
}
