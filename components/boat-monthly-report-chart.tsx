"use client"

import { TrendingUp } from "lucide-react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Legend, Line, ComposedChart } from "recharts"

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

// Sample data showing boat trips per month for each boat
const monthlyBoatData = [
  { 
    month: "May 2025", 
    "Ocean Explorer": 18, 
    "Island Hopper": 16, 
    "Sunset Cruiser": 20, 
    "Morning Glory": 15,
    "Sea Breeze": 17,
    total: 86
  },
  { 
    month: "Jun 2025", 
    "Ocean Explorer": 22, 
    "Island Hopper": 21, 
    "Sunset Cruiser": 24, 
    "Morning Glory": 19,
    "Sea Breeze": 20,
    total: 106
  },
  { 
    month: "Jul 2025", 
    "Ocean Explorer": 26, 
    "Island Hopper": 25, 
    "Sunset Cruiser": 28, 
    "Morning Glory": 23,
    "Sea Breeze": 24,
    total: 126
  },
  { 
    month: "Aug 2025", 
    "Ocean Explorer": 24, 
    "Island Hopper": 23, 
    "Sunset Cruiser": 26, 
    "Morning Glory": 22,
    "Sea Breeze": 23,
    total: 118
  },
  { 
    month: "Sep 2025", 
    "Ocean Explorer": 21, 
    "Island Hopper": 20, 
    "Sunset Cruiser": 23, 
    "Morning Glory": 19,
    "Sea Breeze": 21,
    total: 104
  },
  { 
    month: "Oct 2025", 
    "Ocean Explorer": 19, 
    "Island Hopper": 18, 
    "Sunset Cruiser": 21, 
    "Morning Glory": 17,
    "Sea Breeze": 19,
    total: 94
  },
]

const chartConfig = {
  "Ocean Explorer": {
    label: "Ocean Explorer",
    color: "hsl(221, 83%, 53%)",
  },
  "Island Hopper": {
    label: "Island Hopper",
    color: "hsl(142, 76%, 36%)",
  },
  "Sunset Cruiser": {
    label: "Sunset Cruiser",
    color: "hsl(280, 65%, 60%)",
  },
  "Morning Glory": {
    label: "Morning Glory",
    color: "hsl(24, 95%, 53%)",
  },
  "Sea Breeze": {
    label: "Sea Breeze",
    color: "hsl(173, 58%, 39%)",
  },
  total: {
    label: "Total Trips",
    color: "hsl(0, 0%, 50%)",
  },
} satisfies ChartConfig

export function BoatMonthlyReportChart() {
  // Calculate average trips per boat
  const totalTrips = monthlyBoatData.reduce((sum, month) => sum + month.total, 0)
  const avgTripsPerMonth = (totalTrips / monthlyBoatData.length).toFixed(1)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Boat Rotation Performance</CardTitle>
        <CardDescription>Monthly trips by boat showing rotation fairness (Last 6 Months)</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <ComposedChart accessibilityLayer data={monthlyBoatData}>
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
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dashed" />}
            />
            <Legend />
            <Bar 
              dataKey="Ocean Explorer" 
              fill="var(--color-Ocean Explorer)" 
              radius={4} 
              stackId="boats"
              animationBegin={0}
              animationDuration={800}
              animationEasing="ease-in-out"
            />
            <Bar 
              dataKey="Island Hopper" 
              fill="var(--color-Island Hopper)" 
              radius={4} 
              stackId="boats"
              animationBegin={50}
              animationDuration={800}
              animationEasing="ease-in-out"
            />
            <Bar 
              dataKey="Sunset Cruiser" 
              fill="var(--color-Sunset Cruiser)" 
              radius={4} 
              stackId="boats"
              animationBegin={100}
              animationDuration={800}
              animationEasing="ease-in-out"
            />
            <Bar 
              dataKey="Morning Glory" 
              fill="var(--color-Morning Glory)" 
              radius={4} 
              stackId="boats"
              animationBegin={150}
              animationDuration={800}
              animationEasing="ease-in-out"
            />
            <Bar 
              dataKey="Sea Breeze" 
              fill="var(--color-Sea Breeze)" 
              radius={4} 
              stackId="boats"
              animationBegin={200}
              animationDuration={800}
              animationEasing="ease-in-out"
            />
            <Line 
              type="monotone" 
              dataKey="total" 
              stroke="var(--color-total)" 
              strokeWidth={2}
              dot={{ r: 4 }}
              animationBegin={300}
              animationDuration={1000}
              animationEasing="ease-in-out"
            />
          </ComposedChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Fair rotation maintained across all boats <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Average {avgTripsPerMonth} total trips per month • {totalTrips} total trips across 6 months
        </div>
      </CardFooter>
    </Card>
  )
}
