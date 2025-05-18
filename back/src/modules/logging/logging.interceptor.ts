import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Request } from 'express';
import { LoggingService } from './logging.service';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
    constructor(private readonly loggingService: LoggingService) { }

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const ctx = context.switchToHttp();
        const request = ctx.getRequest();
        const startTime = Date.now();

        return next.handle().pipe(
            tap((responseBody) => {
                const duration = Date.now() - startTime;
                this.loggingService.logHttpRequest({
                    method: request.method,
                    path: request.path,
                    status: ctx.getResponse().statusCode,
                    duration_ms: duration,
                    ip: request.ip,
                    user_id: request.user?.id,
                    request_id: request.id,
                    request_body: request.method !== 'GET' ? request.body : undefined,
                    response_body: responseBody,
                    query_params: JSON.stringify(request.query),
                });
            }),
        );
    }
}