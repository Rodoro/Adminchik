import { Injectable, Inject } from '@nestjs/common';
import { ClickHouseClient } from '@clickhouse/client';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class LogsMetricsService {
  constructor(
    @Inject('CLICKHOUSE_CLIENT')
    private readonly clickhouse: ClickHouseClient,
    private readonly config: ConfigService
  ) { }

  async getRequestsMetrics(timeRange: '24h' | '7d' | '30d') {
    const interval = timeRange === '24h' ? '1 HOUR' : timeRange === '7d' ? '1 DAY' : '7 DAY';
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

  async getPopularEndpoints() {
    const query = `
      SELECT 
        path,
        method,
        count() AS requests,
        avg(duration_ms) AS avg_duration,
        countIf(status >= 400) AS errors
      FROM ${this.config.get('CLICKHOUSE_DB')}.http_requests
      WHERE timestamp >= now() - INTERVAL 7 DAY
      GROUP BY path, method
      ORDER BY requests DESC
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
}