"use client"

import { TrendingUp } from "lucide-react"
import { CartesianGrid, Line, LineChart, XAxis } from "recharts"

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
  { month: "January", trips: 186 },
  { month: "February", trips: 305 },
  { month: "March", trips: 237 },
  { month: "April", trips: 273 },
  { month: "May", trips: 209 },
  { month: "June", trips: 214 },
]

const chartConfig = {
  trips: {
    label: "Trips",
    color: "hsl(142, 76%, 36%)",
  },
} satisfies ChartConfig

export function BoatTripTrendChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Boat Trip Trends</CardTitle>
        <CardDescription>January - June 2024</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Line
              dataKey="trips"
              type="natural"
              stroke="var(--color-trips)"
              strokeWidth={2}
              dot={{
                fill: "var(--color-trips)",
              }}
              activeDot={{
                r: 6,
              }}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing total boat trips for the last 6 months
        </div>
      </CardFooter>
    </Card>
  )
}
