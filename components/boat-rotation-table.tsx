"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Ship, Clock, CheckCircle2, AlertCircle } from "lucide-react"

// Sample boat rotation data - would come from your backend
export interface BoatRotation {
  id: string
  boatName: string
  registrationNumber: string
  rotationPosition: number
  lastTripDate: string
  lastTripTime: string
  status: "available" | "on-trip" | "waiting" | "maintenance"
  totalTripsThisMonth: number
  totalTripsAllTime: number
  avgTouristsPerTrip: number
  captain: string
}

const boatRotationData: BoatRotation[] = [
  {
    id: "1",
    boatName: "Morning Glory",
    registrationNumber: "PH-456789",
    rotationPosition: 1,
    lastTripDate: "2025-10-27",
    lastTripTime: "14:30",
    status: "available",
    totalTripsThisMonth: 17,
    totalTripsAllTime: 156,
    avgTouristsPerTrip: 8,
    captain: "Jose Reyes",
  },
  {
    id: "2",
    boatName: "Island Hopper",
    registrationNumber: "PH-789012",
    rotationPosition: 2,
    lastTripDate: "2025-10-27",
    lastTripTime: "16:45",
    status: "waiting",
    totalTripsThisMonth: 18,
    totalTripsAllTime: 203,
    avgTouristsPerTrip: 12,
    captain: "Maria Santos",
  },
  {
    id: "3",
    boatName: "Ocean Explorer",
    registrationNumber: "PH-123456",
    rotationPosition: 3,
    lastTripDate: "2025-10-28",
    lastTripTime: "09:15",
    status: "on-trip",
    totalTripsThisMonth: 19,
    totalTripsAllTime: 245,
    avgTouristsPerTrip: 45,
    captain: "Juan Dela Cruz",
  },
  {
    id: "4",
    boatName: "Sea Breeze",
    registrationNumber: "PH-567890",
    rotationPosition: 4,
    lastTripDate: "2025-10-28",
    lastTripTime: "10:30",
    status: "waiting",
    totalTripsThisMonth: 19,
    totalTripsAllTime: 178,
    avgTouristsPerTrip: 15,
    captain: "Carlos Mendoza",
  },
  {
    id: "5",
    boatName: "Sunset Cruiser",
    registrationNumber: "PH-345678",
    rotationPosition: 5,
    lastTripDate: "2025-10-28",
    lastTripTime: "11:00",
    status: "waiting",
    totalTripsThisMonth: 21,
    totalTripsAllTime: 198,
    avgTouristsPerTrip: 22,
    captain: "Pedro Garcia",
  },
]

const getStatusBadge = (status: string) => {
  switch (status) {
    case "available":
      return <Badge className="bg-green-500 hover:bg-green-600">Next in Line</Badge>
    case "on-trip":
      return <Badge className="bg-blue-500 hover:bg-blue-600">On Trip</Badge>
    case "waiting":
      return <Badge className="bg-yellow-500 hover:bg-yellow-600">Waiting</Badge>
    case "maintenance":
      return <Badge className="bg-red-500 hover:bg-red-600">Maintenance</Badge>
    default:
      return <Badge variant="outline">{status}</Badge>
  }
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case "available":
      return <CheckCircle2 className="h-4 w-4 text-green-500" />
    case "on-trip":
      return <Ship className="h-4 w-4 text-blue-500" />
    case "waiting":
      return <Clock className="h-4 w-4 text-yellow-500" />
    case "maintenance":
      return <AlertCircle className="h-4 w-4 text-red-500" />
    default:
      return null
  }
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export function BoatRotationTable() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Ship className="h-5 w-5" />
          Boat Rotation Queue
        </CardTitle>
        <CardDescription>
          Current rotation order based on last trip completion. Boats travel in order from position 1.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="p-4 text-left font-medium">Position</th>
                <th className="p-4 text-left font-medium">Boat Information</th>
                <th className="p-4 text-left font-medium">Captain</th>
                <th className="p-4 text-left font-medium">Last Trip</th>
                <th className="p-4 text-center font-medium">Status</th>
                <th className="p-4 text-right font-medium">Trips (Month)</th>
                <th className="p-4 text-right font-medium">Total Trips</th>
                <th className="p-4 text-right font-medium">Avg Tourists</th>
              </tr>
            </thead>
            <tbody>
              {boatRotationData.map((boat, index) => (
                <tr 
                  key={boat.id} 
                  className={`border-b last:border-0 hover:bg-muted/50 ${
                    boat.status === "available" ? "bg-green-50 dark:bg-green-950/20" : ""
                  }`}
                >
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(boat.status)}
                      <span className="font-bold text-lg">{boat.rotationPosition}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex flex-col">
                      <span className="font-semibold">{boat.boatName}</span>
                      <span className="text-xs text-muted-foreground">{boat.registrationNumber}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="text-sm">{boat.captain}</span>
                  </td>
                  <td className="p-4">
                    <div className="flex flex-col">
                      <span className="text-sm">{formatDate(boat.lastTripDate)}</span>
                      <span className="text-xs text-muted-foreground">{boat.lastTripTime}</span>
                    </div>
                  </td>
                  <td className="p-4 text-center">
                    {getStatusBadge(boat.status)}
                  </td>
                  <td className="p-4 text-right font-medium">{boat.totalTripsThisMonth}</td>
                  <td className="p-4 text-right">{boat.totalTripsAllTime}</td>
                  <td className="p-4 text-right">{boat.avgTouristsPerTrip}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="mt-4 p-4 bg-muted/50 rounded-lg">
          <h4 className="font-semibold mb-2">Rotation System Rules:</h4>
          <ul className="text-sm space-y-1 text-muted-foreground">
            <li>• Boat at <strong>Position 1</strong> is next in line for tourists</li>
            <li>• After completing a trip, boat moves to the last position</li>
            <li>• All other boats move up one position</li>
            <li>• This ensures fair distribution of trips among all boats</li>
            <li>• Boats on maintenance are temporarily removed from rotation</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
