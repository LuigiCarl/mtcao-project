"use client"

import { AppSidebar } from "@/components/app-sidebar"
import { MonthlyTouristArrivalsChart } from "@/components/monthly-tourist-arrivals-chart"
import { MonthlySummaryCards } from "@/components/monthly-summary-cards"
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Download, FileText, Calendar, FileSpreadsheet, FileJson } from "lucide-react"
import { useState } from "react"
import { exportToCSV, exportToPDF, formatForExport } from "@/lib/export-utils"

// Sample data for the detailed monthly breakdown
const monthlyBreakdown = [
  { month: "October 2025", foreign: 2180, domestic: 1340, total: 3520 },
  { month: "September 2025", foreign: 2450, domestic: 1520, total: 3970 },
  { month: "August 2025", foreign: 2760, domestic: 1720, total: 4480 },
  { month: "July 2025", foreign: 2890, domestic: 1840, total: 4730 },
  { month: "June 2025", foreign: 2580, domestic: 1620, total: 4200 },
  { month: "May 2025", foreign: 2340, domestic: 1420, total: 3760 },
]

export default function ReportsPage() {
  const [selectedMonth, setSelectedMonth] = useState("Oct 2025")

  const handleExportCSV = () => {
    const formattedData = formatForExport(monthlyBreakdown, {
      month: "Month",
      foreign: "Foreign Tourists",
      domestic: "Domestic Tourists",
      total: "Total Arrivals",
    })

    const totalForeign = monthlyBreakdown.reduce((sum, m) => sum + m.foreign, 0)
    const totalDomestic = monthlyBreakdown.reduce((sum, m) => sum + m.domestic, 0)
    const totalAll = monthlyBreakdown.reduce((sum, m) => sum + m.total, 0)

    const dataWithTotals = [
      ...formattedData,
      {
        "Month": "TOTAL (6 Months)",
        "Foreign Tourists": totalForeign,
        "Domestic Tourists": totalDomestic,
        "Total Arrivals": totalAll,
      }
    ]

    exportToCSV(
      dataWithTotals,
      `Monthly_Tourist_Report_${new Date().toISOString().split('T')[0]}`,
    )
  }

  const handleExportPDF = () => {
    const totalForeign = monthlyBreakdown.reduce((sum, m) => sum + m.foreign, 0)
    const totalDomestic = monthlyBreakdown.reduce((sum, m) => sum + m.domestic, 0)
    const totalAll = monthlyBreakdown.reduce((sum, m) => sum + m.total, 0)

    const tableRows = monthlyBreakdown.map(row => {
      const foreignPercent = ((row.foreign / row.total) * 100).toFixed(1)
      const domesticPercent = ((row.domestic / row.total) * 100).toFixed(1)
      return `
        <tr>
          <td>${row.month}</td>
          <td style="text-align: right;">${row.foreign.toLocaleString()}</td>
          <td style="text-align: right;">${row.domestic.toLocaleString()}</td>
          <td style="text-align: right;"><strong>${row.total.toLocaleString()}</strong></td>
          <td style="text-align: right;">${foreignPercent}%</td>
          <td style="text-align: right;">${domesticPercent}%</td>
        </tr>
      `
    }).join('')

    const content = `
      <div class="summary">
        <h2>Report Summary</h2>
        <p><strong>Report Period:</strong> Last 6 Months (May - October 2025)</p>
        <p><strong>Total Foreign Tourists:</strong> ${totalForeign.toLocaleString()}</p>
        <p><strong>Total Domestic Tourists:</strong> ${totalDomestic.toLocaleString()}</p>
        <p><strong>Grand Total:</strong> ${totalAll.toLocaleString()}</p>
      </div>
      
      <h2>Detailed Monthly Breakdown</h2>
      <table>
        <thead>
          <tr>
            <th>Month</th>
            <th style="text-align: right;">Foreign Tourists</th>
            <th style="text-align: right;">Domestic Tourists</th>
            <th style="text-align: right;">Total Arrivals</th>
            <th style="text-align: right;">Foreign %</th>
            <th style="text-align: right;">Domestic %</th>
          </tr>
        </thead>
        <tbody>
          ${tableRows}
          <tr style="font-weight: bold; background-color: #e8f4f8;">
            <td>TOTAL (6 Months)</td>
            <td style="text-align: right;">${totalForeign.toLocaleString()}</td>
            <td style="text-align: right;">${totalDomestic.toLocaleString()}</td>
            <td style="text-align: right;">${totalAll.toLocaleString()}</td>
            <td colspan="2" style="text-align: right;">Aggregated totals</td>
          </tr>
        </tbody>
      </table>

      <h2>Key Insights</h2>
      <ul>
        <li>Peak season observed in July 2025 with 4,730 total arrivals</li>
        <li>Foreign tourists consistently account for ~60% of all arrivals</li>
        <li>Steady growth trend throughout the summer months</li>
        <li>October shows seasonal decline, typical for fall period</li>
      </ul>
    `

    exportToPDF("Monthly Tourist Arrivals Report", content)
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
                <BreadcrumbPage>Monthly Reports</BreadcrumbPage>
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
                <h1 className="text-3xl font-bold tracking-tight">Monthly Tourist Reports</h1>
                <p className="text-muted-foreground">
                  Comprehensive monthly breakdown of foreign and domestic tourist arrivals
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

          {/* Summary Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <MonthlySummaryCards selectedMonth={selectedMonth} />
          </div>

          {/* Monthly Chart */}
          <div className="grid gap-4">
            <MonthlyTouristArrivalsChart />
          </div>

          {/* Detailed Monthly Breakdown Table */}
          <Card>
            <CardHeader>
              <CardTitle>Detailed Monthly Breakdown</CardTitle>
              <CardDescription>
                Complete record of tourist arrivals by month
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="p-4 text-left font-medium">Month</th>
                      <th className="p-4 text-right font-medium">Foreign Tourists</th>
                      <th className="p-4 text-right font-medium">Domestic Tourists</th>
                      <th className="p-4 text-right font-medium">Total Arrivals</th>
                      <th className="p-4 text-right font-medium">Foreign %</th>
                      <th className="p-4 text-right font-medium">Domestic %</th>
                    </tr>
                  </thead>
                  <tbody>
                    {monthlyBreakdown.map((row, index) => {
                      const foreignPercent = ((row.foreign / row.total) * 100).toFixed(1)
                      const domesticPercent = ((row.domestic / row.total) * 100).toFixed(1)
                      return (
                        <tr key={index} className="border-b last:border-0 hover:bg-muted/50">
                          <td className="p-4 font-medium">{row.month}</td>
                          <td className="p-4 text-right">{row.foreign.toLocaleString()}</td>
                          <td className="p-4 text-right">{row.domestic.toLocaleString()}</td>
                          <td className="p-4 text-right font-semibold">{row.total.toLocaleString()}</td>
                          <td className="p-4 text-right text-blue-600 dark:text-blue-400">
                            {foreignPercent}%
                          </td>
                          <td className="p-4 text-right text-green-600 dark:text-green-400">
                            {domesticPercent}%
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                  <tfoot>
                    <tr className="border-t-2 bg-muted/50 font-bold">
                      <td className="p-4">Total (6 Months)</td>
                      <td className="p-4 text-right">
                        {monthlyBreakdown.reduce((sum, row) => sum + row.foreign, 0).toLocaleString()}
                      </td>
                      <td className="p-4 text-right">
                        {monthlyBreakdown.reduce((sum, row) => sum + row.domestic, 0).toLocaleString()}
                      </td>
                      <td className="p-4 text-right">
                        {monthlyBreakdown.reduce((sum, row) => sum + row.total, 0).toLocaleString()}
                      </td>
                      <td className="p-4 text-right" colSpan={2}>
                        <span className="text-xs text-muted-foreground">Aggregated totals</span>
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Report Summary Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Report Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <h4 className="font-semibold">Key Insights</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                    <li>Peak season observed in July 2025 with 4,730 total arrivals</li>
                    <li>Foreign tourists consistently account for ~60% of all arrivals</li>
                    <li>Steady growth trend throughout the summer months</li>
                    <li>October shows seasonal decline, typical for fall period</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold">Recommendations</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                    <li>Increase marketing efforts during low-season months</li>
                    <li>Develop domestic tourism packages to boost local arrivals</li>
                    <li>Enhance facilities to accommodate peak season demand</li>
                    <li>Focus on customer retention strategies for repeat visits</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
