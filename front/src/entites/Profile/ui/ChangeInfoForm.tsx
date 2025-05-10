'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { changeInfoSchema, type TypeChangeInfoSchema } from '../schemas/change-info.schema'
import { useCurrentStaff } from '@/entites/Staff/lib/hooks/useCurrentStaff'
import { FormWrapper } from '@/shared/ui/form/FormWrapper'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/shared/ui/form/form'
import { Input } from '@/shared/ui/form/input'
import { Separator } from '@/shared/ui/branding/separator'
import { Button } from '@/shared/ui/form/button'
import { Skeleton } from '@/shared/ui/branding/skeleton'
import { Textarea } from '@/shared/ui/form/textarea'
import { profileApi } from '../lib/api/profile.api'

export function ChangeInfoForm() {
    const { staff, isLoading, refetch } = useCurrentStaff()

    const form = useForm<TypeChangeInfoSchema>({
        resolver: zodResolver(changeInfoSchema),
        values: {
            firstName: staff?.firstName ?? '',
            midleName: staff?.midleName ?? '',
            lastName: staff?.lastName ?? '',
            displayName: staff?.displayName ?? '',
            bio: staff?.bio ?? ''
        }
    })

    const {
        formState: { isSubmitting }
    } = form

    async function onSubmit(data: TypeChangeInfoSchema) {
        try {
            await profileApi.changeInfo(data)
            await refetch()
            toast.success('Профиль успешно обновлён')
        } catch (error) {
            toast.error(
                error instanceof Error ? error.message : 'Ошибка при обновлении профиля'
            )
        }
    }

    return isLoading ? (
        <ChangeInfoFormSkeleton />
    ) : (
        <FormWrapper className='mt-6' heading="Настройки профиля">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-y-6">
                    <div className='grid grid-cols-1 lg:grid-cols-3 gap-y-4'>
                        <FormField
                            control={form.control}
                            name="firstName"
                            render={({ field }) => (
                                <FormItem className="px-0 sm:px-5">
                                    <FormLabel>Ваше имя</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Иван"
                                            {...field}
                                            disabled={isSubmitting}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="midleName"
                            render={({ field }) => (
                                <FormItem className="px-0 sm:px-5">
                                    <FormLabel>Ваше отчество</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Иванович"
                                            {...field}
                                            disabled={isSubmitting}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="lastName"
                            render={({ field }) => (
                                <FormItem className="px-0 sm:px-5">
                                    <FormLabel>Ваша фамилия</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Иванов"
                                            {...field}
                                            disabled={isSubmitting}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <Separator />
                    <FormField
                        control={form.control}
                        name="displayName"
                        render={({ field }) => (
                            <FormItem className="px-0 sm:px-5">
                                <FormLabel>Отображаемое имя</FormLabel>
                                <FormControl>
                                    <Input placeholder="Lain" {...field} disabled={isSubmitting} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Separator />
                    <FormField
                        control={form.control}
                        name="bio"
                        render={({ field }) => (
                            <FormItem className="px-0 sm:px-5 pb-3">
                                <FormLabel>О себе</FormLabel>
                                <FormControl>
                                    <Textarea
                                        placeholder="Я люблю программировать"
                                        {...field}
                                        disabled={isSubmitting}
                                    />
                                </FormControl>
                                <FormMessage />
                                <FormDescription>
                                    Информация о себе должна содержать не более 300 символов.
                                </FormDescription>
                            </FormItem>
                        )}
                    />
                    <div className="flex justify-end p-5">
                        <Button type="submit" >
                            Сохранить изменения
                        </Button>
                    </div>
                </form>
            </Form>
        </FormWrapper>
    )
}

export function ChangeInfoFormSkeleton() {
    return <Skeleton className="h-96 w-full mt-6" />
}