import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  BadRequestException,
  ForbiddenException,
  InternalServerErrorException,
  NotFoundException,
  RequestTimeoutException,
  UnauthorizedException,
  PreconditionFailedException,
} from '@nestjs/common';
import { Observable, throwError, TimeoutError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { MongoServerError } from 'mongodb';

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, any> {
  // Define a map for MongoDB error codes and messages
  MONGO_ERROR_MESSAGES: Record<number, string> = {
    11000: 'Duplicate key error: The document already exists.',
    // Add more error codes and messages as needed
  };
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((err) => {
        let error;

        if (err instanceof MongoServerError) {
          // Look up the error message from the map
          const message =
            this.MONGO_ERROR_MESSAGES[err.code] || 'A database error occurred.';
          error = new PreconditionFailedException(message);
        } else if (err instanceof TimeoutError) {
          error = new RequestTimeoutException();
        } else if (err instanceof BadRequestException) {
          error = new BadRequestException(err.getResponse());
        } else if (err instanceof TypeError) {
          error = new BadRequestException('Bad Request');
        } else if (err instanceof NotFoundException) {
          error = new NotFoundException(err.getResponse());
        } else if (err instanceof ForbiddenException) {
          error = new ForbiddenException(err.getResponse());
        } else if (err instanceof UnauthorizedException) {
          error = new UnauthorizedException(err.getResponse());
        } else {
          error = new InternalServerErrorException();
        }
        return throwError(() => error || new InternalServerErrorException());
      }),
      map((data) => {
        // Standardized response structure
        return {
          success: true,
          data,
          message: 'Request successfully processed',
          timestamp: new Date().toISOString(),
        };
      }),
    );
  }
}
