"use client"

import { useEffect, useState } from "react"
import { RefreshCw, TrendingUp, TrendingDown, Users, Globe, Clock } from "lucide-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"

interface TodayStats {
  total: number
  foreign: number
  domestic: number
  percentage_change: number
}

interface RecentArrival {
  name: string
  nationality: string
  type: string
  time_ago: string
}

interface LiveDashboard {
  today: TodayStats
  week_total: number
  month_total: number
  recent_arrivals: RecentArrival[]
  last_updated: string
}

interface TopNationality {
  nationality: string
  count: number
}

export function TouristMonitoring() {
  const [dashboard, setDashboard] = useState<LiveDashboard | null>(null)
  const [topNationalities, setTopNationalities] = useState<TopNationality[]>([])
  const [loading, setLoading] = useState(true)

  const fetchDashboard = async () => {
    try {
      setLoading(true)
      const [dashboardRes, nationalitiesRes] = await Promise.all([
        fetch('http://127.0.0.1:8000/api/tourist-monitoring/live-dashboard'),
        fetch('http://127.0.0.1:8000/api/tourist-monitoring/top-nationalities?limit=5&period=month'),
      ])
      
      const dashboardData = await dashboardRes.json()
      const nationalitiesData = await nationalitiesRes.json()
      
      setDashboard(dashboardData)
      setTopNationalities(nationalitiesData.top_nationalities)
    } catch (error) {
      console.error('Error fetching tourist monitoring data:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDashboard()
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchDashboard, 30000)
    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Tourist Monitoring</CardTitle>
          <CardDescription>Loading...</CardDescription>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-32 w-full" />
        </CardContent>
      </Card>
    )
  }

  if (!dashboard) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Tourist Monitoring</CardTitle>
          <CardDescription>No data available</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  const { today, week_total, month_total, recent_arrivals } = dashboard

  return (
    <div className="grid gap-4 md:gap-6">
      {/* Header with Refresh */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold">Live Tourist Dashboard</h3>
          <p className="text-sm text-muted-foreground">
            Real-time tourist arrival monitoring • Last updated: {new Date(dashboard.last_updated).toLocaleTimeString()}
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={fetchDashboard}
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Today's Arrivals
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{today.total}</div>
            <div className="flex items-center text-xs text-muted-foreground mt-1">
              {today.percentage_change >= 0 ? (
                <>
                  <TrendingUp className="h-3 w-3 mr-1 text-green-600" />
                  <span className="text-green-600">+{today.percentage_change}%</span>
                </>
              ) : (
                <>
                  <TrendingDown className="h-3 w-3 mr-1 text-red-600" />
                  <span className="text-red-600">{today.percentage_change}%</span>
                </>
              )}
              <span className="ml-1">from yesterday</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Foreign Tourists Today
            </CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{today.foreign}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {today.total > 0 ? Math.round((today.foreign / today.total) * 100) : 0}% of total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Domestic Tourists Today
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{today.domestic}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {today.total > 0 ? Math.round((today.domestic / today.total) * 100) : 0}% of total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              This Week
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{week_total}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {month_total} this month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Arrivals and Top Nationalities */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Recent Arrivals */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Arrivals</CardTitle>
            <CardDescription>Latest tourist check-ins</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recent_arrivals.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No recent arrivals
                </p>
              ) : (
                recent_arrivals.map((arrival, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium text-sm">{arrival.name}</p>
                      <p className="text-xs text-muted-foreground">{arrival.nationality}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={arrival.type === 'foreign' ? 'default' : 'secondary'}>
                        {arrival.type}
                      </Badge>
                      <span className="text-xs text-muted-foreground">{arrival.time_ago}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Top Nationalities */}
        <Card>
          <CardHeader>
            <CardTitle>Top Nationalities (This Month)</CardTitle>
            <CardDescription>Most common visitor countries</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topNationalities.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No data available
                </p>
              ) : (
                topNationalities.map((nationality, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold text-sm">
                        #{index + 1}
                      </div>
                      <span className="font-medium">{nationality.nationality}</span>
                    </div>
                    <Badge variant="outline" className="font-semibold">
                      {nationality.count}
                    </Badge>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Stats Table */}
      <Card>
        <CardHeader>
          <CardTitle>Today's Distribution</CardTitle>
          <CardDescription>Breakdown of tourist arrivals</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Category</TableHead>
                  <TableHead className="text-right">Count</TableHead>
                  <TableHead className="text-right">Percentage</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">Foreign Tourists</TableCell>
                  <TableCell className="text-right">{today.foreign}</TableCell>
                  <TableCell className="text-right">
                    {today.total > 0 ? Math.round((today.foreign / today.total) * 100) : 0}%
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Domestic Tourists</TableCell>
                  <TableCell className="text-right">{today.domestic}</TableCell>
                  <TableCell className="text-right">
                    {today.total > 0 ? Math.round((today.domestic / today.total) * 100) : 0}%
                  </TableCell>
                </TableRow>
                <TableRow className="bg-muted/50">
                  <TableCell className="font-bold">Total</TableCell>
                  <TableCell className="text-right font-bold">{today.total}</TableCell>
                  <TableCell className="text-right font-bold">100%</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
