import React from 'react'
import { AppSidebar } from "@/widgets/ui/layouts/Sidebar/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/shared/ui/layout/sidebar";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                {children}
            </SidebarInset>
        </SidebarProvider>
    )
}