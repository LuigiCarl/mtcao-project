"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Globe, Home, TrendingUp, Calendar, Percent } from "lucide-react"

interface MonthlySummaryCardsProps {
  selectedMonth?: string
}

// Sample data - in production this would come from your API/database
const monthlyStats = {
  "Oct 2025": {
    totalTourists: 3520,
    foreignTourists: 2180,
    domesticTourists: 1340,
    growth: 8.3,
    foreignPercentage: 61.9,
    domesticPercentage: 38.1,
    avgStayDuration: 3.5,
    topNationality: "Korea",
  },
  "Sep 2025": {
    totalTourists: 3970,
    foreignTourists: 2450,
    domesticTourists: 1520,
    growth: 12.1,
    foreignPercentage: 61.7,
    domesticPercentage: 38.3,
    avgStayDuration: 3.8,
    topNationality: "USA",
  },
  "Aug 2025": {
    totalTourists: 4480,
    foreignTourists: 2760,
    domesticTourists: 1720,
    growth: 5.6,
    foreignPercentage: 61.6,
    domesticPercentage: 38.4,
    avgStayDuration: 4.2,
    topNationality: "Japan",
  },
}

export function MonthlySummaryCards({ selectedMonth = "Oct 2025" }: MonthlySummaryCardsProps) {
  const stats = monthlyStats[selectedMonth as keyof typeof monthlyStats] || monthlyStats["Oct 2025"]

  return (
    <>
      {/* Total Tourists Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Tourists</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalTourists.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">
            <span className={stats.growth >= 0 ? "text-green-600" : "text-red-600"}>
              {stats.growth >= 0 ? "+" : ""}{stats.growth}%
            </span>{" "}
            from previous month
          </p>
        </CardContent>
      </Card>

      {/* Foreign Tourists Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Foreign Tourists</CardTitle>
          <Globe className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.foreignTourists.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">
            <span className="font-semibold">{stats.foreignPercentage}%</span> of total arrivals
          </p>
        </CardContent>
      </Card>

      {/* Domestic Tourists Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Domestic Tourists</CardTitle>
          <Home className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.domesticTourists.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">
            <span className="font-semibold">{stats.domesticPercentage}%</span> of total arrivals
          </p>
        </CardContent>
      </Card>

      {/* Growth Rate Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Growth Rate</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {stats.growth >= 0 ? "+" : ""}{stats.growth}%
          </div>
          <p className="text-xs text-muted-foreground">
            Month-over-month change
          </p>
        </CardContent>
      </Card>

      {/* Average Stay Duration Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Avg Stay Duration</CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.avgStayDuration} days</div>
          <p className="text-xs text-muted-foreground">
            Average visitor stay
          </p>
        </CardContent>
      </Card>

      {/* Top Nationality Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Top Nationality</CardTitle>
          <Percent className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.topNationality}</div>
          <p className="text-xs text-muted-foreground">
            Most common visitor origin
          </p>
        </CardContent>
      </Card>
    </>
  )
}
