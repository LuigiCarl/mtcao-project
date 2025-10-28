import { AppSidebar } from "@/components/app-sidebar"
import { AreaChartInteractive } from "@/components/area-chart-interactive"
import { DataTable } from "@/components/data-table"
import { BoatDataTable, Boat } from "@/components/boat-data-table"
import { TouristNationalityChart } from "@/components/tourist-nationality-chart"
import { PurposeOfVisitChart } from "@/components/purpose-of-visit-chart"
import { BoatTripTrendChart } from "@/components/boat-trip-trend-chart"
import { AccommodationTypeChart } from "@/components/accommodation-type-chart"
import { TouristSpotChart } from "@/components/tourist-spot-chart"
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

// Sample boat data for dashboard
const dashboardBoats: Boat[] = [
  {
    id: "1",
    boatName: "Ocean Explorer",
    registrationNumber: "PH-123456",
    boatType: "ferry",
    capacity: "50",
    operatorName: "Island Tours Inc.",
    operatorContact: "09123456789",
    captainName: "Juan Dela Cruz",
    captainLicense: "CPT-001234",
    homePort: "Port of Manila",
    engineType: "Diesel",
    engineHorsePower: "250 HP",
    yearBuilt: "2020",
  },
  {
    id: "2",
    boatName: "Island Hopper",
    registrationNumber: "PH-789012",
    boatType: "speedboat",
    capacity: "12",
    operatorName: "Fast Travel Co.",
    operatorContact: "09234567890",
    captainName: "Maria Santos",
    captainLicense: "CPT-005678",
    homePort: "Cebu Port",
    engineType: "Gasoline",
    engineHorsePower: "150 HP",
    yearBuilt: "2021",
  },
  {
    id: "3",
    boatName: "Sunset Cruiser",
    registrationNumber: "PH-345678",
    boatType: "yacht",
    capacity: "25",
    operatorName: "Luxury Cruises Ltd.",
    operatorContact: "09345678901",
    captainName: "Pedro Garcia",
    captainLicense: "CPT-009012",
    homePort: "Boracay Marina",
    engineType: "Diesel",
    engineHorsePower: "300 HP",
    yearBuilt: "2019",
  },
  {
    id: "4",
    boatName: "Morning Glory",
    registrationNumber: "PH-456789",
    boatType: "bangka",
    capacity: "8",
    operatorName: "Local Fishermen Coop",
    operatorContact: "09456789012",
    captainName: "Jose Reyes",
    captainLicense: "CPT-012345",
    homePort: "Palawan Port",
    engineType: "Outboard",
    engineHorsePower: "40 HP",
    yearBuilt: "2022",
  },
]

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

          {/* Charts Grid - 2x2 plus 1 full width */}
          <div className="grid gap-4 md:grid-cols-2">
            <TouristNationalityChart />
            <PurposeOfVisitChart />
            <AccommodationTypeChart />
            <BoatTripTrendChart />
          </div>

          {/* Additional Chart - Full Width */}
          <TouristSpotChart />

          <div className="rounded-xl border bg-card p-6">
            <DataTable />
          </div>

          <div className="rounded-xl border bg-card p-6">
            <div className="pb-4">
              <h3 className="text-2xl font-semibold">Registered Boats</h3>
              <p className="text-sm text-muted-foreground">
                Overview of all boats registered in the system
              </p>
            </div>
            <BoatDataTable data={dashboardBoats} />
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
