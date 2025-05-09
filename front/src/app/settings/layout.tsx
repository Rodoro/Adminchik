import React from 'react'
import { SidebarInset } from "@/shared/ui/layout/sidebar";
import { SettingsSidebar } from '@/widgets/ui/layouts/Settings/settings-sidebar';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <>
            <SettingsSidebar />
            <SidebarInset>
                {children}
            </SidebarInset>
        </>
    )
}