"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, useFieldArray } from "react-hook-form"
import * as z from "zod"
import { Plus, Trash2, CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { DateTimePicker } from "@/components/ui/date-time-picker"

const touristEntrySchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    age: z.string().min(1, "Age is required"),
    nationality: z.string().min(1, "Required"),
    origin: z.string().min(1, "Required"),
    isForeign: z.boolean(),
    gender: z.string().min(1, "Required"),
    purpose: z.string().min(1, "Required"),
    transport: z.string().min(1, "Required"),
    lengthOfStay: z.string().min(1, "Required"),
    isOvernight: z.boolean(),
})

const formSchema = z.object({
    visitDate: z.date({
        message: "Please select a visit date",
    }),
    visitTime: z.string().min(1, "Visit time is required"),
    boatName: z.string().min(1, "Boat name is required"),
    boatOperator: z.string().min(1, "Boat operator is required"),
    boatCaptain: z.string().min(1, "Boat captain is required"),
    boatCrew: z.string().min(1, "Boat crew name is required"),
    touristEntries: z.array(touristEntrySchema).min(1, "At least 1 tourist required").max(10, "Maximum 10 tourists per boat"),
})

export function TourismForm() {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            visitDate: new Date(),
            visitTime: "",
            boatName: "",
            boatOperator: "",
            boatCaptain: "",
            boatCrew: "",
            touristEntries: [
                {
                    name: "",
                    age: "",
                    nationality: "",
                    origin: "",
                    isForeign: false,
                    gender: "",
                    purpose: "",
                    transport: "",
                    lengthOfStay: "",
                    isOvernight: false,
                },
            ],
        },
    })
    
    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "touristEntries",
    })
    
    const addTouristEntry = () => {
        if (fields.length < 10) {
            append({
                name: "",
                age: "",
                nationality: "",
                origin: "",
                isForeign: false,
                gender: "",
                purpose: "",
                transport: "",
                lengthOfStay: "",
                isOvernight: false,
            })
        }
    }
    
    function onSubmit(values: z.infer<typeof formSchema>) {
        console.log(values)
        alert(`Tourism data submitted successfully!\nTotal tourists recorded: ${values.touristEntries.length}\nCheck console for details.`)
    }
    
    return (
        <div className="w-full">
        <div className="pb-6">
        <h3 className="text-2xl font-semibold">Tourism Data Entry (Boat Transaction)</h3>
        <p className="text-sm text-muted-foreground">
        Record tourist information for boat trips. Add 1-10 tourists per transaction.
        </p>
        </div>
        <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        
        {/* Visit Date and Boat Information */}
        <div className="rounded-lg border bg-muted/50 p-6">
        <h4 className="text-lg font-semibold mb-4">Visit Date & Boat Information</h4>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Visit Date */}
        <FormField
        control={form.control}
        name="visitDate"
        render={({ field }) => (
            <FormItem className="flex flex-col">
            <FormLabel>Date of Visit</FormLabel>
            <FormControl>
                <DateTimePicker
                date={field.value}
                onDateChange={field.onChange}
                />
            </FormControl>
            <FormMessage />
            </FormItem>
        )}
        />
        
        {/* Visit Time */}
        <FormField
        control={form.control}
        name="visitTime"
        render={({ field }) => (
            <FormItem>
            <FormLabel>Time of Visit</FormLabel>
            <FormControl>
                <Input type="time" {...field} />
            </FormControl>
            <FormMessage />
            </FormItem>
        )}
        />
        
        {/* Boat Name */}
        <FormField
        control={form.control}
        name="boatName"
        render={({ field }) => (
            <FormItem>
            <FormLabel>Boat Name</FormLabel>
            <FormControl>
                <Input placeholder="Enter boat name" {...field} />
            </FormControl>
            <FormMessage />
            </FormItem>
        )}
        />
        
        {/* Boat Operator */}
        <FormField
        control={form.control}
        name="boatOperator"
        render={({ field }) => (
            <FormItem>
            <FormLabel>Boat Operator</FormLabel>
            <FormControl>
                <Input placeholder="Enter operator name" {...field} />
            </FormControl>
            <FormMessage />
            </FormItem>
        )}
        />
        
        {/* Boat Captain */}
        <FormField
        control={form.control}
        name="boatCaptain"
        render={({ field }) => (
            <FormItem>
            <FormLabel>Boat Captain</FormLabel>
            <FormControl>
                <Input placeholder="Enter captain name" {...field} />
            </FormControl>
            <FormMessage />
            </FormItem>
        )}
        />
        
        {/* Boat Crew */}
        <FormField
        control={form.control}
        name="boatCrew"
        render={({ field }) => (
            <FormItem>
            <FormLabel>Boat Crew</FormLabel>
            <FormControl>
                <Input placeholder="Enter crew name(s)" {...field} />
            </FormControl>
            <FormMessage />
            </FormItem>
        )}
        />
        </div>
        </div>
        
        {/* Tourist Entries */}
        <div className="space-y-4">
        <div>
        <h4 className="text-lg font-semibold">Tourist Entries ({fields.length}/10)</h4>
        <p className="text-sm text-muted-foreground">
        Add tourists who traveled together on the same boat
        </p>
        </div>
        
        {fields.map((field, index) => (
            <div key={field.id} className="rounded-lg border bg-card p-6 space-y-4">
            <div className="flex items-center justify-between mb-4">
            <h5 className="font-semibold">Tourist #{index + 1}</h5>
            {fields.length > 1 && (
                <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => remove(index)}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                <Trash2 className="h-4 w-4 mr-2" />
                Remove
                </Button>
            )}
            </div>
            
            <div className="grid gap-4 md:grid-cols-2">
            {/* Column 1: Name, Age, Gender, Foreign?, Nationality */}
            <div className="space-y-4">
            {/* Name */}
            <FormField
            control={form.control}
            name={`touristEntries.${index}.name`}
            render={({ field }) => (
                <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                <Input placeholder="e.g., John Doe" {...field} />
                </FormControl>
                <FormDescription className="h-5">&nbsp;</FormDescription>
                <FormMessage />
                </FormItem>
            )}
            />
            
            {/* Age */}
            <FormField
            control={form.control}
            name={`touristEntries.${index}.age`}
            render={({ field }) => (
                <FormItem>
                <FormLabel>Age</FormLabel>
                <FormControl>
                <Input type="number" placeholder="e.g., 25" {...field} />
                </FormControl>
                <FormDescription className="h-5">&nbsp;</FormDescription>
                <FormMessage />
                </FormItem>
            )}
            />
            {/* Gender */}
            <FormField
            control={form.control}
            name={`touristEntries.${index}.gender`}
            render={({ field }) => (
                <FormItem>
                <FormLabel>Gender</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                <SelectTrigger>
                <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                </FormControl>
                <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
                </SelectContent>
                </Select>
                <FormDescription className="h-5">&nbsp;</FormDescription>
                <FormMessage />
                </FormItem>
            )}
            />
            
            {/* Foreign/Domestic */}
            <FormField
            control={form.control}
            name={`touristEntries.${index}.isForeign`}
            render={({ field }) => (
                <FormItem>
                <FormLabel>Foreign Tourist</FormLabel>
                <FormControl>
                <div className="flex items-center space-x-2 h-10 rounded-md border px-3">
                <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
                />
                <span className="text-sm text-muted-foreground">Check if international visitor</span>
                </div>
                </FormControl>
                <FormDescription className="h-5">&nbsp;</FormDescription>
                <FormMessage />
                </FormItem>
            )}
            />
            
            {/* Nationality/Country */}
            <FormField
            control={form.control}
            name={`touristEntries.${index}.nationality`}
            render={({ field }) => (
                <FormItem>
                <FormLabel>Nationality/Country</FormLabel>
                <FormControl>
                <Input placeholder="e.g., Korea, USA, Philippines" {...field} />
                </FormControl>
                <FormDescription className="h-5">&nbsp;</FormDescription>
                <FormMessage />
                </FormItem>
            )}
            />
            
            </div>
            
            {/* Column 2: Origin, Purpose, Mode, Overnight, Length of Days */}
            <div className="space-y-4">
            {/* Origin (City/Region) */}
            <FormField
            control={form.control}
            name={`touristEntries.${index}.origin`}
            render={({ field }) => (
                <FormItem>
                <FormLabel>Origin (City/Region)</FormLabel>
                <FormControl>
                <Input placeholder="e.g., Seoul, Manila, Tokyo" {...field} />
                </FormControl>
                <FormDescription className="h-5">&nbsp;</FormDescription>
                <FormMessage />
                </FormItem>
            )}
            />
            
            {/* Purpose */}
            <FormField
            control={form.control}
            name={`touristEntries.${index}.purpose`}
            render={({ field }) => (
                <FormItem>
                <FormLabel>Purpose of Visit</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                <SelectTrigger>
                <SelectValue placeholder="Select purpose" />
                </SelectTrigger>
                </FormControl>
                <SelectContent>
                <SelectItem value="leisure">Leisure</SelectItem>
                <SelectItem value="business">Business</SelectItem>
                <SelectItem value="education">Education</SelectItem>
                <SelectItem value="official">Official</SelectItem>
                <SelectItem value="others">Others</SelectItem>
                </SelectContent>
                </Select>
                <FormDescription className="h-5">&nbsp;</FormDescription>
                <FormMessage />
                </FormItem>
            )}
            />
            
            {/* Transport */}
            <FormField
            control={form.control}
            name={`touristEntries.${index}.transport`}
            render={({ field }) => (
                <FormItem>
                <FormLabel>Mode of Transport</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                <SelectTrigger>
                <SelectValue placeholder="Select transport" />
                </SelectTrigger>
                </FormControl>
                <SelectContent>
                <SelectItem value="land">Land</SelectItem>
                <SelectItem value="air">Air</SelectItem>
                <SelectItem value="sea">Sea</SelectItem>
                </SelectContent>
                </Select>
                <FormDescription className="h-5">&nbsp;</FormDescription>
                <FormMessage />
                </FormItem>
            )}
            />
            {/* Overnight */}
            <FormField
            control={form.control}
            name={`touristEntries.${index}.isOvernight`}
            render={({ field }) => (
                <FormItem>
                <FormLabel>Overnight Stay</FormLabel>
                <FormControl>
                <div className="flex items-center space-x-2 h-10 rounded-md border px-3">
                <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
                />
                <span className="text-sm text-muted-foreground">At least one night</span>
                </div>
                </FormControl>
                <FormDescription className="h-5">&nbsp;</FormDescription>
                <FormMessage />
                </FormItem>
            )}
            />
            {/* Length of Stay */}
            <FormField
            control={form.control}
            name={`touristEntries.${index}.lengthOfStay`}
            render={({ field }) => (
                <FormItem>
                <FormLabel>Length of Stay (days)</FormLabel>
                <FormControl>
                <Input type="number" step="0.5" placeholder="0" {...field} />
                </FormControl>
                <FormDescription className="h-5">Number of days</FormDescription>
                <FormMessage />
                </FormItem>
            )}
            />
            
            
            </div>
            </div>
            </div>
        ))}
        </div>
        
        {/* Submit Buttons */}
        <div className="flex flex-col sm:flex-row justify-between gap-4 pt-4">
        <div className="flex gap-2">
        <Button type="submit" className="bg-green-600 hover:bg-green-700">
        Submit Boat Transaction
        </Button>
        <Button
        type="button"
        variant="outline"
        onClick={() => form.reset()}
        >
        Reset Form
        </Button>
        </div>
        <Button
        type="button"
        variant="outline"
        onClick={addTouristEntry}
        disabled={fields.length >= 10}
        className="gap-2"
        >
        <Plus className="h-4 w-4" />
        Add Tourist ({fields.length}/10)
        </Button>
        </div>
        </form>
        </Form>
        </div>
    )
}
