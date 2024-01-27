import {NextFunction, Request, Response} from "express";

export abstract class AbstractController {
  public async handle(req: Request, res: Response, next: NextFunction) {
    try {
      return await this.process(req, res);
    } catch (error) {
      console.warn(`${req.method} ${req.originalUrl} failed.`, {
        error: JSON.stringify(error),
        method: `${this.constructor.name}.process`,
      });

      next(error);
    }
  }

  protected abstract process(req: Request, res: Response): Promise<Response>;
}
