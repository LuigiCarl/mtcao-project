"use client"

import * as React from "react"
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { ArrowUpDown, MoreHorizontal, Pencil, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useBoats } from "@/hooks/use-api"
import { Skeleton } from "@/components/ui/skeleton"

export type Boat = {
  id: string
  boatName: string
  registrationNumber: string
  boatType: string
  capacity: string
  operatorName: string
  operatorContact: string
  captainName: string
  captainLicense: string
  homePort: string
  engineType?: string
  engineHorsePower?: string
  yearBuilt?: string
  notes?: string
  status?: string
}

export const columns: ColumnDef<Boat>[] = [
  {
    accessorKey: "boatName",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Boat Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => <div className="font-medium">{row.getValue("boatName")}</div>,
  },
  {
    accessorKey: "registrationNumber",
    header: "Registration No.",
    cell: ({ row }) => <div className="font-mono text-xs">{row.getValue("registrationNumber")}</div>,
  },
  {
    accessorKey: "boatType",
    header: "Type",
    cell: ({ row }) => {
      const type = row.getValue("boatType") as string
      return <div className="capitalize">{type}</div>
    },
  },
  {
    accessorKey: "capacity",
    header: "Capacity",
    cell: ({ row }) => <div>{row.getValue("capacity")}</div>,
  },
  {
    accessorKey: "operatorName",
    header: "Operator",
    cell: ({ row }) => <div>{row.getValue("operatorName")}</div>,
  },
  {
    accessorKey: "captainName",
    header: "Captain",
    cell: ({ row }) => <div>{row.getValue("captainName")}</div>,
  },
  {
    accessorKey: "homePort",
    header: "Home Port",
    cell: ({ row }) => <div>{row.getValue("homePort")}</div>,
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const boat = row.original

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(boat.id)}
            >
              Copy boat ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Pencil className="mr-2 h-4 w-4" />
              Edit boat
            </DropdownMenuItem>
            <DropdownMenuItem className="text-red-600">
              <Trash2 className="mr-2 h-4 w-4" />
              Delete boat
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

interface BoatDataTableProps {
  data?: Boat[]
}

export function BoatDataTable({ data: propData }: BoatDataTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})

  // Fetch from API if no data prop is provided
  const { boats: apiBoats, loading, error } = useBoats()

  // Transform API data to match Boat type
  const transformedData: Boat[] = React.useMemo(() => {
    const sourceData = propData || apiBoats || []
    
    return sourceData.map((boat: any): Boat => ({
      id: String(boat.id),
      boatName: boat.boat_name || boat.boatName || '',
      registrationNumber: boat.registration_number || boat.registrationNumber || '',
      boatType: boat.boat_type || boat.boatType || '',
      capacity: String(boat.capacity || ''),
      operatorName: boat.operator_name || boat.operatorName || '',
      operatorContact: boat.operator_contact || boat.operatorContact || '',
      captainName: boat.captain_name || boat.captainName || '',
      captainLicense: boat.captain_license || boat.captainLicense || '',
      homePort: boat.home_port || boat.homePort || '',
      engineType: boat.engine_type || boat.engineType,
      engineHorsePower: boat.engine_horsepower || boat.engineHorsePower,
      yearBuilt: String(boat.year_built || boat.yearBuilt || ''),
      status: boat.status,
      notes: boat.notes,
    }))
  }, [propData, apiBoats])

  const table = useReactTable({
    data: transformedData,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })

  // Show loading state
  if (!propData && loading) {
    return (
      <div className="w-full space-y-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    )
  }

  // Show error state
  if (!propData && error) {
    return (
      <div className="w-full rounded-md border p-8 text-center">
        <p className="text-destructive">Error loading boats: {error}</p>
      </div>
    )
  }

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter by boat name..."
          value={(table.getColumn("boatName")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("boatName")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <div className="ml-auto text-sm text-muted-foreground">
          {table.getFilteredRowModel().rows.length} boat(s) registered
        </div>
      </div>
      <div className="rounded-md border overflow-x-auto">
        <Table className="w-full">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="hover:bg-transparent">
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} className="text-xs sm:text-sm whitespace-nowrap">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="hover:bg-muted/50 text-xs sm:text-sm"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="py-2 px-2 sm:px-4">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No boats registered yet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          Page {table.getState().pagination.pageIndex + 1} of{" "}
          {table.getPageCount()}
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}
