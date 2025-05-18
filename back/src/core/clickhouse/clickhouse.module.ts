import { Module, Global } from '@nestjs/common';
import { createClient, ClickHouseClient } from '@clickhouse/client';
import { ConfigService } from '@nestjs/config';

@Global()
@Module({
    providers: [
        {
            provide: 'CLICKHOUSE_CLIENT',
            useFactory: (config: ConfigService) => createClient({
                host: config.get('CLICKHOUSE_HOST'),
                username: config.get('CLICKHOUSE_USER'),
                password: config.get('CLICKHOUSE_PASSWORD'),
                database: config.get('CLICKHOUSE_DB'),
                clickhouse_settings: {
                    async_insert: 1,
                    wait_for_async_insert: 0,
                },
            }),
            inject: [ConfigService],
        },
    ],
    exports: ['CLICKHOUSE_CLIENT'],
})
export class ClickHouseModule { }