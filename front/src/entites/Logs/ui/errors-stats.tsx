/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { Skeleton } from '@/shared/ui/branding/skeleton';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { metricsApi } from '../lib/api/metrics-api';
import { CardHeader, CardTitle, CardContent } from '@/shared/ui/overlay/card';
import { useEffect, useState } from 'react';
import { ChartConfig, ChartContainer, ChartTooltipContent } from '@/shared/ui/branding/chart';
import { ToggleGroup, ToggleGroupItem } from '@/shared/ui/form/toggle-group';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@radix-ui/react-select';

const chartConfig = {
    errors: {
        label: "Ошибки",
    },
    count: {
        label: "Количество",
        color: "hsl(var(--chart-1))",
    },
} satisfies ChartConfig;

export function ErrorsStats() {
    const [timeRange, setTimeRange] = useState<'24h' | '7d' | '30d'>('24h');
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await metricsApi.getErrors(timeRange);
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
                <CardTitle className="font-medium text-xl">Статистика ошибок</CardTitle>
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
                    <BarChart
                        data={data}
                        margin={{
                            top: 20,
                            right: 30,
                            left: 20,
                            bottom: 5,
                        }}
                    >
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="type"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                        />
                        <YAxis
                            tickLine={false}
                            axisLine={false}
                            domain={[0, 'dataMax + 2']}
                        />
                        <Tooltip
                            cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }}
                            content={
                                <ChartTooltipContent />
                            }
                        />
                        <Bar
                            dataKey="count"
                            fill="var(--color-count)"
                            name="Количество ошибок"
                            radius={[4, 4, 0, 0]}
                            barSize={60}
                        />
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </>
    );
}