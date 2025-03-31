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
import { FileUploader } from "@/components/kyc/file-uploader"
import { Loader2, AlertCircle, CheckCircle, ArrowRight } from "lucide-react"
import { verifyKyc } from "@/lib/api/kyc-api"
import { useProfileStore } from "@/store/profile"
import axios from "axios"
import { getToken } from "@/utils/tokenUtils"

// PAN form schema
const panFormSchema = z.object({
  panNumber: z.string().regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, {
    message: "PAN number must be in the format ABCDE1234F",
  }),
})

// OTP form schema
const otpFormSchema = z.object({
  otp: z.string().length(6, {
    message: "OTP must be 6 digits",
  }),
})

export default function KycVerificationPage() {
  const router = useRouter()
  const [panImage, setPanImage] = useState<File | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [verificationStatus, setVerificationStatus] = useState<"idle" | "success" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState("")
  const [showOtpScreen, setShowOtpScreen] = useState(false)
  const [otpSent, setOtpSent] = useState(false)
  const [otpResendTimer, setOtpResendTimer] = useState(30)
  const sendPanOtp = useProfileStore((state) => state.sendPanOtpAction);
  const verifyPanOtp = useProfileStore((state) => state.verifyPanOtpAction);

  // PAN form
  const panForm = useForm<z.infer<typeof panFormSchema>>({
    resolver: zodResolver(panFormSchema),
    defaultValues: {
      panNumber: "",
    },
  })

  // OTP form
  const otpForm = useForm<z.infer<typeof otpFormSchema>>({
    resolver: zodResolver(otpFormSchema),
    defaultValues: {
      otp: "",
    },
  })

  const handlePanUpload = (file: File) => {
    setPanImage(file)
  }

  const onPanSubmit = async (values: z.infer<typeof panFormSchema>) => {
    if (!panImage) {
      setErrorMessage("Please upload your PAN card image")
      return
    }

    setIsSubmitting(true)
    setVerificationStatus("idle")

    try {
      // Create FormData for API call
      const formData = new FormData()
      formData.append("pancardNumber", values.panNumber)
      // const verificationResult = await verifyKyc(formData)
      const token = getToken();
      const verificationResult : any = await axios.post(
        process.env.NEXT_PUBLIC_BASE_URL + "/api/pancard/sendOtp",
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (verificationResult.status == 200 ) {
        setIsSubmitting(false)
        setShowOtpScreen(true)
        setOtpSent(true)

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
        setErrorMessage(verificationResult.message || "Verification failed. Please check your details and try again.")
        setIsSubmitting(false)
      }
    } catch (error) {
      setVerificationStatus("error")
      setErrorMessage("An error occurred during verification. Please try again.")
      console.error("KYC verification error:", error)
      setIsSubmitting(false)
    }
  }

  const onOtpSubmit = async (values: z.infer<typeof otpFormSchema>) => {
    setIsSubmitting(true)
    setVerificationStatus("idle")
    try {
      if(!panImage){
        setErrorMessage("Please upload your PAN card image")
        return
      }
      // Call OTP verification API
      const token = localStorage.getItem("auth_token");
      const formData = new FormData()
      formData.append("pan_card_image", panImage)
      formData.append("pancardNumber",  panForm.getValues().panNumber)
      formData.append("otp", values.otp || '123456')
      const otpResult : any = await axios.post(
        process.env.NEXT_PUBLIC_BASE_URL + "/api/pancard/create",
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      // const otpResult = await verifyPanOtp(formData)

      if (otpResult.status == 200) {
        setVerificationStatus("success")
        // Redirect to eligibilthy page after 2 seconds
        setTimeout(() => {
          router.push("/eligibility-check")
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

    setOtpSent(true)
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
            KYC Verification
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Complete your KYC verification to proceed with your loan application
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          {!showOtpScreen ? (
            <motion.div
              key="pan-form"
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0, x: -100 }}
            >
              <Card className="border-gray-200 dark:border-gray-700 shadow-lg overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-purple-600/10 to-indigo-600/10 dark:from-purple-900/20 dark:to-indigo-900/20">
                  <CardTitle>PAN Card Verification</CardTitle>
                  <CardDescription>Please provide your PAN details for verification</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <Form {...panForm}>
                    <form onSubmit={panForm.handleSubmit(onPanSubmit)} className="space-y-6">
                      <div className="space-y-6">
                        <FormField
                          control={panForm.control}
                          name="panNumber"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>PAN Number</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="ABCDE1234F"
                                  {...field}
                                  className="border-gray-300 dark:border-gray-600 focus:border-indigo-500 dark:focus:border-indigo-400"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <div>
                          <FormLabel className="block mb-2">PAN Card Image</FormLabel>
                          <FileUploader
                            onFileUpload={handlePanUpload}
                            acceptedFileTypes={["image/jpeg", "image/png", "application/pdf"]}
                            maxSize={5 * 1024 * 1024} // 5MB
                            label="Upload PAN Card"
                            description="Upload a clear image of your PAN card"
                            icon="card"
                          />
                          {panImage && (
                            <p className="text-sm text-green-600 dark:text-green-400 mt-2 flex items-center">
                              <CheckCircle className="h-4 w-4 mr-1" />
                              PAN card uploaded successfully
                            </p>
                          )}
                        </div>
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
                              Verify PAN <ArrowRight className="ml-2 h-4 w-4" />
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
                                Your KYC verification is complete. Redirecting to Eligibilty Check...
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

