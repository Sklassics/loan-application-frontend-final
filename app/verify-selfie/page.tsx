"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Camera, Upload, Check, X, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import axios from "axios"
import { useRouter } from "next/navigation"
function Loader({ message }: { message: string }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-75">
      <div className="flex flex-col items-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-500"></div>
        <p className="mt-4 text-indigo-500 font-medium">{message}</p>
      </div>
    </div>
  );
}

export default function SelfieVerificationPage() {
  const [captureMode, setCaptureMode] = useState<"camera" | "upload" | null>(null)
  const [selfieImage, setSelfieImage] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(false) // Added isLoading state
  const [isSuccess, setIsSuccess] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const { toast } = useToast()
  const router = useRouter()

  // Clean up camera stream when component unmounts
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop())
      }
    }
  }, [])

  // Start camera when camera mode is selected
  useEffect(() => {
    if (captureMode === "camera") {
      startCamera()
    } else if (streamRef.current) {
      // Stop camera when switching away from camera mode
      streamRef.current.getTracks().forEach((track) => track.stop())
      streamRef.current = null
    }
  }, [captureMode])

  const startCamera = async () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      toast({
        title: "Unsupported Device",
        description: "Your device does not support camera access. Please upload an image instead.",
        variant: "destructive",
      });
      setCaptureMode("upload");
      return;
    }
  
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "user",
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      });
  
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      if (err instanceof Error && err.name === "NotAllowedError") {
        toast({
          title: "Camera Permission Denied",
          description: "Please allow camera access in your browser settings.",
          variant: "destructive",
        });
      } else if (err instanceof Error && err.name === "NotFoundError") {
        toast({
          title: "Camera Not Found",
          description: "No camera device was found. Please upload an image instead.",
          variant: "destructive",
        });
      } else if (err instanceof Error && err.name === "NotReadableError") {
        toast({
          title: "Camera in Use",
          description: "Your camera is currently being used by another application. Please close it and try again.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Camera Error",
          description: "An unexpected error occurred while accessing the camera.",
          variant: "destructive",
        });
      }
      setCaptureMode("upload"); // Fallback to upload mode
    }
  };

  const captureSelfie = () => {
    if (videoRef.current) {
      const canvas = document.createElement("canvas")
      canvas.width = videoRef.current.videoWidth
      canvas.height = videoRef.current.videoHeight
      const ctx = canvas.getContext("2d")

      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height)
        const imageDataUrl = canvas.toDataURL("image/jpeg")
        setSelfieImage(imageDataUrl)

        // Stop the camera stream after capturing
        if (streamRef.current) {
          streamRef.current.getTracks().forEach((track) => track.stop())
          streamRef.current = null
        }
      }
    }
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!["image/jpeg", "image/png", "image/jpg"].includes(file.type)) {
      toast({
        title: "Invalid File Type",
        description: "Please upload a JPG or PNG image.",
        variant: "destructive",
      })
      return
    }

    // Validate file size (Max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File Too Large",
        description: "Please upload an image smaller than 5MB.",
        variant: "destructive",
      })
      return
    }

    // Convert file to Base64
    const reader = new FileReader()
    reader.onload = (event) => {
      setSelfieImage(event.target?.result as string)
    }
    reader.readAsDataURL(file)
  }

  const resetSelfie = () => {
    setSelfieImage(null)
  }

  const handleSubmit = async () => {
    if (!selfieImage) return

    setIsSubmitting(true)

    try {
      // Convert base64 to Blob
      const byteCharacters = atob(selfieImage.split(",")[1])
      const byteNumbers = new Array(byteCharacters.length)
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i)
      }
      const byteArray = new Uint8Array(byteNumbers)
      const blob = new Blob([byteArray], { type: "image/jpeg" })

      // Create FormData
      const formData = new FormData()
      formData.append("selfie_image", blob, "selfie.jpg")

      // Get JWT token
      const token = localStorage.getItem("auth_token")
      if (!token) {
        throw new Error("Authentication token not found")
      }

      // Send to API
      const apiResponse = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/selfie/upload`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      )

      // Handle Response
      if (apiResponse.status === 200) {
        toast({
          title: "Verification Successful",
          description: "Your selfie has been uploaded successfully.",
          variant: "default",
        })

        setSelfieImage(null); // Clear the selfie image
        router.push("/kyc-verification"); // Redirect immediately
      } else {
        throw new Error("Failed to upload selfie");
      }
    } catch (error) {
      console.error("Upload Error:", error)
      toast({
        title: "Submission Failed",
        description:
          error instanceof Error ? error.message : "Failed to upload selfie. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    // Show loader while the page is loading
    return <Loader message="Loading Selfie Verification..." />;
  }
 
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md mx-auto"
      >
        <Card className="overflow-hidden border-t-4 border-t-primary shadow-lg relative">
          {isSubmitting && (
            // Loader overlay while API request is in progress
            <Loader message="Submitting Selfie..." />
          )}
          <div className="p-6">
            <motion.h1
              className="text-2xl font-bold text-center mb-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              Selfie Verification
            </motion.h1>
            <motion.p
              className="text-center text-gray-500 dark:text-gray-400 mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              Please take a clear selfie for identity verification
            </motion.p>

            <AnimatePresence mode="wait">
              {!captureMode && !selfieImage ? (
                <motion.div
                  key="options"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-4"
                >
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setCaptureMode("camera")}
                    className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 cursor-pointer flex items-center space-x-4 hover:shadow-md transition-all"
                  >
                    <div className="bg-primary/10 p-3 rounded-full">
                      <Camera className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">Take a Selfie</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Use your camera to take a photo now</p>
                    </div>
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setCaptureMode("upload")}
                    className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 cursor-pointer flex items-center space-x-4 hover:shadow-md transition-all"
                  >
                    <div className="bg-primary/10 p-3 rounded-full">
                      <Upload className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">Upload a Photo</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Select an existing photo from your device
                      </p>
                    </div>
                  </motion.div>
                </motion.div>
              ) : selfieImage ? (
                <motion.div
                  key="preview"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-4"
                >
                  <div className="relative">
                    <motion.div
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ type: "spring", stiffness: 300, damping: 25 }}
                      className="relative rounded-lg overflow-hidden aspect-[3/4] bg-gray-100 dark:bg-gray-700 shadow-inner"
                    >
                      <img
                        src={selfieImage || "/placeholder.svg"}
                        alt="Selfie preview"
                        className="w-full h-full object-cover"
                      />
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="absolute top-2 right-2"
                      >
                        <Button
                          size="icon"
                          variant="destructive"
                          onClick={resetSelfie}
                          className="rounded-full h-8 w-8"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </motion.div>
                    </motion.div>
                  </div>

                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="flex justify-center"
                  >
                    <Button
                      onClick={handleSubmit}
                      disabled={isSubmitting || isSuccess}
                      className="w-full py-6 text-lg relative"
                    >
                      {isSubmitting ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      ) : isSuccess ? (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        >
                          <Check className="h-5 w-5" />
                        </motion.div>
                      ) : (
                        "Submit Verification"
                      )}
                    </Button>
                  </motion.div>
                </motion.div>
              ) : captureMode === "camera" ? (
                <motion.div
                  key="camera"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-4"
                >
                  <div className="relative rounded-lg overflow-hidden aspect-[3/4] bg-gray-900 shadow-inner">
                    <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />

                    {/* Camera guidelines overlay */}
                    <div className="absolute inset-0 border-2 border-dashed border-white/30 m-8 rounded-full pointer-events-none"></div>

                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 }}
                      className="absolute top-2 right-2"
                    >
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() => setCaptureMode(null)}
                        className="rounded-full bg-white/20 backdrop-blur-sm h-8 w-8 border-white/40"
                      >
                        <X className="h-4 w-4 text-white" />
                      </Button>
                    </motion.div>
                  </div>

                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="flex justify-center"
                  >
                    <Button onClick={captureSelfie} className="rounded-full h-16 w-16 p-0 border-4 border-primary">
                      <div className="bg-white rounded-full h-12 w-12"></div>
                    </Button>
                  </motion.div>

                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="text-center text-sm text-gray-500 dark:text-gray-400"
                  >
                    Position your face within the circle and tap the button
                  </motion.p>
                </motion.div>
              ) : captureMode === "upload" ? (
                <motion.div
                  key="upload"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-4"
                >
                  <label className="block">
                    <div className="relative rounded-lg overflow-hidden aspect-[3/4] bg-gray-100 dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-700 flex flex-col items-center justify-center cursor-pointer hover:border-primary/50 transition-colors">
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/jpg"
                        onChange={handleFileUpload}
                        className="sr-only"
                      />
                      <Upload className="h-10 w-10 text-gray-400 dark:text-gray-500 mb-4" />
                      <p className="text-sm font-medium">Click to upload a selfie</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">JPG or PNG (max 5MB)</p>

                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="absolute top-2 right-2"
                      >
                        <Button
                          size="icon"
                          variant="outline"
                          onClick={() => setCaptureMode(null)}
                          className="rounded-full h-8 w-8"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </motion.div>
                    </div>
                  </label>

                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="text-center text-sm text-gray-500 dark:text-gray-400"
                  >
                    Please upload a clear, well-lit photo of your face
                  </motion.p>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        </Card>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-6 text-center"
        >
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Your photo will only be used for identity verification purposes
          </p>
        </motion.div>
      </motion.div>
    </div>
  )
}

