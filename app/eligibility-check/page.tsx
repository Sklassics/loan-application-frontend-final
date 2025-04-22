  "use client"

  import { useState, useEffect } from "react"
  import { useRouter } from "next/navigation"
  import { motion, AnimatePresence } from "framer-motion"
  import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
  import { Button } from "@/components/ui/button"
  import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
  import { Progress } from "@/components/ui/progress"
  import { Loader2, AlertCircle, CheckCircle, IndianRupee, Clock, ArrowRight } from "lucide-react"
  import { useCreditStore } from "@/store/credit"

  export default function EligibilityCheckPage() {
    const router = useRouter();
    const [isChecking, setIsChecking] = useState(false);
    const [checkingProgress, setCheckingProgress] = useState(0);
    const [checkStatus, setCheckStatus] = useState<"idle" | "checking" | "success" | "error">("idle");
    const [eligibleAmount, setEligibleAmount] = useState(0);
    const [errorReason, setErrorReason] = useState("");
    const getCreditLimit = useCreditStore((state) => state.getCreditLimitAction);
    
    const checkEligibility = async () => {
      setIsChecking(true);
      setCheckStatus("checking");
      setCheckingProgress(0);
    
      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setCheckingProgress((prev) => {
          if (prev >= 95) { // Stop incrementing near 100 to allow the final update in `finally`
            return prev;
          }
          return prev + 5;
        });
      }, 150);
    
      try {
        const response = await getCreditLimit();
    
        if (response?.status === 200) {
          if (response?.creditLimit !== undefined) {  // ✅ Fixed: Access creditLimit correctly
            setEligibleAmount(response.creditLimit);
            setCheckStatus("success");
          } else {
            setErrorReason("Your credit score is below our threshold. Please try again after 6 months.");
            setCheckStatus("error");
          }
        } else {
          setErrorReason(response?.message || "An unexpected error occurred.");
          setCheckStatus("error");
        }
      } catch (error) {
        setCheckStatus("error");
        setErrorReason("An error occurred while checking eligibility. Please try again.");
      } finally {
        clearInterval(progressInterval);
        setCheckingProgress(100);
        setIsChecking(false);
      }
    };
    
    const handleContinue = () => {
      router.push("/bank-verification");
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
    const [loading, setLoading] = useState(true); // Set initial state to true
    useEffect(() => {
      // Simulate a delay or fetch data
      const timer = setTimeout(() => {
        setLoading(false); // Set loading to false after delay
      }, 2000); // Adjust the delay as needed
  
      return () => clearTimeout(timer); // Cleanup timer on unmount
    }, []);
   if (loading) {
      // Loader while data is being fetched
      return (
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-20 w-20 border-t-2 border-b-2 border-violet-500"></div>
        </div>
      );
    }
  
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-gray-900 dark:to-slate-900 lg:py-12 lg:px-4">
        <motion.div initial="hidden" animate="visible" variants={containerVariants} className="max-w-4xl mx-auto">
          <motion.div variants={itemVariants} className="hidden lg:block text-center mb-8">
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600">
              Loan Eligibility Check
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              Check if you're eligible for a loan and see your approved amount
            </p>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="border-gray-200 dark:border-gray-700 shadow-lg overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-purple-600/10 to-indigo-600/10 dark:from-purple-900/20 dark:to-indigo-900/20">
                <CardTitle>Eligibility Status</CardTitle>
                <CardDescription>Check your loan eligibility based on your KYC and credit profile</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <AnimatePresence mode="wait">
                  {checkStatus === "idle" && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="text-center py-8"
                    >
                      <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-full p-6 w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                        <IndianRupee className="h-12 w-12 text-indigo-600 dark:text-indigo-400" />
                      </div>
                      <h3 className="text-xl font-semibold mb-2">Ready to Check Eligibility</h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
                        Click the button below to check your loan eligibility. This will analyze your KYC details and
                        credit profile.
                      </p>
                      <Button
                        onClick={checkEligibility}
                        className="bg-violet-150 px-8"
                      >
                        Check Eligibility
                      </Button>
                    </motion.div>
                  )}

                  {checkStatus === "checking" && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="text-center py-8"
                    >
                      <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-full p-6 w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                        <Loader2 className="h-12 w-12 text-indigo-600 dark:text-indigo-400 animate-spin" />
                      </div>
                      <h3 className="text-xl font-semibold mb-2">Checking Eligibility</h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
                        Please wait while we check your eligibility. This may take a few moments.
                      </p>
                      <div className="max-w-md mx-auto">
                        <Progress value={checkingProgress} className="h-2 mb-2" />
                        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                          <span>Verifying credit score</span>
                          <span>{checkingProgress}%</span>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {checkStatus === "success" && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="text-center py-8"
                    >
                      <div className="bg-green-50 dark:bg-green-900/20 rounded-full p-6 w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                        <CheckCircle className="h-12 w-12 text-green-600 dark:text-green-400" />
                      </div>
                      <h3 className="text-xl font-semibold mb-2">Congratulations! You're Eligible</h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-4 max-w-md mx-auto">
                        Based on your profile, you're eligible for a loan of:
                      </p>
                      <div className="text-4xl font-bold text-green-600 dark:text-green-400 mb-6">
                        ₹{eligibleAmount.toLocaleString()}
                      </div>
                      <Button
                        onClick={handleContinue}
                        className="bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 px-8"
                      >
                        Continue to Withdraw <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </motion.div>
                  )}

                  {checkStatus === "error" && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="text-center py-8"
                    >
                      <div className="bg-red-50 dark:bg-red-900/20 rounded-full p-6 w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                        <AlertCircle className="h-12 w-12 text-red-600 dark:text-red-400" />
                      </div>
                      <Alert variant="destructive" className="mb-6 max-w-md mx-auto">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Eligibility Check</AlertTitle>
                        <AlertDescription>{errorReason}</AlertDescription>
                      </Alert>
                      <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button
                          variant="outline"
                          onClick={() => router.push("/dashboard")}
                          className="border-gray-300 dark:border-gray-600"
                        >
                          Go to Dashboard
                        </Button>
                        <Button
                          onClick={() => {
                            setCheckStatus("idle")
                            setErrorReason("")
                          }}
                          className="bg-violet-150 "
                        >
                          Try Again
                        </Button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </CardContent>
              <CardFooter className="bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                  <Clock className="h-4 w-4 mr-1" />
                  Last updated: {new Date().toLocaleDateString()}
                </div>
                {checkStatus !== "idle" && checkStatus !== "checking" && (
                  <Button
                    variant="ghost"
                    onClick={() => setCheckStatus("idle")}
                    className="text-gray-500 dark:text-gray-400"
                  >
                    Check Again
                  </Button>
                )}
              </CardFooter>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    )
  }

