import { z } from 'zod';

export const changeNotificationsSettingsSchema = z.object({
    authLogin: z.boolean(),
    passwordReset: z.boolean(),
});

export type TypeChangeNotificationsSettingsSchema = z.infer<
    typeof changeNotificationsSettingsSchema
>;