"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { FileUp, Upload, User, CreditCard } from "lucide-react"
import { motion } from "framer-motion"

export default function VerificationPage() {
  const [idFile, setIdFile] = useState<File | null>(null)
  const [panFile, setPanFile] = useState<File | null>(null)
  const [selfieFile, setSelfieFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [activeTab, setActiveTab] = useState("id")

  const handleIdUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setIdFile(e.target.files[0])
    }
  }

  const handlePanUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPanFile(e.target.files[0])
    }
  }

  const handleSelfieUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelfieFile(e.target.files[0])
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setUploading(true)

    // Simulate API call
    setTimeout(() => {
      setUploading(false)
      alert("Verification documents submitted successfully!")
    }, 2000)
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 70 } },
  }
 
  return (
    <DashboardShell>
      <DashboardHeader
        heading="Verification"
        text="Complete your identity verification to proceed with loan applications."
      />
      <Tabs defaultValue="id" className="space-y-4" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-slate-100/80 backdrop-blur-sm">
          <TabsTrigger
            value="id"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-violet-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white"
          >
            <User className="h-4 w-4 mr-2" />
            ID Verification
          </TabsTrigger>
          <TabsTrigger
            value="pan"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-violet-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white"
          >
            <CreditCard className="h-4 w-4 mr-2" />
            PAN Card
          </TabsTrigger>
        </TabsList>

        <TabsContent value="id" className="space-y-4">
          <motion.div variants={container} initial="hidden" animate="show">
            <Card className="border-slate-200 hover:shadow-md transition-shadow duration-300 overflow-hidden">
              <div className="hidden md:absolute h-1 w-full top-0 bg-gradient-to-r from-violet-500 to-indigo-500"></div>
              <CardHeader>
                <CardTitle className="text-slate-800">ID Verification</CardTitle>
                <CardDescription className="text-slate-500">
                  Upload your college ID or employee ID for verification
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <motion.div variants={item} className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="full-name" className="text-slate-700">
                        Full Name (as on ID)
                      </Label>
                      <Input
                        id="full-name"
                        placeholder="Enter your full name"
                        required
                        className="border-slate-300 focus:border-violet-500 focus:ring-violet-500/20"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="id-number" className="text-slate-700">
                        ID Number
                      </Label>
                      <Input
                        id="id-number"
                        placeholder="Enter your ID number"
                        required
                        className="border-slate-300 focus:border-violet-500 focus:ring-violet-500/20"
                      />
                    </div>
                  </motion.div>

                  <motion.div variants={item} className="space-y-2">
                    <Label htmlFor="id-type" className="text-slate-700">
                      ID Type
                    </Label>
                    <select
                      id="id-type"
                      className="w-full rounded-md border border-slate-300 bg-background px-3 py-2 text-sm focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 outline-none transition-colors"
                      required
                    >
                      <option value="">Select ID Type</option>
                      <option value="college">College ID</option>
                      <option value="employee">Employee ID</option>
                      <option value="aadhar">Aadhar Card</option>
                      <option value="voter">Voter ID</option>
                      <option value="driving">Driving License</option>
                    </select>
                  </motion.div>

                  <motion.div variants={item} className="space-y-2">
                    <Label className="text-slate-700">Upload ID (Front)</Label>
                    <div className="flex items-center justify-center w-full">
                      <label
                        htmlFor="id-front"
                        className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-slate-50 hover:bg-slate-100 border-slate-300 hover:border-violet-300 transition-colors"
                      >
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <Upload className="w-8 h-8 mb-2 text-slate-500" />
                          <p className="mb-2 text-sm text-slate-600">
                            <span className="font-semibold">Click to upload</span> or drag and drop
                          </p>
                          <p className="text-xs text-slate-500">PNG, JPG or PDF (MAX. 5MB)</p>
                        </div>
                        <input
                          id="id-front"
                          type="file"
                          className="hidden"
                          onChange={handleIdUpload}
                          accept="image/png, image/jpeg, application/pdf"
                          required
                        />
                      </label>
                    </div>
                    {idFile && (
                      <p className="text-sm text-slate-600 flex items-center gap-1">
                        <FileUp className="h-4 w-4 text-violet-600" /> {idFile.name}
                      </p>
                    )}
                  </motion.div>

                  <motion.div variants={item} className="space-y-2">
                    <Label className="text-slate-700">Upload Selfie</Label>
                    <div className="flex items-center justify-center w-full">
                      <label
                        htmlFor="selfie"
                        className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-slate-50 hover:bg-slate-100 border-slate-300 hover:border-violet-300 transition-colors"
                      >
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <Upload className="w-8 h-8 mb-2 text-slate-500" />
                          <p className="mb-2 text-sm text-slate-600">
                            <span className="font-semibold">Click to upload</span> a clear selfie
                          </p>
                          <p className="text-xs text-slate-500">PNG or JPG (MAX. 5MB)</p>
                        </div>
                        <input
                          id="selfie"
                          type="file"
                          className="hidden"
                          onChange={handleSelfieUpload}
                          accept="image/png, image/jpeg"
                          required
                        />
                      </label>
                    </div>
                    {selfieFile && (
                      <p className="text-sm text-slate-600 flex items-center gap-1">
                        <FileUp className="h-4 w-4 text-violet-600" /> {selfieFile.name}
                      </p>
                    )}
                  </motion.div>

                  <motion.div variants={item} className="space-y-2">
                    <Label htmlFor="declaration" className="text-slate-700">
                      Declaration
                    </Label>
                    <div className="flex items-start space-x-2">
                      <input
                        type="checkbox"
                        id="declaration"
                        className="h-4 w-4 mt-1 rounded border-slate-300 text-violet-600 focus:ring-violet-500/20"
                        required
                      />
                      <label htmlFor="declaration" className="text-sm text-slate-600">
                        I hereby declare that the information provided is true and correct. I also understand that any
                        willful dishonesty may result in rejection of my application.
                      </label>
                    </div>
                  </motion.div>

                  <motion.div variants={item}>
                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 transition-all duration-300"
                      disabled={uploading}
                    >
                      {uploading ? (
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
                          Uploading...
                        </div>
                      ) : (
                        "Submit for Verification"
                      )}
                    </Button>
                  </motion.div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        <TabsContent value="pan" className="space-y-4">
          <motion.div variants={container} initial="hidden" animate="show">
            <Card className="border-slate-200 hover:shadow-md transition-shadow duration-300 overflow-hidden">
              <div className="absolute h-1 w-full top-0 bg-gradient-to-r from-indigo-500 to-blue-500"></div>
              <CardHeader>
                <CardTitle className="text-slate-800">PAN Card Verification</CardTitle>
                <CardDescription className="text-slate-500">Upload your PAN Card for verification</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <motion.div variants={item} className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="pan-name" className="text-slate-700">
                        Full Name (as on PAN)
                      </Label>
                      <Input
                        id="pan-name"
                        placeholder="Enter your full name"
                        required
                        className="border-slate-300 focus:border-indigo-500 focus:ring-indigo-500/20"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="pan-number" className="text-slate-700">
                        PAN Number
                      </Label>
                      <Input
                        id="pan-number"
                        placeholder="Enter your PAN number"
                        pattern="[A-Z]{5}[0-9]{4}[A-Z]{1}"
                        title="Enter valid PAN number. E.g., ABCDE1234F"
                        required
                        className="border-slate-300 focus:border-indigo-500 focus:ring-indigo-500/20"
                      />
                    </div>
                  </motion.div>

                  <motion.div variants={item} className="space-y-2">
                    <Label className="text-slate-700">Upload PAN Card</Label>
                    <div className="flex items-center justify-center w-full">
                      <label
                        htmlFor="pan-card"
                        className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-slate-50 hover:bg-slate-100 border-slate-300 hover:border-indigo-300 transition-colors"
                      >
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <Upload className="w-8 h-8 mb-2 text-slate-500" />
                          <p className="mb-2 text-sm text-slate-600">
                            <span className="font-semibold">Click to upload</span> or drag and drop
                          </p>
                          <p className="text-xs text-slate-500">PNG, JPG or PDF (MAX. 5MB)</p>
                        </div>
                        <input
                          id="pan-card"
                          type="file"
                          className="hidden"
                          onChange={handlePanUpload}
                          accept="image/png, image/jpeg, application/pdf"
                          required
                        />
                      </label>
                    </div>
                    {panFile && (
                      <p className="text-sm text-slate-600 flex items-center gap-1">
                        <FileUp className="h-4 w-4 text-indigo-600" /> {panFile.name}
                      </p>
                    )}
                  </motion.div>

                  <motion.div variants={item} className="space-y-2">
                    <Label htmlFor="pan-declaration" className="text-slate-700">
                      Declaration
                    </Label>
                    <div className="flex items-start space-x-2">
                      <input
                        type="checkbox"
                        id="pan-declaration"
                        className="h-4 w-4 mt-1 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500/20"
                        required
                      />
                      <label htmlFor="pan-declaration" className="text-sm text-slate-600">
                        I hereby declare that the PAN details provided are true and correct. I understand that providing
                        false information may result in legal consequences.
                      </label>
                    </div>
                  </motion.div>

                  <motion.div variants={item}>
                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 transition-all duration-300"
                      disabled={uploading}
                    >
                      {uploading ? (
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
                          Uploading...
                        </div>
                      ) : (
                        "Submit PAN for Verification"
                      )}
                    </Button>
                  </motion.div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>
      </Tabs>
    </DashboardShell>
  )
}

