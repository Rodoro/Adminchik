'use client';

import { useCurrentStaff } from '@/entites/Staff/lib/hooks/useCurrentStaff';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { changeNotificationsSettingsSchema, type TypeChangeNotificationsSettingsSchema } from '../schemas/change-notifications-settings.schema';
import { notificationSettingsApi } from '../lib/api/notification-settings.api';
import { ToggleCard } from '@/shared/ui/overlay/ToggleCard';
import { Form, FormField } from '@/shared/ui/form/form';


export function ChangeNotificationsSettingsForm() {
    const { staff, refetch } = useCurrentStaff();

    const form = useForm<TypeChangeNotificationsSettingsSchema>({
        resolver: zodResolver(changeNotificationsSettingsSchema),
        values: {
            authLogin: staff?.notificationSettings?.authLogin ?? false,
            passwordReset: staff?.notificationSettings?.passwordReset ?? false,
        },
    });

    const isLoadingUpdate = form.formState.isSubmitting;

    const onChange = async (
        field: keyof TypeChangeNotificationsSettingsSchema,
        value: boolean
    ) => {
        form.setValue(field, value);

        try {
            const data = { ...form.getValues(), [field]: value };
            const response = await notificationSettingsApi.changeSettings(data);

            await refetch();
            toast.success("Настройки уведомлений успешно обновлены");

            if (response.telegramAuthToken) {
                window.open(
                    `https://t.me/NotificationsAdminchikBot?start=${response.telegramAuthToken}`,
                    '_blank'
                );
            }
        } catch (error) {
            console.error(error)
            toast.error("Ошибка при обновлении настроек");
            form.setValue(field, !value);
        }
    };

    // if (isLoading) {
    //     return (
    //         <>
    //             {Array.from({ length: 2 }).map((_, index) => (
    //                 <ToggleCardSkeleton className='mt-6' key={index} />
    //             ))}
    //         </>
    //     );
    // }

    return (
        <Form {...form}>
            <FormField
                control={form.control}
                name="authLogin"
                render={({ field }) => (
                    <ToggleCard
                        className='mt-6'
                        heading={"Уведомления о входе"}
                        description={"Получать уведомления при входе в аккаунт"}
                        isDisabled={isLoadingUpdate}
                        value={field.value}
                        onChange={(value) => onChange('authLogin', value)}
                    />
                )}
            />
            <FormField
                control={form.control}
                name="passwordReset"
                render={({ field }) => (
                    <ToggleCard
                        className='mt-6'
                        heading={"Уведомления о сбросе пароля"}
                        description={"Получать уведомления при запросе сброса пароля"}
                        isDisabled={isLoadingUpdate}
                        value={field.value}
                        onChange={(value) => onChange('passwordReset', value)}
                    />
                )}
            />
        </Form>
    );
}