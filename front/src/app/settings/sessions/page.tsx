import SessionList from '@/entites/Session/ui/SessionList'
import { TypographyH2 } from '@/shared/ui/typography/TypographyH2'
import { TypographyP } from '@/shared/ui/typography/TypographyP'
import Header from '@/widgets/ui/layouts/Header/Header'
import React from 'react'

export async function generateMetadata() {
    return {
        title: 'Сесcии',
    }
}

export default function page() {
    return (
        <>
            <Header
                breadcrumbs={[
                    { label: "Настройки", href: "/settings" },
                    { label: "Сесcии", isCurrent: true }
                ]}
            />
            {/* TODO: Вынести в отдельный компонент маин */}
            <main className="flex flex-1 flex-col pb-4 pt-0 px-8 max-w-5xl">
                <TypographyH2 text='Сесcии' />
                <TypographyP className='' text='Сессии - это устройства, которые вы используете или которые использовали для входа в вашу учетную запись Adminchik. Здесь показаны активные сессии в данный момент.' />
                <SessionList />
            </main>
        </>
    )
}
