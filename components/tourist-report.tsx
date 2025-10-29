"use client"

import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Calendar } from "lucide-react"
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface TouristReportData {
  period: string
  foreign: number
  domestic: number
  total: number
}

interface TouristReportResponse {
  data: TouristReportData[]
  filters: {
    period: string
    start_date: string | null
    end_date: string | null
    year: number | null
    month: number | null
  }
  summary: {
    total_tourists: number
    total_foreign: number
    total_domestic: number
  }
}

export function TouristReport() {
  const [period, setPeriod] = React.useState<'day' | 'month' | 'year'>('month')
  const [filterType, setFilterType] = React.useState<'quick' | 'custom'>('quick')
  const [year, setYear] = React.useState<string>(new Date().getFullYear().toString())
  const [month, setMonth] = React.useState<string>("all")
  const [startDate, setStartDate] = React.useState<string>("")
  const [endDate, setEndDate] = React.useState<string>("")
  const [data, setData] = React.useState<TouristReportResponse | null>(null)
  const [loading, setLoading] = React.useState(false)

  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 10 }, (_, i) => currentYear - i)
  const months = [
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

  const fetchReport = React.useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      params.append('period', period)

      if (filterType === 'custom' && startDate && endDate) {
        params.append('start_date', startDate)
        params.append('end_date', endDate)
      } else {
        if (year) params.append('year', year)
        if (month && month !== 'all') params.append('month', month)
      }

      const response = await fetch(`http://127.0.0.1:8000/api/reports/tourists?${params.toString()}`)
      const result = await response.json()
      setData(result)
    } catch (error) {
      console.error('Error fetching tourist report:', error)
    } finally {
      setLoading(false)
    }
  }, [period, filterType, year, month, startDate, endDate])

  React.useEffect(() => {
    fetchReport()
  }, [fetchReport])

  const chartConfig = {
    foreign: {
      label: "Foreign",
      color: "hsl(var(--chart-1))",
    },
    domestic: {
      label: "Domestic",
      color: "hsl(var(--chart-2))",
    },
    total: {
      label: "Total",
      color: "hsl(var(--chart-3))",
    },
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Tourist Arrivals Report</CardTitle>
          <CardDescription>
            View tourist arrivals by day, month, or year with custom date filtering
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Period Selection */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label>View By</Label>
                <Select value={period} onValueChange={(v) => setPeriod(v as any)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="day">Daily</SelectItem>
                    <SelectItem value="month">Monthly</SelectItem>
                    <SelectItem value="year">Yearly</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Filter Type</Label>
                <Select value={filterType} onValueChange={(v) => setFilterType(v as any)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="quick">Quick Select</SelectItem>
                    <SelectItem value="custom">Custom Range</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Quick Filters */}
            {filterType === 'quick' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Year</Label>
                  <Select value={year} onValueChange={setYear}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select year" />
                    </SelectTrigger>
                    <SelectContent>
                      {years.map((y) => (
                        <SelectItem key={y} value={y.toString()}>
                          {y}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Month (Optional)</Label>
                  <Select value={month} onValueChange={setMonth}>
                    <SelectTrigger>
                      <SelectValue placeholder="All months" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Months</SelectItem>
                      {months.map((m) => (
                        <SelectItem key={m.value} value={m.value}>
                          {m.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-end">
                  <Button onClick={fetchReport} className="w-full" disabled={loading}>
                    <Calendar className="mr-2 h-4 w-4" />
                    {loading ? 'Loading...' : 'Generate Report'}
                  </Button>
                </div>
              </div>
            )}

            {/* Custom Date Range */}
            {filterType === 'custom' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Start Date</Label>
                  <Input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>End Date</Label>
                  <Input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>

                <div className="flex items-end">
                  <Button onClick={fetchReport} className="w-full" disabled={loading || !startDate || !endDate}>
                    <Calendar className="mr-2 h-4 w-4" />
                    {loading ? 'Loading...' : 'Generate Report'}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      {data && (
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Total Tourists</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data.summary.total_tourists.toLocaleString()}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Foreign Tourists</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {data.summary.total_foreign.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {((data.summary.total_foreign / data.summary.total_tourists) * 100).toFixed(1)}% of total
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Domestic Tourists</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {data.summary.total_domestic.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {((data.summary.total_domestic / data.summary.total_tourists) * 100).toFixed(1)}% of total
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Chart */}
      {data && data.data.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Tourist Arrivals Trend</CardTitle>
            <CardDescription>
              Showing {period === 'day' ? 'daily' : period === 'month' ? 'monthly' : 'yearly'} tourist arrivals
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data.data}>
                  <defs>
                    <linearGradient id="fillForeign" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--color-foreign)" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="var(--color-foreign)" stopOpacity={0.1} />
                    </linearGradient>
                    <linearGradient id="fillDomestic" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--color-domestic)" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="var(--color-domestic)" stopOpacity={0.1} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis
                    dataKey="period"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    className="text-xs"
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    className="text-xs"
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="foreign"
                    stroke="var(--color-foreign)"
                    fillOpacity={1}
                    fill="url(#fillForeign)"
                    name="Foreign"
                  />
                  <Area
                    type="monotone"
                    dataKey="domestic"
                    stroke="var(--color-domestic)"
                    fillOpacity={1}
                    fill="url(#fillDomestic)"
                    name="Domestic"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
