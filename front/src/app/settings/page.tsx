import { ChangeAvatarForm } from '@/entites/Profile/ui/ChangeAvatarForm'
import { ChangeInfoForm } from '@/entites/Profile/ui/ChangeInfoForm'
import { TypographyH2 } from '@/shared/ui/typography/TypographyH2'
import { TypographyP } from '@/shared/ui/typography/TypographyP'
import Header from '@/widgets/ui/layouts/Header/Header'
import React from 'react'

export async function generateMetadata() {
    return {
        title: 'Настройки',
    }
}

export default function SettingsPage() {
    return (
        <>
            <Header
                breadcrumbs={[
                    { label: "Настройки" },
                ]}
            />
            <main className="flex flex-1 flex-col pb-4 pt-0 px-8 max-w-5xl">
                <TypographyH2 text='Профиль' />
                <TypographyP className='' text='Настройте ваш профиль, обновите аватар, измените информацию о себе и добавьте ссылки на социальные сети.' />
                <ChangeAvatarForm />
                <ChangeInfoForm />
            </main>
        </>
    )
}
