import { Module } from '@nestjs/common';
import { LoggingService } from './logging.service';
import { LoggingInterceptor } from './logging.interceptor';
import { ErrorFilter } from './error.filter';
import { ClickHouseModule } from '@/src/core/clickhouse/clickhouse.module';

@Module({
    imports: [ClickHouseModule],
    providers: [
        LoggingService,
        LoggingInterceptor,
        ErrorFilter,
    ],
    exports: [LoggingService],
})
export class LoggingModule { }