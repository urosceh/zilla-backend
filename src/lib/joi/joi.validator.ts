import {NextFunction, Request, Response} from "express";
import Joi from "joi";
import {BadRequest} from "../../domain/errors/errors.index";

export class JoiValidator {
  public static bodySchemaValidationMiddleware(schema: Joi.Schema) {
    return (request: Request, response: Response, next: NextFunction) => {
      const result = this.checkSchema(request.body, schema);
      if (result.errors || !result.value) {
        return result.errors ? next(new BadRequest(JSON.stringify(result.errors))) : next(new BadRequest("Invalid body"));
      }
      request.body = result.value;
      return next();
    };
  }

  public static paramsSchemaValidationMiddleware(schema: Joi.Schema) {
    return (request: Request, response: Response, next: NextFunction) => {
      const result = this.checkSchema(request.params, schema);
      if (result.errors || !result.value) {
        return result.errors ? next(new BadRequest(JSON.stringify(result.errors))) : next(new BadRequest("Invalid params"));
      }
      request.params = result.value;
      return next();
    };
  }

  public static querySchemaValidationMiddleware(schema: Joi.Schema) {
    return (request: Request, response: Response, next: NextFunction) => {
      const result = this.checkSchema(request.query, schema);
      if (result.errors || !result.value) {
        return result.errors ? next(new BadRequest(JSON.stringify(result.errors))) : next(new BadRequest("Invalid query"));
      }
      request.query = result.value;
      return next();
    };
  }

  public static checkSchema(data: any, schema: Joi.Schema, options?: Joi.ValidationOptions) {
    const result = schema.validate(data, options);
    let errors;
    if (result.error) {
      errors = result.error.details.map((value) => {
        return {
          error: value.message.replace(/['"]/g, ""),
          path: value.path,
          type: value.type,
        };
      });
    }
    return {
      value: result.value,
      errors,
    };
  }
}
