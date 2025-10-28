"use client"

import { TrendingUp } from "lucide-react"
import { CartesianGrid, LabelList, Line, LineChart, XAxis, YAxis } from "recharts"

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
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

const chartData = [
  { month: "January", trips: 186, passengers: 1420 },
  { month: "February", trips: 305, passengers: 2380 },
  { month: "March", trips: 237, passengers: 1850 },
  { month: "April", trips: 273, passengers: 2140 },
  { month: "May", trips: 209, passengers: 1620 },
  { month: "June", trips: 214, passengers: 1690 },
]

const chartConfig = {
  trips: {
    label: "Trips",
    color: "hsl(142, 76%, 36%)",
  },
  passengers: {
    label: "Passengers",
    color: "hsl(221, 83%, 53%)",
  },
} satisfies ChartConfig

export function BoatTripTrendChart() {
  return (
    <Card className="flex flex-col h-full min-h-[500px]">
      <CardHeader>
        <CardTitle>Boat Trip Trends</CardTitle>
        <CardDescription>January - June 2024</CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        <ChartContainer config={chartConfig} className="h-full w-full min-h-[300px] aspect-auto">
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
              top: 20,
            }}
            width={undefined}
            height={undefined}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent />}
            />
            <ChartLegend content={<ChartLegendContent />} />
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
            >
              <LabelList
                dataKey="trips"
                position="top"
                className="fill-foreground"
                fontSize={10}
              />
            </Line>
            <Line
              dataKey="passengers"
              type="natural"
              stroke="var(--color-passengers)"
              strokeWidth={2}
              dot={{
                fill: "var(--color-passengers)",
              }}
              activeDot={{
                r: 6,
              }}
            >
              <LabelList
                dataKey="passengers"
                position="bottom"
                className="fill-foreground"
                fontSize={10}
              />
            </Line>
          </LineChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing boat trips and passengers for the last 6 months
        </div>
      </CardFooter>
    </Card>
  )
}
