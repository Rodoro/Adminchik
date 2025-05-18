/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { Skeleton } from "@/shared/ui/branding/skeleton";
import { metricsApi } from "../lib/api/metrics-api";
import { CardHeader, CardTitle, CardContent } from "@/shared/ui/overlay/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/ui/branding/table";
import { useEffect, useState } from "react";


export function ActionsTable() {
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

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
    if (error) return <div>Ошибка загрузки данных</div>;

    return (
        <>
            <CardHeader>
                <CardTitle className="text-xl font-medium">Действия администраторов</CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Действие</TableHead>
                            <TableHead>Количество</TableHead>
                            <TableHead>Уникальные пользователи</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data?.map((item) => (
                            <TableRow key={item.action}>
                                <TableCell className="font-medium">{item.action}</TableCell>
                                <TableCell>{item.count}</TableCell>
                                <TableCell>{item.unique_users}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                {/* TODO: Обновить по сравнению с req table */}
            </CardContent>
        </>
    );
}