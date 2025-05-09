'use client'

import { FormField, FormItem, FormLabel, FormControl, Form, FormMessage } from '@/shared/ui/form/form'
import { Input } from '@/shared/ui/form/input'
import { Alert, AlertTitle, AlertDescription } from '@/shared/ui/overlay/alert'
import { zodResolver } from '@hookform/resolvers/zod'
import { CircleCheck } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { passwordApi } from '../lib/api/password.api'
import { TypeResetPasswordSchema, resetPasswordSchema } from '../schemas/reset-password.schema'
import AuthWrapper from './AuthWraper'
import { useForm } from 'react-hook-form'
import { Button } from '@/shared/ui/form/button'


export function ResetPasswordForm() {
    const [isSuccess, setIsSuccess] = useState(false)

    const form = useForm<TypeResetPasswordSchema>({
        resolver: zodResolver(resetPasswordSchema),
        defaultValues: { email: '' }
    })

    const { isValid, isSubmitting } = form.formState

    const onSubmit = async ({ email }: TypeResetPasswordSchema) => {
        try {
            await passwordApi.resetPassword(email, navigator.userAgent)
            setIsSuccess(true)
        } catch (error) {
            console.error(error)
            toast.error('Ошибка при сбросе пароля')
        }
    }

    return (
        <AuthWrapper
            heading={'Сброс пароля'}
            backButtonHref='/login'
            backButtonLabel='Войти'
        >
            {isSuccess ? (
                <Alert>
                    <CircleCheck className='size-4' />
                    <AlertTitle>Ссылка отправлена</AlertTitle>
                    <AlertDescription>Мы отправили ссылку для сброса пароля на вашу почту (Проверьте спам). Если у вас включены уведомления в Telegram, ссылка также была отправлена туда</AlertDescription>
                </Alert>
            ) : (
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className='grid gap-y-3'>
                        <FormField
                            control={form.control}
                            name='email'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Почта</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder='john.doe@example.com'
                                            disabled={isSubmitting}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button className='mt-2 w-full' disabled={!isValid || isSubmitting}>
                            Сбросить пароль
                        </Button>
                    </form>
                </Form>
            )}
        </AuthWrapper>
    )
}