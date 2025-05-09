import { useState, useEffect } from 'react'
import { sessionApi } from '../api/session.api'
import { Session } from '../../types/session.types'

export const useSessions = () => {
    const [currentSession, setCurrentSession] = useState<Session | null>(null)
    const [sessions, setSessions] = useState<Session[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const loadData = async () => {
            try {
                setIsLoading(true)
                const current = await sessionApi.getCurrent()
                const all = await sessionApi.getAll()

                setCurrentSession(current)

                const sessionsWithCurrent = all.map(s => ({
                    ...s,
                    current: s.id === current.id
                }))

                setSessions(sessionsWithCurrent)
            } catch (err) {
                console.error('Ошибка при загрузке профиля:', err)
                setError('Ошибка при загрузке данных сессий')
            } finally {
                setIsLoading(false)
            }
        }

        loadData()
    }, [])

    const terminateSession = async (sessionId: string) => {
        try {
            setIsLoading(true)
            await sessionApi.terminate(sessionId)

            setSessions(prev => prev.filter(s => s.id !== sessionId))
            if (currentSession?.id === sessionId) {
                const newCurrent = await sessionApi.getCurrent()
                setCurrentSession(newCurrent)
            }
        } catch (err) {
            setError('Не удалось завершить сессию')
            throw err
        } finally {
            setIsLoading(false)
        }
    }

    const terminateAllSessions = async () => {
        try {
            setIsLoading(true)
            await sessionApi.terminateAll()

            const current = await sessionApi.getCurrent()
            setCurrentSession(current)
            setSessions(current ? [current] : [])
        } catch (err) {
            setError('Не удалось завершить все сессии')
            throw err
        } finally {
            setIsLoading(false)
        }
    }

    const refetchSessions = async () => {
        try {
            setIsLoading(true)
            const [current, all] = await Promise.all([
                sessionApi.getCurrent(),
                sessionApi.getAll()
            ])

            setCurrentSession(current)
            setSessions(all.map(s => ({
                ...s,
                current: s.id === current.id
            })))
        } catch (err) {
            setError('Не удалось обновить сессии')
            throw err
        } finally {
            setIsLoading(false)
        }
    }

    return {
        currentSession,
        sessions,
        isLoading,
        error,
        terminateSession,
        terminateAllSessions,
        refetchSessions
    }
}