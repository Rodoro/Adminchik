import Header from '@/widgets/ui/layouts/Header/Header'
import React from 'react'

export default function page() {
    return (
        <>
            <Header
                breadcrumbs={[
                    { label: "Adminchik", href: "/adminchik" },
                    { label: "Сотрудники", isCurrent: true }
                ]}
            />
            <main className="flex flex-1 flex-col gap-4 p-4 pt-0">
                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                    <div className="aspect-video rounded-xl bg-muted/50" />
                    <div className="aspect-video rounded-xl bg-muted/50" />
                    <div className="aspect-video rounded-xl bg-muted/50" />
                </div>
                <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" />
            </main>
        </>
    )
}
