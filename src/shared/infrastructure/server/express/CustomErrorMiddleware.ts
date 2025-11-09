import 'reflect-metadata';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import {
  ExpressErrorMiddlewareInterface,
  Middleware,
} from 'routing-controllers';
import getModuleLogger from '../../../../application/port/log/get-module-logger';
import { CustomError } from '../../../domain/model/errors/CustomError';
import { ValidationDomainError } from '../../../domain/model/errors/ValidationDomainError';
import { NotFoundDomainError } from '../../../domain/model/errors/NotFoundDomainError';

@Middleware({ type: 'after' })
export class CustomErrorMiddleware implements ExpressErrorMiddlewareInterface {
  private readonly log = getModuleLogger('CustomErrorMiddleware');
  error(
    error: Error,
    _: Request,
    response: Response,
    next: (err?: unknown) => unknown
  ) {
    const timestamp = new Date().toISOString();
    this.log.error(`ERROR [${timestamp}] ${JSON.stringify(error)}`);
    if (this.wasErrorCausedBy(error, ValidationDomainError)) {
      response.status(StatusCodes.BAD_REQUEST).send(error);
      return;
    } else if (this.wasErrorCausedBy(error, NotFoundDomainError)) {
      response.status(StatusCodes.NOT_FOUND).send(error);
      return;
    } else {
      response.status(StatusCodes.INTERNAL_SERVER_ERROR).send(error);
      return;
    }
    next();
  }

  private wasErrorCausedBy<T>(
    error: unknown,
    typeConstructor: new (str: string) => T
  ): boolean {
    if (error && error instanceof CustomError) {
      return (
        error instanceof typeConstructor ||
        this.wasErrorCausedBy(error.cause, typeConstructor)
      );
    }
    return false;
  }
}
