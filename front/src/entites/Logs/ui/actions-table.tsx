'use client';

import { Skeleton } from "@/shared/ui/branding/skeleton";
import { metricsApi } from "../lib/api/metrics-api";
import { CardHeader, CardTitle, CardContent } from "@/shared/ui/overlay/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/ui/branding/table";
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

export type AdminAction = {
    action: string;
    count: number;
    unique_users: number;
};

export const columns: ColumnDef<AdminAction>[] = [
    {
        accessorKey: "action",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Действие
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => {
            const action = row.getValue("action") as string;
            return <div className="font-medium">{action}</div>;
        },
    },
    {
        accessorKey: "count",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Количество
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => {
            const count = row.getValue("count") as number;
            return <div className="font-medium">{count}</div>;
        },
    },
    {
        accessorKey: "unique_users",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Уникальные пользователи
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => {
            const uniqueUsers = row.getValue("unique_users") as number;
            return <div className="font-medium">{uniqueUsers}</div>;
        },
    },
];

export function ActionsTable() {
    const [data, setData] = useState<AdminAction[]>([]);
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
                const response = await metricsApi.getAdminActions();
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
    }, []);

    if (loading) return <Skeleton className="h-[300px] w-full" />;
    if (error) return <div className="text-red-500 p-4">{error}</div>;

    return (
        <>
            <CardHeader>
                <CardTitle className="text-xl font-medium">Действия администраторов</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex items-center pb-4">
                    <Input
                        placeholder="Фильтр по действиям..."
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