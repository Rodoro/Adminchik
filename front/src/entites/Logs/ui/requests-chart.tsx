/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { Skeleton } from '@/shared/ui/branding/skeleton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/form/select';
import { CardContent, CardHeader, CardTitle } from '@/shared/ui/overlay/card';
import { useEffect, useState } from 'react';
import { XAxis, CartesianGrid, AreaChart, Area, YAxis } from 'recharts';
import { metricsApi } from '../lib/api/metrics-api';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/shared/ui/branding/chart';
import { ToggleGroup, ToggleGroupItem } from '@/shared/ui/form/toggle-group';

const chartConfig = {
    requests: {
        label: "Запросы",
    },
    total_requests: {
        label: "Всего",
        color: "hsl(var(--chart-1))",
    },
    error_requests: {
        label: "Ошибок",
        color: "hsl(var(--chart-2))",
    },
    avg_duration: {
        label: "Ср. время (мс)",
        color: "hsl(var(--chart-4))",
    },
} satisfies ChartConfig

export function RequestsChart() {
    const [timeRange, setTimeRange] = useState<'24h' | '7d' | '30d'>('24h');
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await metricsApi.getRequests(timeRange);
                setData(response);
                setError(null);
            } catch (err) {
                setError('Ошибка загрузки данных');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [timeRange]);

    if (loading) return <Skeleton className="h-[400px] w-full" />;
    if (error) return <div>Ошибка загрузки данных</div>;

    return (
        <>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="font-medium text-xl">Статистика запросов</CardTitle>
                <ToggleGroup
                    type="single"
                    value={timeRange}
                    onValueChange={(v) => setTimeRange(v as any)}
                    variant="outline"
                    className="min-[767px]:flex hidden"
                >
                    <ToggleGroupItem value="24h" className="h-8 px-2.5">
                        24 часа
                    </ToggleGroupItem>
                    <ToggleGroupItem value="7d" className="h-8 px-2.5">
                        7 дней
                    </ToggleGroupItem>
                    <ToggleGroupItem value="30d" className="h-8 px-2.5">
                        30 дней
                    </ToggleGroupItem>
                </ToggleGroup>
                <Select value={timeRange} onValueChange={(v) => setTimeRange(v as any)}>
                    <SelectTrigger
                        className="min-[767px]:hidden flex w-40"
                        aria-label="Выберите значение"
                    >
                        <SelectValue placeholder="Период" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                        <SelectItem value="24h" className="rounded-lg">
                            24 часа
                        </SelectItem>
                        <SelectItem value="7d" className="rounded-lg">
                            7 дней
                        </SelectItem>
                        <SelectItem value="30d" className="rounded-lg">
                            30 дней
                        </SelectItem>
                    </SelectContent>
                </Select>
            </CardHeader>
            <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
                <ChartContainer config={chartConfig} className="aspect-auto h-[400px] w-full">
                    <AreaChart data={data}>
                        <defs>
                            <linearGradient id="fillTotalReq" x1="0" y1="0" x2="0" y2="1">
                                <stop
                                    offset="5%"
                                    stopColor="var(--color-total_requests)"
                                    stopOpacity={1.0}
                                />
                                <stop
                                    offset="95%"
                                    stopColor="var(--color-total_requests)"
                                    stopOpacity={0.1}
                                />
                            </linearGradient>
                            <linearGradient id="fillErrorReq" x1="0" y1="0" x2="0" y2="1">
                                <stop
                                    offset="5%"
                                    stopColor="var(--color-error_requests)"
                                    stopOpacity={0.8}
                                />
                                <stop
                                    offset="95%"
                                    stopColor="var(--color-error_requests)"
                                    stopOpacity={0.1}
                                />
                            </linearGradient>
                            <linearGradient id="fillAvgDur" x1="0" y1="0" x2="0" y2="1">
                                <stop
                                    offset="5%"
                                    stopColor="var(--color-avg_duration)"
                                    stopOpacity={0.8}
                                />
                                <stop
                                    offset="95%"
                                    stopColor="var(--color-avg_duration)"
                                    stopOpacity={0.1}
                                />
                            </linearGradient>
                        </defs>
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="time"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            minTickGap={32}
                            tickFormatter={(value) => {
                                const date = new Date(value);
                                const hours = date.getHours();
                                const minutes = date.getMinutes();

                                if (hours === 0 && minutes === 0) {
                                    return date.toLocaleDateString("ru-RU", {
                                        day: "numeric",
                                        month: "short",
                                    });
                                }
                                return date.toLocaleDateString("ru-RU", {
                                    day: "numeric",
                                    month: "short",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                    hour12: false,
                                });
                            }}
                        />
                        <YAxis
                            tickLine={false}
                            axisLine={false}
                            domain={[0, 'dataMax + 30']}
                        />
                        <ChartTooltip
                            cursor={false}
                            content={
                                <ChartTooltipContent
                                    labelFormatter={(value) => {
                                        const date = new Date(value);
                                        const hours = date.getHours();
                                        const minutes = date.getMinutes();

                                        if (hours === 0 && minutes === 0) {
                                            return date.toLocaleDateString("ru-RU", {
                                                day: "numeric",
                                                month: "short",
                                            });
                                        }
                                        return date.toLocaleDateString("ru-RU", {
                                            day: "numeric",
                                            month: "short",
                                            hour: "2-digit",
                                            minute: "2-digit",
                                            hour12: false,
                                        });
                                    }}
                                    indicator="dot"
                                />
                            }
                        />
                        <Area
                            dataKey="error_requests"
                            type="natural"
                            fill="url(#fillErrorReq)"
                            stroke="var(--color-error_requests)"
                            stackId="a"
                        />
                        <Area
                            dataKey="total_requests"
                            type="natural"
                            fill="url(#fillTotalReq)"
                            stroke="var(--color-total_requests)"
                            stackId="a"
                        />
                        <Area
                            dataKey="avg_duration"
                            type="natural"
                            fill="url(#fillAvgDur)"
                            stroke="var(--color-avg_duration)"
                        />
                    </AreaChart>
                </ChartContainer>
            </CardContent >
        </>
    );
}
