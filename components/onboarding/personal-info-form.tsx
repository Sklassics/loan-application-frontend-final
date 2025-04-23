"use client"
import { motion } from "framer-motion"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { format, differenceInYears } from "date-fns"
import { User, Users, CalendarDays, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useState } from "react"

// Custom validator for age (must be 18+)
const validateAge = (date: Date) => {
  const age = differenceInYears(new Date(), date)
  return age >= 18
}

const formSchema = z.object({
  firstName: z.string().min(2, {
    message: "First name must be at least 2 characters.",
  }),
  lastName: z.string().min(2, {
    message: "Last name must be at least 2 characters.",
  }),
  dateOfBirth: z
    .date({
      required_error: "Please select a date of birth.",
    })
    .refine(validateAge, {
      message: "You must be at least 18 years old.",
    }),
  gender: z.string({
    required_error: "Please select a gender.",
  }),
  maritalStatus: z.string({
    required_error: "Please select a marital status.",
  }),
  fatherName: z.string().min(2, {
    message: "Father's name must be at least 2 characters.",
  }),
})

type PersonalInfoFormProps = {
  onSubmit: (data: z.infer<typeof formSchema>) => void
  initialData?: z.infer<typeof formSchema>
}

export default function PersonalInfoForm({ onSubmit, initialData }: PersonalInfoFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      firstName: "",
      lastName: "",
      fatherName: "",
    },
  })

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 300, damping: 24 },
    },
  }

  function handleSubmit(values: z.infer<typeof formSchema>) {
    onSubmit(values)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        <motion.div variants={itemVariants} className="space-y-2">
          <h2 className="text-2xl font-semibold tracking-tight">Personal Information</h2>
          <p className="text-sm text-muted-foreground">Please provide your basic personal details to get started.</p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2">
          <motion.div variants={itemVariants}>
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem className="relative">
                  <FormLabel
                    className={cn(
                      "absolute top-2 left-3 z-10 origin-[0] -translate-y-4 scale-75 transform bg-white dark:bg-gray-800 px-2 text-gray-500 duration-300",
                      field.value ? "opacity-100" : "opacity-0",
                    )}
                  >
                    First Name
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        placeholder="First Name"
                        {...field}
                        className="h-14 pl-10 transition-all duration-300 border-gray-300 dark:border-gray-600 focus:border-indigo-500 dark:focus:border-indigo-400"
                        onFocus={(e) => {
                          e.target.parentElement?.parentElement?.querySelector("label")?.classList.add("opacity-100")
                        }}
                        onBlur={(e) => {
                          if (!e.target.value) {
                            e.target.parentElement?.parentElement
                              ?.querySelector("label")
                              ?.classList.remove("opacity-100")
                          }
                        }}
                      />
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    </div>
                  </FormControl>
                  <FormMessage className="animate-slideDown" />
                </FormItem>
              )}
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem className="relative">
                  <FormLabel
                    className={cn(
                      "absolute top-2 left-3 z-10 origin-[0] -translate-y-4 scale-75 transform bg-white dark:bg-gray-800 px-2 text-gray-500 duration-300",
                      field.value ? "opacity-100" : "opacity-0",
                    )}
                  >
                    Last Name
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        placeholder="Last Name"
                        {...field}
                        className="h-14 pl-10 transition-all duration-300 border-gray-300 dark:border-gray-600 focus:border-indigo-500 dark:focus:border-indigo-400"
                        onFocus={(e) => {
                          e.target.parentElement?.parentElement?.querySelector("label")?.classList.add("opacity-100")
                        }}
                        onBlur={(e) => {
                          if (!e.target.value) {
                            e.target.parentElement?.parentElement
                              ?.querySelector("label")
                              ?.classList.remove("opacity-100")
                          }
                        }}
                      />
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    </div>
                  </FormControl>
                  <FormMessage className="animate-slideDown" />
                </FormItem>
              )}
            />
          </motion.div>
        </div>


        <motion.div variants={itemVariants}>
          <FormField
            control={form.control}
            name="dateOfBirth"
            render={({ field }) => {
              const [isPopoverOpen, setIsPopoverOpen] = useState(false); // State to control Popover

              return (
                <FormItem className="flex flex-col">
                  <FormLabel>Date of Birth</FormLabel>
                  <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <button
                          className={cn(
                            "relative h-14 pl-10 w-full justify-start text-left font-normal border rounded-md border-gray-300",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 h-6 w-6 text-gray-400" />
                          {field.value ? format(field.value, "PPP") : <span className="text-sm">Select your date of birth</span>}
                        </button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        selected={field.value}
                        onSelect={(date) => {
                          field.onChange(date); // Update the form field
                          setIsPopoverOpen(false); // Close the Popover
                        }}
                        disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage className="animate-slideDown" />
                </FormItem>
              );
            }}
          />
        </motion.div>

        <motion.div variants={itemVariants}>
          <FormField
            control={form.control}
            name="gender"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Gender</FormLabel>
                <div className="relative">
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col sm:flex-row gap-4 pt-2"
                    >
                      {["Male", "Female", "Other"].map((gender) => (
                        <div key={gender} className="flex items-center space-x-2">
                          <RadioGroupItem
                            value={gender.toLowerCase()}
                            id={`gender-${gender.toLowerCase()}`}
                            className="border-2 border-gray-300 dark:border-gray-600 text-indigo-600"
                          />
                          <Label htmlFor={`gender-${gender.toLowerCase()}`} className="font-medium cursor-pointer">
                            {gender}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </FormControl>
                </div>
                <FormMessage className="animate-slideDown" />
              </FormItem>
            )}
          />
        </motion.div>

        <motion.div variants={itemVariants}>
          <FormField
            control={form.control}
            name="maritalStatus"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Marital Status</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="h-14 pl-10 border-gray-300 dark:border-gray-600 focus:border-indigo-500 dark:focus:border-indigo-400 relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <SelectValue placeholder="Select your marital status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="single">Single</SelectItem>
                    <SelectItem value="married">Married</SelectItem>
                    <SelectItem value="divorced">Divorced</SelectItem>
                    <SelectItem value="widowed">Widowed</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage className="animate-slideDown" />
              </FormItem>
            )}
          />
        </motion.div>
        <motion.div variants={itemVariants}>
          <FormField
            control={form.control}
            name="fatherName"
            render={({ field }) => (
              <FormItem className="relative">
                <FormLabel
                  className={cn(
                    "absolute top-2 left-3 z-10 origin-[0] -translate-y-4 scale-75 transform bg-white dark:bg-gray-800 px-2 text-gray-500 duration-300",
                    field.value ? "opacity-100" : "opacity-0",
                  )}
                >
                  Father's Name
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      placeholder="Father's Name"
                      {...field}
                      className="h-14 pl-10 transition-all duration-300 border-gray-300 dark:border-gray-600 focus:border-indigo-500 dark:focus:border-indigo-400"
                      onFocus={(e) => {
                        e.target.parentElement?.parentElement?.querySelector("label")?.classList.add("opacity-100")
                      }}
                      onBlur={(e) => {
                        if (!e.target.value) {
                          e.target.parentElement?.parentElement?.querySelector("label")?.classList.remove("opacity-100")
                        }
                      }}
                    />
                    <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  </div>
                </FormControl>
                <FormMessage className="animate-slideDown" />
              </FormItem>
            )}
          />
        </motion.div>

        <motion.div variants={itemVariants} className="flex justify-end">
  <Button
    type="submit"
    disabled={form.formState.isSubmitting} // Disable button while submitting
    className="bg-gradient-to-r from-violet-150 to-violet-150 text-white px-8 py-6 rounded-lg text-lg font-medium shadow-md hover:shadow-lg transition-all duration-200"
  >
    {form.formState.isSubmitting ? (
      <>
        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
        Processing...
      </>
    ) : (
      "Continue"
    )}
  </Button>
</motion.div>
      </form>
    </Form>
  )
}

