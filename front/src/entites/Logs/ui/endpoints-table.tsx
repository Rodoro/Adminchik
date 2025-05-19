/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { Skeleton } from "@/shared/ui/branding/skeleton";
import { metricsApi } from "../lib/api/metrics-api";
import { CardContent, CardHeader, CardTitle } from "@/shared/ui/overlay/card";
import { TableHeader, TableRow, TableHead, TableBody, TableCell, Table } from "@/shared/ui/branding/table";
import { useEffect, useState } from "react";
import { Button } from "@/shared/ui/form/button";
import { ArrowUpDown } from "lucide-react";
import {
    ColumnDef,
    ColumnFiltersState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    SortingState,
    useReactTable
} from "@tanstack/react-table";
import { Input } from "@/shared/ui/form/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui/form/select";
import { ToggleGroup, ToggleGroupItem } from "@/shared/ui/form/toggle-group";

export type Endpoint = {
    method: string;
    path: string;
    requests: number;
    errors: number;
    avg_duration: number;
};

export const columns: ColumnDef<Endpoint>[] = [
    {
        accessorKey: "method",
        header: "Метод",
        cell: ({ row }) => {
            const method = row.getValue("method") as string;
            return (
                <div className={`font-medium ${method === 'GET' ? 'text-blue-500' :
                    method === 'POST' ? 'text-green-500' :
                        method === 'PUT' ? 'text-yellow-500' :
                            method === 'DELETE' ? 'text-red-500' : ''
                    }`}>
                    {method}
                </div>
            );
        },
    },
    {
        accessorKey: "path",
        header: "Путь",
    },
    {
        accessorKey: "requests",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Запросы
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => {
            const requests = row.getValue("requests") as number;
            return <div className="font-medium">{requests}</div>;
        },
    },
    {
        accessorKey: "errors",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Ошибки
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => {
            const errors = row.getValue("errors") as number;
            return <div className={errors > 0 ? "text-red-500 font-medium" : ""}>{errors}</div>;
        },
    },
    {
        accessorKey: "avg_duration",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Ср. время (мс)
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => {
            const avgDuration = parseFloat(row.getValue("avg_duration"))
            return <div>{avgDuration.toFixed(2)}</div>
        },
    },
];

export function EndpointsTable() {
    const [timeRange, setTimeRange] = useState<'3h' | '24h' | '7d' | '30d'>('24h');
    const [data, setData] = useState<Endpoint[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

    const table = useReactTable({
        data,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        state: {
            sorting,
            columnFilters,
        },
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await metricsApi.getEndpoints(timeRange);
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

    if (loading) return <Skeleton className="h-[300px] w-full" />;
    if (error) return <div className="text-red-500 p-4">{error}</div>;

    return (
        <>
            <CardHeader>
                <CardTitle className="text-xl font-medium">Популярные эндпоинты</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex items-center justify-between pb-4">
                    <Input
                        placeholder="Фильтр по пути..."
                        value={(table.getColumn("path")?.getFilterValue() as string) ?? ""}
                        onChange={(event) =>
                            table.getColumn("path")?.setFilterValue(event.target.value)
                        }
                        className="max-w-sm"
                    />
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
                </div>
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            {table.getHeaderGroups().map((headerGroup) => (
                                <TableRow key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => {
                                        return (
                                            <TableHead key={header.id}>
                                                {header.isPlaceholder
                                                    ? null
                                                    : flexRender(
                                                        header.column.columnDef.header,
                                                        header.getContext()
                                                    )}
                                            </TableHead>
                                        )
                                    })}
                                </TableRow>
                            ))}
                        </TableHeader>
                        <TableBody>
                            {table.getRowModel().rows?.length ? (
                                table.getRowModel().rows.map((row) => (
                                    <TableRow
                                        key={row.id}
                                        data-state={row.getIsSelected() && "selected"}
                                    >
                                        {row.getVisibleCells().map((cell) => (
                                            <TableCell key={cell.id}>
                                                {flexRender(
                                                    cell.column.columnDef.cell,
                                                    cell.getContext()
                                                )}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell
                                        colSpan={columns.length}
                                        className="h-24 text-center"
                                    >
                                        Нет данных.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
                <div className="flex flex-col sm:flex-row items-center justify-between py-4 gap-4">
                    <div className="text-sm text-muted-foreground">
                        Всего записей: {table.getFilteredRowModel().rows.length}
                    </div>
                    <div className="flex flex-col sm:flex-row items-center space-x-6 gap-4">
                        <div className="flex items-center space-x-2">
                            <p className="text-sm text-muted-foreground">Записей на странице:</p>
                            <Select
                                value={table.getState().pagination.pageSize.toString()}
                                onValueChange={(value) => {
                                    table.setPageSize(Number(value));
                                }}
                            >
                                <SelectTrigger className="w-20">
                                    <SelectValue placeholder={table.getState().pagination.pageSize} />
                                </SelectTrigger>
                                <SelectContent className="rounded-xl">
                                    {[10, 25, 50, 100].map((pageSize) => (
                                        <SelectItem key={pageSize} value={pageSize.toString()} className="rounded-lg">
                                            {pageSize}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-x-2">
                            <Button
                                variant="outline"
                                onClick={() => table.previousPage()}
                                disabled={!table.getCanPreviousPage()}
                            >
                                Назад
                            </Button>
                            <Button
                                onClick={() => table.nextPage()}
                                disabled={!table.getCanNextPage()}
                            >
                                Вперед
                            </Button>
                        </div>
                    </div>
                </div>
            </CardContent>
        </>
    );
}