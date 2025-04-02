"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { zodResolver } from "@hookform/resolvers/zod"
import { SubmitHandler, useForm, useWatch } from "react-hook-form"
import * as z from "zod"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { IndianRupee, AlertCircle, ArrowRight, Loader2, BanknoteIcon as Bank, Calendar, Percent } from "lucide-react"

const formSchema = z.object({
  amount: z.coerce
    .number()
    .min(2000, { message: "Minimum withdrawal amount is ₹2000" })
    .max(500000, { message: "Maximum withdrawal amount is ₹500,000" }),
  accountNumber: z
    .string()
    .min(9, { message: "Account number must be at least 9 digits" })
    .max(18, { message: "Account number must be at most 18 digits" }),
  ifscCode: z.string().regex(/^[A-Z]{4}0[A-Z0-9]{6}$/, { message: "Invalid IFSC code format" }),
  accountHolderName: z.string().min(3, { message: "Account holder name must be at least 3 characters" }),
  tenure: z.coerce
    .number()
    .min(1, { message: "Minimum tenure is 1 months" })
    .max(60, { message: "Maximum tenure is 60 months" }),
  processingFee: z.coerce.number().optional(), // Add processingFee to the schema
  onboardingFee: z.coerce.number().optional(), // Add onboardingFee to the schema
  documentationFee: z.coerce.number().optional(), // Add documentationFee to the schema
})

