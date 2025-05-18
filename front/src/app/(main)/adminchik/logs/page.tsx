import { ActionsTable } from '@/entites/Logs/ui/actions-table'
import { EndpointsTable } from '@/entites/Logs/ui/endpoints-table'
import { ErrorsStats } from '@/entites/Logs/ui/errors-stats'
import { RequestsChart } from '@/entites/Logs/ui/requests-chart'
import { HttpRequestsTable } from '@/entites/Logs/ui/requests-table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/layout/tabs'
import { Card } from '@/shared/ui/overlay/card'
import { TypographyH2 } from '@/shared/ui/typography/TypographyH2'
import { TypographyP } from '@/shared/ui/typography/TypographyP'
import Header from '@/widgets/ui/layouts/Header/Header'
import React from 'react'

export async function generateMetadata() {
    return {
        title: 'Логи',
    }
}

export default function page() {
    return (
        <>
            <Header
                breadcrumbs={[
                    { label: "Adminchik", href: "/adminchik" },
                    { label: "Логи", isCurrent: true }
                ]}
            />
            <main className="flex flex-1 flex-col pb-4 pt-0 px-8 max-w-5xl">
                <TypographyH2 text='Логи' />
                <TypographyP className='' text='Здесь можно посмотреть все логи связанные с серсисом Adminhik' />
                <Tabs defaultValue="requests">
                    <TabsList className="grid w-full grid-cols-4 mt-4">
                        <TabsTrigger value="requests">Запросы</TabsTrigger>
                        <TabsTrigger value="actions">Действия</TabsTrigger>
                        <TabsTrigger value="errors">Ошибки</TabsTrigger>
                        <TabsTrigger value="endpoints">Эндпоинты</TabsTrigger>
                    </TabsList>

                    <TabsContent value="requests" className='flex flex-col gap-8'>
                        <Card className='mt-4'>
                            <RequestsChart />
                        </Card>
                        <Card>
                            <HttpRequestsTable />
                        </Card>
                        {/* TODO: Таблица всех логов */}
                    </TabsContent>

                    <TabsContent value="actions">
                        <Card className='mt-4'>
                            <ActionsTable />
                        </Card>
                    </TabsContent>

                    <TabsContent value="errors">
                        <Card className='mt-4'>
                            <ErrorsStats />
                        </Card>
                        {/* TODO: Таблица всех ошибок */}
                    </TabsContent>

                    <TabsContent value="endpoints">
                        <Card className='mt-4'>
                            <EndpointsTable />
                        </Card>
                    </TabsContent>
                </Tabs>
            </main>
        </>
    )
}
