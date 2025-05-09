import { NewPasswordForm } from '@/entites/Auth/ui/NewPasswordForm'
import React from 'react'

export async function generateMetadata() {
    return {
        title: 'Новый пароль',
    }
}

export default function page() {
    return (
        <NewPasswordForm />
    )
}
