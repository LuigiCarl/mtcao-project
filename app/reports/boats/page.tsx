"use client"

import { AppSidebar } from "@/components/app-sidebar"
import { BoatMonthlyReportChart } from "@/components/boat-monthly-report-chart"
import { BoatRotationTable } from "@/components/boat-rotation-table"
import { BoatUtilizationStats } from "@/components/boat-utilization-stats"
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, Ship, Calendar, Info, FileSpreadsheet, FileText } from "lucide-react"
import { useState } from "react"
import { exportToCSV, exportToPDF, formatForExport } from "@/lib/export-utils"

// Boat performance data
const boatPerformanceData = [
  { boatName: "Sunset Cruiser", trips: 21, tourists: 462, avgTourists: 22, contribution: 22.3, rating: "Excellent" },
  { boatName: "Ocean Explorer", trips: 19, tourists: 855, avgTourists: 45, contribution: 20.2, rating: "Good" },
  { boatName: "Sea Breeze", trips: 19, tourists: 285, avgTourists: 15, contribution: 20.2, rating: "Good" },
  { boatName: "Island Hopper", trips: 18, tourists: 216, avgTourists: 12, contribution: 19.1, rating: "Good" },
  { boatName: "Morning Glory", trips: 17, tourists: 136, avgTourists: 8, contribution: 18.1, rating: "Fair" },
]

