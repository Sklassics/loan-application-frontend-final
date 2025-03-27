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
import { Loader2, AlertCircle, CheckCircle, Building, User, CreditCard, ArrowRight } from "lucide-react"
import { verifyBankAccount, verifyOtp } from "@/lib/api/bank-api"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

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
  ifscCode: z.string().regex(/^[A-Z]{4}0[A-Z0-9]{6}$/, {
    message: "IFSC code must be in the format ABCD0123456",
  }),
  accountType: z.enum(["savings", "current", "salary"], {
    message: "Please select a valid account type",
  }),
})

// OTP form schema
const otpFormSchema = z.object({
  otp: z.string().length(6, {
    message: "OTP must be 6 digits",
  }),
})

export default function BankVerificationPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [verificationStatus, setVerificationStatus] = useState<"idle" | "success" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState("")
  const [showOtpScreen, setShowOtpScreen] = useState(false)
  const [otpResendTimer, setOtpResendTimer] = useState(30)

  // Bank form
  const bankForm = useForm<z.infer<typeof bankFormSchema>>({
    resolver: zodResolver(bankFormSchema),
    defaultValues: {
      fullName: "",
      bankName: "",
      accountNumber: "",
      ifscCode: "",
      accountType: "savings",
    },
  })

  // OTP form
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
      const verificationResult = await verifyBankAccount(values)

      if (verificationResult.success) {
        setIsSubmitting(false)
        setShowOtpScreen(true)

        // Start OTP timer
        let timer = 30
        const interval = setInterval(() => {
          timer -= 1
          setOtpResendTimer(timer)
          if (timer <= 0) {
            clearInterval(interval)
          }
        }, 1000)
      } else {
        setVerificationStatus("error")
        setErrorMessage(
          verificationResult.message || "Bank verification failed. Please check your details and try again.",
        )
        setIsSubmitting(false)
      }
    } catch (error) {
      setVerificationStatus("error")
      setErrorMessage("An error occurred during verification. Please try again.")
      console.error("Bank verification error:", error)
      setIsSubmitting(false)
    }
  }

  const onOtpSubmit = async (values: z.infer<typeof otpFormSchema>) => {
    setIsSubmitting(true)
    setVerificationStatus("idle")

    try {
      // Call OTP verification API
      const otpResult = await verifyOtp(values.otp)

      if (otpResult.success) {
        setVerificationStatus("success")
        // Redirect to next step after 2 seconds
        setTimeout(() => {
          router.push("/withdraw-amount")
        }, 2000)
      } else {
        setVerificationStatus("error")
        setErrorMessage(otpResult.message || "OTP verification failed. Please try again.")
      }
    } catch (error) {
      setVerificationStatus("error")
      setErrorMessage("An error occurred during OTP verification. Please try again.")
      console.error("OTP verification error:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const resendOtp = async () => {
    if (otpResendTimer > 0) return

    setOtpResendTimer(30)

    // Start OTP timer
    let timer = 30
    const interval = setInterval(() => {
      timer -= 1
      setOtpResendTimer(timer)
      if (timer <= 0) {
        clearInterval(interval)
      }
    }, 1000)

    // Simulate OTP resend
    await new Promise((resolve) => setTimeout(resolve, 1000))
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

  const digitVariants = {
    initial: { scale: 0.8, opacity: 10 },
    animate: { scale: 1, opacity: 1 },
    exit: { scale: 0.8, opacity: 20 },
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-gray-900 dark:to-slate-900 py-12 px-4">
      <motion.div initial="hidden" animate="visible" variants={containerVariants} className="max-w-4xl mx-auto">
        <motion.div variants={itemVariants} className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600">
            Bank Account Verification
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Verify your bank account details to proceed with your application
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          {!showOtpScreen ? (
            <motion.div
              key="bank-form"
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0, x: -100 }}
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
                          name="ifscCode"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>IFSC Code</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <Building className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                  <Input
                                    placeholder="e.g., SBIN0123456"
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
                          name="accountType"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Account Type</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger className="border-gray-300 dark:border-gray-600 focus:border-indigo-500 dark:focus:border-indigo-400">
                                    <SelectValue placeholder="Select account type" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="savings">Savings Account</SelectItem>
                                  <SelectItem value="current">Current Account</SelectItem>
                                  <SelectItem value="salary">Salary Account</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
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
                      </AnimatePresence>

                      <div className="flex justify-end">
                        <Button
                          type="submit"
                          disabled={isSubmitting}
                          className="bg-violet-150"
                        >
                          {isSubmitting ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Verifying...
                            </>
                          ) : (
                            <>
                              Verify Bank Account <ArrowRight className="ml-2 h-4 w-4" />
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
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 100 }}
              className="w-full"
            >
              <Card className="border-gray-200 dark:border-gray-700 shadow-lg overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-purple-600/10 to-indigo-600/10 dark:from-purple-900/20 dark:to-indigo-900/20">
                  <CardTitle>OTP Verification</CardTitle>
                  <CardDescription>We've sent a 6-digit OTP to your registered mobile number</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <Form {...otpForm}>
                    <form onSubmit={otpForm.handleSubmit(onOtpSubmit)} className="space-y-6">
                      <div className="space-y-6">
                        <FormField
                          control={otpForm.control}
                          name="otp"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Enter 6-digit OTP</FormLabel>
                              <FormControl>
                                <div className="flex justify-center">
                                  <div className="flex gap-2 sm:gap-4">
                                    {[...Array(6)].map((_, index) => {
                                      const digit = field.value[index] || ""
                                      return (
                                        <motion.div
                                          key={index}
                                          variants={digitVariants}
                                          initial="initial"
                                          animate={digit ? "animate" : "initial"}
                                          className="relative"
                                        >
                                          <Input
                                            type="text"
                                            inputMode="numeric"
                                            maxLength={1}
                                            value={digit}
                                            onChange={(e) => {
                                              const val = e.target.value
                                              if (/^[0-9]?$/.test(val)) {
                                                const newOtp = field.value.split("")
                                                newOtp[index] = val
                                                field.onChange(newOtp.join(""))

                                                // Auto-focus next input
                                                if (val && index < 5) {
                                                  const nextInput = document.querySelector(
                                                    `input[name="otp-${index + 1}"]`,
                                                  ) as HTMLInputElement
                                                  if (nextInput) nextInput.focus()
                                                }
                                              }
                                            }}
                                            onKeyDown={(e) => {
                                              // Handle backspace
                                              if (e.key === "Backspace" && !digit && index > 0) {
                                                const prevInput = document.querySelector(
                                                  `input[name="otp-${index - 1}"]`,
                                                ) as HTMLInputElement
                                                if (prevInput) prevInput.focus()
                                              }
                                            }}
                                            className="w-10 h-12 sm:w-12 sm:h-14 text-center text-lg font-bold border-gray-300 dark:border-gray-600 focus:border-indigo-500 dark:focus:border-indigo-400"
                                            name={`otp-${index}`}
                                          />
                                        </motion.div>
                                      )
                                    })}
                                  </div>
                                </div>
                              </FormControl>
                              <div className="text-center mt-2">
                                <FormMessage />
                              </div>
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="text-center">
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Didn't receive the OTP?{" "}
                          <Button
                            type="button"
                            variant="link"
                            onClick={resendOtp}
                            disabled={otpResendTimer > 0}
                            className="p-0 h-auto text-indigo-600 dark:text-indigo-400"
                          >
                            Resend OTP
                            {otpResendTimer > 0 && ` (${otpResendTimer}s)`}
                          </Button>
                        </p>
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
                          onClick={() => setShowOtpScreen(false)}
                          className="border-gray-300 dark:border-gray-600"
                        >
                          Back
                        </Button>
                        <Button
                          type="submit"
                          disabled={isSubmitting || otpForm.watch("otp").length !== 6}
                          className="bg-violet-150"
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

