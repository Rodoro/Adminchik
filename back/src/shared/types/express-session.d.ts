import 'express-session'

declare module 'express-session' {
    interface SessionData {
        staffId?: string
        createdAt?: Date | string
    }
}

declare module 'express' {
    interface Request {
        user?: Staff;
    }
}