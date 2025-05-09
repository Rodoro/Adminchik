"use client"
import { useAuth } from '@/entites/Auth/lib/hooks/useAuth'
import { useEffect, useState } from 'react'
import { Staff } from '../../types/staff.types'
import { staffApi } from '../api/staff.api'

export const useCurrentStaff = () => {
    const { isAuthenticated, logout } = useAuth()
    const [staff, setStaff] = useState<Staff | null>(null)
    const [isLoading, setIsLoading] = useState(false)

    const refetch = async () => {
        if (!isAuthenticated) return

        setIsLoading(true)
        try {
            const currentStaff = await staffApi.getCurrent()
            setStaff(currentStaff)
            return currentStaff
        } catch (err) {
            throw err
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        if (!isAuthenticated) {
            setStaff(null)
            return
        }

        refetch()
    }, [isAuthenticated])

    useEffect(() => {
        if (!isAuthenticated) {
            // logout()
        }
    }, [isAuthenticated, logout])

    return {
        staff,
        isLoading,
        refetch
    }
}