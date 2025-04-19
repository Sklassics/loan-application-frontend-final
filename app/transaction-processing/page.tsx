"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle, AlertCircle, ArrowRight, Download, Share2 } from "lucide-react"
import confetti from "canvas-confetti"
import axios from "axios"

export default function TransactionProcessingPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const amount = searchParams?.get("amount") || "2000"

  const [progress, setProgress] = useState(0)
  const [status, setStatus] = useState<"processing" | "success" | "failed">("processing")
  const [transactions, setTransactions] = useState<any[]>([]) // Add state for transactions
  const [transactionId, setTransactionId] = useState("")
  const [showConfetti, setShowConfetti] = useState(false)
  useEffect(() => {
    const createTransaction = async () => {
      try {
        const token = localStorage.getItem("auth_token")
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/api/transactions/create`,
          { amount: Number(amount) },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "ngrok-skip-browser-warning": "true",
            },
          }
        )
        console.log("Transaction created:", response.data)
      } catch (error) {
        console.error("Error creating transaction:", error)
      }
    }
  
    if (status === "success") {
      createTransaction()
    }
  }, [status])
  const fetchTransactions = async () => {
    try {
      const token = localStorage.getItem("auth_token")
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/transactions/all`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "ngrok-skip-browser-warning": "true",
        },
      })
  
      if (response.data.success) {
        setTransactions(response.data.transactions)
      }
    } catch (error) {
      console.error("Error fetching transactions:", error)
    }
  }
  
  useEffect(() => {
    // Generate a random transaction ID
    const randomId = Math.random().toString(36).substring(2, 10).toUpperCase()
    setTransactionId(`TXN${randomId}`)

    // Simulate transaction processing
    const interval = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress >= 100) {
          clearInterval(interval)
          return 100
        }
        return prevProgress + 5
      })
    }, 300)

    // Simulate transaction completion
    setTimeout(() => {
      clearInterval(interval)
      setProgress(100)
      setStatus("success")
      setShowConfetti(true)
    }, 6000)

    return () => clearInterval(interval)
  }, [])

  // Trigger confetti effect when transaction is successful
  useEffect(() => {
    if (showConfetti) {
      const duration = 3 * 1000
      const animationEnd = Date.now() + duration
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 }

      function randomInRange(min: number, max: number) {
        return Math.random() * (max - min) + min
      }

      const interval = setInterval(() => {
        const timeLeft = animationEnd - Date.now()

        if (timeLeft <= 0) {
          clearInterval(interval)
          return
        }

        const particleCount = 50 * (timeLeft / duration)

        // Since particles fall down, start a bit higher than random
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        })
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        })
      }, 250)

      return () => clearInterval(interval)
    }
  }, [showConfetti])

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

  const handleViewRepaymentSchedule = () => {
    router.push(`/repayment-schedule?amount=${amount}&txn=${transactionId}`)
  }

  const handleDownloadReceipt = () => {
    // In a real app, this would generate and download a PDF receipt
    alert("Receipt download functionality would be implemented here")
  }

  const handleShareReceipt = () => {
    // In a real app, this would open a share dialog
    if (navigator.share) {
      navigator.share({
        title: "Loan Disbursement Receipt",
        text: `Loan amount of ₹${Number.parseInt(amount).toLocaleString()} has been disbursed. Transaction ID: ${transactionId}`,
        url: window.location.href,
      })
    } else {
      alert("Share functionality would be implemented here")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-gray-900 dark:to-slate-900 py-12 px-4">
      <motion.div initial="hidden" animate="visible" variants={containerVariants} className="max-w-4xl mx-auto">
        <motion.div variants={itemVariants} className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600">
            Transaction Processing
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            {status === "processing"
              ? "Please wait while we process your transaction"
              : status === "success"
                ? "Your loan has been successfully disbursed"
                : "There was an issue with your transaction"}
          </p>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="border-gray-200 dark:border-gray-700 shadow-lg overflow-hidden">
            <CardHeader
              className={`
              ${
                status === "processing"
                  ? "bg-gradient-to-r from-blue-600/10 to-indigo-600/10 dark:from-blue-900/20 dark:to-indigo-900/20"
                  : status === "success"
                    ? "bg-gradient-to-r from-green-600/10 to-emerald-600/10 dark:from-green-900/20 dark:to-emerald-900/20"
                    : "bg-gradient-to-r from-red-600/10 to-orange-600/10 dark:from-red-900/20 dark:to-orange-900/20"
              }
            `}
            >
              <CardTitle>
                {status === "processing"
                  ? "Processing Transaction"
                  : status === "success"
                    ? "Transaction Successful"
                    : "Transaction Failed"}
              </CardTitle>
              <CardDescription>
                {status === "processing"
                  ? "Your loan disbursement is being processed"
                  : status === "success"
                    ? "Your loan amount has been disbursed to your bank account"
                    : "There was an issue processing your transaction"}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-6">
                {status === "processing" && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Processing</span>
                      <span>{progress}%</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                    <p className="text-sm text-center text-gray-500 dark:text-gray-400 mt-2 animate-pulse">
                      Please do not close this window
                    </p>
                  </div>
                )}

                <AnimatePresence>
                  {status === "success" && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                      className="space-y-6"
                    >
                      <Alert className="bg-green-50 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800">
                        <CheckCircle className="h-4 w-4" />
                        <AlertTitle>Transaction Successful</AlertTitle>
                        <AlertDescription>
                          Your loan amount of ₹{Number.parseInt(amount).toLocaleString()} has been successfully
                          disbursed to your bank account.
                        </AlertDescription>
                      </Alert>

                      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                          Transaction Details
                        </h3>

                        <div className="space-y-3">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600 dark:text-gray-400">Transaction ID:</span>
                            <span className="font-medium">{transactionId}</span>
                          </div>

                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600 dark:text-gray-400">Amount Disbursed:</span>
                            <span className="font-medium">₹{Number.parseInt(amount).toLocaleString()}</span>
                          </div>

                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600 dark:text-gray-400">Date & Time:</span>
                            <span className="font-medium">{new Date().toLocaleString()}</span>
                          </div>

                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600 dark:text-gray-400">Status:</span>
                            <span className="font-medium text-green-600 dark:text-green-400">Successful</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-3">
                        <Button
                          variant="outline"
                          className="flex-1 border-gray-300 dark:border-gray-600"
                          onClick={handleDownloadReceipt}
                        >
                          <Download className="mr-2 h-4 w-4" />
                          Download Receipt
                        </Button>
                        <Button
                          variant="outline"
                          className="flex-1 border-gray-300 dark:border-gray-600"
                          onClick={handleShareReceipt}
                        >
                          <Share2 className="mr-2 h-4 w-4" />
                          Share Receipt
                        </Button>
                      </div>

                      <div className="flex justify-center">
                        <Button
                          onClick={handleViewRepaymentSchedule}
                          className="bg-violet-150"
                        >
                          View Dashboard<ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </div>
                    </motion.div>
                  )}

                  {status === "failed" && (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                      <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Transaction Failed</AlertTitle>
                        <AlertDescription>
                          There was an issue processing your transaction. Please try again or contact customer support.
                        </AlertDescription>
                      </Alert>

                      <div className="flex justify-center mt-6">
                        <Button
                          onClick={() => router.push("/withdraw-amount")}
                          className="bg-violet-150"
                        >
                          Try Again
                        </Button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  )
}

