import { Injectable, Inject } from '@nestjs/common';
import { ClickHouseClient } from '@clickhouse/client';
import { ConfigService } from '@nestjs/config';
import { INCLUDED_PATHS, INCLUDED_METHODS } from './config/viewLogs';
import { buildPathConditions } from '@/src/shared/utils/pathMatcher';

@Injectable()
export class LogsMetricsService {
  constructor(
    @Inject('CLICKHOUSE_CLIENT')
    private readonly clickhouse: ClickHouseClient,
    private readonly config: ConfigService
  ) { }

  async getRequestsMetrics(timeRange: '3h' | '24h' | '7d' | '30d') {
    const interval = timeRange === '3h' ? '15 MINUTE' : (timeRange === '24h' ? '1 HOUR' : timeRange === '7d' ? '1 DAY' : '7 DAY');
    const timeRangeInterval = timeRange.replace('d', ' DAY').replace('h', ' HOUR');
    const db = this.config.get('CLICKHOUSE_DB');

    const query = `
      WITH 
        requests_stats AS (
          SELECT 
            toStartOfInterval(timestamp, INTERVAL ${interval}) AS time,
            count() AS total_requests,
            avg(duration_ms) AS avg_duration
          FROM ${db}.http_requests
          WHERE timestamp >= now() - INTERVAL ${timeRangeInterval}
          GROUP BY time
        ),
        errors_stats AS (
          SELECT 
            toStartOfInterval(timestamp, INTERVAL ${interval}) AS time,
            count() AS error_requests
          FROM ${db}.errors
          WHERE timestamp >= now() - INTERVAL ${timeRangeInterval}
          GROUP BY time
        )
      SELECT 
        r.time,
        r.total_requests,
        if(e.error_requests > 0, e.error_requests, 0) AS error_requests,
        r.avg_duration
      FROM requests_stats r
      LEFT JOIN errors_stats e ON r.time = e.time
      ORDER BY r.time ASC
    `;

    const result = await this.clickhouse.query({ query });
    return (await result.json()).data;
  }

  async getAdminActionsMetrics() {
    const query = `
      SELECT 
        action,
        count() AS count,
        uniq(user_id) AS unique_users
      FROM ${this.config.get('CLICKHOUSE_DB')}.admin_actions
      WHERE timestamp >= now() - INTERVAL 7 DAY
      GROUP BY action
      ORDER BY count DESC
      LIMIT 10
    `;

    const result = await this.clickhouse.query({ query });
    return (await result.json()).data;
  }

  async getErrorStats(timeRange: '24h' | '7d' | '30d') {
    const interval = timeRange === '24h' ? '1 HOUR' : timeRange === '7d' ? '1 DAY' : '1 DAY';
    const timeRangeInterval = timeRange.replace('d', ' DAY').replace('h', ' HOUR');

    const query = `
      SELECT 
        type,
        count() AS count,
        argMax(message, timestamp) AS last_message
      FROM ${this.config.get('CLICKHOUSE_DB')}.errors
      WHERE timestamp >= now() - INTERVAL ${timeRangeInterval}
      GROUP BY type
      ORDER BY count DESC
      LIMIT 10
    `;

    const result = await this.clickhouse.query({ query });
    return (await result.json()).data;
  }

  async getPopularEndpoints(timeRange: '3h' | '24h' | '7d' | '30d' = '7d') {
    const timeRangeInterval = timeRange.replace('d', ' DAY').replace('h', ' HOUR');
    const db = this.config.get('CLICKHOUSE_DB');

    const query = `
      WITH 
        requests_stats AS (
          SELECT 
            path,
            method,
            count() AS requests,
            avg(duration_ms) AS avg_duration
          FROM ${db}.http_requests
          WHERE timestamp >= now() - INTERVAL ${timeRangeInterval}
          GROUP BY path, method
        ),
        errors_stats AS (
          SELECT 
            http_path AS path,
            http_method AS method,
            count() AS errors
          FROM ${db}.errors
          WHERE timestamp >= now() - INTERVAL ${timeRangeInterval}
            AND http_path IS NOT NULL
            AND http_method IS NOT NULL
          GROUP BY path, method
        )
      SELECT 
        r.path,
        r.method,
        r.requests,
        r.avg_duration,
        if(e.errors > 0, e.errors, 0) AS errors
      FROM requests_stats r
      LEFT JOIN errors_stats e ON r.path = e.path AND r.method = e.method
      ORDER BY r.requests DESC
    `;

    const result = await this.clickhouse.query({ query });
    return (await result.json()).data;
  }

