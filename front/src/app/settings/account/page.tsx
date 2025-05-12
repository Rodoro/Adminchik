import { ChangeEmailForm } from '@/entites/Profile/ui/ChangeEmailForm'
import { ChangePasswordForm } from '@/entites/Profile/ui/ChangePasswordForm'
import { TypographyH2 } from '@/shared/ui/typography/TypographyH2'
import { TypographyP } from '@/shared/ui/typography/TypographyP'
import Header from '@/widgets/ui/layouts/Header/Header'
import React from 'react'

export async function generateMetadata() {
    return {
        title: 'Акаунт',
    }
}

export default function page() {
    return (
        <>
            <Header
                breadcrumbs={[
                    { label: "Настройки", href: "/settings" },
                    { label: "Акаунт", isCurrent: true }
                ]}
            />
            <main className="flex flex-1 flex-col pb-4 pt-0 px-8 max-w-5xl">
                <TypographyH2 text='Аккаунт' />
                <TypographyP text='Управляйте настройками вашего аккаунта, включая изменение доступа, безопасность' />
                <ChangeEmailForm />
                <ChangePasswordForm />
            </main>
        </>
    )
}
