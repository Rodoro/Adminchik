/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/rules-of-hooks */
'use client';

import { Skeleton } from "@/shared/ui/branding/skeleton";
import { metricsApi } from "../../lib/api/metrics.api";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/overlay/card";
import { TableHeader, TableRow, TableHead, TableBody, TableCell, Table } from "@/shared/ui/branding/table";
import { useEffect, useState } from "react";
import { Button } from "@/shared/ui/form/button";
import { ArrowUpDown, Clock, Copy, Eye, FileInput, FileOutput, ListFilter, X } from "lucide-react";
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
import { Tabs, TabsList, TabsTrigger } from "@/shared/ui/layout/tabs";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle } from "@/shared/ui/overlay/dialog";
import { Badge } from "@/shared/ui/branding/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/shared/ui/form/tooltip";
import { cn } from "@/shared/lib/utils/utils";

export type UserActivityLog = {
    timestamp: string;
    action: string;
    endpoint: string;
    status: number;
    duration_ms: number;
    ip: string;
    details: string;
    request_id: string;
    request_body: string | null;
    response_body: string | null;
};

const EnhancedJsonViewer = ({ jsonString }: { jsonString: string | null }) => {
    if (!jsonString) return (
        <div className="bg-muted/50 rounded-md p-4 text-sm text-muted-foreground">
            Нет данных
        </div>
    );

    try {
        const json = JSON.parse(jsonString);
        return (
            <div className="relative">
                <pre className="text-sm bg-muted/50 rounded-md p-4 overflow-auto max-h-[50vh]">
                    <code className="font-mono">
                        {JSON.stringify(json, null, 2)}
                    </code>
                </pre>
            </div>
        );
    } catch {
        return (
            <div className="relative">
                <div className="text-sm bg-muted/50 rounded-md p-4 overflow-auto max-h-[50vh] break-all">
                    {jsonString}
                </div>
            </div>
        );
    }
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
        id: "details",
        header: () => <div className="text-right">Детали</div>,
        cell: ({ row }) => {
            const [isOpen, setIsOpen] = useState(false);
            const log = row.original;
            const [activeTab, setActiveTab] = useState<'request' | 'response' | 'headers'>('request');
            const [copied, setCopied] = useState(false);

            const copyToClipboard = (text: string) => {
                navigator.clipboard.writeText(text);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            };

            return (
                <div className="flex justify-end">
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 w-8 p-0 hover:bg-accent/50 group"
                                    onClick={() => setIsOpen(true)}
                                >
                                    <Eye className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent side="top">
                                <p>Просмотр деталей</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>

                    <Dialog open={isOpen} onOpenChange={setIsOpen}>
                        <DialogContent className="max-w-6xl p-0 overflow-hidden rounded-xl">
                            <div className="relative flex flex-col h-[60vh]">
                                {/* Заголовок */}
                                <div className="sticky top-0 z-10 bg-background border-b p-4 space-y-1">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <DialogTitle className="text-lg font-semibold">
                                                Детали запроса
                                            </DialogTitle>
                                            <DialogDescription className="flex items-center gap-2 flex-wrap">
                                                <span className="inline-flex items-center gap-1">
                                                    <Clock className="h-3 w-3" />
                                                    {new Date(log.timestamp).toLocaleString()}
                                                </span>
                                                <span>•</span>
                                                <Badge variant="outline" className="font-mono">
                                                    {log.action}
                                                </Badge>
                                                <span>•</span>
                                                <span className="truncate max-w-xs">{log.endpoint}</span>
                                            </DialogDescription>
                                        </div>
                                        <DialogClose className="rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none">
                                            <X className="h-5 w-5" />
                                        </DialogClose>
                                    </div>

                                    {/* Табы */}
                                    <Tabs
                                        value={activeTab}
                                        onValueChange={(v) => setActiveTab(v as any)}
                                        className="mt-2"
                                    >
                                        <TabsList className="grid grid-cols-3 w-full">
                                            <TabsTrigger value="request">
                                                <FileInput className="h-4 w-4 mr-2" />
                                                Request
                                            </TabsTrigger>
                                            <TabsTrigger value="response">
                                                <FileOutput className="h-4 w-4 mr-2" />
                                                Response
                                            </TabsTrigger>
                                            <TabsTrigger value="headers">
                                                <ListFilter className="h-4 w-4 mr-2" />
                                                Headers
                                            </TabsTrigger>
                                        </TabsList>
                                    </Tabs>
                                </div>

                                {/* Контент */}
                                <div className="flex-1 overflow-auto p-6">
                                    {activeTab === 'request' && (
                                        <div className="space-y-4">
                                            <div className="flex justify-between items-center">
                                                <h4 className="text-sm font-medium flex items-center gap-2">
                                                    <FileInput className="h-4 w-4" />
                                                    Request Body
                                                </h4>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => copyToClipboard(log.request_body || '')}
                                                >
                                                    {copied ? 'Скопировано!' : <Copy className="h-4 w-4 mr-2" />}
                                                    Копировать
                                                </Button>
                                            </div>
                                            <EnhancedJsonViewer jsonString={log.request_body} />
                                        </div>
                                    )}

                                    {activeTab === 'response' && (
                                        <div className="space-y-4">
                                            <div className="flex justify-between items-center">
                                                <h4 className="text-sm font-medium flex items-center gap-2">
                                                    <FileOutput className="h-4 w-4" />
                                                    Response Body
                                                </h4>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => copyToClipboard(log.response_body || '')}
                                                >
                                                    {copied ? 'Скопировано!' : <Copy className="h-4 w-4 mr-2" />}
                                                    Копировать
                                                </Button>
                                            </div>
                                            <EnhancedJsonViewer jsonString={log.response_body} />
                                        </div>
                                    )}

                                    {activeTab === 'headers' && (
                                        <div className="space-y-4">
                                            <h4 className="text-sm font-medium flex items-center gap-2 h-8">
                                                <ListFilter className="h-4 w-4" />
                                                Заголовки и метаданные
                                            </h4>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <Card>
                                                    <CardHeader className="pb-2">
                                                        <CardTitle className="text-sm font-medium">Основное</CardTitle>
                                                    </CardHeader>
                                                    <CardContent>
                                                        <div className="space-y-3">
                                                            <div className="flex justify-between">
                                                                <span className="text-sm text-muted-foreground">Статус</span>
                                                                <Badge
                                                                    variant="outline"
                                                                    className={cn(
                                                                        "font-mono",
                                                                        log.status >= 400 ? "bg-red-500/10 text-red-500" :
                                                                            log.status >= 200 ? "bg-green-500/10 text-green-500" :
                                                                                "bg-yellow-500/10 text-yellow-500"
                                                                    )}
                                                                >
                                                                    {log.status}
                                                                </Badge>
                                                            </div>
                                                            <div className="flex justify-between">
                                                                <span className="text-sm text-muted-foreground">Длительность</span>
                                                                <span className="text-sm font-mono">{log.duration_ms} ms</span>
                                                            </div>
                                                        </div>
                                                    </CardContent>
                                                </Card>

                                                <Card>
                                                    <CardHeader className="pb-2">
                                                        <CardTitle className="text-sm font-medium">Сеть</CardTitle>
                                                    </CardHeader>
                                                    <CardContent>
                                                        <div className="space-y-3">
                                                            <div className="flex justify-between">
                                                                <span className="text-sm text-muted-foreground">IP адрес</span>
                                                                <span className="text-sm font-mono">{log.ip}</span>
                                                            </div>
                                                            <div className="flex justify-between">
                                                                <span className="text-sm text-muted-foreground">Request ID</span>
                                                                <span className="text-sm font-mono truncate">{log.request_id}</span>
                                                            </div>
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Футер */}
                                <div className="sticky bottom-0 bg-background border-t p-4 flex justify-end">
                                    <Button
                                        variant="outline"
                                        onClick={() => setIsOpen(false)}
                                        className="mr-2"
                                    >
                                        Закрыть
                                    </Button>
                                    <Button
                                        onClick={() => {
                                            copyToClipboard(JSON.stringify(log, null, 2));
                                        }}
                                    >
                                        {copied ? 'Скопировано!' : 'Копировать все'}
                                    </Button>
                                </div>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>
            );
        }
    }
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
                pagination.pageSize,
                {
                    action: table.getColumn("action")?.getFilterValue() as string,
                    endpoint: table.getColumn("endpoint")?.getFilterValue() as string
                }
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
    }, [pagination.pageIndex, pagination.pageSize, columnFilters]);

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