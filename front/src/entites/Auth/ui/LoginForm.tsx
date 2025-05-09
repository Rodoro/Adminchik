'use client'
import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { useAuth } from '../lib/hooks/useAuth'
import { LoginSchema, loginSchema } from '../schemas/login-user.schema'
import { Button } from '@/shared/ui/form/button'
import { Input } from '@/shared/ui/form/input'
import AuthWrapper from './AuthWraper'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/ui/form/form'

export default function LoginForm() {
    const router = useRouter()
    const { login } = useAuth()

    const form = useForm<LoginSchema>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: '',
            password: ''
        }
    })

    const onSubmit = async (data: LoginSchema) => {
        try {
            await login(data.email, data.password)
            toast.success('Успешная авторизация')
            router.push('/')
        } catch (error) {
            toast.error(
                error instanceof Error
                    ? error.message
                    : 'Ошибка авторизации'
            )
        }
    }
    return (
        <AuthWrapper
            heading="Вход"
            backButtonHref='/recovery'
            backButtonLabel='Сбросить пароль'
        >
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-y-3">
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="email@example.com"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Пароль</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="********"
                                        type="password"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button
                        type="submit"
                        className="mt-2 w-full"
                    >
                        Продолжить
                    </Button>
                </form>
            </Form>
        </AuthWrapper>
    )
}