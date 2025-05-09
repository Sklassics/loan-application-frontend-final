"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Home, MapPin, Phone } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

const formSchema = z.object({
  address: z.string().min(5, {
    message: "Address must be at least 5 characters.",
  }),
  city: z.string().min(2, {
    message: "City must be at least 2 characters.",
  }),
  state: z.string().min(2, {
    message: "State must be at least 2 characters.",
  }),
  pincode: z.string().regex(/^\d{6}$/, {
    message: "Pincode must be 6 digits.",
  }),
  alternatePhone: z
    .string()
    .regex(/^\d{10}$/, {
      message: "Phone number must be 10 digits.",
    })
    .optional(),
    
})

type AddressFormProps = {
  onSubmit: (data: z.infer<typeof formSchema>) => void
  onBack: () => void
  initialData?: z.infer<typeof formSchema> | null
}

export default function AddressForm({ onSubmit, onBack, initialData }: AddressFormProps) {
  const [addressSuggestions, setAddressSuggestions] = useState<string[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      address: "",
      city: "",
      state: "",
      pincode: "",
      alternatePhone: "",
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

  // Mock address suggestions
  const mockAddressSuggestions = [
    "123 Main St, Bangalore",
    "456 Park Avenue, Mumbai",
    "789 Lake View, Delhi",
    "101 Mountain Road, Chennai",
  ]

  const handleAddressChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value
    form.setValue("address", value)

    if (value.length > 3) {
      // Filter suggestions based on input
      const filtered = mockAddressSuggestions.filter((addr) => addr.toLowerCase().includes(value.toLowerCase()))
      setAddressSuggestions(filtered)
      setShowSuggestions(filtered.length > 0)
    } else {
      setShowSuggestions(false)
    }
  }

  const selectSuggestion = (suggestion: string) => {
    form.setValue("address", suggestion)
    setShowSuggestions(false)

    // Extract city and state from suggestion (mock implementation)
    const parts = suggestion.split(", ")
    if (parts.length > 1) {
      form.setValue("city", parts[1])
    }
  }

  // function handleSubmit(values: z.infer<typeof formSchema>) {
  //   onSubmit(values)
  // }
  function handleSubmit(values: z.infer<typeof formSchema>) {
    const updatedValues = {
      ...values,
      alternatePhone: values.alternatePhone ? `+91${values.alternatePhone}` : undefined,
    }
    onSubmit(updatedValues)
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        <motion.div variants={itemVariants} className="space-y-2">
          <h2 className="text-2xl font-semibold tracking-tight">Address Information</h2>
          <p className="text-sm text-muted-foreground">Please provide your current residential address details.</p>
        </motion.div>

        <motion.div variants={itemVariants}>
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem className="relative">
                <FormLabel>Address</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Textarea
                      placeholder="Enter your full address"
                      className="min-h-[100px] pl-10 pt-3 resize-none border-gray-300 dark:border-gray-600 focus:border-indigo-500 dark:focus:border-indigo-400"
                      {...field}
                      onChange={handleAddressChange}
                    />
                    <Home className="absolute left-3 top-4 h-5 w-5 text-gray-400" />

                    {/* Address suggestions dropdown */}
                    {showSuggestions && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute z-10 w-full bg-white dark:bg-gray-800 mt-1 rounded-md shadow-lg border border-gray-200 dark:border-gray-700"
                      >
                        {addressSuggestions.map((suggestion, index) => (
                          <div
                            key={index}
                            className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer flex items-center"
                            onClick={() => selectSuggestion(suggestion)}
                          >
                            <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                            {suggestion}
                          </div>
                        ))}
                      </motion.div>
                    )}
                  </div>
                </FormControl>
                <FormMessage className="animate-slideDown" />
              </FormItem>
            )}
          />
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2">
          <motion.div variants={itemVariants}>
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem className="relative">
                  <FormLabel
                    className={cn(
                      "absolute top-2 left-3 z-10 origin-[0] -translate-y-4 scale-75 transform bg-white dark:bg-gray-800 px-2 text-gray-500 duration-300",
                      field.value ? "opacity-100" : "opacity-0",
                    )}
                  >
                    City
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        placeholder="City"
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
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
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
              name="state"
              render={({ field }) => (
                <FormItem className="relative">
                  <FormLabel
                    className={cn(
                      "absolute top-2 left-3 z-10 origin-[0] -translate-y-4 scale-75 transform bg-white dark:bg-gray-800 px-2 text-gray-500 duration-300",
                      field.value ? "opacity-100" : "opacity-0",
                    )}
                  >
                    State
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        placeholder="State"
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
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    </div>
                  </FormControl>
                  <FormMessage className="animate-slideDown" />
                </FormItem>
              )}
            />
          </motion.div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <motion.div variants={itemVariants}>
            <FormField
              control={form.control}
              name="pincode"
              render={({ field }) => (
                <FormItem className="relative">
                  <FormLabel
                    className={cn(
                      "absolute top-2 left-3 z-10 origin-[0] -translate-y-4 scale-75 transform bg-white dark:bg-gray-800 px-2 text-gray-500 duration-300",
                      field.value ? "opacity-100" : "opacity-0",
                    )}
                  >
                    Pincode
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        placeholder="Pincode"
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
                        maxLength={6}
                      />
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
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
              name="alternatePhone"
              render={({ field }) => (
                <FormItem className="relative">
                  <FormLabel
                    className={cn(
                      "absolute top-2 left-3 z-10 origin-[0] -translate-y-4 scale-75 transform bg-white dark:bg-gray-800 px-2 text-gray-500 duration-300",
                      field.value ? "opacity-100" : "opacity-0",
                    )}
                  >
                    Alternate Phone Number
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        placeholder="Alternate Phone Number (Optional)"
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
                        maxLength={10}
                      />
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    </div>
                  </FormControl>
                  <FormMessage className="animate-slideDown" />
                </FormItem>
              )}
            />
          </motion.div>
          <p className=" text-red-500 text-sm">*Alternate number and registerd mobile number should not be the same </p>
        </div>

        <motion.div variants={itemVariants} className="flex justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={onBack}
            className="border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            Back
          </Button>
          <Button
            type="submit"
            className="bg-gradient-to-r from-violet-150 to-violet-150  text-white px-8 py-6 rounded-lg text-lg font-medium shadow-md hover:shadow-lg transition-all duration-200"
          >
            Continue
          </Button>
        </motion.div>
      </form>
    </Form>
  )
}

