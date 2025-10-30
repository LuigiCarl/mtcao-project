"use client"

import * as React from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { BoatFormEdit } from "@/components/boat-form-edit"
import { BoatsTable } from "@/components/boats-table"
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
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

export default function BoatManagementPage() {
  const [showForm, setShowForm] = React.useState(true)
  const [refreshTrigger, setRefreshTrigger] = React.useState(0)

  const handleFormSaveComplete = () => {
    setRefreshTrigger(prev => prev + 1)
    setShowForm(false)
  }

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
                <BreadcrumbLink href="#">
                  Management
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Boat Management</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <div className="ml-auto">
            <ModeToggle />
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-3 sm:gap-4 p-3 sm:p-4">
          {/* Toggle Form Button */}
          {!showForm && (
            <div className="flex justify-end">
              <Button onClick={() => setShowForm(true)} size="sm" className="w-full sm:w-auto">
                <Plus className="mr-2 h-4 w-4" />
                <span className="text-sm">Register New Boat</span>
              </Button>
            </div>
          )}

          {/* Registration Form - Collapsible */}
          {showForm && (
            <div className="rounded-xl border bg-card p-4 md:p-5 lg:p-6">
              <div className="flex justify-between items-start mb-4 sm:mb-6">
                <div>
                  <h3 className="text-lg sm:text-xl font-semibold">Register New Boat</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                    Add a new boat to the system
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowForm(false)}
                  title="Hide form"
                  className="h-8 w-8"
                >
                  <span className="text-xl">×</span>
                </Button>
              </div>

              <BoatFormEdit
                onSaveComplete={handleFormSaveComplete}
              />
            </div>
          )}

          {/* Boats Table */}
          <div key={refreshTrigger}>
            <BoatsTable />
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
