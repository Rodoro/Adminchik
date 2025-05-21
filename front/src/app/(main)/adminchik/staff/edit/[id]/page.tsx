import { ChangeAvatarForm } from '@/entites/Staff/ui/edit-forms/edit-avatar-form';
import EditStaffPage from '@/entites/Staff/ui/edit-forms/edit-form';
import { TypographyH2 } from '@/shared/ui/typography/TypographyH2'
import Header from '@/widgets/ui/layouts/Header/Header'
import React from 'react'

export async function generateMetadata() {
    return {
        title: 'Редактировать сотрудника',
    }
}

export default function page({ params }: {
    params: Promise<{ id: string }>
}) {
    return (
        <>
            <Header
                breadcrumbs={[
                    { label: "Adminchik", href: "/adminchik" },
                    { label: "Сотрудники", href: "/adminchik/staff" },
                    { label: "Редактировать", isCurrent: true }
                ]}
            />
            <main className="flex flex-1 flex-col pb-4 pt-0 px-8 max-w-7xl gap-4">
                <TypographyH2 text='Редактировать сотрудника' />
                <ChangeAvatarForm params={params} />
                <EditStaffPage params={params} />
            </main>
        </>
    )
}
