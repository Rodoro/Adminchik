// src/logs-metrics/logs-metrics.controller.ts
import { Controller, Get, Query } from '@nestjs/common';
import { LogsMetricsService } from './logs-metrics.service';
import { Authorization } from '@/src/shared/decorators/auth.decorator';
import { ApiBearerAuth } from '@nestjs/swagger';

@Authorization()
@ApiBearerAuth()
@Controller('logs')
export class LogsMetricsController {
    constructor(private readonly metricsService: LogsMetricsService) { }

    @Get('requests')
    async getRequestsMetrics(@Query('range') range: string = '7d') {
        return this.metricsService.getRequestsMetrics(range as any);
    }

    @Get('admin-actions')
    async getAdminActionsMetrics() {
        return this.metricsService.getAdminActionsMetrics();
    }

    @Get('errors')
    async getErrorStats(@Query('range') range: string = '7d') {
        return this.metricsService.getErrorStats(range as any);
    }

    @Get('errors-page')
    async getErrorsPaginated(
        @Query('page') page: string = '1',
        @Query('pageSize') pageSize: string = '10',
    ) {
        return this.metricsService.getErrorsPaginated(
            parseInt(page, 10),
            parseInt(pageSize, 10),
        );
    }

    @Get('endpoints')
    async getPopularEndpoints(@Query('range') range: '3h' | '24h' | '7d' | '30d' = '7d') {
        return this.metricsService.getPopularEndpoints(range);
    }

    @Get('http-requests')
    async getHttpRequestsPaginated(
        @Query('page') page: string = '1',
        @Query('pageSize') pageSize: string = '10',
    ) {
        return this.metricsService.getHttpRequestsPaginated(
            parseInt(page, 10),
            parseInt(pageSize, 10),
        );
    }
}