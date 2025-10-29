"use client"

import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Calendar, Ship } from "lucide-react"
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface BoatReportData {
  period: string
  total: number
  [boatName: string]: number | string
}

interface BoatReportResponse {
  data: BoatReportData[]
  boat_names: string[]
  filters: {
    period: string
    start_date: string | null
    end_date: string | null
    year: number | null
    month: number | null
    boat_id: number | null
  }
  summary: {
    total_trips: number
  }
}

interface Boat {
  id: number
  boat_name: string
}

export function BoatReport() {
  const [period, setPeriod] = React.useState<'day' | 'month' | 'year'>('month')
  const [filterType, setFilterType] = React.useState<'quick' | 'custom'>('quick')
  const [year, setYear] = React.useState<string>(new Date().getFullYear().toString())
  const [month, setMonth] = React.useState<string>("all")
  const [startDate, setStartDate] = React.useState<string>("")
  const [endDate, setEndDate] = React.useState<string>("")
  const [selectedBoat, setSelectedBoat] = React.useState<string>("all")
  const [data, setData] = React.useState<BoatReportResponse | null>(null)
  const [boats, setBoats] = React.useState<Boat[]>([])
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

  // Generate colors for boats
  const boatColors = [
    "hsl(var(--chart-1))",
    "hsl(var(--chart-2))",
    "hsl(var(--chart-3))",
    "hsl(var(--chart-4))",
    "hsl(var(--chart-5))",
  ]

  // Fetch boats
  React.useEffect(() => {
    const fetchBoats = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/boats')
        const result = await response.json()
        setBoats(result.data || [])
      } catch (error) {
        console.error('Error fetching boats:', error)
      }
    }
    fetchBoats()
  }, [])

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

      if (selectedBoat && selectedBoat !== 'all') {
        params.append('boat_id', selectedBoat)
      }

      const response = await fetch(`http://127.0.0.1:8000/api/reports/boats?${params.toString()}`)
      const result = await response.json()
      setData(result)
    } catch (error) {
      console.error('Error fetching boat report:', error)
    } finally {
      setLoading(false)
    }
  }, [period, filterType, year, month, startDate, endDate, selectedBoat])

  React.useEffect(() => {
    fetchReport()
  }, [fetchReport])

  const chartConfig = React.useMemo(() => {
    if (!data) return {}
    
    const config: any = {}
    data.boat_names.forEach((name, index) => {
      config[name] = {
        label: name,
        color: boatColors[index % boatColors.length],
      }
    })
    return config
  }, [data])

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Boat Trips Report</CardTitle>
          <CardDescription>
            View boat trip statistics by day, month, or year with custom filtering
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

              <div className="space-y-2">
                <Label>Boat Filter</Label>
                <Select value={selectedBoat} onValueChange={setSelectedBoat}>
                  <SelectTrigger>
                    <SelectValue placeholder="All boats" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Boats</SelectItem>
                    {boats.map((boat) => (
                      <SelectItem key={boat.id} value={boat.id.toString()}>
                        {boat.boat_name}
                      </SelectItem>
                    ))}
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
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Ship className="h-4 w-4" />
              Total Trips
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.summary.total_trips.toLocaleString()}</div>
            {selectedBoat && (
              <p className="text-xs text-muted-foreground mt-1">
                For selected boat
              </p>
            )}
          </CardContent>
        </Card>
      )}

      {/* Chart */}
      {data && data.data.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Boat Trips Trend</CardTitle>
            <CardDescription>
              Showing {period === 'day' ? 'daily' : period === 'month' ? 'monthly' : 'yearly'} boat trips
              {selectedBoat && " for selected boat"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.data}>
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
                  <Tooltip content={<ChartTooltipContent />} />
                  <Legend />
                  {data.boat_names.map((name, index) => (
                    <Bar
                      key={name}
                      dataKey={name}
                      fill={boatColors[index % boatColors.length]}
                      name={name}
                      stackId="a"
                    />
                  ))}
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
