"use client"

import { TrendingUp } from "lucide-react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"

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

const chartData = [
  { spot: "Juag Lagoon", visitors: 1450, fill: "hsl(199, 89%, 48%)" },
  { spot: "Cave", visitors: 980, fill: "hsl(30, 80%, 55%)" },
  { spot: "Beach", visitors: 1620, fill: "hsl(45, 93%, 58%)" },
]

const chartConfig = {
  visitors: {
    label: "Visitors",
  },
  juagLagoon: {
    label: "Juag Lagoon",
    color: "hsl(199, 89%, 48%)",
  },
  cave: {
    label: "Cave",
    color: "hsl(30, 80%, 55%)",
  },
  beach: {
    label: "Beach",
    color: "hsl(45, 93%, 58%)",
  },
} satisfies ChartConfig

export function TouristSpotChart() {
  const totalVisitors = chartData.reduce((acc, curr) => acc + curr.visitors, 0)
  const mostPopular = chartData.reduce((max, curr) => curr.visitors > max.visitors ? curr : max)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Popular Tourist Spots</CardTitle>
        <CardDescription>Most visited destinations this month</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="spot"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar
              dataKey="visitors"
              radius={8}
              fill="var(--color-visitors)"
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          {mostPopular.spot} is most popular <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Total spot visits: {totalVisitors.toLocaleString()} visitors
        </div>
      </CardFooter>
    </Card>
  )
}
