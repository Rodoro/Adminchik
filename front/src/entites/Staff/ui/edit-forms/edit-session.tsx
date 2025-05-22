'use client'
import { TypographyH3 } from '@/shared/ui/typography/TypographyH3'
import React, { useEffect, useState } from 'react'
import { SessionItem } from '@/entites/Session/ui/SessionItem';
import { Session } from '@/entites/Session/types/session.types';
import { sessionApi } from '../../lib/api/session.api';

export default function SessionStaffList({ params }: {
    params: Promise<{ id: string }>
}) {
    const [sessions, setSessions] = useState<Session[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const fetchSessions = async () => {
        try {
            setIsLoading(true)
            const data = await sessionApi.getAll((await params).id)
            setSessions(data)
            setError(null)
        } catch (err) {
            setError('Не удалось загрузить сессии')
            console.error('Error fetching sessions:', err)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchSessions()
    }, [])

    const handleTerminate = async (sessionId: string) => {
        try {
            await sessionApi.terminate((await params).id, sessionId)
            await fetchSessions()
        } catch (err) {
            console.error('Error terminating session:', err)
            setError('Не удалось завершить сессию')
        }
    }

    if (isLoading) {
        return <div>Загрузка...</div>
    }

    if (error) {
        return <div className="text-destructive">{error}</div>
    }

    return (
        <>
            <TypographyH3 text='Активные сессии' className='mt-6 mb-6' />
            {
                sessions.length ? (
                    sessions.map((session) => (
                        <SessionItem
                            key={session.id}
                            session={session}
                            onTerminate={() => handleTerminate(session.id)}
                        />
                    ))
                ) : (
                    <div className='text-muted-foreground'>
                        Нет активных сессий
                    </div>
                )}
        </>
    )
}
