'use client';

import { Skeleton } from "@/shared/ui/branding/skeleton";
import { metricsApi } from "../../lib/api/metrics.api";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/overlay/card";
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
    useReactTable,
    PaginationState
} from "@tanstack/react-table";
import { Input } from "@/shared/ui/form/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui/form/select";

export type UserActivityLog = {
    timestamp: string;
    action: string;
    endpoint: string;
    status: number;
    duration_ms: number;
    ip: string;
    details: string;
};

export const columns: ColumnDef<UserActivityLog>[] = [
    {
        accessorKey: "timestamp",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Дата и время
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => {
            const date = new Date(row.getValue("timestamp"));
            return <div>{date.toLocaleString()}</div>;
        },
    },
    {
        accessorKey: "action",
        header: "Действие",
        cell: ({ row }) => {
            const action = row.getValue("action") as string;
            return (
                <div className={`font-medium ${action === 'GET' ? 'text-blue-500' :
                    action === 'POST' ? 'text-green-500' :
                        action === 'PUT' ? 'text-yellow-500' :
                            action === 'DELETE' ? 'text-red-500' : ''
                    }`}>
                    {action}
                </div>
            );
        },
    },
    {
        accessorKey: "endpoint",
        header: "Эндпоинт",
    },
    {
        accessorKey: "status",
        header: "Статус",
        cell: ({ row }) => {
            const status = row.getValue("status") as number;
            return (
                <div className={`font-medium ${status >= 200 && status < 300 ? 'text-green-500' :
                    status >= 400 ? 'text-red-500' : 'text-yellow-500'
                    }`}>
                    {status}
                </div>
            );
        },
    },
    {
        accessorKey: "duration_ms",
        header: "Длительность (мс)",
    },
    {
        accessorKey: "ip",
        header: "IP адрес",
    },
    {
        accessorKey: "details",
        header: "Детали",
        cell: ({ row }) => {
            const details = row.getValue("details") as string;
            return (
                <div className="max-w-[200px] truncate" title={details}>
                    {details}
                </div>
            );
        },
    },
];

export function UserLogsTable({ params }: {
    params: Promise<{ id: string }>
}) {
    const [data, setData] = useState<UserActivityLog[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 10,
    });
    const [totalCount, setTotalCount] = useState(0);

    const totalPages = Math.ceil(totalCount / pagination.pageSize);

    const table = useReactTable({
        data,
        columns,
        pageCount: totalPages,
        state: {
            sorting,
            columnFilters,
            pagination,
        },
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        onPaginationChange: setPagination,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        manualPagination: true,
    });

    const fetchData = async () => {
        try {
            setLoading(true);
            const response = await metricsApi.getUserActivityLogs(
                (await params).id,
                pagination.pageIndex + 1,
                pagination.pageSize
            );
            setData(response.data);
            setTotalCount(response.pagination.total);
            setError(null);
        } catch (err) {
            setError('Ошибка загрузки данных');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [pagination.pageIndex, pagination.pageSize]);

    useEffect(() => {
        setPagination(prev => ({ ...prev, pageIndex: 0 }));
    }, [columnFilters]);

    if (loading) return <Skeleton className="h-[300px] w-full" />;
    if (error) return <div className="text-red-500 p-4">{error}</div>;

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-xl font-medium">Логи активности пользователя</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex items-center flex-wrap gap-4 pb-4">
                    <Input
                        placeholder="Фильтр по эндпоинту..."
                        value={(table.getColumn("endpoint")?.getFilterValue() as string) ?? ""}
                        onChange={(event) =>
                            table.getColumn("endpoint")?.setFilterValue(event.target.value)
                        }
                        className="max-w-sm"
                    />
                    <Input
                        placeholder="Фильтр по действию..."
                        value={(table.getColumn("action")?.getFilterValue() as string) ?? ""}
                        onChange={(event) =>
                            table.getColumn("action")?.setFilterValue(event.target.value)
                        }
                        className="max-w-sm"
                    />
                </div>
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            {table.getHeaderGroups().map((headerGroup) => (
                                <TableRow key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    ))}
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
                        Всего записей: {totalCount}
                    </div>
                    <div className="flex flex-col sm:flex-row items-center space-x-6 gap-4">
                        <div className="text-sm text-muted-foreground">
                            Страница {pagination.pageIndex + 1} из {totalPages}
                        </div>
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
        </Card>
    );
}