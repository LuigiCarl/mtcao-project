import { AppSidebar } from "@/components/app-sidebar"
import { AreaChartInteractive } from "@/components/area-chart-interactive"
import { DataTable } from "@/components/data-table"
import { TouristNationalityChart } from "@/components/tourist-nationality-chart"
import { PurposeOfVisitChart } from "@/components/purpose-of-visit-chart"
import { BoatTripTrendChart } from "@/components/boat-trip-trend-chart"
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
import { Users, Ship, Calendar, TrendingUp } from "lucide-react"

export default function Page() {
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
                <BreadcrumbPage>Dashboard</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <div className="ml-auto">
            <ModeToggle />
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {/* Total Tourists Card */}
            <div className="rounded-xl border bg-card p-6">
              <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                <p className="text-sm font-medium text-muted-foreground">Total Tourists</p>
                <Users className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="flex flex-col gap-1">
                <p className="text-3xl font-bold">2,760</p>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-green-600 font-semibold">+15.2%</span>
                  <span className="text-muted-foreground">from last month</span>
                </div>
              </div>
            </div>

            {/* Boat Trips Card */}
            <div className="rounded-xl border bg-card p-6">
              <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                <p className="text-sm font-medium text-muted-foreground">Boat Trips</p>
                <Ship className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="flex flex-col gap-1">
                <p className="text-3xl font-bold">268</p>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-green-600 font-semibold">+8.4%</span>
                  <span className="text-muted-foreground">from last month</span>
                </div>
              </div>
            </div>

            {/* Foreign Tourists Card */}
            <div className="rounded-xl border bg-card p-6">
              <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                <p className="text-sm font-medium text-muted-foreground">Foreign Tourists</p>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="flex flex-col gap-1">
                <p className="text-3xl font-bold">1,860</p>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-green-600 font-semibold">67.4%</span>
                  <span className="text-muted-foreground">of total visitors</span>
                </div>
              </div>
            </div>

            {/* Average Stay Card */}
            <div className="rounded-xl border bg-card p-6">
              <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                <p className="text-sm font-medium text-muted-foreground">Avg Stay Duration</p>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="flex flex-col gap-1">
                <p className="text-3xl font-bold">3.2 days</p>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-green-600 font-semibold">+0.5 days</span>
                  <span className="text-muted-foreground">from last month</span>
                </div>
              </div>
            </div>
          </div>

          {/* Charts Row */}
          <div className="grid gap-4 md:grid-cols-2">
            <TouristNationalityChart />
            <PurposeOfVisitChart />
          </div>

          <BoatTripTrendChart />

          <div className="rounded-xl border bg-card p-6">
            <DataTable />
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
