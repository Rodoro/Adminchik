'use client';

import { Skeleton } from "@/shared/ui/branding/skeleton";
import { CardContent, CardHeader, CardTitle } from "@/shared/ui/overlay/card";
import { TableHeader, TableRow, TableHead, TableBody, TableCell, Table } from "@/shared/ui/branding/table";
import { useEffect, useState } from "react";
import { Button } from "@/shared/ui/form/button";
import { ArrowUpDown, Edit, Trash2, Plus } from "lucide-react";
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
import { useRouter } from "next/navigation";
import { Staff } from "../types/staff.types";
import { staffApi } from "../lib/api/staff.api";
import { toast } from "sonner";
import { Badge } from "@/shared/ui/branding/badge";
import { PermissionBadges } from "../types/permission.types";
import { ConfirmModal } from "@/shared/ui/overlay/ConfirmModal";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/branding/avatar";
import { getMediaSource } from "@/shared/lib/utils/get-media-source";

//TODO: Система проектов
//TODO: Редактирование админов
//TODO: Поченить логи админов
//TODO: Гварды на права и на проекты
//TODO: Фильтр в таблице по правам и проектам

export function StaffTable() {
    const [data, setData] = useState<Staff[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [globalFilter, setGlobalFilter] = useState('');
    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 10,
    });
    const router = useRouter();

    const columns: ColumnDef<Staff>[] = [
        {
            accessorKey: "avatar",
            header: () => {
                return (
                    <div className="text-center">
                        Аватар
                    </div>
                )
            },
            cell: ({ row }) => {
                return (
                    <div className="flex justify-center">
                        <Avatar className="h-10 w-10 rounded-lg">
                            <AvatarImage src={getMediaSource(row.getValue("avatar"))} alt={row.getValue("email")} />
                            <AvatarFallback className="rounded-lg">{(row.getValue("email") as string)[0]}</AvatarFallback>
                        </Avatar>
                    </div>
                );
            },
        },
        {
            accessorKey: "searchText",
            header: () => null,
            cell: () => null,
        },
        {
            accessorKey: "displayName",
            header: "Пользователь",
            cell: ({ row }) => {
                const staff = row.original;
                const fullName = `${staff.lastName} ${staff.firstName}${staff.midleName ? ` ${staff.midleName}` : ''}`;

                return (
                    <div className="flex flex-col">
                        <span className="font-medium">{staff.displayName}</span>
                        {fullName.trim() && (
                            <span className="text-xs text-muted-foreground">
                                {fullName}
                            </span>
                        )}
                    </div>
                );
            },
        },
        {
            accessorKey: "email",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Email
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                )
            },
        },
        {
            accessorKey: "permissions",
            header: "Права доступа",
            cell: ({ row }) => {
                const permissions = row.getValue("permissions") as string;
                return (
                    <div className="flex flex-wrap gap-1">
                        {Object.entries(PermissionBadges).map(([key, label]) => {
                            const permissionIndex = Number(key);
                            return permissions.length > permissionIndex && permissions[permissionIndex] === '1' ? (
                                <Badge key={key} variant="outline">{label}</Badge>
                            ) : null;
                        })}
                    </div>
                );
            },
        },
        {
            accessorKey: "projects",
            header: "Проекты",
            cell: ({ row }) => {
                const projects = row.getValue("projects") as string[];
                return (
                    <div className="flex flex-wrap gap-1">
                        {projects?.map(project => (
                            <Badge key={project} variant="secondary">{project}</Badge>
                        ))}
                    </div>
                );
            },
        },
        {
            id: "actions",
            cell: ({ row }) => {
                const staff = row.original;

                const handleDelete = async () => {
                    try {
                        await staffApi.delete(staff.email);
                        await fetchData();
                        toast.success('Сотрудник удален');
                    } catch (error) {
                        console.error(error);
                        toast.error('Не удалось удалить сотрудника');
                    }
                };

                return (
                    <div className="flex space-x-2 justify-end">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => router.push(`/adminchik/staff/edit/${staff.id}`)}
                        >
                            <Edit className="h-4 w-4" />
                        </Button>
                        <ConfirmModal
                            heading="Удаление сотрудника"
                            message={`Вы уверены, что хотите удалить сотрудника ${staff.displayName}? Это действие нельзя отменить.`}
                            onConfirm={handleDelete}
                        >
                            <Button variant="ghost" size="icon">
                                <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                        </ConfirmModal>
                    </div>
                );
            },
        },
    ];

    const table = useReactTable({
        data,
        columns,
        pageCount: Math.ceil(data.length / pagination.pageSize),
        state: {
            sorting,
            columnFilters: [
                ...columnFilters,
                { id: 'searchText', value: globalFilter }
            ],
            pagination,
            globalFilter,
        },
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        onGlobalFilterChange: setGlobalFilter,
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
            const response = await staffApi.getAll();
            const staffWithSearch = response.map(staff => ({
                ...staff,
                searchText: `${staff.displayName} ${staff.lastName} ${staff.firstName}${staff.midleName ? ` ${staff.midleName}` : ''}`.toLowerCase()
            }));
            setData(staffWithSearch);
            setError(null);
        } catch (err) {
            setError('Ошибка загрузки данных');
            console.error(err);
            toast.error('Не удалось загрузить список сотрудников');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [pagination.pageIndex, pagination.pageSize]);

    if (loading) return <Skeleton className="h-[300px] w-full" />;
    if (error) return <div className="text-red-500 p-4">{error}</div>;

    return (
        <>
            <CardHeader className="flex flex-col gap-4 sm:flex-row justify-between items-center">
                <CardTitle className="text-xl font-medium">Управление персоналом</CardTitle>
                <Button onClick={() => router.push('/adminchik/staff/create')}>
                    <Plus className="mr-2 h-4 w-4" />
                    Добавить администратора
                </Button>
            </CardHeader>
            <CardContent>
                <div className="flex items-center flex-wrap gap-4 pb-4">
                    <Input
                        placeholder="Поиск по никнейму, ФИО или email..."
                        value={globalFilter ?? ''}
                        onChange={(event) => {
                            const value = event.target.value.toLowerCase();
                            setGlobalFilter(value);
                            table.getColumn('searchText')?.setFilterValue(value);
                        }}
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
                        Всего сотрудников: {data.length}
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