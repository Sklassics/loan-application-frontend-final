"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { CheckCircle, AlertCircle, Download, Home } from "lucide-react"

const steps = [
  { id: "initiated", label: "Transaction Initiated", description: "Your withdrawal request has been received" },
  { id: "processing", label: "Processing", description: "We're processing your transaction" },
  { id: "verification", label: "Verification", description: "Verifying your bank details" },
  { id: "transfer", label: "Transfer", description: "Transferring funds to your account" },
  { id: "complete", label: "Complete", description: "Transaction completed successfully" },
]

export default function TransactionProcessingPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const amount = searchParams.get("amount") || "100000"

  const [currentStep, setCurrentStep] = useState(0)
  const [progress, setProgress] = useState(0)
  const [status, setStatus] = useState<"processing" | "success" | "error">("processing")
  const [errorMessage, setErrorMessage] = useState("")
  const [transactionId, setTransactionId] = useState("")

  useEffect(() => {
    // Generate a random transaction ID
    setTransactionId(
      `TXN${Math.floor(Math.random() * 1000000)
        .toString()
        .padStart(6, "0")}`,
    )

    // Simulate the transaction process
    const stepDuration = 1500 // 1.5 seconds per step
    const totalSteps = steps.length

    // Update progress continuously
    const progressInterval = setInterval(
      () => {
        setProgress((prev) => {
          const nextProgress = prev + 1
          return nextProgress > 100 ? 100 : nextProgress
        })
      },
      (stepDuration * totalSteps) / 100,
    )

    // Update steps at intervals
    const stepInterval = setInterval(() => {
      setCurrentStep((prev) => {
        const nextStep = prev + 1

        // If we've reached the last step
        if (nextStep >= totalSteps - 1) {
          clearInterval(stepInterval)

          // Simulate a 90% success rate
          const isSuccess = Math.random() > 0.1

          if (isSuccess) {
            setStatus("success")
          } else {
            setStatus("error")
            setErrorMessage("Bank transfer failed. Please try again or contact support.")
          }
        }

        return nextStep >= totalSteps ? totalSteps - 1 : nextStep
      })
    }, stepDuration)

    // Clean up intervals
    return () => {
      clearInterval(progressInterval)
      clearInterval(stepInterval)
    }
  }, [])

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
            Transaction Processing
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Your withdrawal of ₹{Number.parseInt(amount).toLocaleString()} is being processed
          </p>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="border-gray-200 dark:border-gray-700 shadow-lg overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-purple-600/10 to-indigo-600/10 dark:from-purple-900/20 dark:to-indigo-900/20">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Transaction Status</CardTitle>
                  <CardDescription>Transaction ID: {transactionId}</CardDescription>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-700 dark:text-gray-300">Amount</div>
                  <div className="text-xl font-bold text-gray-900 dark:text-gray-100">
                    ₹{Number.parseInt(amount).toLocaleString()}
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="mb-6">
                <Progress value={progress} className="h-2" />
                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                  <span>Processing</span>
                  <span>{progress}%</span>
                </div>
              </div>

              <div className="space-y-6">
                {steps.map((step, index) => (
                  <div key={step.id} className="flex items-start">
                    <div className="flex-shrink-0 mr-4">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          index < currentStep
                            ? "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400"
                            : index === currentStep
                              ? "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 animate-pulse"
                              : "bg-gray-100 dark:bg-gray-800 text-gray-400"
                        }`}
                      >
                        {index < currentStep ? (
                          <CheckCircle className="h-5 w-5" />
                        ) : (
                          <span className="text-sm font-medium">{index + 1}</span>
                        )}
                      </div>
                    </div>
                    <div className="flex-grow">
                      <div
                        className={`text-base font-medium ${
                          index <= currentStep ? "text-gray-900 dark:text-gray-100" : "text-gray-500 dark:text-gray-400"
                        }`}
                      >
                        {step.label}
                      </div>
                      <div
                        className={`text-sm ${
                          index <= currentStep ? "text-gray-600 dark:text-gray-300" : "text-gray-400 dark:text-gray-500"
                        }`}
                      >
                        {step.description}
                      </div>
                      {index < steps.length - 1 && (
                        <div
                          className={`h-10 border-l border-dashed ml-4 my-1 ${
                            index < currentStep
                              ? "border-green-300 dark:border-green-700"
                              : "border-gray-300 dark:border-gray-700"
                          }`}
                        ></div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <AnimatePresence>
                {status === "success" && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-8 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 text-center"
                  >
                    <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-green-800 dark:text-green-400 mb-2">
                      Transaction Successful
                    </h3>
                    <p className="text-green-700 dark:text-green-300 mb-4">
                      ₹{Number.parseInt(amount).toLocaleString()} has been successfully transferred to your bank account
                    </p>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      <p>Transaction ID: {transactionId}</p>
                      <p>Date: {new Date().toLocaleDateString()}</p>
                      <p>Time: {new Date().toLocaleTimeString()}</p>
                    </div>
                  </motion.div>
                )}

                {status === "error" && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-8 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 text-center"
                  >
                    <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                      <AlertCircle className="h-8 w-8 text-red-600 dark:text-red-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-red-800 dark:text-red-400 mb-2">Transaction Failed</h3>
                    <p className="text-red-700 dark:text-red-300 mb-4">{errorMessage}</p>
                    <Button
                      onClick={() => router.push("/withdraw-amount")}
                      className="bg-red-600 hover:bg-red-700 text-white"
                    >
                      Try Again
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
            <CardFooter className="bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {status === "success"
                  ? "Transaction completed"
                  : status === "error"
                    ? "Transaction failed"
                    : "Processing transaction..."}
              </div>
              <div className="flex gap-2">
                {status === "success" && (
                  <>
                    <Button variant="outline" size="sm" className="flex items-center gap-1">
                      <Download className="h-4 w-4" /> Receipt
                    </Button>
                    <Button
                      size="sm"
                      className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                      onClick={() => router.push("/dashboard")}
                    >
                      <Home className="h-4 w-4 mr-1" /> Dashboard
                    </Button>
                  </>
                )}
              </div>
            </CardFooter>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  )
}

