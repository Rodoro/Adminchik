import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
} from '@nestjs/common';
import { LoggingService } from './logging.service';
import { Request, Response } from 'express';

@Catch()
export class ErrorFilter implements ExceptionFilter {
    constructor(private readonly loggingService: LoggingService) { }

    catch(exception: any, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const request = ctx.getRequest();
        const response = ctx.getResponse<Response>();

        const status = exception.getStatus?.() || 500;
        const message = exception.response?.message || exception.message;

        this.loggingService.logError({
            type: exception.constructor.name,
            message,
            stack_trace: exception.stack,
            request_id: request.id,
            ip: request.ip,
            user_id: request.user?.id,
            http_path: request.path,
            http_method: request.method || '',
            http_status: status,
            request_body: request.method !== 'GET' ? request.body : undefined,
            response_body: exception.response,
        });

        response.status(status).json({
            statusCode: status,
            message,
            timestamp: new Date().toISOString(),
            path: request.url,
        });
    }
}