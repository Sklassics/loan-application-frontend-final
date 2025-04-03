"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  Loader2,
  AlertCircle,
  CheckCircle,
  Building,
  User,
  CreditCard,
  ArrowRight,
  Phone,
  MapPin,
  KeyRound,
} from "lucide-react"
import { useProfileStore } from "@/store/profile"
import { Textarea } from "@/components/ui/textarea"
import { verifyOtp } from "@/lib/api/bank-api"
import { IVerBankReq } from "@/interface/IProfileStore"

// Bank form schema
const bankFormSchema = z.object({
  fullName: z.string().min(3, {
    message: "Full name must be at least 3 characters",
  }),
  bankName: z.string().min(2, {
    message: "Bank name is required",
  }),
  accountNumber: z
    .string()
    .min(9, {
      message: "Account number must be at least 9 digits",
    })
    .max(18, {
      message: "Account number must be at most 18 digits",
    })
    .refine((val) => /^\d+$/.test(val), {
      message: "Account number must contain only digits",
    }),
  mobileNumber: z
    .string()
    .length(10, { message: "Mobile number must be exactly 10 digits" })
    .refine((val) => /^\d+$/.test(val), { message: "Mobile number must contain only digits" }),
  address: z.string().min(5, { message: "Address must be at least 5 characters long" }),
})

// OTP form schema
const otpFormSchema = z.object({
  otp: z
    .string()
    .length(6, { message: "OTP must be exactly 6 digits" })
    .refine((val) => /^\d+$/.test(val), { message: "OTP must contain only digits" }),
})

