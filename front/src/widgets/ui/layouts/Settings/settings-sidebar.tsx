"use client"

import * as React from "react"
import {
  HardDrive,
  Send,
  DoorOpen,
  User2,
  MonitorSmartphone,
  Settings,
  Bell,
  MessageCircleWarning
} from "lucide-react"

import { NavUser } from "@/widgets/ui/layouts/Sidebar/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/shared/ui/layout/sidebar"
import { NavSecondary } from "../Sidebar/nav-secondary"
import { useRouter } from "next/navigation"

// TODO: Вынести в контент
// TODO: Данные пользователя из сессии
const data = {
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

export function SettingsSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const router = useRouter()
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <div onClick={() => router.push('/')} className="cursor-pointer">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <DoorOpen className="size-4" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-semibold">Обратно</span>
                </div>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavSecondary items={data.navMain} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
