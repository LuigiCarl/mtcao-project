"use client"

import { AppSidebar } from "@/components/app-sidebar"
import { BoatMonitoring } from "@/components/boat-monitoring"
import { TouristsTable } from "@/components/tourists-table"
import { ModeToggle } from "@/components/mode-toggle"
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function MonitoringPage() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="/">
                  Dashboard
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Monitoring</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <div className="ml-auto">
            <ModeToggle />
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 md:gap-6 md:p-6">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Real-Time Monitoring</h2>
            <p className="text-muted-foreground">
              Monitor tourist arrivals and boat operations in real-time
            </p>
          </div>
          
          <Tabs defaultValue="tourist" className="w-full">
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="tourist">Tourist Monitoring</TabsTrigger>
              <TabsTrigger value="boat">Boat Monitoring</TabsTrigger>
            </TabsList>
            <TabsContent value="tourist" className="mt-6">
              <TouristsTable />
            </TabsContent>
            <TabsContent value="boat" className="mt-6">
              <BoatMonitoring />
            </TabsContent>
          </Tabs>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
