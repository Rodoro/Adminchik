import { ClickHouseModule } from '@/src/core/clickhouse/clickhouse.module';
import { Module } from '@nestjs/common';
import { LogsMetricsController } from './logs-metrics.controller';
import { LogsMetricsService } from './logs-metrics.service';

@Module({
    imports: [ClickHouseModule],
    providers: [LogsMetricsService],
    controllers: [LogsMetricsController],
})
export class LogsMetricsModule { }