export default function BoatReportsPage() {
  const [selectedMonth, setSelectedMonth] = useState("Oct 2025")

  const handleExportCSV = () => {
    const formattedData = formatForExport(boatPerformanceData, {
      boatName: "Boat Name",
      trips: "Trips Completed",
      tourists: "Tourists Served",
      avgTourists: "Avg Tourists/Trip",
      contribution: "Fleet Contribution (%)",
      rating: "Fairness Rating",
    })

    const totalTrips = boatPerformanceData.reduce((sum, b) => sum + b.trips, 0)
    const totalTourists = boatPerformanceData.reduce((sum, b) => sum + b.tourists, 0)

    const dataWithTotals = [
      ...formattedData,
      {
        "Boat Name": "TOTAL FLEET",
        "Trips Completed": totalTrips,
        "Tourists Served": totalTourists,
        "Avg Tourists/Trip": (totalTourists / totalTrips).toFixed(1),
        "Fleet Contribution (%)": 100,
        "Fairness Rating": "Overall Rating",
      }
    ]

    exportToCSV(
      dataWithTotals,
      `Boat_Rotation_Report_${selectedMonth.replace(' ', '_')}_${new Date().toISOString().split('T')[0]}`,
    )
  }

  const handleExportPDF = () => {
    const totalTrips = boatPerformanceData.reduce((sum, b) => sum + b.trips, 0)
    const totalTourists = boatPerformanceData.reduce((sum, b) => sum + b.tourists, 0)

    const performanceRows = boatPerformanceData.map(boat => `
      <tr>
        <td>${boat.boatName}</td>
        <td style="text-align: right;">${boat.trips}</td>
        <td style="text-align: right;">${boat.tourists.toLocaleString()}</td>
        <td style="text-align: right;">${boat.avgTourists}</td>
        <td style="text-align: right;">${boat.contribution}%</td>
        <td style="text-align: right;">${boat.rating}</td>
      </tr>
    `).join('')

    const content = `
      <div class="summary">
        <h2>Boat Rotation Report Summary - ${selectedMonth}</h2>
        <p><strong>Active Boats:</strong> 5</p>
        <p><strong>Total Trips Completed:</strong> ${totalTrips}</p>
        <p><strong>Total Tourists Served:</strong> ${totalTourists.toLocaleString()}</p>
        <p><strong>Average Trips per Boat:</strong> ${(totalTrips / 5).toFixed(1)}</p>
        <p><strong>Fleet Utilization Rate:</strong> 87.2%</p>
        <p><strong>Rotation Fairness Score:</strong> 94.5%</p>
        <p><strong>Rotation Violations:</strong> 0 (Perfect compliance)</p>
      </div>

      <h2>Rotation System Overview</h2>
      <p>
        Boats operate on a fair rotation system where each boat waits its turn to serve tourists. 
        After completing a trip, the boat moves to the end of the queue, and the next boat in line 
        serves the next group of tourists. This ensures equal opportunity and fair income distribution 
        among all boat operators.
      </p>
      
      <h2>Individual Boat Performance</h2>
      <table>
        <thead>
          <tr>
            <th>Boat Name</th>
            <th style="text-align: right;">Trips Completed</th>
            <th style="text-align: right;">Tourists Served</th>
            <th style="text-align: right;">Avg Tourists/Trip</th>
            <th style="text-align: right;">Fleet Contribution</th>
            <th style="text-align: right;">Fairness Rating</th>
          </tr>
        </thead>
        <tbody>
          ${performanceRows}
          <tr style="font-weight: bold; background-color: #e8f4f8;">
            <td>TOTAL FLEET</td>
            <td style="text-align: right;">${totalTrips}</td>
            <td style="text-align: right;">${totalTourists.toLocaleString()}</td>
            <td style="text-align: right;">${(totalTourists / totalTrips).toFixed(1)}</td>
            <td style="text-align: right;">100%</td>
            <td style="text-align: right;">Overall Rating</td>
          </tr>
        </tbody>
      </table>

      <h2>Key Insights</h2>
      <ul>
        <li>All boats maintaining fair rotation with minimal variance (±2 trips)</li>
        <li>Zero rotation violations this month - excellent compliance</li>
        <li>Fleet utilization at 87.2% - above industry standard</li>
        <li>Ocean Explorer serves most tourists per trip (45 avg) due to larger capacity</li>
        <li>Morning Glory has fewer trips - recommend investigating if maintenance needed</li>
      </ul>

      <h2>Recommendations</h2>
      <ul>
        <li>Monitor Morning Glory's performance - ensure no technical issues</li>
        <li>Consider rewarding boats with highest compliance and safety records</li>
        <li>Implement digital queue system for better real-time tracking</li>
        <li>Schedule regular maintenance during low-season months</li>
        <li>Expand fleet if demand consistently exceeds capacity</li>
      </ul>
    `

    exportToPDF("Boat Rotation Report - " + selectedMonth, content)
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
                  Reports and Analytics
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Boat Reports</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <div className="ml-auto flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Download className="mr-2 h-4 w-4" />
                  Export Report
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Export Format</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleExportCSV}>
                  <FileSpreadsheet className="mr-2 h-4 w-4" />
                  Export as CSV
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleExportPDF}>
                  <FileText className="mr-2 h-4 w-4" />
                  Export as PDF
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <ModeToggle />
          </div>
        </header>

        <div className="flex flex-1 flex-col gap-4 p-4 md:p-6">
          {/* Page Header */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                  <Ship className="h-8 w-8" />
                  Boat Rotation Reports
                </h1>
                <p className="text-muted-foreground">
                  Track boat rotation system, trip distribution, and fleet utilization
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select month" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Oct 2025">October 2025</SelectItem>
                    <SelectItem value="Sep 2025">September 2025</SelectItem>
                    <SelectItem value="Aug 2025">August 2025</SelectItem>
                    <SelectItem value="Jul 2025">July 2025</SelectItem>
                    <SelectItem value="Jun 2025">June 2025</SelectItem>
                    <SelectItem value="May 2025">May 2025</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Information Banner */}
          <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                <div className="space-y-1">
                  <h3 className="font-semibold text-blue-900 dark:text-blue-100">
                    Rotation System Explained
                  </h3>
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    Boats operate on a fair rotation system where each boat waits its turn to serve tourists. 
                    After completing a trip, the boat moves to the end of the queue, and the next boat in line 
                    serves the next group of tourists. This ensures equal opportunity and fair income distribution 
                    among all boat operators.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Statistics Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <BoatUtilizationStats selectedMonth={selectedMonth} />
          </div>

          {/* Current Rotation Queue */}
          <BoatRotationTable />

          {/* Monthly Performance Chart */}
          <BoatMonthlyReportChart />

          {/* Boat Performance Comparison Table */}
          <Card>
            <CardHeader>
              <CardTitle>Individual Boat Performance (This Month)</CardTitle>
              <CardDescription>
                Detailed breakdown of each boat's contribution to the fleet
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="p-4 text-left font-medium">Boat Name</th>
                      <th className="p-4 text-right font-medium">Trips Completed</th>
                      <th className="p-4 text-right font-medium">Tourists Served</th>
                      <th className="p-4 text-right font-medium">Avg Tourists/Trip</th>
                      <th className="p-4 text-right font-medium">Fleet Contribution</th>
                      <th className="p-4 text-right font-medium">Fairness Rating</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b hover:bg-muted/50">
                      <td className="p-4 font-medium">Sunset Cruiser</td>
                      <td className="p-4 text-right">21</td>
                      <td className="p-4 text-right">462</td>
                      <td className="p-4 text-right">22</td>
                      <td className="p-4 text-right">22.3%</td>
                      <td className="p-4 text-right">
                        <span className="text-green-600 font-semibold">Excellent</span>
                      </td>
                    </tr>
                    <tr className="border-b hover:bg-muted/50">
                      <td className="p-4 font-medium">Ocean Explorer</td>
                      <td className="p-4 text-right">19</td>
                      <td className="p-4 text-right">855</td>
                      <td className="p-4 text-right">45</td>
                      <td className="p-4 text-right">20.2%</td>
                      <td className="p-4 text-right">
                        <span className="text-green-600 font-semibold">Good</span>
                      </td>
                    </tr>
                    <tr className="border-b hover:bg-muted/50">
                      <td className="p-4 font-medium">Sea Breeze</td>
                      <td className="p-4 text-right">19</td>
                      <td className="p-4 text-right">285</td>
                      <td className="p-4 text-right">15</td>
                      <td className="p-4 text-right">20.2%</td>
                      <td className="p-4 text-right">
                        <span className="text-green-600 font-semibold">Good</span>
                      </td>
                    </tr>
                    <tr className="border-b hover:bg-muted/50">
                      <td className="p-4 font-medium">Island Hopper</td>
                      <td className="p-4 text-right">18</td>
                      <td className="p-4 text-right">216</td>
                      <td className="p-4 text-right">12</td>
                      <td className="p-4 text-right">19.1%</td>
                      <td className="p-4 text-right">
                        <span className="text-green-600 font-semibold">Good</span>
                      </td>
                    </tr>
                    <tr className="border-b last:border-0 hover:bg-muted/50">
                      <td className="p-4 font-medium">Morning Glory</td>
                      <td className="p-4 text-right">17</td>
                      <td className="p-4 text-right">136</td>
                      <td className="p-4 text-right">8</td>
                      <td className="p-4 text-right">18.1%</td>
                      <td className="p-4 text-right">
                        <span className="text-yellow-600 font-semibold">Fair</span>
                      </td>
                    </tr>
                  </tbody>
                  <tfoot>
                    <tr className="border-t-2 bg-muted/50 font-bold">
                      <td className="p-4">Total Fleet</td>
                      <td className="p-4 text-right">94</td>
                      <td className="p-4 text-right">1,954</td>
                      <td className="p-4 text-right">20.8</td>
                      <td className="p-4 text-right">100%</td>
                      <td className="p-4 text-right">
                        <span className="text-xs text-muted-foreground">Overall Rating</span>
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Insights and Recommendations */}
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Key Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-1">✓</span>
                    <span>All boats maintaining fair rotation with minimal variance (±2 trips)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-1">✓</span>
                    <span>Zero rotation violations this month - excellent compliance</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-1">✓</span>
                    <span>Fleet utilization at 87.2% - above industry standard</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-1">→</span>
                    <span>Ocean Explorer serves most tourists per trip (45 avg) due to larger capacity</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-1">→</span>
                    <span>Morning Glory has fewer trips - investigate if maintenance needed</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recommendations</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-orange-600 mt-1">•</span>
                    <span>Monitor Morning Glory's performance - ensure no technical issues</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-600 mt-1">•</span>
                    <span>Consider rewarding boats with highest compliance and safety records</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-600 mt-1">•</span>
                    <span>Implement digital queue system for better real-time tracking</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-600 mt-1">•</span>
                    <span>Schedule regular maintenance during low-season months</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-600 mt-1">•</span>
                    <span>Expand fleet if demand consistently exceeds capacity</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
