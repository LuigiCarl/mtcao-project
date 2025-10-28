"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Ship, RotateCw, TrendingUp, Award, AlertTriangle, Users } from "lucide-react"

interface BoatUtilizationStatsProps {
  selectedMonth?: string
}

// Sample statistics - in production would come from your backend
const utilizationStats = {
  "Oct 2025": {
    totalBoatsActive: 5,
    totalTrips: 94,
    avgTripsPerBoat: 18.8,
    utilizationRate: 87.2,
    mostActiveBoat: "Sunset Cruiser",
    leastActiveBoat: "Morning Glory",
    fairnessScore: 94.5,
    rotationViolations: 0,
  },
  "Sep 2025": {
    totalBoatsActive: 5,
    totalTrips: 104,
    avgTripsPerBoat: 20.8,
    utilizationRate: 92.5,
    mostActiveBoat: "Sunset Cruiser",
    leastActiveBoat: "Morning Glory",
    fairnessScore: 93.8,
    rotationViolations: 0,
  },
  "Aug 2025": {
    totalBoatsActive: 5,
    totalTrips: 118,
    avgTripsPerBoat: 23.6,
    utilizationRate: 96.8,
    mostActiveBoat: "Sunset Cruiser",
    leastActiveBoat: "Morning Glory",
    fairnessScore: 95.2,
    rotationViolations: 0,
  },
}

export function BoatUtilizationStats({ selectedMonth = "Oct 2025" }: BoatUtilizationStatsProps) {
  const stats = utilizationStats[selectedMonth as keyof typeof utilizationStats] || utilizationStats["Oct 2025"]

  return (
    <>
      {/* Total Active Boats */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Boats</CardTitle>
          <Ship className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalBoatsActive}</div>
          <p className="text-xs text-muted-foreground">
            Boats in rotation system
          </p>
        </CardContent>
      </Card>

      {/* Total Trips This Month */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Trips</CardTitle>
          <RotateCw className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalTrips}</div>
          <p className="text-xs text-muted-foreground">
            Completed this month
          </p>
        </CardContent>
      </Card>

      {/* Average Trips Per Boat */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Avg Trips/Boat</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.avgTripsPerBoat}</div>
          <p className="text-xs text-muted-foreground">
            Fair distribution metric
          </p>
        </CardContent>
      </Card>

      {/* Utilization Rate */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Utilization Rate</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.utilizationRate}%</div>
          <p className="text-xs text-muted-foreground">
            Fleet efficiency
          </p>
        </CardContent>
      </Card>

      {/* Rotation Fairness Score */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Fairness Score</CardTitle>
          <Award className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.fairnessScore}%</div>
          <p className="text-xs text-muted-foreground">
            <span className="text-green-600 font-semibold">Excellent</span> rotation balance
          </p>
        </CardContent>
      </Card>

      {/* Rotation Violations */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Violations</CardTitle>
          <AlertTriangle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.rotationViolations}</div>
          <p className="text-xs text-muted-foreground">
            <span className="text-green-600 font-semibold">Perfect</span> compliance
          </p>
        </CardContent>
      </Card>

      {/* Most Active Boat */}
      <Card className="md:col-span-2 lg:col-span-1">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Most Active</CardTitle>
          <Ship className="h-4 w-4 text-blue-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.mostActiveBoat}</div>
          <p className="text-xs text-muted-foreground">
            Leading in trips this month
          </p>
        </CardContent>
      </Card>

      {/* Least Active Boat */}
      <Card className="md:col-span-2 lg:col-span-1">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Least Active</CardTitle>
          <Ship className="h-4 w-4 text-orange-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.leastActiveBoat}</div>
          <p className="text-xs text-muted-foreground">
            Needs attention or maintenance
          </p>
        </CardContent>
      </Card>
    </>
  )
}
