import { SessionMetadata } from '@/src/shared/types/session-metadata.types';
import { Body, Head, Heading, Link, Preview, Section, Tailwind, Text } from '@react-email/components'
import { Html } from '@react-email/html'
import * as React from 'react'

interface PasswordRecoveryTemplateProps {
    domain: string;
    token: string;
    metadata: SessionMetadata;
}

export function PasswordRecoveryTemplate({ domain, token, metadata }: PasswordRecoveryTemplateProps) {
    const resetLink = `${domain}/recovery/${token}`;

    return (
        <Html>
            <Head />
            <Preview>Сброс пароля</Preview>
            <Tailwind>
                <Body className='max-w-2xl mx-auto p-6 bg-slate-50'>
                    <Section className='text-center mb-8'>
                        <Heading className='text-3xl text-black font-bold'>
                            Сброс пароля
                        </Heading>
                        <Text className="text-black text-base mt-2">
                            Вы запросили сброс пароля для вашей учетной записи.
                        </Text>
                        <Text className="text-black text-base mt-2">
                            Чтобы создать новый пароль, нажмите на ссылку ниже:
                        </Text>
                        <Link href={resetLink} className='inline-flex justify-center items-center rounded-full text-sm font-medium text-white bg-[#f54a00] px-5 py-2'>
                            Сбросить пароль
                        </Link>
                    </Section>

                    <Section className='bg-gray-100 rounded-lg p-6 mb-6'>
                        <Heading className='text-xl font-semibold text-[#f54a00]'>
                            Информация о запросе:
                        </Heading>
                        <ul className='list-disc list-inside mt-2 text-black'>
                            <li>🌍 Расположение: {metadata.location.country}, {metadata.location.city}</li>
                            <li>📱 Операционная система: {metadata.device.os}</li>
                            <li>🌐 Браузер: {metadata.device.browser}</li>
                            <li>💻 IP-адрес: {metadata.ip}</li>
                        </ul>
                        <Text className='text-gray-600 mt-2'>
                            Если вы не инициировали этот запрос, пожалуйста, игорируйте это сообщение.
                        </Text>
                    </Section>
                </Body>
            </Tailwind>
        </Html>
    )
}