export default function BankVerificationPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [verificationStatus, setVerificationStatus] = useState<"idle" | "success" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState("")
  const [currentStep, setCurrentStep] = useState<"bank-details" | "otp-verification">("bank-details")
  const sendOtp = useProfileStore((state) => state.sendBankDetailsAction)
  const verifyBankOtp = useProfileStore((state) => state.verifyBankDetailsAction)

  // Bank form
  const bankForm = useForm<z.infer<typeof bankFormSchema>>({
    resolver: zodResolver(bankFormSchema),
    defaultValues: {
      fullName: "",
      bankName: "",
      accountNumber: "",
      mobileNumber: "",
      address: "",
    },
  })

  // OTP form
  // OTP form schema
  const otpFormSchema = z.object({
    otp: z
      .string()
      .length(6, { message: "OTP must be exactly 6 digits" })
      .refine((val) => /^\d+$/.test(val), { message: "OTP must contain only digits" }),
  });
  
  const otpForm = useForm<z.infer<typeof otpFormSchema>>({
    resolver: zodResolver(otpFormSchema),
    defaultValues: {
      otp: "",
    },
  })

  const onBankSubmit = async (values: z.infer<typeof bankFormSchema>) => {
    setIsSubmitting(true)
    setVerificationStatus("idle")

    try {
      // Call bank verification API
      console.log(values, "values")
      const verificationResult = await sendOtp(values)

      if (verificationResult.success) {
        setVerificationStatus("success")
        // Move to OTP verification step
        setTimeout(() => {
          setCurrentStep("otp-verification")
          setVerificationStatus("idle")
        }, 1000)
      } else {
        setVerificationStatus("error")
        setErrorMessage(
          verificationResult.message || "Bank verification failed. Please check your details and try again.",
        )
      }
    } catch (error) {
      setVerificationStatus("error")
      setErrorMessage("An error occurred during verification. Please try again.")
      console.error("Bank verification error:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const onOtpSubmit = async (values: z.infer<typeof otpFormSchema>) => {
    setIsSubmitting(true)
    setVerificationStatus("idle")

    try {
      // Call OTP verification API
      let req : IVerBankReq = {
        mobileNumber : bankForm.getValues().mobileNumber,
        otp : values.otp
      }
      const otpVerificationResult = await verifyBankOtp(req)

      if (otpVerificationResult.success) {
        setVerificationStatus("success")
        // Redirect to next step after 2 seconds
        setTimeout(() => {
          router.push("/onboarding")
        }, 2000)
      } else {
        setVerificationStatus("error")
        setErrorMessage(
          otpVerificationResult.message || "OTP verification failed. Please check the code and try again.",
        )
      }
    } catch (error) {
      setVerificationStatus("error")
      setErrorMessage("An error occurred during OTP verification. Please try again.")
      console.error("OTP verification error:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 24 },
    },
  }

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
      transition: {
        x: { type: "spring", stiffness: 300, damping: 30 },
        opacity: { duration: 0.2 },
      },
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
      transition: {
        x: { type: "spring", stiffness: 300, damping: 30 },
        opacity: { duration: 0.2 },
      },
    }),
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-gray-900 dark:to-slate-900 py-12 px-4">
      <motion.div initial="hidden" animate="visible" variants={containerVariants} className="max-w-4xl mx-auto">
        <motion.div variants={itemVariants} className="hidden lg:block text-center mb-8">
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600">
            Bank Account Verification
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            {currentStep === "bank-details"
              ? "Verify your bank account details to proceed with your application"
              : "Enter the OTP sent to your registered mobile number"}
          </p>
        </motion.div>

        <AnimatePresence mode="wait" initial={false} custom={currentStep === "bank-details" ? -1 : 1}>
          {currentStep === "bank-details" ? (
            <motion.div
              key="bank-form"
              variants={itemVariants}
              initial="enter"
              animate="center"
              exit="exit"
              custom={-1}
            >
              <Card className="border-gray-200 dark:border-gray-700 shadow-lg overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-purple-600/10 to-indigo-600/10 dark:from-purple-900/20 dark:to-indigo-900/20">
                  <CardTitle>Bank Details</CardTitle>
                  <CardDescription>Please provide your bank account information for verification</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <Form {...bankForm}>
                    <form onSubmit={bankForm.handleSubmit(onBankSubmit)} className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-6">
                        <FormField
                          control={bankForm.control}
                          name="fullName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Full Name (as per Bank Records)</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                  <Input
                                    placeholder="Enter your full name"
                                    {...field}
                                    className="pl-10 border-gray-300 dark:border-gray-600 focus:border-indigo-500 dark:focus:border-indigo-400"
                                  />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={bankForm.control}
                          name="bankName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Bank Name</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <Building className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                  <Input
                                    placeholder="Enter bank name"
                                    {...field}
                                    className="pl-10 border-gray-300 dark:border-gray-600 focus:border-indigo-500 dark:focus:border-indigo-400"
                                  />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={bankForm.control}
                          name="accountNumber"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Account Number</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <CreditCard className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                  <Input
                                    placeholder="Enter account number"
                                    {...field}
                                    className="pl-10 border-gray-300 dark:border-gray-600 focus:border-indigo-500 dark:focus:border-indigo-400"
                                  />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={bankForm.control}
                          name="mobileNumber"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Mobile Number</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                  <Input
                                    placeholder="Enter 10-digit mobile number"
                                    {...field}
                                    className="pl-10 border-gray-300 dark:border-gray-600 focus:border-indigo-500 dark:focus:border-indigo-400"
                                    maxLength={10}
                                  />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={bankForm.control}
                        name="address"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Bank Branch Address</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                <Textarea
                                  placeholder="Enter bank branch address"
                                  {...field}
                                  className="pl-10 min-h-[100px] border-gray-300 dark:border-gray-600 focus:border-indigo-500 dark:focus:border-indigo-400"
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <AnimatePresence>
                        {verificationStatus === "error" && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                          >
                            <Alert variant="destructive">
                              <AlertCircle className="h-4 w-4" />
                              <AlertTitle>Verification Failed</AlertTitle>
                              <AlertDescription>{errorMessage}</AlertDescription>
                            </Alert>
                          </motion.div>
                        )}

                        {verificationStatus === "success" && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                          >
                            <Alert className="bg-green-50 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800">
                              <CheckCircle className="h-4 w-4" />
                              <AlertTitle>Details Verified</AlertTitle>
                              <AlertDescription>
                                Your bank details have been verified. Proceeding to OTP verification...
                              </AlertDescription>
                            </Alert>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      <div className="flex justify-end">
                        <Button
                          type="submit"
                          disabled={isSubmitting}
                          className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                        >
                          {isSubmitting ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Verifying...
                            </>
                          ) : (
                            <>
                              Verify & Get OTP
                              <ArrowRight className="ml-2 h-4 w-4" />
                            </>
                          )}
                        </Button>
                      </div>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            <motion.div
              key="otp-form"
              variants={itemVariants}
              initial="enter"
              animate="center"
              exit="exit"
              custom={1}
            >
              <Card className="border-gray-200 dark:border-gray-700 shadow-lg overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-purple-600/10 to-indigo-600/10 dark:from-purple-900/20 dark:to-indigo-900/20">
                  <CardTitle>OTP Verification</CardTitle>
                  <CardDescription>Enter the 6-digit OTP sent to your registered mobile number</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <Form {...otpForm}>
                    <form onSubmit={otpForm.handleSubmit(onOtpSubmit)} className="space-y-6">
                      <div className="max-w-md mx-auto">
                        <FormField
                          control={otpForm.control}
                          name="otp"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>One-Time Password (OTP)</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <KeyRound className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                  <Input
                                    placeholder="Enter 6-digit OTP"
                                    {...field}
                                    maxLength={6}
                                    className="pl-10 text-center text-lg tracking-widest border-gray-300 dark:border-gray-600 focus:border-indigo-500 dark:focus:border-indigo-400"
                                  />
                                </div>
                              </FormControl>
                              <FormMessage />
                              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 text-center">
                                Didn't receive OTP?{" "}
                                <button type="button" className="text-indigo-600 dark:text-indigo-400 hover:underline">
                                  Resend OTP
                                </button>
                              </p>
                            </FormItem>
                          )}
                        />
                      </div>

                      <AnimatePresence>
                        {verificationStatus === "error" && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                          >
                            <Alert variant="destructive">
                              <AlertCircle className="h-4 w-4" />
                              <AlertTitle>Verification Failed</AlertTitle>
                              <AlertDescription>{errorMessage}</AlertDescription>
                            </Alert>
                          </motion.div>
                        )}

                        {verificationStatus === "success" && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                          >
                            <Alert className="bg-green-50 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800">
                              <CheckCircle className="h-4 w-4" />
                              <AlertTitle>Verification Successful</AlertTitle>
                              <AlertDescription>
                                Your bank account has been verified successfully. Redirecting to the next step...
                              </AlertDescription>
                            </Alert>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      <div className="flex justify-between">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setCurrentStep("bank-details")}
                          className="border-gray-300 dark:border-gray-600"
                        >
                          Back to Bank Details
                        </Button>
                        <Button
                          type="submit"
                          disabled={isSubmitting}
                          className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                        >
                          {isSubmitting ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Verifying...
                            </>
                          ) : (
                            "Verify OTP"
                          )}
                        </Button>
                      </div>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}

