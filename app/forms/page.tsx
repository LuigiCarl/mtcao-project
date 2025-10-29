import { AppSidebar } from "@/components/app-sidebar"
import { TourismForm } from "@/components/tourism-form"
import { BoatForm } from "@/components/boat-form"
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

export default function FormsPage() {
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
        <div className="flex flex-1 flex-col gap-4 p-4">
          <Tabs defaultValue="tourism" className="w-full">
            <TabsList className="grid w-full grid-cols-2 max-w-[400px]">
              <TabsTrigger value="tourism">Tourism Data</TabsTrigger>
              <TabsTrigger value="boat">Boat Registration</TabsTrigger>
            </TabsList>
            <TabsContent value="tourism">
              <div className="rounded-xl border bg-card p-6">
                <TourismForm />
              </div>
            </TabsContent>
            <TabsContent value="boat" className="space-y-4">
              <div className="rounded-xl border bg-card p-6">
                <BoatForm />
              </div>
              <div className="rounded-xl border bg-card p-6">
                <div className="pb-4">
                  <h3 className="text-2xl font-semibold">Registered Boats</h3>
                  <p className="text-sm text-muted-foreground">
                    View and manage all registered boats in the system
                  </p>
                </div>
                <BoatDataTable />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
