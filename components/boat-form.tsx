"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

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
  notes: z.string().optional(),
})

export function BoatForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
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
      notes: "",
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values)
    alert("Boat registered successfully! Check console for details.")
  }

  return (
    <div className="w-full">
      <div className="pb-6">
        <h3 className="text-2xl font-semibold">Boat Registration Form</h3>
        <p className="text-sm text-muted-foreground">
          Register a new boat or update existing boat information.
        </p>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Basic Boat Information */}
          <div className="rounded-lg border bg-muted/50 p-6">
            <h4 className="text-lg font-semibold mb-4">Basic Information</h4>
            <div className="grid gap-4 md:grid-cols-2">
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
                      <Input placeholder="e.g., PH-123456" {...field} />
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
            </div>
          </div>

          {/* Operator Information */}
          <div className="rounded-lg border bg-muted/50 p-6">
            <h4 className="text-lg font-semibold mb-4">Operator Information</h4>
            <div className="grid gap-4 md:grid-cols-2">
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
          <div className="rounded-lg border bg-muted/50 p-6">
            <h4 className="text-lg font-semibold mb-4">Captain Information</h4>
            <div className="grid gap-4 md:grid-cols-2">
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
          <div className="rounded-lg border bg-muted/50 p-6">
            <h4 className="text-lg font-semibold mb-4">Technical Specifications (Optional)</h4>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
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

          {/* Additional Notes */}
          <div className="rounded-lg border bg-muted/50 p-6">
            <h4 className="text-lg font-semibold mb-4">Additional Notes</h4>
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter any additional information about the boat..."
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Include any relevant details about the boat's condition, special features, or restrictions
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex gap-4">
            <Button type="submit" className="flex-1">
              Register Boat
            </Button>
            <Button type="button" variant="outline" className="flex-1" onClick={() => form.reset()}>
              Reset Form
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
