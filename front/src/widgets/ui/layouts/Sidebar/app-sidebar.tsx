"use client"

import * as React from "react"
import {
  BookOpen,
  Github,
  HardDrive,
  Server,
  SquareTerminal,
  ShieldAlert,
  Send,
  MessageCircleWarning,
} from "lucide-react"

import { NavMain } from "@/widgets/ui/layouts/Sidebar/nav-main"
import { NavProjects } from "@/widgets/ui/layouts/Sidebar/nav-projects"
import { NavUser } from "@/widgets/ui/layouts/Sidebar/nav-user"
import { TeamSwitcher } from "@/widgets/ui/layouts/Sidebar/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/shared/ui/layout/sidebar"
import { NavSecondary } from "./nav-secondary"

// TODO: Вынести в контент
// TODO: Данные пользователя из сессии
const data = {
  teams: [
    {
      name: "Adminchik",
      logo: ShieldAlert,
      plan: "Admin panel",
    },
    {
      name: "GravityNode",
      logo: Server,
      plan: "Servers",
    },
  ],
  navMain: [
    {
      title: "Администрирование",
      url: "/adminchik",
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "Сотрудники",
          url: "/adminchik/staff",
        },
        {
          title: "Сесcии",
          url: "/adminchik/session",
        },
      ],
    },
    {
      title: "Метрики",
      url: "/adminchik/metrics",
      icon: BookOpen,
      isActive: true,
      items: [
        {
          title: "Логи",
          url: "/adminchik/logs",
        },
      ],
    },
  ],
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
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
