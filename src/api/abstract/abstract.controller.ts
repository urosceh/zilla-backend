import {NextFunction, Request, Response} from "express";
import {InternalServerError} from "../../domain/errors/errors.index";
import {IBearerData, IDtoable} from "../../domain/interfaces/IReturnable";
import {Returnable} from "../../domain/types/Returnable";

export abstract class AbstractController {
  public async handle(req: Request, res: Response, next: NextFunction) {
    try {
      const response = await this.process(req);

      if (!response.data) {
        return res.status(response.statusCode).send();
      } else if (this.isBearerData(response.data)) {
        return res.status(response.statusCode).json({bearerToken: response.data.bearerToken});
      } else if (this.isDtoable(response.data)) {
        return res.status(response.statusCode).json(response.data.toDto());
      } else if (this.isDtoableArray(response.data)) {
        return res.status(response.statusCode).json(response.data.map((item) => item.toDto()));
      } else {
        throw new InternalServerError("Invalid Response Data Type");
      }
    } catch (error) {
      console.warn(`${req.method} ${req.originalUrl} failed.`, {
        error: JSON.stringify(error),
        method: `${this.constructor.name}.process`,
      });

      next(error);
    }
  }

  protected abstract process(req: Request): Promise<{statusCode: number; data?: Returnable}>;

  private isDtoableArray(data: any): data is IDtoable[] {
    return Array.isArray(data) && data.every((item) => this.isDtoable(item));
  }

  private isDtoable(data: any): data is IDtoable {
    return "toDto" in data;
  }

  private isBearerData(data: any): data is IBearerData {
    return "bearerToken" in data;
  }
}
