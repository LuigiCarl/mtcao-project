"use client"

import * as React from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { AreaChartInteractive } from "@/components/area-chart-interactive"
import { DataTable } from "@/components/data-table"
import { BoatDataTable } from "@/components/boat-data-table"
import { TouristNationalityChart } from "@/components/tourist-nationality-chart"
import { PurposeOfVisitChart } from "@/components/purpose-of-visit-chart"
import { BoatTripTrendChart } from "@/components/boat-trip-trend-chart"
import { AccommodationTypeChart } from "@/components/accommodation-type-chart"
import { TouristSpotChart } from "@/components/tourist-spot-chart"
import { ExportableChart } from "@/components/exportable-chart"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Users, Ship, Calendar as CalendarIcon, TrendingUp } from "lucide-react"
import { useDashboardStats } from "@/hooks/use-api"
import { Skeleton } from "@/components/ui/skeleton"

export default function Page() {
  const [selectedMonth, setSelectedMonth] = React.useState<string>("all")
  const [selectedYear, setSelectedYear] = React.useState<string>("2025")
  const { stats, loading, error } = useDashboardStats(selectedMonth, selectedYear)
  
  // Get current year and available years
  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 5 }, (_, i) => currentYear - i)
  
  // Month options
  const months = [
    { value: "all", label: "All Months" },
    { value: "1", label: "January" },
    { value: "2", label: "February" },
    { value: "3", label: "March" },
    { value: "4", label: "April" },
    { value: "5", label: "May" },
    { value: "6", label: "June" },
    { value: "7", label: "July" },
    { value: "8", label: "August" },
    { value: "9", label: "September" },
    { value: "10", label: "October" },
    { value: "11", label: "November" },
    { value: "12", label: "December" },
  ]

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
          <div className="ml-auto flex items-center gap-2">
            {/* Month Selector */}
            <Select value={selectedMonth} onValueChange={setSelectedMonth}>
              <SelectTrigger className="w-[140px]">
                <CalendarIcon className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Select month" />
              </SelectTrigger>
              <SelectContent>
                {months.map((month) => (
                  <SelectItem key={month.value} value={month.value}>
                    {month.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            {/* Year Selector */}
            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger className="w-[100px]">
                <SelectValue placeholder="Year" />
              </SelectTrigger>
              <SelectContent>
                {years.map((year) => (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <ModeToggle />
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4">
          {/* Filter Info Banner */}
          {selectedMonth !== "all" && (
            <div className="rounded-lg border bg-muted/50 p-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">
                  Showing data for {months.find(m => m.value === selectedMonth)?.label} {selectedYear}
                </span>
              </div>
              <button
                onClick={() => setSelectedMonth("all")}
                className="text-sm text-muted-foreground hover:text-foreground underline"
              >
                Clear filter
              </button>
            </div>
          )}
          
          {loading ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Skeleton className="h-32 rounded-xl" />
              <Skeleton className="h-32 rounded-xl" />
              <Skeleton className="h-32 rounded-xl" />
              <Skeleton className="h-32 rounded-xl" />
            </div>
          ) : error ? (
            <div className="rounded-xl border bg-destructive/10 p-6 text-center">
              <p className="text-destructive">Error loading dashboard data: {error}</p>
            </div>
          ) : (
            <>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {/* Total Tourists Card */}
                <div className="rounded-xl border bg-card p-6">
                  <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <p className="text-sm font-medium text-muted-foreground">Trip Passengers</p>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <p className="text-3xl font-bold">{stats?.summary?.total_trip_passengers?.toLocaleString() || '0'}</p>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-muted-foreground">
                        {stats?.summary?.total_tourists || 0} registered tourists
                      </span>
                    </div>
                  </div>
                </div>

                {/* Boat Trips Card */}
                <div className="rounded-xl border bg-card p-6">
                  <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <p className="text-sm font-medium text-muted-foreground">Total Trips</p>
                    <Ship className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <p className="text-3xl font-bold">{stats?.summary?.total_trips?.toLocaleString() || '0'}</p>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-muted-foreground">
                        {stats?.summary?.month_trips || 0} this month
                      </span>
                    </div>
                  </div>
                </div>

                {/* Active Boats Card */}
                <div className="rounded-xl border bg-card p-6">
                  <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <p className="text-sm font-medium text-muted-foreground">Active Boats</p>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <p className="text-3xl font-bold">{stats?.summary?.active_boats || '0'}</p>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-muted-foreground">
                        of {stats?.summary?.total_boats || 0} registered
                      </span>
                    </div>
                  </div>
                </div>

                {/* Average Stay Card */}
                <div className="rounded-xl border bg-card p-6">
                  <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <p className="text-sm font-medium text-muted-foreground">Avg Stay Duration</p>
                    <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <p className="text-3xl font-bold">{stats?.summary?.average_stay || '0'} days</p>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-muted-foreground">
                        per tourist visit
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Charts Grid - 2x2 plus 1 full width */}
              <div className="grid gap-4 md:grid-cols-2 auto-rows-fr">
                <ExportableChart chartId="nationality-chart" chartName="Tourist_Nationality">
                  <TouristNationalityChart data={stats?.nationality_stats} />
                </ExportableChart>
                <ExportableChart chartId="purpose-chart" chartName="Purpose_of_Visit">
                  <PurposeOfVisitChart data={stats?.purpose_stats} />
                </ExportableChart>
                <ExportableChart chartId="accommodation-chart" chartName="Accommodation_Type">
                  <AccommodationTypeChart data={stats?.accommodation_stats} />
                </ExportableChart>
                <ExportableChart chartId="boat-trend-chart" chartName="Boat_Trip_Trends">
                  <BoatTripTrendChart data={stats?.trip_trends} />
                </ExportableChart>
              </div>

              {/* Additional Chart - Full Width */}
              <ExportableChart chartId="tourist-spot-chart" chartName="Tourist_Spots">
                <TouristSpotChart data={stats?.tourist_spots} />
              </ExportableChart>

              <div className="rounded-xl border bg-card p-6">
                <DataTable month={selectedMonth} year={selectedYear} />
              </div>

              <div className="rounded-xl border bg-card p-6">
                <div className="pb-4">
                  <h3 className="text-2xl font-semibold">Registered Boats</h3>
                  <p className="text-sm text-muted-foreground">
                    Overview of all boats registered in the system
                  </p>
                </div>
                <BoatDataTable />
              </div>
            </>
          )}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
