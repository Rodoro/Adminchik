import { ResetPasswordForm } from '@/entites/Auth/ui/ResetPasswordForm'
import React from 'react'

export async function generateMetadata() {
    return {
        title: 'Сброс пароля',
    }
}

export default function page() {
    return (
        <ResetPasswordForm />
    )
}
