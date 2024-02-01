import {NextFunction, Request, Response} from "express";
import {IReturnable} from "../../domain/interfaces/IReturnable";

export abstract class AbstractController {
  public async handle(req: Request, res: Response, next: NextFunction) {
    try {
      const response = await this.process(req, res);

      if (typeof response.data === "boolean" || typeof response.data === "string") {
        return res.status(response.statusCode).json(response.data);
      } else if (this.isReturnable(response.data)) {
        return res.status(response.statusCode).json(response.data.createDto());
      } else if (Array.isArray(response.data) && response.data.every((item) => this.isReturnable(item))) {
        return res.status(response.statusCode).json(response.data.map((item) => item.createDto()));
      } else {
        throw new Error("Invalid response data type");
      }
    } catch (error) {
      console.warn(`${req.method} ${req.originalUrl} failed.`, {
        error: JSON.stringify(error),
        method: `${this.constructor.name}.process`,
      });

      next(error);
    }
  }

  protected abstract process(
    req: Request,
    res: Response
  ): Promise<{statusCode: number; data: boolean | string | IReturnable | IReturnable[]}>;

  private isReturnable(data: any): data is IReturnable {
    return "createDto" in data;
  }
}
