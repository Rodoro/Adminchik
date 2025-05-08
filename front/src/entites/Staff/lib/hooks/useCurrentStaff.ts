import { useAuth } from '@/entites/Auth/lib/hooks/useAuth'
import { useEffect, useState } from 'react'
import { Staff } from '../../types/staff.types'
import { staffApi } from '../api/staff.api'

export const useCurrentStaff = () => {
    const { isAuthenticated, logout } = useAuth()
    const [staff, setStaff] = useState<Staff | null>(null)
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        if (!isAuthenticated) return

        const fetchStaff = async () => {
            setIsLoading(true)
            try {
                const currentStaff = await staffApi.getCurrent()
                setStaff(currentStaff)
            } catch (error) {
                console.error('Ошибка при загрузке профиля:', error)
                logout()
            } finally {
                setIsLoading(false)
            }
        }

        fetchStaff()
    }, [isAuthenticated, logout])

    return { staff, isLoading }
}