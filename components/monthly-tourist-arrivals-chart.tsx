"use client"

import { TrendingUp } from "lucide-react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Legend } from "recharts"
import { useEffect, useState } from "react"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

const chartConfig = {
  foreign: {
    label: "Foreign Tourists",
    color: "hsl(221, 83%, 53%)",
  },
  domestic: {
    label: "Domestic Tourists",
    color: "hsl(142, 76%, 36%)",
  },
  total: {
    label: "Total",
    color: "hsl(280, 65%, 60%)",
  },
} satisfies ChartConfig

export function MonthlyTouristArrivalsChart() {
  const [monthlyData, setMonthlyData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/reports/monthly-tourist-arrivals')
        const data = await response.json()
        setMonthlyData(data)
      } catch (error) {
        console.error('Error fetching monthly tourist data:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Monthly Tourist Arrivals</CardTitle>
          <CardDescription>Loading...</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  if (monthlyData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Monthly Tourist Arrivals</CardTitle>
          <CardDescription>No data available</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  // Calculate year-over-year growth
  const currentMonthTotal = monthlyData[monthlyData.length - 1]?.total || 0
  const previousYearTotal = monthlyData[0]?.total || 1
  const growthPercentage = ((currentMonthTotal - previousYearTotal) / previousYearTotal * 100).toFixed(1)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Monthly Tourist Arrivals</CardTitle>
        <CardDescription>Foreign vs Domestic Tourist Arrivals (Last 12 Months)</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={monthlyData}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => `${value}`}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dashed" />}
            />
            <Legend />
            <Bar
              dataKey="foreign"
              fill="var(--color-foreign)"
              radius={4}
            />
            <Bar
              dataKey="domestic"
              fill="var(--color-domestic)"
              radius={4}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          {parseFloat(growthPercentage) > 0 ? (
            <>
              Trending up by {growthPercentage}% compared to last year <TrendingUp className="h-4 w-4" />
            </>
          ) : (
            <>
              Trending down by {Math.abs(parseFloat(growthPercentage))}% compared to last year
            </>
          )}
        </div>
        <div className="leading-none text-muted-foreground">
          Total arrivals across all months: {monthlyData.reduce((sum, m) => sum + m.total, 0).toLocaleString()}    
        </div>
      </CardFooter>
    </Card>
  )
}
