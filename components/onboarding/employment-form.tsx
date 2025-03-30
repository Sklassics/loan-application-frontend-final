"use client";

import type React from "react";

import { useState, useEffect, useRef } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { motion, AnimatePresence } from "framer-motion";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { CheckCircle, X, Camera } from "lucide-react";
import { FileUploader } from "../kyc/file-uploader";

// Dynamic schema based on employment type
const createFormSchema = (employmentType: string) => {
  if (employmentType === "employee") {
    return z.object({
      employmentType: z.string(),
      companyName: z.string().min(2, "Company name is required"),
      employeeId: z.string().min(2, "Employee ID is required"),
      officeAddress: z.string().min(5, "Office address is required"),
      annualIncome: z.string().min(2, "Annual income is required"),
    });
  } else {
    return z.object({
      employmentType: z.string(),
      instituteName: z.string().min(2, "Institute name is required"),
      studentId: z.string().min(2, "Student ID is required"),
      campusAddress: z.string().min(5, "Campus address is required"),
      annualIncome: z.string().min(2, "Annual income is required"),
    });
  }
};

// Animation variants
const formVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 24,
      staggerChildren: 0.07,
      delayChildren: 0.1,
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: { duration: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
};

type EmployeeFormProps = {
  onSubmit: (data: any, idImage?: any) => void;
  onBack: () => void;
};

export default function EmploymentForm({
  onSubmit,
  onBack,
}: EmployeeFormProps) {
  const [employmentType, setEmploymentType] = useState<string>("employee");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formSuccess, setFormSuccess] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [idImage, setIdImage] = useState<File | null>(null);

  // Initialize form with the employee schema
  const form = useForm<any>({
    resolver: zodResolver(createFormSchema(employmentType)),
    defaultValues: {
      employmentType: "employee",
      companyName: "",
      employeeId: "",
      officeAddress: "",
      annualIncome: "",
    },
  });

  // Update form schema and reset values when employment type changes
  useEffect(() => {
    if (employmentType === "employee") {
      form.reset({
        employmentType,
        companyName: form.getValues("companyName") || "",
        employeeId: form.getValues("employeeId") || "",
        officeAddress: form.getValues("officeAddress") || "",
        annualIncome: form.getValues("annual_income") || "",
      });
    } else {
      form.reset({
        employmentType,
        instituteName: form.getValues("instituteName") || "",
        studentId: form.getValues("studentId") || "",
        campusAddress: form.getValues("campusAddress") || "",
        annual_income: form.getValues("annual_income") || "",
      });
    }

    // Clear preview when switching types
    setPreviewUrl(null);

    // Update resolver with new schema
    form.clearErrors();
  }, [employmentType, form]);

  // Handle file change and generate preview
  const handleFileChange = (file: File) => {
    if (file) {
      setIdImage(file);
    }
  };

  // Clean up preview URL when component unmounts
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleSubmit = async (data: any) => {
    onSubmit(data, idImage);
  };

  return (
    <Card className="w-full shadow-md border-t-4 border-t-primary">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">
          {employmentType === "employee"
            ? "Employment Details"
            : "Student Details"}
        </CardTitle>
        <CardDescription className="text-center">
          Please provide your{" "}
          {employmentType === "employee" ? "employment" : "education"}{" "}
          information
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="employmentType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>I am a</FormLabel>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value);
                      setEmploymentType(value);
                    }}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="h-11 rounded-md">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="employee">Employee</SelectItem>
                      <SelectItem value="student">Student</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <AnimatePresence mode="wait">
              {employmentType === "employee" ? (
                <motion.div
                  key="employee-form"
                  variants={formVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="space-y-4"
                >
                  <motion.div variants={itemVariants}>
                    <FormField
                      control={form.control}
                      name="companyName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Company Name</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter your company name"
                              className="h-11 rounded-md"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <FormField
                      control={form.control}
                      name="employeeId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Employee ID</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter your employee ID"
                              className="h-11 rounded-md"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <FormField
                      control={form.control}
                      name="annualIncome"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Annual Income</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter your annual Income"
                              className="h-11 rounded-md"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <FormField
                      control={form.control}
                      name="officeAddress"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Office Address</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter your office address"
                              className="h-11 rounded-md"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <FormField
                      control={form.control}
                      name="idImage"
                      render={({
                        field: { onChange, value, ...fieldProps },
                      }) => (
                        <FormItem>
                          <FormLabel>Employee ID Card Image</FormLabel>
                          <FormControl>
                            <div className="flex flex-col items-center">
                              <FileUploader
                                onFileUpload={handleFileChange}
                                acceptedFileTypes={["image/jpeg", "image/png"]}
                                maxSize={5 * 1024 * 1024} // 5MB
                                label="Upload Profile Image"
                                description="Upload a clear photo of yourself"
                                icon="user"
                              />
                            </div>
                          </FormControl>
                          <FormDescription>
                            Upload a clear image of your employee ID card
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </motion.div>
                </motion.div>
              ) : (
                <motion.div
                  key="student-form"
                  variants={formVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="space-y-4"
                >
                  <motion.div variants={itemVariants}>
                    <FormField
                      control={form.control}
                      name="instituteName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Institute Name</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter your institute name"
                              className="h-11 rounded-md"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <FormField
                      control={form.control}
                      name="studentId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Student ID</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter your student ID"
                              className="h-11 rounded-md"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <FormField
                      control={form.control}
                      name="annualIncome"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Annual Income</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter your annual Income"
                              className="h-11 rounded-md"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <FormField
                      control={form.control}
                      name="campusAddress"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Campus Address</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter your campus address"
                              className="h-11 rounded-md"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <FormField
                      control={form.control}
                      name="idImage"
                      render={({
                        field: { onChange, value, ...fieldProps },
                      }) => (
                        <FormItem>
                          <FormLabel>Student ID Card Image</FormLabel>
                          <FormControl>
                            <div className="flex flex-col items-center">
                              <FileUploader
                                onFileUpload={handleFileChange}
                                acceptedFileTypes={["image/jpeg", "image/png"]}
                                maxSize={5 * 1024 * 1024} // 5MB
                                label="Upload Student ID"
                                description="Upload a clear photo of your student ID card"
                                icon="user"
                              />
                            </div>
                          </FormControl>
                          <FormDescription>
                            Upload a clear image of your student ID card
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            <motion.div
              className="pt-2"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              <Button
                type="submit"
                className="w-full h-11 rounded-md relative overflow-hidden"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Processing...
                  </span>
                ) : formSuccess ? (
                  <span className="flex items-center justify-center">
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Submitted Successfully
                  </span>
                ) : (
                  "Submit"
                )}

                {formSuccess && (
                  <motion.div
                    className="absolute inset-0 bg-green-500 flex items-center justify-center"
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    exit={{ width: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Submitted Successfully
                  </motion.div>
                )}
              </Button>
            </motion.div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
