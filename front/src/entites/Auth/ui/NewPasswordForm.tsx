'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useParams, useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { TypeNewPasswordSchema, newPasswordSchema } from '../schemas/new-passsword.schema'
import { passwordApi } from '../lib/api/password.api'
import AuthWrapper from './AuthWraper'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/shared/ui/form/form'
import { Input } from '@/shared/ui/form/input'
import { Button } from '@/shared/ui/form/button'



export function NewPasswordForm() {
    const router = useRouter()
    const params = useParams<{ token: string }>()
    const token = params.token

    const form = useForm<TypeNewPasswordSchema>({
        resolver: zodResolver(newPasswordSchema),
        defaultValues: { password: '', passwordRepeat: '' }
    })

    const { isSubmitting } = form.formState

    const onSubmit = async (data: TypeNewPasswordSchema) => {
        console.log(token)
        if (!token) {
            toast.error('Неверный токен')
            return
        }

        try {
            await passwordApi.setNewPassword({ ...data, token })
            toast.success('Пароль успешно изменён')
            router.push('/login')
        } catch (error) {
            console.error(error)
            toast.error('Ошибка при установлении нового пароля')
        }
    }

    return (
        <AuthWrapper
            heading={'Новый пароль'}
        >
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className='grid gap-y-3'>
                    <FormField
                        control={form.control}
                        name='password'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Новый пароль</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder='********'
                                        type='password'
                                        disabled={isSubmitting}
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                                <FormDescription>Ваш новый пароль</FormDescription>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name='passwordRepeat'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Повторите пароль</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder='********'
                                        type='password'
                                        disabled={isSubmitting}
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                                <FormDescription>Повторите свой новый пароль для подтверждения</FormDescription>
                            </FormItem>
                        )}
                    />
                    <Button className='mt-2 w-full' disabled={isSubmitting}>
                        Продолжить
                    </Button>
                </form>
            </Form>
        </AuthWrapper>
    )
}