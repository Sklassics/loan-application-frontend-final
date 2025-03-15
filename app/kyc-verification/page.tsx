"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent} from "@/components/ui/tabs"
import { FileUploader } from "@/components/kyc/file-uploader"
import { AlertCircle, CheckCircle } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useProfileStore } from "@/store/profile"

const formSchema = z.object({
  panNumber: z.string().regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, {
    message: "PAN number must be in the format ABCDE1234F",
  }),
})

export default function KycVerificationPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("upload")
  const [panImage, setPanImage] = useState<File | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [verificationStatus, setVerificationStatus] = useState<"idle" | "success" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState("")
  const [panId,setPanId] = useState("")
  const sendPanOtp = useProfileStore((state) => state.sendPanOtpAction)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      panNumber: "",
    },
  })
  const handlePanUpload = (file: File) => {
    setPanImage(file)
    // In a real app, you might want to extract PAN details from the image using OCR
    // For demo purposes, we'll just set the active tab to details
  }

  const onSubmit = async () => {
    if (!panImage || !panId) {
      setErrorMessage("Please upload both selfie and PAN card images")
      return
    }
    const panIdRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    if (!panIdRegex.test(panId)) {
      setErrorMessage("PAN Id must be in the format ABCDE1234F")
      return;
    }

    setIsSubmitting(true)
    setVerificationStatus("idle")
    try {
      let req = {
        panId,
        panImage,
      }
      const response:any = await sendPanOtp(req)
      if (response.status == 200) {
        setVerificationStatus("success")
        setTimeout(() => {
          router.push("/eligibility-check")
        }, 2000)
      } else {
        setVerificationStatus("error")
        setErrorMessage("Verification failed. Please check your details and try again.")
      }
    } catch (error) {
      setVerificationStatus("error")
      setErrorMessage("An error occurred during verification. Please try again.")
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
            KYC Verification
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Complete your KYC verification to proceed with your loan application
          </p>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="border-gray-200 dark:border-gray-700 shadow-lg overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-purple-600/10 to-indigo-600/10 dark:from-purple-900/20 dark:to-indigo-900/20">
              <CardTitle>Identity Verification</CardTitle>
              <CardDescription>Please upload your PAN card for verification</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsContent value="upload" className="space-y-6">
                  <div className="grid md:grid-cols-1 gap-6">
                    <div>
                      <Label className="block mb-2" htmlFor="pan-id">
                        PAN ID
                      </Label>
                      <Input
                        id="pan-id"
                        type="text"
                        placeholder="Enter your PAN ID"
                        className="block w-full"
                        value={panId}
                        onChange={(e) => setPanId(e.target.value)}
                      />
                    </div>

                    <div>
                      <Label className="block mb-2">PAN Card</Label>
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
                                Your KYC verification is complete. Redirecting to bank verification...
                              </AlertDescription>
                            </Alert>
                          </motion.div>
                        )}
                      </AnimatePresence>

                  <div className="flex justify-end mt-6">
                  <Button
                    onClick={() => {onSubmit()}}
                    disabled={!(panImage && panId)}
                    className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                  >
                    Verify
                  </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  )
}

