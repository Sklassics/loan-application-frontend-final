"use client";

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
import { Loader2, AlertCircle, CheckCircle, Building, User, Phone, MapPin, CreditCard } from "lucide-react"
import { verifyBankAccount } from "@/lib/bank-api"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { useProfileStore } from "@/store/profile";

const formSchema = z.object({
  fullName: z.string().min(3, {
    message: "Full name must be at least 3 characters",
  }),
  bankName: z.string().min(2, {
    message: "Bank name is required",
  }),
  address: z.string().min(10, {
    message: "Address must be at least 10 characters",
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
  mobileNumber: z.string().regex(/^[6-9]\d{9}$/, {
    message: "Mobile number must be a valid 10-digit Indian number",
  }),
  accountType: z.enum(["savings", "current", "salary"], {
    message: "Please select a valid account type",
  }),
});

export default function BankVerificationPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [step, setStep] = useState("details");
  const [phoneOtp, setPhoneOtp] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const sendOtp = useProfileStore((state) => state.sendBankDetailsAction);
  const verifyBank = useProfileStore((state) => state.verifyBankDetailsAction);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      bankName: "",
      address: "",
      accountNumber: "",
      ifscCode: "",
      mobileNumber: "",
      accountType: "savings",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true)
    setVerificationStatus("idle")

    try {
      // Call bank verification API
      const verificationResult = await sendOtp(values);

      if (verificationResult.status == 200) {
        setVerificationStatus("success");
        setStep('phoneOtp')
      } else {
        setVerificationStatus("error");
        setErrorMessage(
          verificationResult.message ||
            "Bank verification failed. Please check your details and try again."
        );
      }
    } catch (error) {
      setVerificationStatus("error");
      setErrorMessage(
        "An error occurred during verification. Please try again."
      );
      console.error("Bank verification error:", error);
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
  };

  const handleOtpChange = (
    index: number,
    value: string,
    type: "phone" | "email"
  ) => {
    if (value.length > 1) {
      value = value.slice(0, 1);
    }

    if (value && !/^\d+$/.test(value)) {
      return;
    }

    const newOtp = [...phoneOtp];
    newOtp[index] = value;
    setPhoneOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(
        `phone-otp-${index + 1}`
      ) as HTMLInputElement;
      if (nextInput) {
        nextInput.focus();
      }
    }
  };

  const handleOtpKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
    type: "phone" | "email"
  ) => {
    if (e.key === "Backspace") {
      if (!phoneOtp[index] && index > 0) {
        const prevInput = document.getElementById(
          `phone-otp-${index - 1}`
        ) as HTMLInputElement;
        if (prevInput) {
          prevInput.focus();
        }
      }
    }
  };

  const handleVerifyOtp = async () => {
    const otpValue = phoneOtp.join("");
    if (otpValue.length !== 6) {
      setError("Please enter a valid 4-digit OTP");
      return;
    }
    setError("");
    setIsVerifying(true);
    let mobileNumber = form.getValues().mobileNumber;
    try {
      // Call bank verification API
      let req ={
        mobileNumber,
        otp : otpValue
      }
      const response = await verifyBank(req);

      if (response.status == 200) {
        setVerificationStatus("success");
        setIsVerifying(false);
        // Redirect to next step after 2 seconds
        setTimeout(() => {
          router.push("/withdraw-amount")
        }, 2000);
      } else {
        setVerificationStatus("error");
        setErrorMessage(
          response.message ||
            "Bank verification failed. Please check your details and try again."
        );
      }
    } catch (error) {
      setVerificationStatus("error");
      setErrorMessage("An error occurred during verification. Please try again.");
      console.error("Bank verification error:", error);
      setIsVerifying(false);
      setError( "An error occurred during verification. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-gray-900 dark:to-slate-900 py-12 px-4">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="max-w-4xl mx-auto"
      >
        <motion.div
          variants={itemVariants}
          className="hidden lg:block text-center mb-8"
        >
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600">
            Bank Account Verification
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Verify your bank account details to proceed with your application
          </p>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="border-gray-200 dark:border-gray-700 shadow-lg overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-purple-600/10 to-indigo-600/10 dark:from-purple-900/20 dark:to-indigo-900/20">
              <CardTitle>Bank Details</CardTitle>
              <CardDescription>Please provide your bank account information for verification</CardDescription>
            </CardHeader>
            {step == "details" && (
              <CardContent className="pt-6">
                <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
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
                        control={form.control}
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
                        control={form.control}
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
                        control={form.control}
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
                        control={form.control}
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
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
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

                    <FormField
                      control={form.control}
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
                            <AlertTitle>Verification Successful</AlertTitle>
                            <AlertDescription>
                              Your bank account has been verified successfully.
                              Redirecting to the next step...
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
                          "Verify Bank Account"
                        )}
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            )}
            {step === "phoneOtp" && (
              <motion.div
                className="space-y-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="space-y-2">
                  <Label htmlFor="otp" className="text-slate-700">
                    Enter OTP
                  </Label>
                  <p className="text-sm text-slate-500">
                    We've sent a 6-digit OTP to{" "}
                    {form?.getValues("mobileNumber")}.
                    <button
                      className="ml-1 text-violet-600 hover:text-violet-800 hover:underline transition-colors"
                      onClick={() => setStep("phone")}
                    >
                      Change
                    </button>
                  </p>

                  <div className="flex justify-between gap-2 mt-2">
                    {phoneOtp.map((digit, index) => (
                      <Input
                        key={index}
                        id={`phone-otp-${index}`}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) =>
                          handleOtpChange(index, e.target.value, "phone")
                        }
                        onKeyDown={(e) => handleOtpKeyDown(index, e, "phone")}
                        className="w-12 h-12 text-center text-lg border-slate-300 focus:border-violet-500 focus:ring-violet-500/20"
                      />
                    ))}
                  </div>

                  {error && (
                    <div className="flex items-center gap-2 text-red-600 text-sm mt-1">
                      <AlertCircle className="h-4 w-4" />
                      <span>{error}</span>
                    </div>
                  )}

                  <div className="text-center mt-2">
                    <button className="text-sm text-violet-600 hover:text-violet-800 hover:underline transition-colors">
                      Resend OTP
                    </button>
                  </div>
                </div>
                <Button
                  className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 transition-all duration-300"
                  onClick={handleVerifyOtp}
                  disabled={isVerifying}
                >
                  {isVerifying ? (
                    <div className="flex items-center">
                      <svg
                        className="animate-spin -ml-1 mr-3 h-4 w-4 text-white"
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
                      Verifying...
                    </div>
                  ) : (
                    "Verify & Continue"
                  )}
                </Button>
              </motion.div>
            )}
          </Card>
        </motion.div>
      </motion.div>
    </div>
  )
}

