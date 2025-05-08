"use client"

import * as React from "react"
import {
  AudioWaveform,
  BookOpen,
  // Bot,
  // Command,
  Github,
  HardDrive,
  // Frame,
  GalleryVerticalEnd,
  // Map,
  // PieChart,
  // Settings2,
  SquareTerminal,
  Send,
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

// This is sample data.
const data = {
  user: {
    name: "Rodoro",
    email: "rodoro@gravitynode.ru",
    avatar: "/avatars/rodoro.jpg",
  },
  teams: [
    {
      name: "Adminchik",
      logo: GalleryVerticalEnd,
      plan: "Admin panel",
    },
    {
      name: "GravityNode",
      logo: AudioWaveform,
      plan: "Servers",
    },
    // {
    //   name: "Game",
    //   logo: Command,
    //   plan: "Free",
    // },
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
          title: "Сесии",
          url: "/adminchik/session",
        },
        // {
        //   title: "Settings",
        //   url: "#",
        // },
      ],
    },
    // {
    //   title: "Логи",
    //   url: "#",
    //   icon: Bot,
    //   items: [
    //     {
    //       title: "Genesis",
    //       url: "#",
    //     },
    //     {
    //       title: "Explorer",
    //       url: "#",
    //     },
    //     {
    //       title: "Quantum",
    //       url: "#",
    //     },
    //   ],
    // },
    {
      title: "Метрики",
      url: "/adminchik/metrics",
      icon: BookOpen,
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
  ],
  projects: [
    {
      name: "GitHub",
      url: "#",
      icon: Github,
    },
    // {
    //   name: "Sales & Marketing",
    //   url: "#",
    //   icon: PieChart,
    // },
    // {
    //   name: "Travel",
    //   url: "#",
    //   icon: Map,
    // },
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
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
