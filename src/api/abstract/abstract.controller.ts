import {NextFunction, Request, Response} from "express";
import {IBearerData, IDtoable, IReturnable} from "../../domain/interfaces/IReturnable";

export abstract class AbstractController {
  public async handle(req: Request, res: Response, next: NextFunction) {
    try {
      const response = await this.process(req, res);

      if (!response.data) {
        return res.status(response.statusCode).send();
      } else if (this.isBearerData(response.data)) {
        return res.status(response.statusCode).json({bearerToken: response.data.bearerToken});
      } else if (this.isDtoable(response.data)) {
        return res.status(response.statusCode).json(response.data.createDto());
      } else if (this.isDtoableArray(response.data)) {
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

  protected abstract process(req: Request, res: Response): Promise<{statusCode: number; data?: IReturnable}>;

  private isDtoable(data: any): data is IDtoable {
    return "createDto" in data;
  }

  private isDtoableArray(data: any): data is IDtoable[] {
    return Array.isArray(data) && data.every((item) => this.isDtoable(item));
  }

  private isBearerData(data: any): data is IBearerData {
    return "bearerToken" in data;
  }
}
