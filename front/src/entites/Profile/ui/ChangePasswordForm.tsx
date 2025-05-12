'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { Button } from '@/shared/ui/form/button'
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from '@/shared/ui/form/form'
import { Input } from '@/shared/ui/form/input'
import { Separator } from '@/shared/ui/branding/separator'
import { Skeleton } from '@/shared/ui/branding/skeleton'
import { FormWrapper } from '@/shared/ui/form/FormWrapper'

import { accountApi } from '../lib/api/account.api'
import {
    changePasswordSchema,
    type TypeChangePasswordSchema
} from '../schemas/change-password.schema'
import { useCurrentStaff } from '@/entites/Staff/lib/hooks/useCurrentStaff'

export function ChangePasswordForm() {
    const { isLoading, refetch } = useCurrentStaff()

    const form = useForm<TypeChangePasswordSchema>({
        resolver: zodResolver(changePasswordSchema),
        values: {
            oldPassword: '',
            newPassword: ''
        }
    })

    const {
        formState: { isSubmitting }
    } = form

    async function onSubmit(data: TypeChangePasswordSchema) {
        try {
            await accountApi.changePassword(data)
            form.reset()
            await refetch()
            toast.success("Пароль успешно обновлён")
        } catch (error) {
            console.error(error)
            toast.error("Ошибка при обновлении пароля")
        }
    }

    return isLoading ? (
        <ChangePasswordFormSkeleton />
    ) : (
        <FormWrapper className="mt-6" heading={"Пароль от аккаунта"}>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-y-3">
                    <FormField
                        control={form.control}
                        name="oldPassword"
                        render={({ field }) => (
                            <FormItem className="px-5">
                                <FormLabel>{"Старый пароль"}</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="********"
                                        type="password"
                                        disabled={isSubmitting}
                                        {...field}
                                    />
                                </FormControl>
                                <FormDescription>{"Введите свой старый пароль, чтобы подтвердить вашу личность перед изменением пароля. Это необходимо для обеспечения безопасности вашей учетной записи."}</FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Separator />
                    <FormField
                        control={form.control}
                        name="newPassword"
                        render={({ field }) => (
                            <FormItem className="px-5">
                                <FormLabel>{"Новый пароль"}</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="********"
                                        type="password"
                                        disabled={isSubmitting}
                                        {...field}
                                    />
                                </FormControl>
                                <FormDescription>{"Ваш новый пароль должен содержать не менее 8 символов. Рекомендуется использовать также специальные символы для повышения безопасности."}</FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Separator />
                    <div className="flex justify-end p-5">
                        <Button>
                            Сохранить
                        </Button>
                    </div>
                </form>
            </Form>
        </FormWrapper>
    )
}

export function ChangePasswordFormSkeleton() {
    return <Skeleton className="h-96 w-full mt-6" />
}