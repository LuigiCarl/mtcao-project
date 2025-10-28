"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

const chartData = [
  { date: "2024-04-01", desktop: 222, mobile: 150 },
  { date: "2024-04-02", desktop: 97, mobile: 180 },
  { date: "2024-04-03", desktop: 167, mobile: 120 },
  { date: "2024-04-04", desktop: 242, mobile: 260 },
  { date: "2024-04-05", desktop: 373, mobile: 290 },
  { date: "2024-04-06", desktop: 301, mobile: 340 },
  { date: "2024-04-07", desktop: 245, mobile: 180 },
  { date: "2024-04-08", desktop: 409, mobile: 320 },
  { date: "2024-04-09", desktop: 359, mobile: 350 },
  { date: "2024-04-10", desktop: 474, mobile: 410 },
  { date: "2024-04-11", desktop: 537, mobile: 520 },
  { date: "2024-04-12", desktop: 499, mobile: 390 },
  { date: "2024-04-13", desktop: 476, mobile: 420 },
  { date: "2024-04-14", desktop: 424, mobile: 380 },
  { date: "2024-04-15", desktop: 373, mobile: 350 },
  { date: "2024-04-16", desktop: 392, mobile: 420 },
  { date: "2024-04-17", desktop: 450, mobile: 380 },
  { date: "2024-04-18", desktop: 490, mobile: 450 },
  { date: "2024-04-19", desktop: 523, mobile: 500 },
  { date: "2024-04-20", desktop: 452, mobile: 380 },
  { date: "2024-04-21", desktop: 390, mobile: 340 },
  { date: "2024-04-22", desktop: 421, mobile: 350 },
  { date: "2024-04-23", desktop: 390, mobile: 360 },
  { date: "2024-04-24", desktop: 402, mobile: 380 },
  { date: "2024-04-25", desktop: 478, mobile: 420 },
  { date: "2024-04-26", desktop: 520, mobile: 480 },
  { date: "2024-04-27", desktop: 499, mobile: 460 },
  { date: "2024-04-28", desktop: 490, mobile: 450 },
  { date: "2024-04-29", desktop: 523, mobile: 490 },
  { date: "2024-04-30", desktop: 556, mobile: 520 },
]

const chartConfig = {
  visitors: {
    label: "Visitors",
  },
  desktop: {
    label: "Desktop",
    color: "hsl(142, 76%, 36%)",
  },
  mobile: {
    label: "Mobile",
    color: "hsl(142, 71%, 45%)",
  },
} satisfies ChartConfig

export function AreaChartInteractive() {
  const [timeRange, setTimeRange] = React.useState("90d")

  const filteredData = chartData.filter((item) => {
    const date = new Date(item.date)
    const now = new Date("2024-04-30")
    let daysToSubtract = 90
    if (timeRange === "30d") {
      daysToSubtract = 30
    } else if (timeRange === "7d") {
      daysToSubtract = 7
    }
    const startDate = new Date(now)
    startDate.setDate(startDate.getDate() - daysToSubtract)
    return date >= startDate
  })

  return (
    <div className="w-full">
      <div className="flex items-center justify-between pb-4">
        <div>
          <h3 className="text-lg font-semibold">Area Chart - Interactive</h3>
          <p className="text-sm text-muted-foreground">
            Showing total visitors for the last {timeRange === "90d" ? "3 months" : timeRange === "30d" ? "30 days" : "7 days"}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setTimeRange("7d")}
            className={`rounded-md px-3 py-1 text-sm font-medium transition-colors ${
              timeRange === "7d"
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            7d
          </button>
          <button
            onClick={() => setTimeRange("30d")}
            className={`rounded-md px-3 py-1 text-sm font-medium transition-colors ${
              timeRange === "30d"
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            30d
          </button>
          <button
            onClick={() => setTimeRange("90d")}
            className={`rounded-md px-3 py-1 text-sm font-medium transition-colors ${
              timeRange === "90d"
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            90d
          </button>
        </div>
      </div>
      <ChartContainer
        config={chartConfig}
        className="aspect-auto h-[300px] w-full"
      >
        <AreaChart data={filteredData}>
          <defs>
            <linearGradient id="fillDesktop" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="5%"
                stopColor="var(--color-desktop)"
                stopOpacity={0.8}
              />
              <stop
                offset="95%"
                stopColor="var(--color-desktop)"
                stopOpacity={0.1}
              />
            </linearGradient>
            <linearGradient id="fillMobile" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="5%"
                stopColor="var(--color-mobile)"
                stopOpacity={0.8}
              />
              <stop
                offset="95%"
                stopColor="var(--color-mobile)"
                stopOpacity={0.1}
              />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="date"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            minTickGap={32}
            tickFormatter={(value) => {
              const date = new Date(value)
              return date.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })
            }}
          />
          <ChartTooltip
            cursor={false}
            content={
              <ChartTooltipContent
                labelFormatter={(value) => {
                  return new Date(value).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })
                }}
                indicator="dot"
              />
            }
          />
          <Area
            dataKey="mobile"
            type="natural"
            fill="url(#fillMobile)"
            stroke="var(--color-mobile)"
            stackId="a"
          />
          <Area
            dataKey="desktop"
            type="natural"
            fill="url(#fillDesktop)"
            stroke="var(--color-desktop)"
            stackId="a"
          />
          <ChartLegend content={<ChartLegendContent />} />
        </AreaChart>
      </ChartContainer>
    </div>
  )
}
