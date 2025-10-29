"use client"

import { AppSidebar } from "@/components/app-sidebar"
import { ModeToggle } from "@/components/mode-toggle"
import { TouristReport } from "@/components/tourist-report"
import { BoatReport } from "@/components/boat-report"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { Users, Ship } from "lucide-react"

export default function ReportsPage() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="/">
                  Dashboard
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Advanced Reports</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <div className="ml-auto">
            <ModeToggle />
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 md:p-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">Advanced Reports</h1>
            <p className="text-muted-foreground">
              Generate detailed reports with custom date filtering (daily, monthly, or yearly)
            </p>
          </div>

          <Tabs defaultValue="tourists" className="space-y-4">
            <TabsList>
              <TabsTrigger value="tourists" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Tourist Arrivals
              </TabsTrigger>
              <TabsTrigger value="boats" className="flex items-center gap-2">
                <Ship className="h-4 w-4" />
                Boat Trips
              </TabsTrigger>
            </TabsList>

            <TabsContent value="tourists" className="space-y-4">
              <TouristReport />
            </TabsContent>

            <TabsContent value="boats" className="space-y-4">
              <BoatReport />
            </TabsContent>
          </Tabs>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
