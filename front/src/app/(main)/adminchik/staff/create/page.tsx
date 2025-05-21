import CreateStaffPage from '@/entites/Staff/ui/create-form'
import { TypographyH2 } from '@/shared/ui/typography/TypographyH2'
import { TypographyP } from '@/shared/ui/typography/TypographyP'
import Header from '@/widgets/ui/layouts/Header/Header'
import React from 'react'

export async function generateMetadata() {
    return {
        title: 'Добавить сотрудника',
    }
}

export default function page() {
    return (
        <>
            <Header
                breadcrumbs={[
                    { label: "Adminchik", href: "/adminchik" },
                    { label: "Сотрудники", href: "/adminchik/staff" },
                    { label: "Добавить", isCurrent: true }
                ]}
            />
            <main className="flex flex-1 flex-col pb-4 pt-0 px-8 max-w-7xl gap-4">
                <TypographyH2 text='Добавить сотрудника' />
                <TypographyP className='' text='Добавте сотрудника в систему Adminchik' />
                <CreateStaffPage />
            </main>
        </>
    )
}
