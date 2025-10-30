"use client"

import * as React from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { ModeToggle } from "@/components/mode-toggle"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Users, Search, Download, Eye, Pencil, Trash2, Plus } from "lucide-react"
import { useTourists } from "@/hooks/use-api"
import { Skeleton } from "@/components/ui/skeleton"

interface Tourist {
  id: number
  full_name?: string
  first_name?: string
  last_name?: string
  name?: string
  age: number
  gender: string
  nationality: string
  origin?: string
  origin_city?: string
  purpose: string
  transport?: string
  transport_mode?: string
  destination: string
  is_overnight?: boolean
  accommodation_type?: string
  length_of_stay?: number
  duration_days?: number
  trip_id?: number
  arrival_date?: string
  visit_date?: string
  created_at?: string
}

export default function TouristsPage() {
  const { tourists, loading, error } = useTourists()
  const [searchQuery, setSearchQuery] = React.useState("")
  const [nationalityFilter, setNationalityFilter] = React.useState("all")
  const [purposeFilter, setPurposeFilter] = React.useState("all")
  const [selectedTourist, setSelectedTourist] = React.useState<Tourist | null>(null)
  const [showViewDialog, setShowViewDialog] = React.useState(false)

  // Get unique nationalities for filter
  const uniqueNationalities = React.useMemo(() => {
    if (!tourists) return []
    const nationalities = new Set(tourists.map((t: Tourist) => t.nationality))
    return Array.from(nationalities).sort()
  }, [tourists])

  // Helper function to get tourist name
  const getTouristName = (tourist: Tourist) => {
    return tourist.full_name || tourist.name || `${tourist.first_name || ''} ${tourist.last_name || ''}`.trim()
  }

  // Helper function to get origin
  const getOrigin = (tourist: Tourist) => {
    return tourist.origin || tourist.origin_city || ''
  }

  // Helper function to get transport
  const getTransport = (tourist: Tourist) => {
    return tourist.transport || tourist.transport_mode || ''
  }

  // Helper function to check if overnight
  const isOvernight = (tourist: Tourist) => {
    return tourist.is_overnight || tourist.accommodation_type === 'overnight' || tourist.accommodation_type === 'staycation'
  }

  // Helper function to get stay duration
  const getStayDuration = (tourist: Tourist) => {
    return tourist.length_of_stay || tourist.duration_days || 0
  }

  // Filter tourists
  const filteredTourists = React.useMemo(() => {
    if (!tourists) return []
    
    return tourists.filter((tourist: Tourist) => {
      const touristName = getTouristName(tourist)
      const touristOrigin = getOrigin(tourist)
      
      const matchesSearch = 
        touristName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        touristOrigin?.toLowerCase().includes(searchQuery.toLowerCase())
      
      const matchesNationality = 
        nationalityFilter === "all" || tourist.nationality === nationalityFilter
      
      const matchesPurpose = 
        purposeFilter === "all" || tourist.purpose === purposeFilter

      return matchesSearch && matchesNationality && matchesPurpose
    })
  }, [tourists, searchQuery, nationalityFilter, purposeFilter])

  // Export to CSV
  const handleExport = () => {
    const headers = ["Name", "Age", "Gender", "Nationality", "Origin", "Purpose", "Transport", "Destination", "Overnight", "Length of Stay", "Visit Date"]
    const csvContent = [
      headers.join(","),
      ...filteredTourists.map((t: Tourist) => [
        getTouristName(t),
        t.age,
        t.gender,
        t.nationality,
        getOrigin(t),
        t.purpose,
        getTransport(t),
        t.destination,
        isOvernight(t) ? "Yes" : "No",
        getStayDuration(t),
        t.arrival_date || t.visit_date || t.created_at || ""
      ].join(","))
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `tourists_${new Date().toISOString().split("T")[0]}.csv`
    a.click()
  }

  const handleViewDetails = (tourist: Tourist) => {
    setSelectedTourist(tourist)
    setShowViewDialog(true)
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="overflow-x-hidden">
        <header className="flex h-16 shrink-0 items-center gap-1 sm:gap-2 border-b px-2 sm:px-4 overflow-x-hidden">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-1 sm:mr-2 h-4" />
          <Breadcrumb className="hidden sm:block">
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="#">Management</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Tourist Management</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <div className="ml-auto">
            <ModeToggle />
          </div>
        </header>

        <div className="flex flex-1 flex-col gap-3 sm:gap-4 p-3 sm:p-4 md:p-6 overflow-x-hidden">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight">Tourist Management</h1>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                View and manage all tourist records in the system
              </p>
            </div>
            <Button onClick={handleExport} className="w-full sm:w-auto">
              <Download className="mr-2 h-4 w-4" />
              Export CSV
            </Button>
          </div>

          {/* Stats Cards */}
          {!loading && tourists && (
            <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4">
              <div className="rounded-lg border bg-card p-3 sm:p-4">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <p className="text-xs sm:text-sm font-medium text-muted-foreground">Total Tourists</p>
                </div>
                <p className="text-xl sm:text-2xl font-bold mt-2">{tourists.length}</p>
              </div>
              <div className="rounded-lg border bg-card p-3 sm:p-4">
                <p className="text-xs sm:text-sm font-medium text-muted-foreground">Foreign Visitors</p>
                <p className="text-xl sm:text-2xl font-bold mt-2">
                  {tourists.filter((t: Tourist) => t.nationality !== "Philippines").length}
                </p>
              </div>
              <div className="rounded-lg border bg-card p-3 sm:p-4">
                <p className="text-xs sm:text-sm font-medium text-muted-foreground">Domestic Visitors</p>
                <p className="text-xl sm:text-2xl font-bold mt-2">
                  {tourists.filter((t: Tourist) => t.nationality === "Philippines").length}
                </p>
              </div>
              <div className="rounded-lg border bg-card p-3 sm:p-4">
                <p className="text-xs sm:text-sm font-medium text-muted-foreground">Overnight Stays</p>
                <p className="text-xl sm:text-2xl font-bold mt-2">
                  {tourists.filter((t: Tourist) => isOvernight(t)).length}
                </p>
              </div>
            </div>
          )}

          {/* Filters */}
          <div className="rounded-lg border bg-card p-3 sm:p-4">
            <div className="grid gap-3 sm:gap-4 grid-cols-1 md:grid-cols-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search by name or origin..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={nationalityFilter} onValueChange={setNationalityFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by nationality" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Nationalities</SelectItem>
                  <SelectItem value="Philippines">Philippines</SelectItem>
                  {uniqueNationalities.filter(n => n !== "Philippines").map((nationality) => (
                    <SelectItem key={nationality} value={nationality}>
                      {nationality}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={purposeFilter} onValueChange={setPurposeFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by purpose" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Purposes</SelectItem>
                  <SelectItem value="leisure">Leisure</SelectItem>
                  <SelectItem value="business">Business</SelectItem>
                  <SelectItem value="education">Education</SelectItem>
                  <SelectItem value="official">Official</SelectItem>
                  <SelectItem value="others">Others</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Table */}
          <div className="rounded-lg border bg-card overflow-hidden">
            {loading ? (
              <div className="p-6 space-y-4">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
            ) : error ? (
              <div className="p-6 text-center">
                <p className="text-destructive">Error loading tourists: {error}</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-xs sm:text-sm">ID</TableHead>
                      <TableHead className="text-xs sm:text-sm">Name</TableHead>
                      <TableHead className="text-xs sm:text-sm">Age</TableHead>
                      <TableHead className="text-xs sm:text-sm">Gender</TableHead>
                      <TableHead className="text-xs sm:text-sm">Nationality</TableHead>
                      <TableHead className="text-xs sm:text-sm">Origin</TableHead>
                      <TableHead className="text-xs sm:text-sm">Purpose</TableHead>
                      <TableHead className="text-xs sm:text-sm">Destination</TableHead>
                      <TableHead className="text-xs sm:text-sm">Stay</TableHead>
                      <TableHead className="text-xs sm:text-sm text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTourists.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={10} className="text-center py-8 text-muted-foreground">
                          {searchQuery || nationalityFilter !== "all" || purposeFilter !== "all"
                            ? "No tourists match your filters"
                            : "No tourist records found"}
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredTourists.map((tourist: Tourist) => (
                        <TableRow key={tourist.id} className="text-xs sm:text-sm">
                          <TableCell className="font-medium">{tourist.id}</TableCell>
                          <TableCell>{getTouristName(tourist)}</TableCell>
                          <TableCell>{tourist.age}</TableCell>
                          <TableCell className="capitalize">{tourist.gender}</TableCell>
                          <TableCell>{tourist.nationality}</TableCell>
                          <TableCell>{getOrigin(tourist)}</TableCell>
                          <TableCell className="capitalize">{tourist.purpose}</TableCell>
                          <TableCell className="capitalize">{tourist.destination?.replace(/_/g, " ")}</TableCell>
                          <TableCell>
                            <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                              isOvernight(tourist)
                                ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                                : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
                            }`}>
                              {isOvernight(tourist) ? `${getStayDuration(tourist)}d` : "Day trip"}
                            </span>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleViewDetails(tourist)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>

          {/* Results Count */}
          {!loading && filteredTourists.length > 0 && (
            <p className="text-xs sm:text-sm text-muted-foreground">
              Showing {filteredTourists.length} of {tourists?.length || 0} tourists
            </p>
          )}
        </div>
      </SidebarInset>

      {/* View Details Dialog */}
      <Dialog open={showViewDialog} onOpenChange={setShowViewDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Tourist Details</DialogTitle>
            <DialogDescription>
              Complete information for this tourist record
            </DialogDescription>
          </DialogHeader>
          {selectedTourist && (
            <div className="space-y-4">
              <div className="grid gap-4 grid-cols-2">
                <div>
                  <Label className="text-muted-foreground text-xs">Name</Label>
                  <p className="font-medium">{getTouristName(selectedTourist)}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground text-xs">Age</Label>
                  <p className="font-medium">{selectedTourist.age}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground text-xs">Gender</Label>
                  <p className="font-medium capitalize">{selectedTourist.gender}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground text-xs">Nationality</Label>
                  <p className="font-medium">{selectedTourist.nationality}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground text-xs">Origin</Label>
                  <p className="font-medium">{getOrigin(selectedTourist)}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground text-xs">Purpose of Visit</Label>
                  <p className="font-medium capitalize">{selectedTourist.purpose}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground text-xs">Mode of Transport</Label>
                  <p className="font-medium capitalize">{getTransport(selectedTourist)}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground text-xs">Destination</Label>
                  <p className="font-medium capitalize">{selectedTourist.destination?.replace(/_/g, " ")}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground text-xs">Accommodation Type</Label>
                  <p className="font-medium capitalize">{selectedTourist.accommodation_type?.replace(/_/g, " ") || (isOvernight(selectedTourist) ? "Overnight" : "Day Tour")}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground text-xs">Length of Stay</Label>
                  <p className="font-medium">{getStayDuration(selectedTourist)} days</p>
                </div>
                {(selectedTourist.arrival_date || selectedTourist.visit_date) && (
                  <div>
                    <Label className="text-muted-foreground text-xs">Arrival Date</Label>
                    <p className="font-medium">{new Date(selectedTourist.arrival_date || selectedTourist.visit_date || '').toLocaleDateString()}</p>
                  </div>
                )}
                {selectedTourist.trip_id && (
                  <div>
                    <Label className="text-muted-foreground text-xs">Trip ID</Label>
                    <p className="font-medium">#{selectedTourist.trip_id}</p>
                  </div>
                )}
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowViewDialog(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </SidebarProvider>
  )
}