export default function WithdrawAmountPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [withdrawStatus, setWithdrawStatus] = useState<"idle" | "success" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState("")
  const [processingFee, setProcessingFee] = useState(0)
  const [totalAmount, setTotalAmount] = useState(0)
  const [interestRate, setInterestRate] = useState(12) 
  const [emi, setEmi] = useState(0)
  const [activeTab, setActiveTab] = useState("amount")

  // For demo purposes, we'll set a random eligible amount
  const eligibleAmount = 500000

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: undefined, 
      accountNumber: "",
      ifscCode: "",
      accountHolderName: "",
      tenure: undefined,
      documentationFee: undefined, 
    },
  });
  

  // Calculate processing fee (2% of loan amount)
  const amount = useWatch({ control: form.control, name: "amount" });

  useEffect(() => {
    if (amount !== undefined) {
      const fee = Math.round(amount * 0.02);
      setProcessingFee(fee);
      setTotalAmount(amount - fee);
    }
  }, [amount]);
  

  // Calculate EMI
  const tenure = useWatch({ control: form.control, name: "tenure" });
  
  useEffect(() => {
    if (!amount || !tenure || tenure <= 0) {
      setEmi(0);
      return;
    }
  
    const monthlyInterestRate = interestRate / 12 / 100;
    const denominator = Math.pow(1 + monthlyInterestRate, tenure) - 1;
  
    if (denominator === 0) {
      setEmi(0);
      return;
    }
  
    const emiValue =
      (amount * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, tenure)) /
      denominator;
  
    setEmi(Math.round(emiValue));
  }, [amount, tenure, interestRate]);

  const onSubmit: SubmitHandler<{ 
  amount: number; 
  tenure: number; 
  processingFee?: number; 
  onboardingFee?: number; 
  documentationFee?: number; 
}> = async (values) => {
  setIsSubmitting(true);
  setWithdrawStatus("idle");
  setErrorMessage("");

  try {
    const token = localStorage.getItem("auth_token");

    if (!token || token.trim() === "") {
      setWithdrawStatus("error");
      setErrorMessage("Authentication token is missing. Please log in.");
      setIsSubmitting(false);
      return;
    }

    const requestBody = {
      withdrawAmount: values.amount,
      tenure: `${values.tenure} months`,
      processingFee: values.processingFee ?? 0,
      onboardingFee: values.onboardingFee ?? 0,
      documentationFee: values.documentationFee ?? 0,
    };
    console.log("Request Body:", requestBody);
    console.log("Token sending for backend", token);
    
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/withdraw`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(requestBody),
    });
    
    const data = await response.json();
    console.log("Response Data:", data);

    if (response.status === 401) {
      setWithdrawStatus("error");
      setErrorMessage("Session expired. Please log in again.");
      localStorage.removeItem("token");
      router.push("/login");
    } else if (response.ok) {
      setWithdrawStatus("success");
      setTimeout(() => {
        router.push(`/transaction-processing?amount=${values.amount}`);
      }, 1500);
    } else {
      setWithdrawStatus("error");
      setErrorMessage(data.message || "Withdrawal failed. Please try again.");
    }
  } catch (error) {
    setWithdrawStatus("error");
    setErrorMessage("An error occurred during withdrawal. Please try again.");
  } finally {
    setIsSubmitting(false);
  }
};

  

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
              <CardDescription>
                You are eligible for a loan of up to ₹{eligibleAmount.toLocaleString("en-IN")}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-8">
                  <TabsTrigger value="amount">Loan Amount</TabsTrigger>
                  <TabsTrigger value="details">Bank Details</TabsTrigger>
                </TabsList>

                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <TabsContent value="amount" className="space-y-6">
                      <div className="space-y-6">
                        <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-lg p-4 mb-6">
                          <div className="flex justify-between items-center mb-2">
                            <Label htmlFor="amount" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                              Loan Amount (₹)
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
                                  <span>₹{eligibleAmount.toLocaleString("en-IN")}</span>
                                </div>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-lg p-4 mb-6">
                          <div className="flex justify-between items-center mb-2">
                            <Label htmlFor="tenure" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                              Loan Tenure (months)
                            </Label>
                            <div className="relative">
                              <Calendar className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 dark:text-gray-400" />
                              <Input
                                id="tenure-input"
                                type="number"
                                value={form.watch("tenure")}
                                onChange={(e) => form.setValue("tenure", Number.parseInt(e.target.value))}
                                className="pl-8 w-20 border-gray-300 dark:border-gray-600 focus:border-indigo-500 dark:focus:border-indigo-400"
                              />
                            </div>
                          </div>
                          <FormField
                            control={form.control}
                            name="tenure"
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <Slider
                                    defaultValue={[field.value]}
                                    min={3}
                                    max={60}
                                    step={1}
                                    onValueChange={(value) => {
                                      field.onChange(value[0])
                                    }}
                                    className="mt-2"
                                  />
                                </FormControl>
                                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                                  <span>3 months</span>
                                  <span>60 months</span>
                                </div>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Loan Summary</h3>

                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600 dark:text-gray-400">Loan Amount:</span>
                              <span className="font-medium">
                                ₹{(form.watch("amount") ?? 0).toLocaleString("en-IN")}
                              </span>
                            </div>

                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600 dark:text-gray-400">Processing Fee (2%):</span>
                              <span className="font-medium text-red-600 dark:text-red-400">
                                - ₹{processingFee.toLocaleString("en-IN")}
                              </span>
                            </div>

                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600 dark:text-gray-400">Interest Rate:</span>
                              <span className="font-medium flex items-center">
                                <Percent className="h-3 w-3 mr-1" />
                                {interestRate}% p.a.
                              </span>
                            </div>

                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600 dark:text-gray-400">Tenure:</span>
                              <span className="font-medium">{form.watch("tenure")} months</span>
                            </div>

                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600 dark:text-gray-400">Monthly EMI:</span>
                              <span className="font-medium">₹{emi.toLocaleString("en-IN")}</span>
                            </div>

                            <div className="border-t border-gray-200 dark:border-gray-700 my-2 pt-2"></div>

                            <div className="flex justify-between font-medium">
                              <span>Disbursed Amount:</span>
                              <span className="text-green-600 dark:text-green-400">
                                ₹{totalAmount.toLocaleString("en-IN")}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-end">
                        <Button
                          type="button"
                          onClick={() => setActiveTab("details")}
                          className="bg-violet-150"
                        >
                          Continue to Bank Details <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </div>
                    </TabsContent>

                    <TabsContent value="details" className="space-y-6">
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

                      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                          Disbursement Summary
                        </h3>

                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600 dark:text-gray-400">Loan Amount:</span>
                            <span className="font-medium">
                              ₹{(form.watch("amount") ?? 0).toLocaleString("en-IN")}
                            </span>
                          </div>

                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600 dark:text-gray-400">Processing Fee (2%):</span>
                            <span className="font-medium text-red-600 dark:text-red-400">
                              - ₹{processingFee.toLocaleString("en-IN")}
                            </span>
                          </div>

                          <div className="border-t border-gray-200 dark:border-gray-700 my-2 pt-2"></div>

                          <div className="flex justify-between font-medium">
                            <span>Amount to be Disbursed:</span>
                            <span className="text-green-600 dark:text-green-400">₹{totalAmount.toLocaleString("en-IN")}</span>
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
                          onClick={() => setActiveTab("amount")}
                          className="border-gray-300 dark:border-gray-600"
                        >
                          Back
                        </Button>
                        <Button
                          type="submit"
                          disabled={isSubmitting}
                          className="bg-violet-150 "
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
                    </TabsContent>
                  </form>
                </Form>
              </Tabs>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  )
}

