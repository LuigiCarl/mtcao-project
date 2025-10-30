"use client"

import * as React from "react"
import { Pencil, Trash2, Loader2, Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { BoatFormEdit } from "./boat-form-edit"

interface Boat {
  id: number
  boat_name: string
  registration_number: string
  boat_type: string
  capacity: number
  operator_name: string
  operator_contact?: string
  captain_name: string
  captain_license?: string
  home_port?: string
  engine_type?: string
  engine_horsepower?: string
  year_built?: number
  status: string
}

const API_BASE_URL = 'http://127.0.0.1:8000/api'

export function BoatsTable() {
  const [boats, setBoats] = React.useState<Boat[]>([])
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)
  const [deletingId, setDeletingId] = React.useState<number | null>(null)
  const [viewingBoat, setViewingBoat] = React.useState<Boat | null>(null)
  const [editingBoat, setEditingBoat] = React.useState<Boat | null>(null)

  const fetchBoats = React.useCallback(async () => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch(`${API_BASE_URL}/boats`, {
        headers: {
          Accept: 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error('Failed to fetch boats')
      }

      const data = await response.json()
      setBoats(Array.isArray(data) ? data : data.data || [])
    } catch (err: any) {
      setError(err.message || "Failed to load boats")
    } finally {
      setLoading(false)
    }
  }, [])

  React.useEffect(() => {
    fetchBoats()
  }, [fetchBoats])

  const handleDelete = async (id: number, boatName: string) => {
    if (!confirm(`Are you sure you want to delete "${boatName}"? This action cannot be undone.`)) {
      return
    }

    setDeletingId(id)
    try {
      const response = await fetch(`${API_BASE_URL}/boats/${id}`, {
        method: 'DELETE',
        headers: {
          Accept: 'application/json',
        },
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to delete boat')
      }

      alert("Boat deleted successfully!")
      fetchBoats()
    } catch (err: any) {
      alert(`Failed to delete boat: ${err.message}`)
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Registered Boats</CardTitle>
              <CardDescription>
                Manage boat registrations and information
              </CardDescription>
            </div>
            
            <Button onClick={fetchBoats} variant="outline" size="sm">
              Refresh
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          {error && (
            <div className="p-4 mb-4 bg-destructive/10 border border-destructive rounded-lg">
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}

          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              <span className="ml-2 text-muted-foreground">Loading boats...</span>
            </div>
          ) : boats.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>No boats registered yet</p>
              <p className="text-sm mt-2">Boats will be automatically created when you record tourist arrivals</p>
            </div>
          ) : (
            <div className="rounded-md border overflow-x-auto">
              <Table className="w-full">
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="text-xs sm:text-sm whitespace-nowrap">Boat Name</TableHead>
                    <TableHead className="text-xs sm:text-sm whitespace-nowrap">Reg #</TableHead>
                    <TableHead className="text-xs sm:text-sm whitespace-nowrap">Type</TableHead>
                    <TableHead className="text-xs sm:text-sm whitespace-nowrap">Capacity</TableHead>
                    <TableHead className="text-xs sm:text-sm whitespace-nowrap">Operator</TableHead>
                    <TableHead className="text-xs sm:text-sm whitespace-nowrap">Captain</TableHead>
                    <TableHead className="text-xs sm:text-sm whitespace-nowrap">Status</TableHead>
                    <TableHead className="text-right text-xs sm:text-sm whitespace-nowrap">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {boats.map((boat) => (
                    <TableRow key={boat.id} className="hover:bg-muted/50 text-xs sm:text-sm">
                      <TableCell className="font-medium py-2 px-2 sm:px-4 whitespace-normal break-words">{boat.boat_name}</TableCell>
                      <TableCell className="font-mono text-xs py-2 px-2 sm:px-4 whitespace-normal break-words">{boat.registration_number}</TableCell>
                      <TableCell className="capitalize py-2 px-2 sm:px-4 text-xs whitespace-normal break-words">{boat.boat_type}</TableCell>
                      <TableCell className="py-2 px-2 sm:px-4 text-xs">{boat.capacity}</TableCell>
                      <TableCell className="py-2 px-2 sm:px-4 text-xs whitespace-normal break-words">{boat.operator_name}</TableCell>
                      <TableCell className="py-2 px-2 sm:px-4 text-xs whitespace-normal break-words">{boat.captain_name}</TableCell>
                      <TableCell className="py-2 px-2 sm:px-4">
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium whitespace-nowrap ${
                            boat.status === "active"
                              ? "bg-green-100 text-green-700"
                              : boat.status === "maintenance"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {boat.status}
                        </span>
                      </TableCell>
                      <TableCell className="text-right py-2 px-2 sm:px-4">
                        <div className="flex justify-end gap-1 sm:gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setEditingBoat(boat)}
                            title="Edit boat"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(boat.id, boat.boat_name)}
                            disabled={deletingId === boat.id}
                            title="Delete boat"
                            className="text-destructive hover:text-destructive"
                          >
                            {deletingId === boat.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {boats.length > 0 && (
            <div className="mt-4 text-sm text-muted-foreground">
              Showing {boats.length} boat(s)
            </div>
          )}
        </CardContent>
      </Card>

      {/* Boat Details Dialog */}
      <Dialog open={!!viewingBoat} onOpenChange={(open: boolean) => !open && setViewingBoat(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Boat Details</DialogTitle>
            <DialogDescription>
              Complete information for {viewingBoat?.boat_name}
            </DialogDescription>
          </DialogHeader>
          
          {viewingBoat && (
            <div className="grid gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Boat Name</label>
                  <p className="mt-1 font-medium">{viewingBoat.boat_name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Registration Number</label>
                  <p className="mt-1 font-mono text-sm">{viewingBoat.registration_number}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Boat Type</label>
                  <p className="mt-1 capitalize">{viewingBoat.boat_type}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Capacity</label>
                  <p className="mt-1">{viewingBoat.capacity} passengers</p>
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-semibold mb-3">Operator Information</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Operator Name</label>
                    <p className="mt-1">{viewingBoat.operator_name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Contact</label>
                    <p className="mt-1">{viewingBoat.operator_contact || "N/A"}</p>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-semibold mb-3">Captain Information</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Captain Name</label>
                    <p className="mt-1">{viewingBoat.captain_name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">License Number</label>
                    <p className="mt-1">{viewingBoat.captain_license || "N/A"}</p>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-semibold mb-3">Technical Information</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Home Port</label>
                    <p className="mt-1">{viewingBoat.home_port || "N/A"}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Year Built</label>
                    <p className="mt-1">{viewingBoat.year_built || "N/A"}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Engine Type</label>
                    <p className="mt-1">{viewingBoat.engine_type || "N/A"}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Engine Horsepower</label>
                    <p className="mt-1">{viewingBoat.engine_horsepower || "N/A"}</p>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <label className="text-sm font-medium text-muted-foreground">Status</label>
                <p className="mt-1">
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      viewingBoat.status === "active"
                        ? "bg-green-100 text-green-700"
                        : viewingBoat.status === "maintenance"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {viewingBoat.status}
                  </span>
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Boat Edit Dialog */}
      <Dialog open={!!editingBoat} onOpenChange={(open: boolean) => !open && setEditingBoat(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Boat</DialogTitle>
          </DialogHeader>
          
          {editingBoat && (
            <BoatFormEdit
              boat={editingBoat}
              onSaveComplete={() => {
                setEditingBoat(null)
                fetchBoats()
              }}
              onCancel={() => setEditingBoat(null)}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
