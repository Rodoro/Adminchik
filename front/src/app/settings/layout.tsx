import React from 'react'
import { SidebarInset, SidebarProvider } from "@/shared/ui/layout/sidebar";
import { SettingsSidebar } from '@/widgets/ui/layouts/Settings/settings-sidebar';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <SidebarProvider>
            <SettingsSidebar />
            <SidebarInset>
                {children}
            </SidebarInset>
        </SidebarProvider>
    )
}