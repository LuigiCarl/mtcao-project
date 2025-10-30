"use client"

import { Skeleton } from "@/components/ui/skeleton"
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"

export default function BoatsLoading() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <div className="flex-1">
        <div className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <Skeleton className="h-8 w-8 rounded" />
          <Skeleton className="h-4 w-32" />
        </div>
        <div className="flex flex-1 flex-col gap-4 p-4">
          <Skeleton className="h-32 rounded-xl" />
          <Skeleton className="h-96 rounded-xl" />
        </div>
      </div>
    </SidebarProvider>
  )
}
