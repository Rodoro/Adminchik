'use client'
import { Skeleton } from "@/shared/ui/branding/skeleton"
import { Button } from "@/shared/ui/form/button"
import { Form, FormField } from "@/shared/ui/form/form"
import { ConfirmModal } from "@/shared/ui/overlay/ConfirmModal"
import { Trash } from "lucide-react"
import { toast } from "sonner"
import { avatarApi } from "../lib/api/avatar.api"
import { ChangeEvent, useRef } from "react"
import { type TypeUploadFileSchema, uploadFileSchema } from "../schemas/upload-file.schema"
import { useCurrentStaff } from "@/entites/Staff/lib/hooks/useCurrentStaff"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { FormWrapper } from "@/shared/ui/form/FormWrapper"
import { ChannelAvatar } from "@/shared/ui/branding/ChannelAvatar"

export function ChangeAvatarForm() {
    const { staff, isLoading, refetch } = useCurrentStaff()
    const inputRef = useRef<HTMLInputElement>(null)

    const form = useForm<TypeUploadFileSchema>({
        resolver: zodResolver(uploadFileSchema),
        values: {
            file: staff?.avatar || ''
        }
    })

    const handleImageChange = async (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (!file) return

        console.log(file)

        try {
            const { success } = await avatarApi.uploadAvatar(file)
            if (success) {
                refetch()
                toast.success('Изображение профиля успешно обновлено')
            }
        } catch (error) {
            console.error(error)
            toast.error('Ошибка при обновлении изображения профиля')
        }
    }

    const handleRemoveAvatar = async () => {
        try {
            const { success } = await avatarApi.removeAvatar()
            if (success) {
                refetch()
                toast.success('Изображение профиля успешно удалено')
            }
        } catch (error) {
            console.error(error)
            toast.error('Ошибка при удалении изображения профиля')
        }
    }

    return isLoading ? (
        <ChangeAvatarFormSkeleton />
    ) : (
        <FormWrapper className="mt-6" heading={'Изображение профиля'}>
            <Form {...form}>
                <FormField
                    control={form.control}
                    name="file"
                    render={({ field }) => (
                        <div className=" pb-5">
                            <div className="w-full lg:items-center gap-6 lg:gap-0 space-x-6 flex flex-col lg:flex-row">
                                <ChannelAvatar
                                    channel={{
                                        username: staff?.email || '',
                                        avatar: field.value instanceof File
                                            ? URL.createObjectURL(field.value)
                                            : field.value
                                    }}
                                    size="xl"
                                />
                                <div className="space-y-3">
                                    <div className="flex items-center gap-x-3">
                                        <input
                                            className="hidden"
                                            type="file"
                                            ref={inputRef}
                                            onChange={handleImageChange}
                                            accept="image/*"
                                        />
                                        <Button
                                            variant="secondary"
                                            onClick={() => inputRef.current?.click()}
                                            disabled={form.formState.isSubmitting}
                                        >
                                            Обновить изображение профиля
                                        </Button>
                                        {staff?.avatar && (
                                            <ConfirmModal
                                                heading={'Удаление аватара'}
                                                message={'Вы уверены, что хотите удалить изображение профиля? Это действие нельзя будет отменить.'}
                                                onConfirm={handleRemoveAvatar}
                                            >
                                                <Button
                                                    variant="ghost"
                                                    disabled={form.formState.isSubmitting}
                                                >
                                                    <Trash className="size-4" />
                                                </Button>
                                            </ConfirmModal>
                                        )}
                                    </div>
                                    <p className="text-sm text-muted-foreground">
                                        Поддерживаемые форматы: JPG, JPEG, PNG, WEBP или GIF. Макс. размер: 10 МБ.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                />
            </Form>
        </FormWrapper>
    )
}

export function ChangeAvatarFormSkeleton() {
    return <Skeleton className="h-52 w-full mt-6" />
}