"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Briefcase, Building2, CreditCard, ChevronDown, ChevronUp, GraduationCap } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
const formSchema = z.object({
  employmentType: z.string().min(1, { message: "Please select an employment type." }),
  annualIncome: z.string().min(1, { message: "Please enter your annual income." }),
  companyName: z.string().min(2, { message: "Company name must be at least 2 characters." }).optional(),
  employmentId: z.string().optional(),
  companyAddress: z.string().min(5, { message: "Company address must be at least 5 characters." }).optional(),
  employeeIdCard: z.any().optional(),
  collegeName: z.string().min(2, { message: "College name must be at least 2 characters." }).optional(),
  collegeId: z.string().optional(),
  collegeAddress: z.string().min(5, { message: "College address must be at least 5 characters." }).optional(),
  studentIdCard: z.any().optional(),
});

type EmploymentFormProps = {
  onSubmit: (data: z.infer<typeof formSchema>) => void;
  onBack: () => void;
  initialData?: z.infer<typeof formSchema> | null;
};

export default function EmploymentForm({ onSubmit, onBack, initialData }: EmploymentFormProps) {
  const [formProgress, setFormProgress] = useState(0);
  const [showCompanyAddress, setShowCompanyAddress] = useState(false);
  const [showCollegeAddress, setShowCollegeAddress] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      employmentType: "",
      annualIncome: "",
      companyName: "",
      employmentId: "",
      companyAddress: "",
      collegeName: "",
      collegeId: "",
      collegeAddress: "",
    },
  });

  const employmentType = form.watch("employmentType");

  // Update progress bar based on form completion
  const updateProgress = () => {
    const values = form.getValues();
    const fields = Object.keys(formSchema.shape);
    const filledFields = fields.filter((field) => {
      const value = values[field as keyof typeof values];
      return value !== undefined && value.length > 0;
    });

    setFormProgress((filledFields.length / fields.length) * 100);
  };

  // Watch for changes to update progress
  form.watch(() => updateProgress());

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 300, damping: 24 },
    },
  };

  function handleSubmit(values: z.infer<typeof formSchema>) {
    onSubmit(values);
  }

  return (
   

    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
      <motion.div variants={itemVariants} className="space-y-2">
      <h2 className="text-2xl font-semibold tracking-tight">Employment Information</h2>
      <p className="text-sm text-muted-foreground">Please provide details about your current employment.</p>
      </motion.div>

      <motion.div variants={itemVariants} className="mb-8">
          <Progress value={formProgress} className="h-2 bg-gray-200 dark:bg-gray-700" />
        </motion.div>

        {/* Employment Type Selection */}
        <motion.div variants={itemVariants}>
          <FormField
            control={form.control}
            name="employmentType"
            render={({ field }) => (
              <FormItem className="relative">
                <FormLabel className={cn(
                        "absolute top-2 left-3 z-10 origin-[0] -translate-y-4 scale-75 transform bg-white dark:bg-gray-800 px-2 text-gray-500 duration-300",
                        field.value ? "opacity-100" : "opacity-0",
                      )}>Employment Type</FormLabel>
                <Select
                  onValueChange={(value) => {
                    field.onChange(value)
                    // Show/hide employment ID based on selection
                    form.setValue("employmentId", "")
                  }}
                >
                  <FormControl>
                    <SelectTrigger className="h-14 pl-10 border-gray-300 dark:border-gray-600 focus:border-indigo-500 dark:focus:border-indigo-400">
                      <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <SelectValue placeholder="Select your employment type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="salaried">Salaried</SelectItem>
                    <SelectItem value="self-employed">Self-Employed</SelectItem>
                    <SelectItem value="business-owner">Business Owner</SelectItem>
                    <SelectItem value="student">Student</SelectItem>
                    <SelectItem value="unemployed">Unemployed</SelectItem>
                    <SelectItem value="retired">Retired</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage className="animate-slideDown" />
              </FormItem>
            )}
          />
        </motion.div>

        {/* Common Field: Annual Income (Hidden for "Unemployed") */}
        {employmentType !== "unemployed" && (
          <motion.div variants={itemVariants}>
          <FormField
            control={form.control}
            name="annualIncome"
            render={({ field }) => (
              <FormItem className="relative">
                <FormLabel
                  className={cn(
                    "absolute top-2 left-3 z-10 origin-[0] -translate-y-4 scale-75 transform bg-white dark:bg-gray-800 px-2 text-gray-500 duration-300",
                    field.value ? "opacity-100" : "opacity-0",
                  )}
                >
                  Annual Income (₹)
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      placeholder="Annual Income (₹)"
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
                    <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  </div>
                </FormControl>
                <FormMessage className="animate-slideDown" />
              </FormItem>
            )}
          />
        </motion.div>
        )}

        {/* Employment Fields */}
        {["salaried", "self-employed", "business-owner"].includes(employmentType) && (
          <>
            <motion.div
              variants={itemVariants}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <FormField
                control={form.control}
                name="companyName"
                render={({ field }) => (
                  <FormItem className="relative">
                    <FormLabel  className={cn(
                        "absolute top-2 left-3 z-10 origin-[0] -translate-y-4 scale-75 transform bg-white dark:bg-gray-800 px-2 text-gray-500 duration-300",
                        field.value ? "opacity-100" : "opacity-0",
                      )}>Company Name</FormLabel>
                    <FormControl>
                    <div className="relative">
                    <Input
                          placeholder="Conmpany Name"
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
                       <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                       </div>
                      </FormControl>
                      <FormMessage className="animate-slideDown" />
                      </FormItem>
                )}
              />
            </motion.div>

            <motion.div
              variants={itemVariants}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <FormField
                control={form.control}
                name="employmentId"
                render={({ field }) => (
                  <FormItem className="relative">
                    <FormLabel
                      className={cn(
                        "absolute top-2 left-3 z-10 origin-[0] -translate-y-4 scale-75 transform bg-white dark:bg-gray-800 px-2 text-gray-500 duration-300",
                        field.value ? "opacity-100" : "opacity-0",
                      )}
                    >
                      Employment ID
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          placeholder="Employment ID (if applicable)"
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
                        <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                      </div>
                    </FormControl>
                    <FormMessage className="animate-slideDown" />
                  </FormItem>
                )}
              />
            </motion.div>
              <motion.div
                      variants={itemVariants}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      {/* Employee ID Card Upload */}
                      <FormField
                        control={form.control}
                        name="employeeIdCard"
                        render={({ field }) => (
                      <FormItem className="relative">
                    <FormLabel
                      className={cn(
                        "absolute top-2 left-3 z-10 origin-[0] -translate-y-4 scale-75 transform bg-white dark:bg-gray-800 px-2 text-gray-500 duration-300",
                        field.value ? "opacity-100" : "opacity-0",
                      )}
                    >
                      Employment ID Card
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                            <Input
                            type="file"
                            accept="image/*"
                            placeholder="Employment ID Card"
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
                      </div>
                    </FormControl>
                    <FormMessage className="animate-slideDown" />
                  </FormItem>
                )}
              />
            </motion.div>


            <motion.div variants={itemVariants}>
              <div className=" dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
                <div
                  onClick={() => setShowCompanyAddress(!showCompanyAddress)}
                >
                  <h3 className="font-medium">Company Address</h3>
                    {showCompanyAddress }
                </div>

                <motion.div
                  
                >
                  <div className="p-4 pt-0">
                    <FormField
                      control={form.control}
                      name="companyAddress"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Textarea
                              placeholder="Enter company address"
                              className="min-h-[100px] resize-none border-gray-300 dark:border-gray-600 focus:border-indigo-500 dark:focus:border-indigo-400"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage className="animate-slideDown" />
                        </FormItem>
                      )}
                    />
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </>
        )}

        {/* Student Fields */}
        {employmentType === "student" && (
          <>
                     <motion.div
              variants={itemVariants}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <FormField
                control={form.control}
                name="collegeName"
                render={({ field }) => (
                  <FormItem className="relative">
                    <FormLabel  className={cn(
                        "absolute top-2 left-3 z-10 origin-[0] -translate-y-4 scale-75 transform bg-white dark:bg-gray-800 px-2 text-gray-500 duration-300",
                        field.value ? "opacity-100" : "opacity-0",
                      )}>College Name</FormLabel>
                    <FormControl>
                    <div className="relative">
                    <Input
                          placeholder="College Name"
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
                       <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                       </div>
                      </FormControl>
                      <FormMessage className="animate-slideDown" />
                      </FormItem>
                )}
              />
            </motion.div>

            <motion.div
              variants={itemVariants}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <FormField
                control={form.control}
                name="collegeId"
                render={({ field }) => (
                  <FormItem className="relative">
                    <FormLabel  className={cn(
                        "absolute top-2 left-3 z-10 origin-[0] -translate-y-4 scale-75 transform bg-white dark:bg-gray-800 px-2 text-gray-500 duration-300",
                        field.value ? "opacity-100" : "opacity-0",
                      )}>Collge ID</FormLabel>
                    <FormControl>
                    <div className="relative">
                    <Input
                          placeholder="College Id"
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
                       <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                       </div>
                      </FormControl>
                      <FormMessage className="animate-slideDown" />
                      </FormItem>
                )}
              />
            </motion.div>
            <motion.div
                      variants={itemVariants}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      {/* Stundent ID Card Upload */}
                      <FormField
                        control={form.control}
                        name="studentIdCard"
                        render={({ field }) => (
                      <FormItem className="relative">
                    <FormLabel
                      className={cn(
                        "absolute top-2 left-3 z-10 origin-[0] -translate-y-4 scale-75 transform bg-white dark:bg-gray-800 px-2 text-gray-500 duration-300",
                        field.value ? "opacity-100" : "opacity-0",
                      )}
                    >
                      Student ID Card
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                            <Input
                            type="file"
                            accept="image/*"
                            placeholder="Student ID Card"
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
                      </div>
                    </FormControl>
                    <FormMessage className="animate-slideDown" />
                  </FormItem>
                )}
              />
            </motion.div>


            <motion.div variants={itemVariants}>
              <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
                <div
                  className="p-4 flex justify-between items-center cursor-pointer"
                  onClick={() => setShowCollegeAddress(!showCollegeAddress)}
                >
                  <h3 className="font-medium">College Address</h3>
                  <Button variant="ghost" size="sm" type="button">
                    {showCollegeAddress ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                  </Button>
                </div>
                <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{
          height: showCollegeAddress ? "auto" : 0,
          opacity: showCollegeAddress ? 1 : 0,
        }}
        transition={{ duration: 0.3 }}
        className="overflow-hidden"
      >
        <div className="p-4 pt-0">
          <FormField
            control={form.control}
            name="collegeAddress"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <textarea
                    placeholder="Enter college address"
                    className="min-h-[100px] resize-none border-gray-300 dark:border-gray-600 focus:border-indigo-500 dark:focus:border-indigo-400"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="animate-slideDown" />
              </FormItem>
            )}
          />
        </div>
      </motion.div>
              </div>
            </motion.div>
          </>
        )}

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
            Complete Profile
          </Button>
        </motion.div>
      </form>
    </Form>
  )
}
