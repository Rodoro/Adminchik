'use client'
import { TypographyH3 } from '@/shared/ui/typography/TypographyH3'
import React from 'react'
import { ToggleCardSkeleton } from '@/shared/ui/overlay/ToggleCard'
import { SessionItem } from './SessionItem'
import { useSessions } from '../lib/hooks/useSessions'

export default function SessionList() {
    const {
        currentSession,
        sessions,
        isLoading,
        refetchSessions
    } = useSessions();

    return (
        <>
            <TypographyH3 text='Текущая сессии' className='mt-6 mb-6' />
            {isLoading ? (
                <ToggleCardSkeleton />
            ) : currentSession ? (
                <SessionItem
                    session={currentSession}
                    isCurrentSession
                    onTerminate={refetchSessions}
                />
            ) : null}

            <TypographyH3 text='Активные сессии' className='mt-6 mb-6' />
            {isLoading ? (
                Array.from({ length: 3 }).map((_, index) => (
                    <ToggleCardSkeleton key={index} className='mb-6' />
                ))
            ) : sessions?.length ? (
                sessions.map((session) => (
                    <SessionItem
                        key={session.id}
                        session={session}
                        onTerminate={refetchSessions}
                    />
                ))
            ) : (
                <div className='text-muted-foreground'>
                    Нету еще активных сессий
                </div>
            )}
        </>
    )
}
