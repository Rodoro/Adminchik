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

const adjustToMoscowTime = (date: Date): Date => {
    const moscowOffset = 3 * 60 * 60 * 1000;
    const utcTime = date.getTime();
    return new Date(utcTime + moscowOffset);
};

const fillTimeGaps = (data: any[], timeRange: '3h' | '24h' | '7d' | '30d') => {
    if (data.length === 0) return data;

    const result = [...data];
    const timeStep = timeRange === '24h' ? 3600000 :
        timeRange === '7d' ? 86400000 :
            86400000;

    result.sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime());

    const minTime = new Date(result[0].time).getTime();
    const maxTime = new Date(result[result.length - 1].time).getTime();

    const expectedTimes = [];
    for (let time = minTime; time <= maxTime; time += timeStep) {
        expectedTimes.push(time);
    }

    expectedTimes.forEach(time => {
        const exists = result.some(item => new Date(item.time).getTime() === time);
        if (!exists) {
            result.push({
                time: new Date(time).toISOString(),
                total_requests: 0,
                error_requests: 0,
                avg_duration: 0,
                displayTime: adjustToMoscowTime(new Date(time))
            });
        }
    });

    return result.sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime());
};

export function RequestsChart() {
    const [timeRange, setTimeRange] = useState<'3h' | '24h' | '7d' | '30d'>('24h');
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await metricsApi.getRequests(timeRange);

                const processedData = fillTimeGaps(response, timeRange).map(item => ({
                    ...item,
                    displayTime: adjustToMoscowTime(new Date(item.time))
                }));

                setData(processedData);
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

    const formatTime = (value: string) => {
        const date = adjustToMoscowTime(new Date(value));
        const hours = date.getHours();
        const minutes = date.getMinutes();

        if (hours === 0 && minutes === 0) {
            return date.toLocaleDateString("ru-RU", {
                day: "numeric",
                month: "short",
            });
        }
        return date.toLocaleTimeString("ru-RU", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
        });
    };

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
                    <ToggleGroupItem value="3h" className="h-8 px-2.5">
                        3 часа
                    </ToggleGroupItem>
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
                        <SelectItem value="3h" className="rounded-lg">
                            3 часа
                        </SelectItem>
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
                            tickFormatter={formatTime}
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
                                        const date = adjustToMoscowTime(new Date(value));
                                        return date.toLocaleString("ru-RU", {
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
                            type="monotoneX"
                            fill="url(#fillErrorReq)"
                            stroke="var(--color-error_requests)"
                            stackId="a"
                        />
                        <Area
                            dataKey="total_requests"
                            type="monotoneX"
                            fill="url(#fillTotalReq)"
                            stroke="var(--color-total_requests)"
                            stackId="a"
                        />
                        <Area
                            dataKey="avg_duration"
                            type="monotoneX"
                            fill="url(#fillAvgDur)"
                            stroke="var(--color-avg_duration)"
                        />
                    </AreaChart>
                </ChartContainer>
            </CardContent >
        </>
    );
}
