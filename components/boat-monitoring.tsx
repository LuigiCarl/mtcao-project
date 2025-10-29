"use client"

import { useEffect, useState } from "react"
import { RefreshCw, CheckCircle, Clock, AlertCircle } from "lucide-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"

interface Boat {
  id: number
  boat_name: string
  registration_number: string
  current_cycle: number
  cycle_position: number
  has_trip_in_cycle: boolean
  last_trip_date: string | null
  status: string
  can_take_trip: boolean
}

interface CycleInfo {
  current_cycle: number
  total_boats: number
  boats_with_trips: number
  boats_remaining: number
  cycle_complete: boolean
  progress_percentage: number
}

interface CycleStatus {
  boats: Boat[]
  cycle_info: CycleInfo
}

export function BoatMonitoring() {
  const [cycleStatus, setCycleStatus] = useState<CycleStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)

  const fetchCycleStatus = async () => {
    try {
      setLoading(true)
      const response = await fetch('http://127.0.0.1:8000/api/boat-monitoring/cycle-status')
      const data = await response.json()
      setCycleStatus(data)
    } catch (error) {
      console.error('Error fetching cycle status:', error)
    } finally {
      setLoading(false)
    }
  }

  const startNewCycle = async () => {
    if (!confirm('Are you sure you want to start a new cycle? This will reset all boats.')) {
      return
    }

    try {
      setActionLoading(true)
      const response = await fetch('http://127.0.0.1:8000/api/boat-monitoring/start-new-cycle', {
        method: 'POST',
      })
      const data = await response.json()
      
      if (data.success) {
        await fetchCycleStatus()
        alert('New cycle started successfully!')
      }
    } catch (error) {
      console.error('Error starting new cycle:', error)
      alert('Failed to start new cycle')
    } finally {
      setActionLoading(false)
    }
  }

  const resetPositions = async () => {
    if (!confirm('Are you sure you want to reset cycle positions?')) {
      return
    }

    try {
      setActionLoading(true)
      const response = await fetch('http://127.0.0.1:8000/api/boat-monitoring/reset-positions', {
        method: 'POST',
      })
      const data = await response.json()
      
      if (data.success) {
        await fetchCycleStatus()
        alert('Positions reset successfully!')
      }
    } catch (error) {
      console.error('Error resetting positions:', error)
      alert('Failed to reset positions')
    } finally {
      setActionLoading(false)
    }
  }

  useEffect(() => {
    fetchCycleStatus()
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchCycleStatus, 30000)
    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Boat Cycle Monitoring</CardTitle>
          <CardDescription>Loading...</CardDescription>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-32 w-full" />
        </CardContent>
      </Card>
    )
  }

  if (!cycleStatus) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Boat Cycle Monitoring</CardTitle>
          <CardDescription>No data available</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  const { boats, cycle_info } = cycleStatus

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Boat Cycle Monitoring</CardTitle>
            <CardDescription>
              Track boat rotation and ensure fair trip distribution
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={fetchCycleStatus}
              disabled={actionLoading}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={resetPositions}
              disabled={actionLoading}
            >
              Reset Positions
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={startNewCycle}
              disabled={actionLoading || !cycle_info.cycle_complete}
            >
              Start New Cycle
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Cycle Overview */}
        <div className="mb-6 p-4 border rounded-lg">
          <div className="grid gap-4 md:grid-cols-4 mb-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Current Cycle</p>
              <p className="text-2xl font-bold">#{cycle_info.current_cycle}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Boats</p>
              <p className="text-2xl font-bold">{cycle_info.total_boats}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Completed Trips</p>
              <p className="text-2xl font-bold text-green-600">
                {cycle_info.boats_with_trips}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Remaining</p>
              <p className="text-2xl font-bold text-orange-600">
                {cycle_info.boats_remaining}
              </p>
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium">Cycle Progress</p>
              <p className="text-sm font-medium">{cycle_info.progress_percentage}%</p>
            </div>
            <Progress value={cycle_info.progress_percentage} className="h-2" />
          </div>
          {cycle_info.cycle_complete && (
            <div className="mt-4 p-3 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <p className="text-sm font-medium text-green-800 dark:text-green-200">
                Cycle complete! All boats have completed their trip. You can start a new cycle.
              </p>
            </div>
          )}
        </div>

        {/* Boats Table */}
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Position</TableHead>
                <TableHead>Boat Name</TableHead>
                <TableHead>Registration</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Trip</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {boats.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground">
                    No active boats found
                  </TableCell>
                </TableRow>
              ) : (
                boats.map((boat) => (
                  <TableRow key={boat.id}>
                    <TableCell>
                      <Badge variant="outline">{boat.cycle_position}</Badge>
                    </TableCell>
                    <TableCell className="font-medium">{boat.boat_name}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {boat.registration_number}
                    </TableCell>
                    <TableCell>
                      {boat.has_trip_in_cycle ? (
                        <Badge className="bg-green-600">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Completed
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-orange-600 border-orange-600">
                          <Clock className="h-3 w-3 mr-1" />
                          Waiting
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {boat.last_trip_date
                        ? new Date(boat.last_trip_date).toLocaleDateString()
                        : 'Never'}
                    </TableCell>
                    <TableCell>
                      {boat.can_take_trip ? (
                        <Badge variant="secondary" className="text-xs">
                          Available
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="text-xs opacity-50">
                          In Cycle
                        </Badge>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
      <CardFooter className="text-sm text-muted-foreground">
        <AlertCircle className="h-4 w-4 mr-2" />
        Each boat can only take one trip per cycle. Start a new cycle when all boats have completed their trips.
      </CardFooter>
    </Card>
  )
}
