"use client"

import { TrendingUp } from "lucide-react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Legend } from "recharts"

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

// Sample data for monthly tourist arrivals over the past year
const monthlyData = [
  { month: "Nov 2024", foreign: 1240, domestic: 680, total: 1920 },
  { month: "Dec 2024", foreign: 1560, domestic: 920, total: 2480 },
  { month: "Jan 2025", foreign: 1840, domestic: 1150, total: 2990 },
  { month: "Feb 2025", foreign: 1680, domestic: 980, total: 2660 },
  { month: "Mar 2025", foreign: 2120, domestic: 1280, total: 3400 },
  { month: "Apr 2025", foreign: 1980, domestic: 1090, total: 3070 },
  { month: "May 2025", foreign: 2340, domestic: 1420, total: 3760 },
  { month: "Jun 2025", foreign: 2580, domestic: 1620, total: 4200 },
  { month: "Jul 2025", foreign: 2890, domestic: 1840, total: 4730 },
  { month: "Aug 2025", foreign: 2760, domestic: 1720, total: 4480 },
  { month: "Sep 2025", foreign: 2450, domestic: 1520, total: 3970 },
  { month: "Oct 2025", foreign: 2180, domestic: 1340, total: 3520 },
]

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
  // Calculate year-over-year growth
  const currentMonthTotal = monthlyData[monthlyData.length - 1].total
  const previousYearTotal = monthlyData[0].total
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
            <Bar dataKey="foreign" fill="var(--color-foreign)" radius={4} />
            <Bar dataKey="domestic" fill="var(--color-domestic)" radius={4} />
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
