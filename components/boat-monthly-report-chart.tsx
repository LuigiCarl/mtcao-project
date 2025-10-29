"use client"

import { TrendingUp } from "lucide-react"
import { Bar, CartesianGrid, XAxis, YAxis, Legend, Line, ComposedChart } from "recharts"
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

// Default colors for boats
const defaultColors = [
  "hsl(221, 83%, 53%)",
  "hsl(142, 76%, 36%)",
  "hsl(280, 65%, 60%)",
  "hsl(24, 95%, 53%)",
  "hsl(173, 58%, 39%)",
]

export function BoatMonthlyReportChart() {
  const [monthlyBoatData, setMonthlyBoatData] = useState<any[]>([])
  const [chartConfig, setChartConfig] = useState<ChartConfig>({
    total: {
      label: "Total Trips",
      color: "hsl(0, 0%, 50%)",
    },
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/reports/monthly-boat-trips')
        const data = await response.json()
        
        // Extract unique boat names and create config
        const boatNames = new Set<string>()
        data.forEach((month: any) => {
          Object.keys(month).forEach(key => {
            if (key !== 'month' && key !== 'total') {
              boatNames.add(key)
            }
          })
        })

        // Create chart config for each boat
        const config: ChartConfig = {
          total: {
            label: "Total Trips",
            color: "hsl(0, 0%, 50%)",
          },
        }
        Array.from(boatNames).forEach((boatName, index) => {
          config[boatName] = {
            label: boatName,
            color: defaultColors[index % defaultColors.length],
          }
        })

        setChartConfig(config)
        setMonthlyBoatData(data)
      } catch (error) {
        console.error('Error fetching monthly boat data:', error)
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
          <CardTitle>Boat Rotation Performance</CardTitle>
          <CardDescription>Loading...</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  if (monthlyBoatData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Boat Rotation Performance</CardTitle>
          <CardDescription>No data available</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  // Calculate average trips per boat
  const totalTrips = monthlyBoatData.reduce((sum, month) => sum + (month.total || 0), 0)
  const avgTripsPerMonth = (totalTrips / monthlyBoatData.length).toFixed(1)

  // Get boat names (excluding month and total)
  const boatNames = Object.keys(chartConfig).filter(key => key !== 'total')

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
            {boatNames.map((boatName) => (
              <Bar
                key={boatName}
                dataKey={boatName}
                fill={`var(--color-${boatName})`}
                radius={4}
                stackId="boats"
              />
            ))}
            <Line
              type="monotone"
              dataKey="total"
              stroke="var(--color-total)"
              strokeWidth={2}
              dot={{ r: 4 }}
            />
          </ComposedChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Fair rotation maintained across all boats <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Average {avgTripsPerMonth} total trips per month • {totalTrips} total trips across all months
        </div>
      </CardFooter>
    </Card>
  )
}
