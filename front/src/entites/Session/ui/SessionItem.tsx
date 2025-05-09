'use client'
import React from 'react'
import { Session } from '../types/session.types'
import { Button } from '@/shared/ui/form/button'
import { toast } from 'sonner'
import { CardContainer } from '@/shared/ui/overlay/CardContainer'
import { useSessions } from '../lib/hooks/useSessions'
import { SessionModal } from './SessionModal'
import { getBrowserIcon } from '@/shared/lib/utils/get-browser-icon'
import { ConfirmModal } from '@/shared/ui/overlay/ConfirmModal'

interface SessionItemProps {
    session: Session
    isCurrentSession?: boolean
    onTerminate?: () => void
}

export function SessionItem({
    session,
    isCurrentSession,
    onTerminate
}: SessionItemProps) {
    const { terminateSession } = useSessions()
    const Icon = getBrowserIcon(session.metadata.device.browser)

    const handleRemove = async () => {
        try {
            await terminateSession(session.id)
            toast.success('Сессия удалена')
            onTerminate?.()
        } catch {
            toast.error("Ошибка при удалении сессии")
        }
    }

    return (
        <CardContainer
            heading={`${session.metadata.device.browser}, ${session.metadata.device.os}`}
            description={`${session.metadata.location.country}, ${session.metadata.location.city}`}
            Icon={Icon}
            rightContent={
                <div className='flex items-center gap-x-4'>
                    {!isCurrentSession && (
                        <ConfirmModal
                            heading={'Удаление превью для стрима'}
                            message={"Вы уверены, что хотите удалить изображение для стрима? Это действие нельзя будет отменить."}
                            onConfirm={handleRemove}
                        >
                            <Button variant='secondary'>
                                Удалить
                            </Button>
                        </ConfirmModal>
                    )}
                    <SessionModal session={session}>
                        <Button>Подробнее</Button>
                    </SessionModal>
                </div>
            }
        />
    )
}
