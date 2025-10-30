"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import * as React from "react"
import { Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const formSchema = z.object({
  boatName: z.string().min(2, {
    message: "Boat name must be at least 2 characters.",
  }),
  registrationNumber: z.string().min(3, {
    message: "Registration number is required.",
  }),
  boatType: z.string().min(1, {
    message: "Please select a boat type.",
  }),
  capacity: z.string().min(1, {
    message: "Capacity is required.",
  }),
  operatorName: z.string().min(2, {
    message: "Operator name must be at least 2 characters.",
  }),
  operatorContact: z.string().min(10, {
    message: "Contact number must be at least 10 digits.",
  }),
  captainName: z.string().min(2, {
    message: "Captain name must be at least 2 characters.",
  }),
  captainLicense: z.string().min(3, {
    message: "Captain license number is required.",
  }),
  homePort: z.string().min(2, {
    message: "Home port is required.",
  }),
  engineType: z.string().optional(),
  engineHorsePower: z.string().optional(),
  yearBuilt: z.string().optional(),
  status: z.string().optional(),
  notes: z.string().optional(),
})

const API_BASE_URL = 'http://127.0.0.1:8000/api'

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

interface BoatFormEditProps {
  boat?: Boat
  onSaveComplete?: () => void
  onCancel?: () => void
}

export function BoatFormEdit({ boat, onSaveComplete, onCancel }: BoatFormEditProps = {}) {
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [submitError, setSubmitError] = React.useState<string | null>(null)
  const [submitSuccess, setSubmitSuccess] = React.useState(false)
  
  const isEditing = !!boat

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: isEditing ? {
      boatName: boat.boat_name,
      registrationNumber: boat.registration_number,
      boatType: boat.boat_type,
      capacity: boat.capacity.toString(),
      operatorName: boat.operator_name,
      operatorContact: boat.operator_contact || "",
      captainName: boat.captain_name,
      captainLicense: boat.captain_license || "",
      homePort: boat.home_port || "",
      engineType: boat.engine_type || "",
      engineHorsePower: boat.engine_horsepower || "",
      yearBuilt: boat.year_built?.toString() || "",
      status: boat.status || "active",
      notes: "",
    } : {
      boatName: "",
      registrationNumber: "",
      boatType: "",
      capacity: "",
      operatorName: "",
      operatorContact: "",
      captainName: "",
      captainLicense: "",
      homePort: "",
      engineType: "",
      engineHorsePower: "",
      yearBuilt: "",
      status: "active",
      notes: "",
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)
    setSubmitError(null)
    setSubmitSuccess(false)
    
    // Transform form data to match backend expectations
    const boatData = {
      boat_name: values.boatName,
      registration_number: values.registrationNumber,
      boat_type: values.boatType,
      capacity: parseInt(values.capacity) || 0,
      operator_name: values.operatorName,
      operator_contact: values.operatorContact || 'N/A',
      captain_name: values.captainName,
      captain_license: values.captainLicense || 'N/A',
      home_port: values.homePort || 'N/A',
      engine_type: values.engineType || 'N/A',
      engine_horsepower: values.engineHorsePower || 'N/A',
      year_built: values.yearBuilt ? parseInt(values.yearBuilt) : new Date().getFullYear(),
      status: values.status || 'active',
    }
    
    const url = isEditing ? `${API_BASE_URL}/boats/${boat.id}` : `${API_BASE_URL}/boats`
    const method = isEditing ? 'PUT' : 'POST'

    fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(boatData),
    })
      .then(async (response) => {
        const data = await response.json()
        
        if (!response.ok) {
          console.error('API Error Response:', data)
          
          if (data.errors || data.messages) {
            const errors = data.errors || data.messages
            const errorMessages = Object.entries(errors)
              .map(([field, messages]) => `${field}: ${(messages as string[]).join(', ')}`)
              .join('\n')
            throw new Error(`Validation failed:\n${errorMessages}`)
          }
          
          throw new Error(data.error || data.message || `Failed to ${isEditing ? 'update' : 'register'} boat`)
        }
        
        setSubmitSuccess(true)
        
        alert(
          `✅ Boat ${isEditing ? 'updated' : 'registered'} successfully!\n\n` +
          `Boat Details:\n` +
          `• Name: ${values.boatName}\n` +
          `• Registration: ${values.registrationNumber}\n` +
          `• Type: ${values.boatType}\n` +
          `• Capacity: ${values.capacity} passengers\n` +
          `• Operator: ${values.operatorName}\n` +
          `• Captain: ${values.captainName}\n\n` +
          `The boat has been ${isEditing ? 'updated in' : 'added to'} the system.`
        )
        
        // Reset form if creating new boat
        if (!isEditing) {
          form.reset({
            boatName: "",
            registrationNumber: "",
            boatType: "",
            capacity: "",
            operatorName: "",
            operatorContact: "",
            captainName: "",
            captainLicense: "",
            homePort: "",
            engineType: "",
            engineHorsePower: "",
            yearBuilt: "",
            status: "active",
            notes: "",
          })
        }
        
        // Call onSaveComplete callback
        if (onSaveComplete) {
          onSaveComplete()
        }
      })
      .catch((error) => {
        console.error(`Error ${isEditing ? 'updating' : 'registering'} boat:`, error)
        setSubmitError(error.message || `Failed to ${isEditing ? 'update' : 'register'} boat. Please try again.`)
        
        alert(
          `❌ Error: Failed to ${isEditing ? 'update' : 'register'} boat\n\n` +
          `${error.message || 'Please check your connection and try again.'}`
        )
      })
      .finally(() => {
        setIsSubmitting(false)
      })
  }

  return (
    <div className="w-full">
      <div className="pb-6">
        <h3 className="text-2xl font-semibold">
          {isEditing ? 'Edit Boat Information' : 'Boat Registration Form'}
        </h3>
        <p className="text-sm text-muted-foreground">
          {isEditing ? 'Update boat information' : 'Register a new boat or update existing boat information.'}
        </p>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Basic Boat Information */}
          <div className="rounded-lg border bg-muted/50 p-4 md:p-5 lg:p-6">
            <h4 className="text-base md:text-lg font-semibold mb-3 md:mb-4">Basic Information</h4>
            <div className="grid gap-3 sm:gap-4 grid-cols-1 lg:grid-cols-2">
              {/* Boat Name */}
              <FormField
                control={form.control}
                name="boatName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Boat Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Ocean Explorer" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Registration Number */}
              <FormField
                control={form.control}
                name="registrationNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Registration Number</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., PH-123456" {...field} disabled={isEditing} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Boat Type */}
              <FormField
                control={form.control}
                name="boatType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Boat Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select boat type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="ferry">Ferry</SelectItem>
                        <SelectItem value="speedboat">Speedboat</SelectItem>
                        <SelectItem value="yacht">Yacht</SelectItem>
                        <SelectItem value="bangka">Bangka</SelectItem>
                        <SelectItem value="motorboat">Motorboat</SelectItem>
                        <SelectItem value="sailboat">Sailboat</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Capacity */}
              <FormField
                control={form.control}
                name="capacity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Passenger Capacity</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="e.g., 20" {...field} />
                    </FormControl>
                    <FormDescription>Maximum number of passengers</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Home Port */}
              <FormField
                control={form.control}
                name="homePort"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Home Port</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Port of Manila" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Status - only show if editing */}
              {isEditing && (
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="maintenance">Maintenance</SelectItem>
                          <SelectItem value="inactive">Inactive</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>
          </div>

          {/* Operator Information */}
          <div className="rounded-lg border bg-muted/50 p-4 md:p-5 lg:p-6">
            <h4 className="text-base md:text-lg font-semibold mb-3 md:mb-4">Operator Information</h4>
            <div className="grid gap-3 sm:gap-4 grid-cols-1 lg:grid-cols-2">
              {/* Operator Name */}
              <FormField
                control={form.control}
                name="operatorName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Operator Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter operator name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Operator Contact */}
              <FormField
                control={form.control}
                name="operatorContact"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Operator Contact Number</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., 09123456789" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Captain Information */}
          <div className="rounded-lg border bg-muted/50 p-4 md:p-5 lg:p-6">
            <h4 className="text-base md:text-lg font-semibold mb-3 md:mb-4">Captain Information</h4>
            <div className="grid gap-3 sm:gap-4 grid-cols-1 lg:grid-cols-2">
              {/* Captain Name */}
              <FormField
                control={form.control}
                name="captainName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Captain Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter captain name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Captain License */}
              <FormField
                control={form.control}
                name="captainLicense"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Captain License Number</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., CPT-12345" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Technical Specifications */}
          <div className="rounded-lg border bg-muted/50 p-4 md:p-5 lg:p-6">
            <h4 className="text-base md:text-lg font-semibold mb-3 md:mb-4">Technical Specifications (Optional)</h4>
            <div className="grid gap-3 sm:gap-4 grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
              {/* Engine Type */}
              <FormField
                control={form.control}
                name="engineType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Engine Type</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Diesel" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Engine Horsepower */}
              <FormField
                control={form.control}
                name="engineHorsePower"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Engine Horsepower</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., 250 HP" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Year Built */}
              <FormField
                control={form.control}
                name="yearBuilt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Year Built</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="e.g., 2020" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Error and Success Messages */}
          {submitError && (
            <div className="p-4 bg-destructive/10 border border-destructive rounded-lg">
              <p className="text-sm text-destructive font-medium">❌ {submitError}</p>
            </div>
          )}
          
          {submitSuccess && (
            <div className="p-4 bg-green-50 border border-green-500 rounded-lg">
              <p className="text-sm text-green-700 font-medium">✅ Boat {isEditing ? 'updated' : 'registered'} successfully!</p>
            </div>
          )}

          <div className="flex gap-4">
            <Button type="submit" className="flex-1" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isSubmitting ? (isEditing ? 'Updating...' : 'Registering...') : (isEditing ? 'Update Boat' : 'Register Boat')}
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              className="flex-1" 
              onClick={() => {
                if (isEditing && onCancel) {
                  onCancel()
                } else {
                  form.reset()
                  setSubmitError(null)
                  setSubmitSuccess(false)
                }
              }}
              disabled={isSubmitting}
            >
              {isEditing ? 'Cancel' : 'Reset Form'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
