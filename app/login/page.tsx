"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Mail, Smartphone, CheckCircle, AlertCircle } from "lucide-react"
import { motion } from "framer-motion"
import { useAuthStore } from "@/store/auth"
import { IEmailOtpReq } from "@/interface/IAuthStore"

export default function LoginPage() {
  const router = useRouter()
  const [phoneNumber, setPhoneNumber] = useState("")
  const [phoneOtp, setPhoneOtp] = useState(["", "", "", "", "", ""])
  const [email, setEmail] = useState("")
  const [emailOtp, setEmailOtp] = useState(["", "", "", "", "", ""])
  const [otpSent, setOtpSent] = useState(false)
  const [emailOtpSent, setEmailOtpSent] = useState(false)
  const [phoneVerified, setPhoneVerified] = useState(false)
  const [emailVerified, setEmailVerified] = useState(false)
  const [isVerifying, setIsVerifying] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [activeTab, setActiveTab] = useState("phone")
  const [authStep, setAuthStep] = useState<"phone" | "phoneOtp" | "email" | "emailOtp" | "complete">("phone")
  const [error, setError] = useState("")
  const sendMobOtp = useAuthStore((state) => state.sendMobileOtpAction)
  const verifyMobOtp = useAuthStore((state) => state.verifyMobileOtpAction)
  const sendEmailOtp = useAuthStore((state) => state.sendEmailOtpAction)
  const verifyEmailOtp = useAuthStore((state) => state.verifyEmailOtpAction)
  const saveUser = useAuthStore((state) => state.saveUserAction)

  const handleSendOtp = async() => {
    // Validate phone number
    if (phoneNumber.length !== 10) {
      setError("Please enter a valid phone number")
      return
    }
    setError("")
    setIsVerifying(true)
    const response:any = await sendMobOtp({phoneNumber })
    if(response?.status === 200){  
      setIsVerifying(false)
      setOtpSent(true)
      setAuthStep("phoneOtp")
    }else{
      setIsVerifying(false)
      setError(response?.message)
    }
  }

  const handleOtpChange = (index: number, value: string, type: "phone" | "email") => {
    if (value.length > 1) {
      value = value.slice(0, 1)
    }

    if (value && !/^\d+$/.test(value)) {
      return
    }

    if (type === "phone") {
      const newOtp = [...phoneOtp]
      newOtp[index] = value
      setPhoneOtp(newOtp)

      // Auto-focus next input
      if (value && index < 5) {
        const nextInput = document.getElementById(`phone-otp-${index + 1}`) as HTMLInputElement
        if (nextInput) {
          nextInput.focus()
        }
      }
    } else {
      const newOtp = [...emailOtp]
      newOtp[index] = value
      setEmailOtp(newOtp)

      // Auto-focus next input
      if (value && index < 5) {
        const nextInput = document.getElementById(`email-otp-${index + 1}`) as HTMLInputElement
        if (nextInput) {
          nextInput.focus()
        }
      }
    }
  }

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>, type: "phone" | "email") => {
    if (e.key === "Backspace") {
      if (type === "phone") {
        if (!phoneOtp[index] && index > 0) {
          const prevInput = document.getElementById(`phone-otp-${index - 1}`) as HTMLInputElement
          if (prevInput) {
            prevInput.focus()
          }
        }
      } else {
        if (!emailOtp[index] && index > 0) {
          const prevInput = document.getElementById(`email-otp-${index - 1}`) as HTMLInputElement
          if (prevInput) {
            prevInput.focus()
          }
        }
      }
    }
  }

  const handleVerifyOtp = async() => {
    const otpValue = phoneOtp.join("")
    if (otpValue.length !== 6) {
      setError("Please enter a valid 4-digit OTP")
      return
    }
    setError("")
    setIsVerifying(true)
    let req = { phoneNumber, otp: otpValue }
    const response:any = await verifyMobOtp(req)
    if(response?.status || response?.statusCode === 200){  
        setIsVerifying(false)
        setPhoneVerified(true)
        if(!response?.isEmailVerified){
          setAuthStep("email")
        }else if(!response?.isPersonalDetailsVerified){
          router.push("/onboarding")
        }else if(!response?.isPancardVerified){
          router.push("/kyc-verification")
        }else if(!response?.isCreditLimit){
          router.push("/eligibility-check")
        }else if(!response?.isBankDetails){
          router.push("/onboarding")
        }else if(!response?.isWithDrawAmount){
          router.push("/withdraw-amount")
        }else{
          router.push("/dashboard")
        }
    }else{
      setIsVerifying(false)
      setError(response?.message)
    }
  }

  const handleSendEmailOtp = async() => {
    // Validate email
    if (!email || !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/i.test(email)) {
      setError("Please enter a valid email address")
      return
    }
    setError("")
    setIsVerifying(true)
    const response:any = await sendEmailOtp({ email })
    if(response?.status === 200){  
      setIsVerifying(false)
      setEmailOtpSent(true)
      setAuthStep("emailOtp")
    }else{
      setIsVerifying(false)
      setError(response?.message)
    }
  }

  const handleVerifyEmailOtp = async() => {
    const otpValue = emailOtp.join("")

    if (otpValue.length !== 6) {
      setError("Please enter a valid 6-digit OTP")
      return
    }

    setError("")
    setIsVerifying(true)

    let req : IEmailOtpReq = {
      email,
      otp : otpValue
    }
    const response:any = await verifyEmailOtp(req)
    if(response?.status === 200){  
        setIsVerifying(false)
        setEmailOtpSent(true)
        setAuthStep("emailOtp")
        let res:any = await saveUser({ phoneNumber, email })
        if(res?.status === 200){
          // Redirect to dashboard after a short delay
          setTimeout(() => {
            router.push("/onboarding")
          }, 1000)
        }else{
          setIsVerifying(false)
          setError(res?.message)
        }

    }
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 },
    },
  }

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <div className="absolute top-20 left-20 w-72 h-72 rounded-full bg-violet-300/20 blur-3xl"></div>
      <div className="absolute bottom-20 right-20 w-72 h-72 rounded-full bg-indigo-300/20 blur-3xl"></div>

      <div className="flex h-16 items-center border-b backdrop-blur-sm bg-white/70 px-4 md:px-6 z-10">
        <Link
          href="/"
          className="flex items-center gap-2 text-lg font-semibold text-violet-700 transition-colors hover:text-violet-900"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Back to Home</span>
        </Link>
      </div>

      <main className="flex-1 flex items-center justify-center p-4 md:p-8 relative z-10">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="mx-auto max-w-md space-y-6 w-full"
        >
          <motion.div variants={itemVariants} className="space-y-2 text-center">
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-indigo-600">
              Welcome Back
            </h1>
            <p className="text-slate-600">Login to your account to continue</p>
          </motion.div>

          <motion.div variants={itemVariants}>
            {authStep === "phone" && (
              <motion.div
                className="space-y-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-slate-700">
                    Phone Number
                  </Label>
                  <div className="relative">
                    <Smartphone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="Enter your phone number"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="pl-10 border-slate-300 focus:border-violet-500 focus:ring-violet-500/20"
                    />
                  </div>
                  {error && (
                    <div className="flex items-center gap-2 text-red-600 text-sm mt-1">
                      <AlertCircle className="h-4 w-4" />
                      <span>{error}</span>
                    </div>
                  )}
                </div>
                <Button
                  className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 transition-all duration-300"
                  onClick={handleSendOtp}
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
                      Sending OTP...
                    </div>
                  ) : (
                    "Send OTP"
                  )}
                </Button>
              </motion.div>
            )}

            {authStep === "phoneOtp" && (
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
                    We've sent a 6-digit OTP to {phoneNumber}.
                    <button
                      className="ml-1 text-violet-600 hover:text-violet-800 hover:underline transition-colors"
                      onClick={() => setAuthStep("phone")}
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
                        onChange={(e) => handleOtpChange(index, e.target.value, "phone")}
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

            {authStep === "email" && (
              <motion.div
                className="space-y-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center justify-center mb-4 text-green-600 gap-2">
                  <CheckCircle className="h-5 w-5" />
                  <span className="text-sm font-medium">Phone number verified successfully</span>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-slate-700">
                    Email
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 border-slate-300 focus:border-violet-500 focus:ring-violet-500/20"
                    />
                  </div>

                  {error && (
                    <div className="flex items-center gap-2 text-red-600 text-sm mt-1">
                      <AlertCircle className="h-4 w-4" />
                      <span>{error}</span>
                    </div>
                  )}
                </div>

                <Button
                  className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 transition-all duration-300"
                  onClick={handleSendEmailOtp}
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
                      Sending OTP...
                    </div>
                  ) : (
                    "Send Email OTP"
                  )}
                </Button>
              </motion.div>
            )}

            {authStep === "emailOtp" && (
              <motion.div
                className="space-y-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="space-y-2">
                  <Label htmlFor="email-otp" className="text-slate-700">
                    Enter Email OTP
                  </Label>
                  <p className="text-sm text-slate-500">
                    We've sent a 6-digit OTP to {email}.
                    <button
                      className="ml-1 text-violet-600 hover:text-violet-800 hover:underline transition-colors"
                      onClick={() => setAuthStep("email")}
                    >
                      Change
                    </button>
                  </p>

                  <div className="flex justify-between gap-2 mt-2">
                    {emailOtp.map((digit, index) => (
                      <Input
                        key={index}
                        id={`email-otp-${index}`}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(index, e.target.value, "email")}
                        onKeyDown={(e) => handleOtpKeyDown(index, e, "email")}
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
                  onClick={handleVerifyEmailOtp}
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
                    "Verify & Login"
                  )}
                </Button>
              </motion.div>
            )}

            {authStep === "complete" && (
              <motion.div
                className="space-y-4 text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex flex-col items-center justify-center py-8">
                  <div className="rounded-full bg-green-100 p-3 mb-4">
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                  <h2 className="text-xl font-bold text-slate-800">Login Successful</h2>
                  <p className="text-slate-600 mt-2">Redirecting you to dashboard...</p>
                  <div className="mt-4 w-16 h-1 bg-slate-200 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-violet-500 to-indigo-500"
                      initial={{ width: 0 }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 1 }}
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>

          {authStep !== "complete" && (
            <>
              <motion.div variants={itemVariants} className="text-center text-sm">
                <p className="text-slate-600">
                  Don&apos;t have an account?{" "}
                  <Link
                    href="/register"
                    className="text-violet-600 hover:text-violet-800 hover:underline transition-colors"
                  >
                    Register
                  </Link>
                </p>
              </motion.div>

              <motion.div variants={itemVariants} className="relative flex items-center py-5">
                <div className="flex-grow border-t border-slate-300"></div>
                <span className="mx-4 flex-shrink text-slate-500">or continue with</span>
                <div className="flex-grow border-t border-slate-300"></div>
              </motion.div>

              <motion.div variants={itemVariants} className="flex gap-4 justify-center">
                {["google", "apple", "facebook"].map((provider) => (
                  <button
                    key={provider}
                    className="flex items-center justify-center w-12 h-12 rounded-full bg-white shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                  >
                    <img
                      src={`/placeholder.svg?height=24&width=24&text=${provider.charAt(0).toUpperCase()}`}
                      alt={`${provider} login`}
                      width={24}
                      height={24}
                    />
                  </button>
                ))}
              </motion.div>
            </>
          )}
        </motion.div>
      </main>
    </div>
  )
}

