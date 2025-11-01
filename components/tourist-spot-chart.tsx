"use client"

import { TrendingUp } from "lucide-react"
import { Bar, BarChart, XAxis, YAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

export const description = "Popular tourist spots (vertical layout)"

interface SpotItem {
  destination?: string
  spot?: string
  visitors?: number
  count?: number
}

interface TouristSpotChartProps {
  data?: SpotItem[]
  loading?: boolean
}

const chartConfig = {
  visitors: {
    label: "📍 Visitors",
  },
} satisfies ChartConfig

export default function TouristSpotChart({ data, loading = false }: TouristSpotChartProps) {
  // Loading skeleton
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-44" />
          <Skeleton className="h-4 w-64 mt-2" />
        </CardHeader>
        <CardContent>
          <div className="h-[340px] w-full">
            <Skeleton className="h-full w-full" />
          </div>
        </CardContent>
        <CardFooter className="flex-col items-start gap-2 text-sm">
          <Skeleton className="h-4 w-56" />
        </CardFooter>
      </Card>
    )
  }

  const rows = (data || []).map((d) => ({
    spot: d.destination || d.spot || "Unknown",
    visitors: d.visitors ?? d.count ?? 0,
  }))

  const chartData = rows
    .slice()
    .sort((a, b) => b.visitors - a.visitors)

  const totalVisitors = chartData.reduce((s, r) => s + r.visitors, 0)
  const mostPopular = chartData[0] ?? null

  return (
    <Card>
      <CardHeader>
        <CardTitle>Popular Tourist Spots</CardTitle>
        <CardDescription>Most visited destinations</CardDescription>
      </CardHeader>
      <CardContent>
        {/* Color Indicator */}
        <div className="flex items-center gap-2 text-xs mb-4 pb-4 border-b">
          <div className="w-3 h-3 rounded" style={{ backgroundColor: 'var(--chart-1)' }} />
          <span>📍 Popular Tourist Spots - Visitor Count</span>
        </div>
        <ChartContainer config={chartConfig} className="h-[340px] w-full">
          <BarChart
            accessibilityLayer
            data={chartData}
            layout="vertical"
            margin={{ left: 0 }}
          >
            <YAxis
              dataKey="spot"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) =>
                (chartConfig as any)[value as keyof typeof chartConfig]?.label || String(value)
              }
            />
            <XAxis dataKey="visitors" type="number" hide />
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
            <Bar dataKey="visitors" layout="vertical" radius={5} fill="var(--chart-1)" />
          </BarChart>
        </ChartContainer>
        
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 leading-none font-medium">
          {mostPopular ? (
            <>
              {mostPopular.spot} is most popular <TrendingUp className="h-4 w-4" />
            </>
          ) : (
            <>No data available</>
          )}
        </div>
        <div className="text-muted-foreground leading-none">Total visitors: {totalVisitors.toLocaleString()}</div>
      </CardFooter>
    </Card>
  )
}