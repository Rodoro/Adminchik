// content/sidebar-content.ts
import {
    BookOpen,
    Github,
    HardDrive,
    Server,
    SquareTerminal,
    ShieldAlert,
    Send,
    MessageCircleWarning,
    User2,
    MonitorSmartphone,
    Settings,
    Bell,
    DoorOpen,
    Database,
    Network,
    Cpu
} from "lucide-react"
import { Team, TeamContent } from "../types/sidebar"

// Меню над авой
export const commonSidebarContent = {
    navSecondary: [
        {
            title: "Google drive",
            url: "https://drive.google.com/drive/mobile/folders/17rCxyEEwf1fuon-p6nNe7LLzpZmdZp0-?utm_source=en&pli=1&sort=13&direction=a",
            icon: HardDrive,
        },
        {
            title: "Telegram",
            url: "https://web.telegram.org/a/#-1002558987262_1",
            icon: Send,
        },
        {
            title: "Reports",
            url: "https://web.telegram.org/a/#-1002558987262_767",
            icon: MessageCircleWarning,
        }
    ],
}

const adminchikContent: TeamContent = {
    navMain: [
        {
            title: "Администрирование",
            url: "/adminchik",
            icon: SquareTerminal,
            isActive: true,
            items: [
                { title: "Сотрудники", url: "/adminchik/staff" },
            ],
        },
        {
            title: "Метрики",
            url: "/adminchik/metrics",
            icon: BookOpen,
            isActive: true,
            items: [
                { title: "Логи", url: "/adminchik/logs" },
            ],
        },
    ],
    projects: [
        {
            name: "GitHub",
            url: "https://github.com/Rodoro/Adminchik",
            icon: Github,
        },
        {
            name: "API docs",
            url: process.env.NEXT_PUBLIC_BACKEND + "/api",
            icon: Server,
        },
        {
            name: "Notification bot",
            url: "https://web.telegram.org/a/#7387312661",
            icon: Send,
        },
    ],
}

const gravityNodeContent: TeamContent = {
    navMain: [
        {
            title: "Серверы",
            url: "/gravity-node/servers",
            icon: Server,
            isActive: true,
            items: [
                { title: "Список", url: "/gravity-node/servers" },
                { title: "Мониторинг", url: "/gravity-node/monitoring" },
            ],
        },
        {
            title: "Базы данных",
            url: "/gravity-node/databases",
            icon: Database,
            isActive: true,
            items: [
                { title: "MySQL", url: "/gravity-node/mysql" },
                { title: "MongoDB", url: "/gravity-node/mongodb" },
            ],
        },
        {
            title: "Сеть",
            url: "/gravity-node/network",
            icon: Network,
            isActive: true,
            items: [
                { title: "DNS", url: "/gravity-node/dns" },
                { title: "Firewall", url: "/gravity-node/firewall" },
            ],
        },
    ],
    projects: [
        {
            name: "Node API",
            url: process.env.NEXT_PUBLIC_BACKEND || '',
            icon: Cpu,
        },
        {
            name: "Status",
            url: process.env.NEXT_PUBLIC_BACKEND || '',
            icon: Network,
        },
    ],
}

export const settingsSidebarContent = {
    navMain: [
        {
            title: "Профиль",
            url: "/settings",
            icon: User2,
        },
        {
            title: "Акаунт",
            url: "/settings/account",
            icon: Settings,
        },
        {
            title: "Сесcии",
            url: "/settings/sessions",
            icon: MonitorSmartphone,
        },
        {
            title: "Уведомления",
            url: "/settings/notifications",
            icon: Bell,
        },
    ],
    backButton: {
        title: "Обратно",
        icon: DoorOpen,
        url: "/"
    }
}

export const appSidebarContent: {
    teams: Team[]
} = {
    teams: [
        {
            name: "Adminchik",
            logo: ShieldAlert,
            plan: "Admin panel",
            url: "/adminchik",
            content: adminchikContent
        },
        {
            name: "GravityNode",
            logo: Server,
            plan: "Servers",
            url: "/gravity-node",
            content: gravityNodeContent
        },
    ],
}
