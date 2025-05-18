import { Injectable, Inject } from '@nestjs/common';
import { ClickHouseClient } from '@clickhouse/client';
import { AdminActionLogDto } from './dto/admin-action.dto';
import { HttpRequestLogDto } from './dto/http-request.dto';
import { ErrorLogDto } from './dto/error-log.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class LoggingService {

    private readonly SENSITIVE_KEYS = [
        'password',
        'token',
        'access_token',
        'refresh_token',
        'credit_card',
        'cvv',
        'api_key',
        'secret'
    ];

    constructor(
        @Inject('CLICKHOUSE_CLIENT')
        private readonly clickhouse: ClickHouseClient,
        private readonly config: ConfigService
    ) { }

    private sanitizeData(data: any): any {
        if (!data || typeof data !== 'object') {
            return data;
        }

        if (Array.isArray(data)) {
            return data.map(item => this.sanitizeData(item));
        }

        const sanitized = { ...data };
        for (const key of Object.keys(sanitized)) {
            if (this.SENSITIVE_KEYS.includes(key.toLowerCase())) {
                sanitized[key] = '*****';
            } else if (typeof sanitized[key] === 'object') {
                sanitized[key] = this.sanitizeData(sanitized[key]);
            }
        }
        return sanitized;
    }

    private safeStringify(data: any): string {
        try {
            return JSON.stringify(this.sanitizeData(data));
        } catch (error) {
            return '{"error": "Failed to stringify data"}';
        }
    }

    async onModuleInit() {
        await this.ensureDatabaseExists();
        await this.ensureTablesExist();
    }

    private async ensureDatabaseExists() {
        try {
            await this.clickhouse.command({
                query: `CREATE DATABASE IF NOT EXISTS ${this.config.get('CLICKHOUSE_DB')}`,
                clickhouse_settings: {
                    wait_end_of_query: 1,
                },
            });
        } catch (error) {
            console.error('Failed to create database:', error);
            throw error;
        }
    }

    private async ensureTablesExist() {
        try {
            await Promise.all([
                this.createAdminActionsTable(),
                this.createHttpRequestsTable(),
                this.createErrorsTable(),
            ]);
            console.log('All log tables verified/created');
        } catch (error) {
            console.error('Failed to create tables:', error);
            throw error;
        }
    }


    private async createAdminActionsTable() {
        await this.clickhouse.command({
            query: `
        CREATE TABLE IF NOT EXISTS ${this.config.get('CLICKHOUSE_DB')}.admin_actions (
          timestamp DateTime DEFAULT now(),
          level Enum('INFO'=1, 'WARN'=2, 'ERROR'=3) DEFAULT 'INFO',
          action String,
          user_id String,
          target_id Nullable(String),
          metadata JSON
        ) ENGINE = MergeTree()
        ORDER BY (timestamp, level, action)
        TTL timestamp + INTERVAL 90 DAY
      `,
        });
    }

    private async createHttpRequestsTable() {
        await this.clickhouse.command({
            query: `
            CREATE TABLE IF NOT EXISTS ${this.config.get('CLICKHOUSE_DB')}.http_requests (
              timestamp DateTime DEFAULT now(),
              method String,
              path String,
              status UInt16,
              duration_ms UInt32,
              ip String,
              user_id Nullable(String),
              request_id String,
              request_body Nullable(String),
              response_body Nullable(String),
              query_params Nullable(String)
            ) ENGINE = MergeTree()
            ORDER BY (timestamp, status)
            TTL timestamp + INTERVAL 30 DAY
          `,
        });
    }

    private async createErrorsTable() {
        await this.clickhouse.command({
            query: `
            CREATE TABLE IF NOT EXISTS ${this.config.get('CLICKHOUSE_DB')}.errors (
              timestamp DateTime DEFAULT now(),
              type String,
              message String,
              stack_trace String,
              ip String,
              request_id Nullable(String),
              user_id Nullable(String),
              http_path Nullable(String),
              http_method Nullable(String),
              http_status Nullable(UInt16),
              request_body Nullable(String),
              response_body Nullable(String),
              metadata JSON
            ) ENGINE = MergeTree()
            ORDER BY (timestamp, type)
            TTL timestamp + INTERVAL 365 DAY
          `,
        });
    }

    async logAdminAction(payload: AdminActionLogDto) {
        await this.clickhouse.insert({
            table: `${this.config.get('CLICKHOUSE_DB')}.admin_actions`,
            values: [{
                ...payload,
                metadata: JSON.stringify(payload.metadata || {}),
            }],
            format: 'JSONEachRow',
        });
    }

    async logHttpRequest(payload: HttpRequestLogDto) {
        await this.clickhouse.insert({
            table: `${this.config.get('CLICKHOUSE_DB')}.http_requests`,
            values: [{
                ...payload,
                request_body: payload.request_body ? this.safeStringify(payload.request_body) : null,
                response_body: payload.response_body ? this.safeStringify(payload.response_body) : null,
                query_params: payload.query_params ? this.safeStringify(payload.query_params) : null,
            }],
            format: 'JSONEachRow',
        });
    }

    async logError(payload: ErrorLogDto) {
        await this.clickhouse.insert({
            table: `${this.config.get('CLICKHOUSE_DB')}.errors`,
            values: [{
                ...payload,
            }],
            format: 'JSONEachRow',
        });
    }
}