import { staffApi } from "@/entites/Staff/lib/api/staff.api"
import { authStore } from "../store/auth.store"


export const useAuth = () => {
    const { isAuthenticated, setIsAuthenticated } = authStore()

    const login = async (email: string, password: string) => {
        try {
            await staffApi.login({ email, password })
            setIsAuthenticated(true)
        } catch (error) {
            throw error
        }
    }

    const logout = async () => {
        try {
            await staffApi.logout()
            setIsAuthenticated(false)
        } catch (error) {
            throw error
        }
    }

    return {
        isAuthenticated,
        login,
        logout,
    }
}