  async getHttpRequestsPaginated(page: number = 1, pageSize: number = 10) {
    const offset = (page - 1) * pageSize;
    const db = this.config.get('CLICKHOUSE_DB');

    const query = `
      SELECT 
        timestamp,
        method,
        path,
        status,
        duration_ms,
        ip,
        user_id,
        request_id
      FROM ${db}.http_requests
      ORDER BY timestamp DESC
      LIMIT ${pageSize} OFFSET ${offset}
    `;

    const countQuery = `
      SELECT count() as total
      FROM ${db}.http_requests
    `;

    const [result, countResult] = await Promise.all([
      this.clickhouse.query({ query }),
      this.clickhouse.query({ query: countQuery }),
    ]);

    const data = (await result.json()).data;
    const countData = await countResult.json() as { data: { total: string }[] };

    const total = parseInt(countData.data[0].total, 10);

    return {
      data,
      pagination: {
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
      },
    };
  }

  async getErrorsPaginated(page: number = 1, pageSize: number = 10) {
    const offset = (page - 1) * pageSize;
    const db = this.config.get('CLICKHOUSE_DB');

    const query = `
      SELECT 
        timestamp,
        type,
        message,
        stack_trace,
        request_id,
        user_id,
        http_path as path,
        http_method as method,
        http_status as status,
        request_body,
        response_body,
        metadata
      FROM ${db}.errors
      ORDER BY timestamp DESC
      LIMIT ${pageSize} OFFSET ${offset}
    `;

    const countQuery = `
      SELECT count() as total
      FROM ${db}.errors
    `;

    const [result, countResult] = await Promise.all([
      this.clickhouse.query({ query }),
      this.clickhouse.query({ query: countQuery }),
    ]);

    const data = (await result.json()).data;
    const countData = await countResult.json() as { data: { total: string }[] };

    const total = parseInt(countData.data[0].total, 10);

    return {
      data,
      pagination: {
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
      },
    };
  }

  async getUserActivityLogs(
    userId: string,
    page: number = 1,
    pageSize: number = 10,
    filters?: {
      action?: string;
      endpoint?: string;
      dateFrom?: string;
      dateTo?: string;
    }
  ) {
    const offset = (page - 1) * pageSize;
    const db = this.config.get('CLICKHOUSE_DB');

    let whereClauses = [`user_id = '${userId}'`];

    whereClauses.push(`(${buildPathConditions()})`);
    whereClauses.push(`method IN (${INCLUDED_METHODS.map(m => `'${m}'`).join(', ')})`);

    if (filters?.action) {
      whereClauses.push(`method = '${filters.action}'`);
    }
    if (filters?.endpoint) {
      whereClauses.push(`path LIKE '%${filters.endpoint}%'`);
    }
    if (filters?.dateFrom) {
      whereClauses.push(`timestamp >= '${filters.dateFrom}'`);
    }
    if (filters?.dateTo) {
      whereClauses.push(`timestamp <= '${filters.dateTo}'`);
    }

    const query = `
      SELECT 
        timestamp,
        method as action,
        path as endpoint,
        status,
        duration_ms,
        ip,
        request_id,
        if(status >= 400, toString(response_body), '') as details,
        -- Добавляем тела запросов и ответов
        if(empty(request_body), null, request_body) as request_body,
        if(empty(response_body), null, response_body) as response_body
      FROM ${db}.http_requests
      WHERE ${whereClauses.join(' AND ')}
      ORDER BY timestamp DESC
      LIMIT ${pageSize} OFFSET ${offset}
    `;

    const countQuery = `
      SELECT count() as total
      FROM ${db}.http_requests
      WHERE ${whereClauses.join(' AND ')}
    `;

    const [result, countResult] = await Promise.all([
      this.clickhouse.query({ query }),
      this.clickhouse.query({ query: countQuery }),
    ]);

    const data = (await result.json()).data;
    const countData = await countResult.json() as { data: { total: string }[] };

    const total = parseInt(countData.data[0].total, 10);

    return {
      data: data.map((item: any) => ({
        ...item,
        request_body: tryParseJson(item.request_body),
        response_body: tryParseJson(item.response_body),
      })),
      pagination: {
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
      },
    };
  }

  async getUserAvailableActions(userId: string) {
    const db = this.config.get('CLICKHOUSE_DB');

    const query = `
    SELECT DISTINCT method as action
    FROM ${db}.http_requests
    WHERE user_id = '${userId}'
      AND (${buildPathConditions()})
      AND method IN (${INCLUDED_METHODS.map(m => `'${m}'`).join(', ')})
    ORDER BY action
  `;

    const result = await this.clickhouse.query({ query });
    const data = (await result.json()).data;
    return data.map((item: any) => item.action);
  }
}

function tryParseJson(jsonString: string | null): string | null {
  if (!jsonString) return null;
  try {
    // Возвращаем строку с красивым форматированием
    return JSON.stringify(JSON.parse(jsonString), null, 2);
  } catch {
    return jsonString;
  }
}