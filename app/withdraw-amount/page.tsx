"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Slider } from "@/components/ui/slider"
import { IndianRupee, AlertCircle, ArrowRight, Loader2, BanknoteIcon as Bank } from "lucide-react"

const formSchema = z.object({
  amount: z.coerce
    .number()
    .min(10000, { message: "Minimum withdrawal amount is ₹10,000" })
    .max(500000, { message: "Maximum withdrawal amount is ₹500,000" }),
  accountNumber: z
    .string()
    .min(9, { message: "Account number must be at least 9 digits" })
    .max(18, { message: "Account number must be at most 18 digits" }),
  ifscCode: z.string().regex(/^[A-Z]{4}0[A-Z0-9]{6}$/, { message: "Invalid IFSC code format" }),
  accountHolderName: z.string().min(3, { message: "Account holder name must be at least 3 characters" }),
})

export default function WithdrawAmountPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [withdrawStatus, setWithdrawStatus] = useState<"idle" | "success" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState("")

  // For demo purposes, we'll set a random eligible amount
  const eligibleAmount = 500000

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: 100000,
      accountNumber: "",
      ifscCode: "",
      accountHolderName: "",
    },
  })

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true)
    setWithdrawStatus("idle")

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Simulate API response (success for demo)
      const response = { success: true }

      if (response.success) {
        setWithdrawStatus("success")
        // Redirect to transaction processing page after 1.5 seconds
        setTimeout(() => {
          router.push(`/transaction-processing?amount=${values.amount}`)
        }, 1500)
      } else {
        setWithdrawStatus("error")
        setErrorMessage("Withdrawal failed. Please try again.")
      }
    } catch (error) {
      setWithdrawStatus("error")
      setErrorMessage("An error occurred during withdrawal. Please try again.")
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-gray-900 dark:to-slate-900 py-12 px-4">
      <motion.div initial="hidden" animate="visible" variants={containerVariants} className="max-w-4xl mx-auto">
        <motion.div variants={itemVariants} className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600">
            Withdraw Loan Amount
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Specify the amount you want to withdraw and your bank details
          </p>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="border-gray-200 dark:border-gray-700 shadow-lg overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-purple-600/10 to-indigo-600/10 dark:from-purple-900/20 dark:to-indigo-900/20">
              <CardTitle>Withdraw Funds</CardTitle>
              <CardDescription>You are eligible for a loan of up to ₹{eligibleAmount.toLocaleString()}</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="space-y-4">
                    <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-lg p-4 mb-6">
                      <div className="flex justify-between items-center mb-2">
                        <Label htmlFor="amount" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Withdrawal Amount (₹)
                        </Label>
                        <div className="relative">
                          <IndianRupee className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 dark:text-gray-400" />
                          <Input
                            id="amount-input"
                            type="number"
                            value={form.watch("amount")}
                            onChange={(e) => form.setValue("amount", Number.parseInt(e.target.value))}
                            className="pl-8 w-32 border-gray-300 dark:border-gray-600 focus:border-indigo-500 dark:focus:border-indigo-400"
                          />
                        </div>
                      </div>
                      <FormField
                        control={form.control}
                        name="amount"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Slider
                                defaultValue={[field.value]}
                                min={10000}
                                max={eligibleAmount}
                                step={5000}
                                onValueChange={(value) => {
                                  field.onChange(value[0])
                                }}
                                className="mt-2"
                              />
                            </FormControl>
                            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                              <span>₹10,000</span>
                              <span>₹{eligibleAmount.toLocaleString()}</span>
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="accountHolderName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Account Holder Name</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Enter account holder name"
                                {...field}
                                className="border-gray-300 dark:border-gray-600 focus:border-indigo-500 dark:focus:border-indigo-400"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="accountNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Account Number</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Enter account number"
                                {...field}
                                className="border-gray-300 dark:border-gray-600 focus:border-indigo-500 dark:focus:border-indigo-400"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="ifscCode"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>IFSC Code</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Enter IFSC code"
                                {...field}
                                className="border-gray-300 dark:border-gray-600 focus:border-indigo-500 dark:focus:border-indigo-400"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="flex items-end">
                        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 w-full">
                          <div className="flex items-center">
                            <Bank className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2" />
                            <div className="text-sm text-blue-600 dark:text-blue-400">
                              Funds will be transferred to your bank account within 24 hours
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <AnimatePresence>
                    {withdrawStatus === "error" && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                      >
                        <Alert variant="destructive">
                          <AlertCircle className="h-4 w-4" />
                          <AlertTitle>Withdrawal Failed</AlertTitle>
                          <AlertDescription>{errorMessage}</AlertDescription>
                        </Alert>
                      </motion.div>
                    )}

                    {withdrawStatus === "success" && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                      >
                        <Alert className="bg-green-50 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800">
                          <AlertCircle className="h-4 w-4" />
                          <AlertTitle>Withdrawal Initiated</AlertTitle>
                          <AlertDescription>
                            Your withdrawal request has been initiated. Redirecting to transaction status...
                          </AlertDescription>
                        </Alert>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="flex justify-between">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => router.push("/eligibility-check")}
                      className="border-gray-300 dark:border-gray-600"
                    >
                      Back
                    </Button>
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          Withdraw Funds <ArrowRight className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  )
}

