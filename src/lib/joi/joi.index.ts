import {NextFunction, Request, Response} from "express";
import Joi from "joi";

export function bodySchemaValidationMiddleware(schema: Joi.Schema) {
  return (request: Request, response: Response, next: NextFunction) => {
    const result = checkSchema(request.body, schema);
    if (result.errors || !result.value) {
      return result.errors ? next(result.errors) : next(new Error("Invalid body"));
    }
    request.body = result.value;
    return next();
  };
}

export function paramsSchemaValidationMiddleware(schema: Joi.Schema) {
  return (request: Request, response: Response, next: NextFunction) => {
    const result = checkSchema(request.params, schema);
    if (result.errors || !result.value) {
      return result.errors ? next(result.errors) : next(new Error("Invalid params"));
    }
    request.params = result.value;
    return next();
  };
}

function checkSchema(data: any, schema: Joi.Schema) {
  const result = schema.validate(data);
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
