'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import * as z from 'zod';
import { staffApi } from '../../lib/api/staff.api';
import { Permission, PermissionBadges } from '../../types/permission.types';
import { FormWrapper } from '@/shared/ui/form/FormWrapper';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/shared/ui/form/form';
import { Input } from '@/shared/ui/form/input';
import { Separator } from '@/shared/ui/branding/separator';
import { Button } from '@/shared/ui/form/button';
import { Checkbox } from '@/shared/ui/form/checkbox';
import { Textarea } from '@/shared/ui/form/textarea';

//TODO: Редактирование логи

const formSchema = z.object({
    email: z.string().email("Некорректный email"),
    displayName: z.string().min(2, "Никнейм должен содержать минимум 2 символа"),
    firstName: z.string().min(2, "Имя должно содержать минимум 2 символа"),
    lastName: z.string().min(2, "Фамилия должна содержать минимум 2 символа"),
    midleName: z.string().optional(),
    permissions: z.array(z.number()).optional(),
    bio: z.string({ invalid_type_error: "Описание должно быть строкой" }).max(300, { message: "Описание должно быть не длиннее 300 символов" }).optional()
});

export default function EditStaffPage({ params }: {
    params: Promise<{ id: string }>
}) {
    const router = useRouter();
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            displayName: "",
            firstName: "",
            lastName: "",
            midleName: "",
            permissions: [],
            bio: ""
        },
    });

    const {
        formState: { isSubmitting }
    } = form;

    useEffect(() => {
        const loadStaffData = async () => {
            const id = (await params).id
            try {
                const staff = await staffApi.getById(id);
                form.reset({
                    bio: staff.bio || "",
                    email: staff.email,
                    displayName: staff.displayName,
                    firstName: staff.firstName,
                    lastName: staff.lastName,
                    midleName: staff.midleName || "",
                    permissions: staff.permissions
                        .split('')
                        .map((char, index) => char === '1' ? index : -1)
                        .filter(index => index !== -1),
                });
            } catch (error) {
                console.error(error);
                toast.error("Не удалось загрузить данные администратора");
                router.push("/adminchik/staff");
            }
        };

        loadStaffData();
    }, [form, router]);

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            await staffApi.update((await params).id, values);

            toast.success("Администратор успешно обновлен");
            router.push("/adminchik/staff");
        } catch (error) {
            console.error(error);
            toast.error("Не удалось обновить администратора");
        }
    };

    const handlePermissionChange = (permission: Permission, checked: boolean) => {
        const currentPermissions = form.getValues("permissions") || [];

        if (checked) {
            form.setValue("permissions", [...currentPermissions, permission]);
        } else {
            form.setValue(
                "permissions",
                currentPermissions.filter((p) => p !== permission)
            );
        }
    };

    return (
        <FormWrapper heading="Редактирование администратора">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-y-6">
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem className="px-0 sm:px-5">
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Введите email"
                                        {...field}
                                        disabled={isSubmitting}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <Separator />

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-y-4">
                        <FormField
                            control={form.control}
                            name="lastName"
                            render={({ field }) => (
                                <FormItem className="px-0 sm:px-5">
                                    <FormLabel>Фамилия</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Введите фамилию"
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
                            name="firstName"
                            render={({ field }) => (
                                <FormItem className="px-0 sm:px-5">
                                    <FormLabel>Имя</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Введите имя"
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
                                    <FormLabel>Отчество (необязательно)</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Введите отчество"
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
                                <FormLabel>Никнейм</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Введите никнейм"
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
                                    Информация должна содержать не более 300 символов.
                                </FormDescription>
                            </FormItem>
                        )}
                    />

                    <Separator />

                    <div className="px-0 sm:px-5 space-y-4">
                        <FormLabel>Права доступа</FormLabel>
                        <FormDescription>
                            Выберите права, которые будут доступны администратору
                        </FormDescription>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {Object.entries(PermissionBadges).map(([key, label]) => {
                                const permission = Number(key) as Permission;
                                return (
                                    <div key={key} className="flex items-center space-x-2">
                                        <Checkbox
                                            id={`permission-${permission}`}
                                            checked={form.watch("permissions")?.includes(permission) || false}
                                            onCheckedChange={(checked) =>
                                                handlePermissionChange(permission, !!checked)
                                            }
                                            disabled={isSubmitting}
                                        />
                                        <label
                                            htmlFor={`permission-${permission}`}
                                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                        >
                                            {label}
                                        </label>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div className="flex justify-end p-5 gap-4">
                        <Button
                            variant="outline"
                            type="button"
                            onClick={() => router.push("/adminchik/staff")}
                            disabled={isSubmitting}
                        >
                            Отмена
                        </Button>
                        <Button type="submit" disabled={isSubmitting}>
                            Сохранить изменения
                        </Button>
                    </div>
                </form>
            </Form>
        </FormWrapper>
    );
}