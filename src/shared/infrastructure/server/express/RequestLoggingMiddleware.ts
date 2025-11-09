import { NextFunction, Request, Response } from 'express';
import { Logger } from '../../../model/Logger';
import getModuleLogger from '../../../../application/port/log/get-module-logger';
import { Middleware } from 'routing-controllers';

@Middleware({ type: 'before' })
export class RequestLoggingMiddleware {
  private readonly logger: Logger = getModuleLogger("RequestLoggingMiddleware")

  middleware = (req: Request, res: Response, next: NextFunction): void => {
    const startTime = Date.now();
    const requestId = this.generateRequestId();

    // Add request ID to request for potential use in other parts of the application
    Object.assign(req, { requestId });

    // Log incoming request
    this.logger.info('Incoming request', {
      requestId,
      method: req.method,
      url: req.url,
      path: req.path,
      query: req.query,
      headers: this.sanitizeHeaders(req.headers),
      userAgent: req.get('User-Agent'),
      ip: req.ip || req.socket?.remoteAddress,
      timestamp: new Date().toISOString(),
    });

    // Log request body for POST, PUT, PATCH requests (but sanitize sensitive data)
    if (['POST', 'PUT', 'PATCH'].includes(req.method) && req.body) {
      this.logger.info('Request body', {
        requestId,
        body: this.sanitizeRequestBody(req.body),
      });
    }

    // Override res.end to capture response details
    const originalEnd = res.end.bind(res);
    const logger = this.logger;
    res.end = function (
      chunk?: unknown,
      encoding?: BufferEncoding | (() => void),
      callback?: () => void
    ) {
      const duration = Date.now() - startTime;

      logger.info('Request completed', {
        requestId,
        method: req.method,
        url: req.url,
        statusCode: res.statusCode,
        responseTime: `${duration}ms`,
        userAgent: req.get('User-Agent') || 'Unknown',
        ip: req.ip,
        contentLength: res.get('content-length') || 'Unknown',
      });

      // Log slow requests
      if (duration > 1000) {
        // Log requests taking more than 1 second
        logger.warn('Slow request detected', {
          requestId,
          method: req.method,
          url: req.url,
          responseTime: `${duration}ms`,
        });
      }

      // Handle different parameter combinations for res.end
      if (typeof encoding === 'function') {
        callback = encoding;
        encoding = undefined;
      }

      // Call the original res.end with proper typing
      if (
        chunk !== undefined &&
        encoding !== undefined &&
        callback !== undefined
      ) {
        return originalEnd(chunk, encoding, callback);
      } else if (chunk !== undefined && encoding !== undefined) {
        return originalEnd(chunk, encoding);
      } else if (chunk !== undefined && callback !== undefined) {
        return originalEnd(chunk, callback);
      } else if (chunk) {
        return originalEnd(chunk);
      } else {
        return originalEnd();
      }
    };

    next();
  };

  private generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
  }

  private sanitizeHeaders(
    headers: Record<string, unknown>
  ): Record<string, unknown> {
    const sensitiveHeaders = [
      'authorization',
      'cookie',
      'x-api-key',
      'x-auth-token',
    ];
    const sanitized = { ...headers };

    for (const header of sensitiveHeaders) {
      if (sanitized[header]) {
        sanitized[header] = '[REDACTED]';
      }
    }

    return sanitized;
  }

  private sanitizeRequestBody(body: unknown): unknown {
    if (typeof body !== 'object' || body === null) {
      return body;
    }

    const sensitiveFields = [
      'password',
      'token',
      'secret',
      'key',
      'auth',
      'credential',
    ];
    const sanitized = { ...(body as Record<string, unknown>) };

    const sanitizeObject = (obj: unknown): unknown => {
      if (typeof obj !== 'object' || obj === null) {
        return obj;
      }

      const objRecord = obj as Record<string, unknown>;
      const result = Array.isArray(obj) ? [...obj] : { ...objRecord };

      for (const key of Object.keys(result)) {
        const lowerKey = key.toLowerCase();

        // Check if key contains sensitive information
        if (sensitiveFields.some((field) => lowerKey.includes(field))) {
          (result as Record<string, unknown>)[key] = '[REDACTED]';
        } else if (
          typeof (result as Record<string, unknown>)[key] === 'object' &&
          (result as Record<string, unknown>)[key] !== null
        ) {
          (result as Record<string, unknown>)[key] = sanitizeObject(
            (result as Record<string, unknown>)[key]
          );
        }
      }

      return result;
    };

    return sanitizeObject(sanitized);
  }
}
