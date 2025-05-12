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
    changeEmailSchema,
    type TypeChangeEmailSchema
} from '../schemas/change-email.schema'
import { useCurrentStaff } from '@/entites/Staff/lib/hooks/useCurrentStaff'

export function ChangeEmailForm() {
    const { staff, isLoading, refetch } = useCurrentStaff()

    const form = useForm<TypeChangeEmailSchema>({
        resolver: zodResolver(changeEmailSchema),
        values: {
            email: staff?.email ?? ''
        }
    })

    const {
        formState: { isSubmitting, isValid, isDirty }
    } = form

    async function onSubmit(data: TypeChangeEmailSchema) {
        try {
            await accountApi.changeEmail(data)
            await refetch()
            toast.success("Почта успешно обновлена")
        } catch (error) {
            console.error(error)
            toast.error("Ошибка при обновлении почты")
        }
    }

    return isLoading ? (
        <ChangeEmailFormSkeleton />
    ) : (
        <FormWrapper className="mt-6" heading={"Адрес электронной почты"}>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-y-3">
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem className="px-0 sm:px-5">
                                <FormLabel>{"Почта"}</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="john.doe@example.com"
                                        disabled={isSubmitting}
                                        {...field}
                                    />
                                </FormControl>
                                <FormDescription>{"Введите ваш новый адрес электронной почты."}</FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Separator />
                    <div className="flex justify-end p-5">
                        <Button disabled={!isValid || !isDirty || isSubmitting}>
                            Сохранить
                        </Button>
                    </div>
                </form>
            </Form>
        </FormWrapper>
    )
}

export function ChangeEmailFormSkeleton() {
    return <Skeleton className="h-64 w-full mt-6" />
}