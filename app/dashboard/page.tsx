"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { ArrowRight, BadgeCheck, Clock, FileText, IndianRupee, Percent } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"
import AnimatedCounter from "@/hooks/use-animated-counter"

export default function DashboardPage() {
  const [documents, setDocuments] = useState([
    { title: "PAN Card", description: "Identity verification", status: "Verified", statusColor: "green" },
    { title: "Bank Details", description: "Account verification", status: "Verified", statusColor: "green" },
    { title: "Selfie", description: "Facial verification", status: "Not Uploaded", statusColor: "red" },
    { title: "Address Proof", description: "Residence verification", status: "Not Uploaded", statusColor: "red" },
    { title: "Income Proof", description: "Salary slips or bank statements", status: "Not Uploaded", statusColor: "red" },
  ]);

  // Function to handle document upload
  const handleUpload = (index: number) => {
    setDocuments((prevDocs) =>
      prevDocs.map((doc, i) =>
        i === index ? { ...doc, status: "Pending Verification", statusColor: "yellow" } : doc
      )
    );
  };
  const [activeTab, setActiveTab] = useState("overview")
  const [progressValue, setProgressValue] = useState(0)

  useEffect(() => {
    const timer = setTimeout(() => {
      setProgressValue(75)
    }, 500)
    return () => clearTimeout(timer)
  }, [])

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
      <DashboardHeader heading="Dashboard" text="Manage your loan applications and account details." />
      <Tabs defaultValue="overview" className="space-y-4" onValueChange={setActiveTab} value={activeTab}>
        <TabsList className="bg-slate-100/80 backdrop-blur-sm">
          <TabsTrigger
            value="overview"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-violet-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white"
          >
            Overview
          </TabsTrigger>
          {/* <TabsTrigger
            value="applications"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-violet-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white"
          >
            Applications
          </TabsTrigger> */}
          <TabsTrigger
            value="documents"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-violet-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white"
          >
            Documents
          </TabsTrigger>
          {/* <TabsTrigger
            value="profile"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-violet-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white"
          >
            Profile
          </TabsTrigger> */}
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <motion.div
            className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
            variants={container}
            initial="hidden"
            animate="show"
          >
            <motion.div variants={item}>
              <Card className="overflow-hidden border-slate-200 hover:shadow-md transition-shadow duration-300">
                <div className="hidden md:absolute h-1 w-full top-0 bg-gradient-to-r from-violet-500 to-indigo-500"></div>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-slate-700">Loan Eligibility</CardTitle>
                  <BadgeCheck className="h-4 w-4 text-violet-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-slate-800">₹<AnimatedCounter from={0} to={500000} duration={2} /></div>
                  <p className="text-xs text-slate-500">Maximum eligible amount</p>
                  <Progress
                    value={progressValue}
                    className="mt-2 h-2 bg-slate-200"
                    indicatorClassName="bg-gradient-to-r from-violet-500 to-indigo-500"
                  />
                  <p className="mt-2 text-xs text-slate-500">75% of your maximum limit</p>
                </CardContent>
                <CardFooter>
                  <Link href="/loan-calculator" className="w-full">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full border-violet-200 text-violet-700 hover:bg-violet-50 hover:text-violet-800 hover:border-violet-300 transition-colors"
                    >
                      Calculate Loan
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            </motion.div>

            <motion.div variants={item}>
              <Card className="overflow-hidden border-slate-200 hover:shadow-md transition-shadow duration-300">
                <div className="absolute h-1 w-full top-0 bg-gradient-to-r from-indigo-500 to-blue-500"></div>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-slate-700">Active Loans</CardTitle>
                  <IndianRupee className="h-4 w-4 text-indigo-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-slate-800">₹<AnimatedCounter from={0} to={500000} duration={2} /></div>
                  <p className="text-xs text-slate-500">Current outstanding amount</p>
                  <div className="mt-2 flex items-center gap-2">
                    <Percent className="h-4 w-4 text-indigo-600" />
                    <span className="text-sm text-slate-700">12% interest rate</span>
                  </div>
                </CardContent>
                <CardFooter>
                  <Link href="/loan-details" className="w-full">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full border-indigo-200 text-indigo-700 hover:bg-indigo-50 hover:text-indigo-800 hover:border-indigo-300 transition-colors"
                    >
                      View Details
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            </motion.div>

            <motion.div variants={item}>
              <Card className="overflow-hidden border-slate-200 hover:shadow-md transition-shadow duration-300">
                <div className="hidden md:absolute h-1 w-full top-0 bg-gradient-to-r from-blue-500 to-cyan-500"></div>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-slate-700">Verification Status</CardTitle>
                  <Clock className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-slate-800">Pending</div>
                  <p className="text-xs text-slate-500">ID verification required</p>
                  <div className="mt-4 flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-600">PAN Card</span>
                      <span className="text-xs font-medium text-yellow-500">Pending</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-600">ID Proof</span>
                      <span className="text-xs font-medium text-red-500">Not Submitted</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Link href="/verification" className="w-full">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full border-blue-200 text-blue-700 hover:bg-blue-50 hover:text-blue-800 hover:border-blue-300 transition-colors"
                    >
                      Complete Verification
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            </motion.div>
          </motion.div>

          <motion.div className="grid gap-4 md:grid-cols-2" variants={container} initial="hidden" animate="show">
            <motion.div variants={item}>
              <Card className="border-slate-200 hover:shadow-md transition-shadow duration-300">
                <CardHeader>
                  <CardTitle className="text-slate-800">Quick Actions</CardTitle>
                  <CardDescription className="text-slate-500">Common tasks you might want to perform</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-2">
                  {[
                    { title: "Apply for a New Loan", href: "/apply-loan" },
                    { title: "Calculate EMI", href: "/loan-calculator" },
                    { title: "Complete Verification", href: "/verification" },
                    { title: "Contact Support", href: "/support" },
                  ].map((action, index) => (
                    <Link key={index} href={action.href}>
                      <Button
                        variant="outline"
                        className="w-full justify-between border-slate-200 hover:border-violet-300 hover:bg-violet-50 hover:text-violet-700 transition-all duration-300 group"
                      >
                        {action.title}
                        <ArrowRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  ))}
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={item}>
              <Card className="border-slate-200 hover:shadow-md transition-shadow duration-300">
                <CardHeader>
                  <CardTitle className="text-slate-800">Recent Activity</CardTitle>
                  <CardDescription className="text-slate-500">Your recent loan-related activities</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { icon: FileText, title: "Loan application submitted", time: "2 days ago" },
                    { icon: BadgeCheck, title: "Email verification completed", time: "3 days ago" },
                    { icon: IndianRupee, title: "Loan eligibility calculated", time: "5 days ago" },
                  ].map((activity, index) => (
                    <div key={index} className="flex items-start gap-4">
                      <div className="rounded-full bg-gradient-to-br from-violet-100 to-indigo-100 p-2">
                        <activity.icon className="h-4 w-4 text-violet-600" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-slate-700">{activity.title}</p>
                        <p className="text-xs text-slate-500">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
                <CardFooter>
                  <Link href="/activity">
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-slate-200 hover:border-violet-300 hover:bg-violet-50 hover:text-violet-700 transition-all duration-300"
                    >
                      View All Activity
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            </motion.div>
          </motion.div>
        </TabsContent>

        <TabsContent value="applications" className="space-y-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Card className="border-slate-200 hover:shadow-md transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="text-slate-800">Loan Applications</CardTitle>
                <CardDescription className="text-slate-500">Manage your loan applications</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="rounded-lg border border-slate-200 p-4 hover:border-violet-200 hover:bg-violet-50/30 transition-colors duration-300">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-slate-800">Personal Loan</h3>
                        <p className="text-sm text-slate-500">₹200,000</p>
                      </div>
                      <span className="rounded-full bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-800">
                        In Review
                      </span>
                    </div>
                    <div className="mt-4 flex items-center justify-between text-sm">
                      <span className="text-slate-500">Applied on: 15 Mar 2023</span>
                      <Link href="/applications/1">
                        <Button variant="link" size="sm" className="h-auto p-0 text-violet-600 hover:text-violet-800">
                          View Details
                        </Button>
                      </Link>
                    </div>
                  </div>
                  <div className="rounded-lg border border-slate-200 p-4 hover:border-violet-200 hover:bg-violet-50/30 transition-colors duration-300">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-slate-800">Education Loan</h3>
                        <p className="text-sm text-slate-500">₹500,000</p>
                      </div>
                      <span className="rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-red-800">
                        Documents Required
                      </span>
                    </div>
                    <div className="mt-4 flex items-center justify-between text-sm">
                      <span className="text-slate-500">Applied on: 10 Feb 2023</span>
                      <Link href="/applications/2">
                        <Button variant="link" size="sm" className="h-auto p-0 text-violet-600 hover:text-violet-800">
                          View Details
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Link href="/apply-loan">
                  <Button className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 transition-all duration-300">
                    Apply for a New Loan
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          </motion.div>
        </TabsContent>

        <TabsContent value="documents" className="space-y-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Card className="border-slate-200 hover:shadow-md transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="text-slate-800">Documents</CardTitle>
            <CardDescription className="text-slate-500">Manage your documents and verification</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {documents.map((doc, index) => (
                <div
                  key={index}
                  className="rounded-lg border border-slate-200 p-4 hover:border-violet-200 hover:bg-violet-50/30 transition-colors duration-300"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-slate-500" />
                      <div>
                        <h3 className="font-medium text-slate-800">{doc.title}</h3>
                        <p className="text-sm text-slate-500">{doc.description}</p>
                      </div>
                    </div>
                    <span className={`rounded-full bg-${doc.statusColor}-100 px-2 py-1 text-xs font-medium text-${doc.statusColor}-800`}>
                      {doc.status}
                    </span>
                  </div>
                  <div className="mt-4 flex items-center justify-end gap-2">
                    {doc.status === "Verified" ? (
                      <Button variant="outline" size="sm" className="border-slate-200 text-green-700 bg-green-50 hover:bg-green-100 transition-all duration-300">
                        View
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 transition-all duration-300"
                        onClick={() => handleUpload(index)}
                      >
                        Upload Document
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </TabsContent>
        <TabsContent value="profile" className="space-y-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Card className="border-slate-200 hover:shadow-md transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="text-slate-800">Profile Information</CardTitle>
                <CardDescription className="text-slate-500">Manage your personal information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Full Name</label>
                    <input
                      type="text"
                      className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 outline-none transition-colors"
                      defaultValue="John Doe"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Email</label>
                    <input
                      type="email"
                      className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 outline-none transition-colors"
                      defaultValue="john.doe@example.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Phone Number</label>
                    <input
                      type="tel"
                      className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 outline-none transition-colors"
                      defaultValue="+91 9876543210"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Date of Birth</label>
                    <input
                      type="date"
                      className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 outline-none transition-colors"
                      defaultValue="1990-01-01"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Address</label>
                  <textarea
                    className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 outline-none transition-colors"
                    rows={3}
                    defaultValue="123 Main Street, Apartment 4B, Mumbai, Maharashtra, 400001"
                  ></textarea>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button
                  variant="outline"
                  className="border-slate-200 hover:border-violet-300 hover:bg-violet-50 hover:text-violet-700 transition-all duration-300"
                >
                  Cancel
                </Button>
                <Button className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 transition-all duration-300">
                  Save Changes
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        </TabsContent>
      </Tabs>
    </DashboardShell>
  )
}

