import { ChangeNotificationsSettingsForm } from '@/entites/Notification/ui/ChangeNotificationsSettingsForm'
import { TypographyH2 } from '@/shared/ui/typography/TypographyH2'
import { TypographyP } from '@/shared/ui/typography/TypographyP'
import Header from '@/widgets/ui/layouts/Header/Header'
import React from 'react'

export async function generateMetadata() {
    return {
        title: 'Уведомления',
    }
}

export default function page() {
    return (
        <>
            <Header
                breadcrumbs={[
                    { label: "Настройки", href: "/settings" },
                    { label: "Уведомления", isCurrent: true }
                ]}
            />
            <main className="flex flex-1 flex-col pb-4 pt-0 px-8 max-w-5xl">
                <TypographyH2 text='Уведомления' />
                <TypographyP text='Настройте, как вы хотите получать уведомления по панели Adminchik и получайте их сразу в телеграмм канале.' />
                <ChangeNotificationsSettingsForm />
            </main>
        </>
    )
}
