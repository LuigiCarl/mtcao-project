"use client"

import * as React from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { TourismForm } from "@/components/tourism-form"
import { TourismRecordsTable } from "@/components/tourism-records-table"
import { BoatForm } from "@/components/boat-form"
import { BoatsTable } from "@/components/boats-table"
import { BoatDataTable } from "@/components/boat-data-table"
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
import { Button } from "@/components/ui/button"
import { Plus, Edit } from "lucide-react"

export default function FormsPage() {
  const [editingTourismRecord, setEditingTourismRecord] = React.useState<any>(null)
  const [refreshTrigger, setRefreshTrigger] = React.useState(0)
  const [refreshBoatsTrigger, setRefreshBoatsTrigger] = React.useState(0)
  const [showForm, setShowForm] = React.useState(true)

  const handleTourismEdit = (record: any) => {
    setEditingTourismRecord(record)
    setShowForm(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleTourismSaveComplete = () => {
    setEditingTourismRecord(null)
    setRefreshTrigger(prev => prev + 1)
    setShowForm(false)
  }

  const handleCancelEdit = () => {
    setEditingTourismRecord(null)
    setShowForm(false)
  }

  const handleBoatSaveComplete = () => {
    setRefreshBoatsTrigger(prev => prev + 1)
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
                  Data Entry
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Forms</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <div className="ml-auto">
            <ModeToggle />
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-3 sm:gap-4 p-3 sm:p-4">
          <Tabs defaultValue="tourism" className="w-full">
            <TabsList className="grid w-full grid-cols-2 max-w-full sm:max-w-[400px]">
              <TabsTrigger value="tourism" className="text-xs sm:text-sm">Tourism Data</TabsTrigger>
              <TabsTrigger value="boat" className="text-xs sm:text-sm">Boat Management</TabsTrigger>
            </TabsList>
            
            <TabsContent value="tourism" className="space-y-4 sm:space-y-6 mt-4 sm:mt-6">
              {/* Tourism Form - Collapsible */}
              {showForm ? (
                <div className="rounded-xl border bg-card p-4 md:p-5 lg:p-6">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
                    <div>
                      <h3 className="text-lg sm:text-xl font-semibold">
                        {editingTourismRecord ? "Edit Tourism Record" : "Record Tourist Arrivals"}
                      </h3>
                      <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                        {editingTourismRecord 
                          ? "Update the trip and tourist information" 
                          : "Record a new boat trip with tourist information"}
                      </p>
                    </div>
                    {editingTourismRecord && (
                      <Button variant="outline" size="sm" onClick={handleCancelEdit} className="w-full sm:w-auto">
                        Cancel Edit
                      </Button>
                    )}
                  </div>
                  <TourismForm 
                    editingRecord={editingTourismRecord}
                    onSaveComplete={handleTourismSaveComplete}
                    onCancel={handleCancelEdit}
                  />
                </div>
              ) : (
                <div className="rounded-xl border bg-card p-4 md:p-5 lg:p-6">
                  <Button onClick={() => setShowForm(true)} className="w-full sm:w-auto" size="default">
                    <Plus className="h-4 w-4 mr-2" />
                    <span className="text-sm">Record New Tourist Arrivals</span>
                  </Button>
                </div>
              )}
              
              {/* Tourism Records Table */}
              <div>
                <TourismRecordsTable 
                  onEdit={handleTourismEdit}
                  onRefresh={() => setRefreshTrigger(prev => prev + 1)}
                  refreshTrigger={refreshTrigger}
                />
              </div>
            </TabsContent>
            
            <TabsContent value="boat" className="space-y-4 sm:space-y-6 mt-4 sm:mt-6">
              {/* Boat Registration Form */}
              <div className="rounded-xl border bg-card p-4 md:p-5 lg:p-6">
                <BoatForm onSaveComplete={handleBoatSaveComplete} />
              </div>
              
              {/* Boats Management Table */}
              <div>
                <BoatsTable key={refreshBoatsTrigger} />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
