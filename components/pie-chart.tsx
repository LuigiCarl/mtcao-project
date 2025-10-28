"use client"

import * as React from "react"
import { Pie, PieChart } from "recharts"

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

const chartData = [
  { browser: "chrome", visitors: 275, fill: "hsl(142, 76%, 36%)" },
  { browser: "safari", visitors: 200, fill: "hsl(142, 71%, 45%)" },
  { browser: "firefox", visitors: 187, fill: "hsl(142, 66%, 54%)" },
  { browser: "edge", visitors: 173, fill: "hsl(142, 61%, 63%)" },
  { browser: "other", visitors: 90, fill: "hsl(142, 56%, 72%)" },
]

const chartConfig = {
  visitors: {
    label: "Visitors",
  },
  chrome: {
    label: "Chrome",
    color: "hsl(142, 76%, 36%)",
  },
  safari: {
    label: "Safari",
    color: "hsl(142, 71%, 45%)",
  },
  firefox: {
    label: "Firefox",
    color: "hsl(142, 66%, 54%)",
  },
  edge: {
    label: "Edge",
    color: "hsl(142, 61%, 63%)",
  },
  other: {
    label: "Other",
    color: "hsl(142, 56%, 72%)",
  },
} satisfies ChartConfig

export function PieChartComponent() {
  return (
    <div className="w-full flex items-center justify-center">
      <ChartContainer
        config={chartConfig}
        className="aspect-square max-h-[200px]"
      >
        <PieChart>
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent hideLabel />}
          />
          <Pie data={chartData} dataKey="visitors" nameKey="browser" />
        </PieChart>
      </ChartContainer>
    </div>
  )
}
