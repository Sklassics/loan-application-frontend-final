"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { FileUp, Upload } from "lucide-react"
import { Stepper, Step } from "@/components/stepper"
import { motion } from "framer-motion"

export default function ApplyLoanPage() {
  const [currentStep, setCurrentStep] = useState(0)
  const [loanAmount, setLoanAmount] = useState("")
  const [loanPurpose, setLoanPurpose] = useState("")
  const [loanTerm, setLoanTerm] = useState("")
  const [salarySlip, setSalarySlip] = useState<File | null>(null)
  const [bankStatement, setBankStatement] = useState<File | null>(null)
  const [addressProof, setAddressProof] = useState<File | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSalarySlipUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSalarySlip(e.target.files[0])
    }
  }

  const handleBankStatementUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setBankStatement(e.target.files[0])
    }
  }

  const handleAddressProofUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAddressProof(e.target.files[0])
    }
  }

  const handleNext = () => {
    setCurrentStep((prev) => prev + 1)
  }

  const handlePrevious = () => {
    setCurrentStep((prev) => prev - 1)
  }

  const handleSubmit = () => {
    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      setCurrentStep(3) // Move to success step
    }, 2000)
  }

  return (
    <DashboardShell>
      <DashboardHeader heading="Apply for Loan" text="Complete the application process to get your loan." />

      <Stepper currentStep={currentStep} className="mb-7 mt-3 md:w-7/12 mx-auto md:px-0">
        <Step title="Details" />
        <Step title="Documents" />
        <Step title="Review" />
        <Step title="Confirmation" />
      </Stepper>

      {currentStep === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="space-y-4"
        >
          <Card className="bg-background border border-input rounded-lg shadow-sm">
            <CardHeader className="bg-primary text-white px-4 py-2">
              <CardTitle className="text-xl font-semibold">Loan Details</CardTitle>
              <CardDescription className="text-sm font-light">
                Provide details about the loan you want to apply for
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 px-4 py-6">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, ease: "easeOut", delay: 0.1 }}
                className="rounded-lg border p-4"
              >
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, ease: "easeOut", delay: 0.2 }}
                  className="space-y-2"
                >
                  <Label
                    htmlFor="loan-type"
                    className="text-base font-semibold text-primary"
                  >
                    Loan Type
                  </Label>
                  <select
                    id="loan-type"
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-light"
                    required
                  >
                    <option value="">Select Loan Type</option>
                    <option value="personal">Personal Loan</option>
                    <option value="education">Education Loan</option>
                    <option value="business">Business Loan</option>
                  </select>
                </motion.div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, ease: "easeOut", delay: 0.3 }}
                className="space-y-2"
              >
                <Label
                  htmlFor="loan-amount"
                  className="text-base font-semibold text-primary"
                >
                  Loan Amount (₹)
                </Label>
                <Input
                  id="loan-amount"
                  type="number"
                  placeholder="Enter loan amount"
                  value={loanAmount}
                  onChange={(e) => setLoanAmount(e.target.value)}
                  required
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-light"
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, ease: "easeOut", delay: 0.4 }}
                className="space-y-2"
              >
                <Label
                  htmlFor="loan-purpose"
                  className="text-base font-semibold text-primary"
                >
                  Loan Purpose
                </Label>
                <Input
                  id="loan-purpose"
                  placeholder="Enter the purpose of the loan"
                  value={loanPurpose}
                  onChange={(e) => setLoanPurpose(e.target.value)}
                  required
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-light"
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, ease: "easeOut", delay: 0.5 }}
                className="space-y-2"
              >
                <Label
                  htmlFor="loan-term"
                  className="text-base font-semibold text-primary"
                >
                  Loan Term (months)
                </Label>
                <Input
                  id="loan-term"
                  type="number"
                  placeholder="Enter loan term in months"
                  value={loanTerm}
                  onChange={(e) => setLoanTerm(e.target.value)}
                  required
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-light"
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, ease: "easeOut", delay: 0.6 }}
                className="space-y-2"
              >
                <Label
                  htmlFor="employment-type"
                  className="text-base font-semibold text-primary"
                >
                  Employment Type
                </Label>
                <select
                  id="employment-type"
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-light"
                  required
                >
                  <option value="">Select Employment Type</option>
                  <option value="salaried">Salaried</option>
                  <option value="self-employed">Self-Employed</option>
                  <option value="business">Business Owner</option>
                  <option value="student">Student</option>
                </select>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, ease: "easeOut", delay: 0.7 }}
                className="space-y-2"
              >
                <Label
                  htmlFor="monthly-income"
                  className="text-base font-semibold text-primary"
                >
                  Monthly Income (₹)
                </Label>
                <Input
                  id="monthly-income"
                  type="number"
                  placeholder="Enter your monthly income"
                  required
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-light"
                />
              </motion.div>
            </CardContent>
            <CardFooter className="flex justify-end px-4 py-2">
              <Button
                onClick={handleNext}
                className="px-8 py-3 bg-cyan-500  text-white font-semibold rounded-full hover:bg-cyan-600 transition duration-300 relative overflow-hidden before:absolute before:inset-0 before:bg-white/30 before:scale-x-0 hover:before:scale-x-100 before:origin-left before:transition before:duration-500 before:ease-out"
              >
                Next
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      )}

      {currentStep === 1 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-bold text-primary">Upload Documents</CardTitle>
              <CardDescription className="text-sm text-muted">
                Upload the required documents for loan processing
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, ease: "easeOut", delay: 0.1 }}
                className="space-y-2"
              >
                <Label className="text-base text-primary">Salary Slip / Income Proof</Label>
                <div className="flex items-center justify-center w-full">
                  <label
                    htmlFor="salary-slip"
                    className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-muted/50 hover:bg-muted transition duration-300"
                  >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
                      <p className="mb-2 text-sm text-muted-foreground">
                        <span className="font-semibold">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-xs text-muted-foreground">PDF, PNG or JPG (MAX. 5MB)</p>
                    </div>
                    <input
                      id="salary-slip"
                      type="file"
                      className="hidden"
                      onChange={handleSalarySlipUpload}
                      accept="image/png, image/jpeg, application/pdf"
                      required
                    />
                  </label>
                </div>
                {salarySlip && (
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <FileUp className="h-4 w-4" /> {salarySlip.name}
                  </p>
                )}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, ease: "easeOut", delay: 0.2 }}
                className="space-y-2"
              >
                <Label className="text-base text-primary">Bank Statement (Last 3 months)</Label>
                <div className="flex items-center justify-center w-full">
                  <label
                    htmlFor="bank-statement"
                    className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-muted/50 hover:bg-muted transition duration-300"
                  >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
                      <p className="mb-2 text-sm text-muted-foreground">
                        <span className="font-semibold">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-xs text-muted-foreground">PDF format (MAX. 10MB)</p>
                    </div>
                    <input
                      id="bank-statement"
                      type="file"
                      className="hidden"
                      onChange={handleBankStatementUpload}
                      accept="application/pdf"
                      required
                    />
                  </label>
                </div>
                {bankStatement && (
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <FileUp className="h-4 w-4" /> {bankStatement.name}
                  </p>
                )}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, ease: "easeOut", delay: 0.3 }}
                className="space-y-2"
              >
                <Label className="text-base text-primary">Address Proof</Label>
                <div className="flex items-center justify-center w-full">
                  <label
                    htmlFor="address-proof"
                    className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-muted/50 hover:bg-muted transition duration-300"
                  >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
                      <p className="mb-2 text-sm text-muted-foreground">
                        <span className="font-semibold">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-xs text-muted-foreground">PDF, PNG or JPG (MAX. 5MB)</p>
                    </div>
                    <input
                      id="address-proof"
                      type="file"
                      className="hidden"
                      onChange={handleAddressProofUpload}
                      accept="image/png, image/jpeg, application/pdf"
                      required
                    />
                  </label>
                </div>
                {addressProof && (
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <FileUp className="h-4 w-4" /> {addressProof.name}
                  </p>
                )}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, ease: "easeOut", delay: 0.4 }}
                className="space-y-2"
              >
                <Label htmlFor="document-declaration" className="text-base text-primary">
                  Declaration
                </Label>
                <div className="flex items-start space-x-2">
                  <input
                    type="checkbox"
                    id="document-declaration"
                    className="h-4 w-4 mt-1 rounded border-gray-300 focus:ring-0"
                    required
                  />
                  <label htmlFor="document-declaration" className="text-sm text-muted-foreground">
                    I hereby declare that all the documents provided are genuine and authentic. I understand that
                    providing false documents may result in rejection of my application and legal consequences.
                  </label>
                </div>
              </motion.div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button
                variant="outline"
                onClick={handlePrevious}
                className="bg-transparent hover:bg-primary-100 transition duration-300"
              >
                Previous
              </Button>
              <Button
                onClick={handleNext}
                className="bg-primary text-white hover:bg-primary-dark transition duration-300"
              >
                Next
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      )}

      {currentStep === 2 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="  space-y-6"
        >
          <Card className="rounded-lg bg-white dark:bg-gray-800 shadow-md">
            <CardHeader className="flex items-center justify-between">
              <CardTitle className="text-xl font-medium">Review Application</CardTitle>
              <div className="flex space-x-2">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, duration: 0.3 }}
                  className="h-4 w-4 rounded-full bg-green-500"
                />
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3, duration: 0.3 }}
                  className="h-4 w-4 rounded-full bg-yellow-500"
                />
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.4, duration: 0.3 }}
                  className="h-4 w-4 rounded-full bg-red-500"
                />
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="rounded-lg border p-4">
                <h3 className="font-medium mb-2">Loan Details</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Loan Type:</span>
                    <span className="text-sm">Personal Loan</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Loan Amount:</span>
                    <span className="text-sm">₹{loanAmount || "100,000"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Loan Purpose:</span>
                    <span className="text-sm">{loanPurpose || "Home Renovation"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Loan Term:</span>
                    <span className="text-sm">{loanTerm || "24"} months</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Interest Rate:</span>
                    <span className="text-sm">12.5% per annum</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Processing Fee:</span>
                    <span className="text-sm">1.5% of loan amount</span>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border p-4">
                <h3 className="font-medium mb-2">Personal Details</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Name:</span>
                    <span className="text-sm">John Doe</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Email:</span>
                    <span className="text-sm">john.doe@example.com</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Phone:</span>
                    <span className="text-sm">+91 9876543210</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Employment Type:</span>
                    <span className="text-sm">Salaried</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Monthly Income:</span>
                    <span className="text-sm">₹50,000</span>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border p-4">
                <h3 className="font-medium mb-2">Documents Uploaded</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Salary Slip:</span>
                    <span className="text-sm">{salarySlip ? "✓ Uploaded" : "✗ Not Uploaded"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Bank Statement:</span>
                    <span className="text-sm">{bankStatement ? "✓ Uploaded" : "✗ Not Uploaded"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Address Proof:</span>
                    <span className="text-sm">{addressProof ? "✓ Uploaded" : "✗ Not Uploaded"}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="final-declaration">Final Declaration</Label>
                <div className="flex items-start space-x-2">
                  <input
                    type="checkbox"
                    id="final-declaration"
                    className="h-4 w-4 mt-1 rounded border-gray-300"
                    required
                  />
                  <label htmlFor="final-declaration" className="text-sm text-muted-foreground">
                    I confirm that all the information provided in this application is true, complete, and accurate.
                    I authorize LoanEase to verify the information provided and obtain additional information as
                    needed. I agree to the terms and conditions of the loan agreement.
                  </label>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={handlePrevious}>
                Previous
              </Button>
              <Button onClick={handleSubmit} disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Submit Application"}
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      )}

      {currentStep === 3 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <Card className="bg-green-50 border border-green-200">
            <CardHeader className="bg-green-100">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="h-10 w-10 text-green-600"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
              </div>
              <CardTitle className="text-2xl">Application Submitted Successfully!</CardTitle>
              <CardDescription className="text-green-700">
                Your loan application has been received and is being processed.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg border p-4">
                <h3 className="font-medium mb-2">Application Details</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Application ID:</span>
                    <span className="text-sm font-medium">LOAN-2023-12345</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Submission Date:</span>
                    <span className="text-sm">{new Date().toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Status:</span>
                    <span className="text-sm text-yellow-600 font-medium">Under Review</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Estimated Processing Time:</span>
                    <span className="text-sm">2-3 business days</span>
                  </div>
                </div>
              </div>

              <div className="text-left">
                <h3 className="font-medium mb-2">Next Steps:</h3>
                <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
                  <li>Our team will review your application and documents.</li>
                  <li>You may receive a call for verification or additional information.</li>
                  <li>Once approved, the loan agreement will be sent to you for digital signature.</li>
                  <li>After signing, the loan amount will be disbursed to your bank account.</li>
                </ol>
              </div>
            </CardContent>
            <CardFooter className="flex justify-center gap-4">
              <Button
                variant="outline"
                onClick={() => window.print()}
                className="text-green-600 hover:text-green-700"
              >
                Print Application
              </Button>
              <Button
                onClick={() => (window.location.href = "/dashboard")}
                className="text-white hover:text-black hover:bg-white border border-transparent hover:border-gray-300"
              >
                Back to Dashboard
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      )}
    </DashboardShell>
  )
}

