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
    useReactTable,
    PaginationState
} from "@tanstack/react-table";
import { Input } from "@/shared/ui/form/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui/form/select";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/shared/ui/form/tooltip";

export type ErrorLog = {
    timestamp: string;
    type: string;
    message: string;
    stack_trace: string;
    request_id: string | null;
    user_id: string | null;
    path: string;
    method: string;
    status: number;
    request_body: string | null;
    response_body: string | null;
};

export const columns: ColumnDef<ErrorLog>[] = [
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
        accessorKey: "type",
        header: "Тип ошибки",
        cell: ({ row }) => {
            const type = row.getValue("type") as string;
            return (
                <div className="font-medium">
                    {type}
                </div>
            );
        },
    },
    {
        accessorKey: "message",
        header: "Сообщение",
        cell: ({ row }) => {
            const message = row.getValue("message") as string;
            return (
                <Tooltip>
                    <TooltipTrigger asChild>
                        <div className="max-w-[200px] truncate">
                            {message}
                        </div>
                    </TooltipTrigger>
                    <TooltipContent className="max-w-[400px] break-words">
                        {message}
                    </TooltipContent>
                </Tooltip>
            );
        },
    },
    {
        accessorKey: "status",
        header: "Статус",
        cell: ({ row }) => {
            const status = row.getValue("status") as number;
            return (
                <div className={`font-medium ${status >= 200 && status < 300 ? 'text-green-500' :
                    status >= 500 ? 'text-red-500' : 'text-yellow-500'
                    }`}>
                    {status}
                </div>
            );
        },
    },
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
        accessorKey: "user_id",
        header: "Пользователь",
        cell: ({ row }) => {
            const userId = row.original.user_id;

            return (
                <div className="flex flex-col">
                    {userId ? (
                        <span
                            className="text-xs text-muted-foreground truncate max-w-[120px]"
                            title={userId}
                        >
                            {userId.slice(0, 8)}...{userId.slice(-4)}
                        </span>
                    ) : (
                        <span className="text-muted-foreground">-</span>
                    )}
                </div>
            );
        },
    },
];

export function ErrorLogsTable() {
    const [data, setData] = useState<ErrorLog[]>([]);
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
        pageCount: Math.ceil(totalCount / pagination.pageSize),
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
        debugTable: true,
    });

    const fetchData = async () => {
        try {
            setLoading(true);
            const response = await metricsApi.getErrorLogsPaginated(
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pagination.pageIndex, pagination.pageSize]);

    if (loading) return <Skeleton className="h-[300px] w-full" />;
    if (error) return <div className="text-red-500 p-4">{error}</div>;

    return (
        <>
            <CardHeader>
                <CardTitle className="text-xl font-medium">Логи ошибок</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex items-center flex-wrap gap-4 sm:grid grid-cols-3 pb-4">
                    <Input
                        placeholder="Фильтр по типу..."
                        value={(table.getColumn("type")?.getFilterValue() as string) ?? ""}
                        onChange={(event) =>
                            table.getColumn("type")?.setFilterValue(event.target.value)
                        }
                    />
                    <Input
                        placeholder="Фильтр по сообщению..."
                        value={(table.getColumn("message")?.getFilterValue() as string) ?? ""}
                        onChange={(event) =>
                            table.getColumn("message")?.setFilterValue(event.target.value)
                        }
                    />
                    <Input
                        placeholder="Фильтр по ID пользователя..."
                        value={(table.getColumn("user_id")?.getFilterValue() as string) ?? ""}
                        onChange={(event) =>
                            table.getColumn("user_id")?.setFilterValue(event.target.value)
                        }
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
        </>
    );
}