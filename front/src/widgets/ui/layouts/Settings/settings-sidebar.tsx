"use client"

import * as React from "react"
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
import { commonSidebarContent, settingsSidebarContent } from "@/widgets/content/sidebar-content"

export function SettingsSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const router = useRouter()
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <div onClick={() => router.push(settingsSidebarContent.backButton.url)} className="cursor-pointer">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <settingsSidebarContent.backButton.icon className="size-4" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-semibold">{settingsSidebarContent.backButton.title}</span>
                </div>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavSecondary items={settingsSidebarContent.navMain} />
        <NavSecondary items={commonSidebarContent.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}