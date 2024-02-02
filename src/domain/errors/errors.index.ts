import {DomainError} from "./BaseError";

export class BadRequest extends DomainError {
  constructor(message: string, details?: Record<string, any>) {
    super(400, message, details ?? {});
  }
}

export class UnauthorizedAccess extends DomainError {
  constructor(message: string, details?: Record<string, any>) {
    super(401, message, details ?? {});
  }
}

export class ForbiddenAccess extends DomainError {
  constructor(message: string, details?: Record<string, any>) {
    super(403, message, details ?? {});
  }
}

export class NotFound extends DomainError {
  constructor(message: string, details?: Record<string, any>) {
    super(404, message, details ?? {});
  }
}

export class NotAcceptable extends DomainError {
  constructor(message: string, details?: Record<string, any>) {
    super(406, message, details ?? {});
  }
}

export class ConflictError extends DomainError {
  constructor(message: string, details?: Record<string, any>) {
    super(409, message, details ?? {});
  }
}

export class UnprocessableContent extends DomainError {
  constructor(message: string, details?: Record<string, any>) {
    super(422, message, details ?? {});
  }
}

export class InternalServerError extends DomainError {
  constructor(message: string, details?: Record<string, any>) {
    super(500, message, details ?? {});
  }
}

export class BadGateway extends DomainError {
  constructor(message: string, details?: Record<string, any>) {
    super(502, message, details ?? {});
  }
}
