"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { Calendar, Download, ChevronDown, ChevronUp, CheckCircle, Clock, AlertCircle } from 'lucide-react'
import { motion, AnimatePresence } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import axios from "axios"

export default function RepaymentSchedulePage() {
  const [expandedMonth, setExpandedMonth] = useState<number | null>(0)
  const [viewMode, setViewMode] = useState<"calendar" | "list">("list")
  const [loanDetails, setLoanDetails] = useState<any>(null)
  const [repaymentSchedule, setRepaymentSchedule] = useState<any[]>([])

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem("auth_token") || ""
        const apiUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/api/dashboard`; // Correctly define the API URL

        console.log("API URL:", apiUrl)
        console.log("Auth Token:", token)

        const response = await axios.get(apiUrl, {
          headers: {
            Authorization: `Bearer ${token}`,
            "ngrok-skip-browser-warning": "true",
          },
        })

        const data = response.data.dashboardData

        if (data?.loans?.length > 0) {
          const loan = data.loans[0]
          const schedules = loan.repaymentSchedules || []

          setLoanDetails({
            loanAmount: loan.withdrawAmount,
            interestRate: schedules?.[0]?.interest ??12, // default to 0.12
            tenure: loan.tenure,
            emiAmount: schedules?.[0]?.repayableAmount ?? 0,
            startDate: loan.loanRequestedAt,
            endDate: schedules?.[schedules.length - 1]?.dueDate,
            totalInterest: schedules.reduce((acc: number, r: { interest?: number }) => acc + (r.interest || 0), 0),
            totalAmount: schedules.reduce((acc: number, r: { repayableAmount?: number }) => acc + (r.repayableAmount || 0), 0),
            paidEMIs: schedules.filter((r: { paymentStatus: string }) => r.paymentStatus === "Paid").length,
          })

          const formattedSchedule = schedules.map((r: any, index: number) => {
            const dueDate = new Date(r.dueDate)
            const isPaid = r.paymentStatus === "Paid"
            const isUpcoming =
              r.paymentStatus === "Unpaid" &&
              index === schedules.findIndex((s: any) => s.paymentStatus === "Unpaid")

            return {
              id: r.id,
              repaymentDate: r.dueDate,
              month: dueDate.toLocaleString("default", { month: "long" }),
              year: dueDate.getFullYear(),
              emiDate: dueDate.getDate(),
              emiAmount: r.repayableAmount,
              principal: r.principalAmount,
              interest: r.interest ?? 12, // fallback to default interest
              remainingPrincipal: Math.max(0, loan.withdrawAmount - r.principalAmount * (index + 1)),
              status: isPaid ? "paid" : isUpcoming ? "upcoming" : "scheduled",
              paymentDate: isPaid ? dueDate : null,
            }
          })

          setRepaymentSchedule(formattedSchedule)
        }
      } catch (error: any) {
        console.error("Error fetching dashboard data", error?.response?.data || error.message)
      }
    }

    fetchDashboardData()
  }, [])

  const toggleMonth = (monthId: number) => {
    setExpandedMonth(expandedMonth === monthId ? null : monthId)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800"
      case "upcoming":
        return "bg-blue-100 text-blue-800"
      case "scheduled":
        return "bg-slate-100 text-slate-800"
      default:
        return "bg-slate-100 text-slate-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "paid":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "upcoming":
        return <Clock className="h-4 w-4 text-blue-600" />
      case "scheduled":
        return <Calendar className="h-4 w-4 text-slate-600" />
      default:
        return <AlertCircle className="h-4 w-4 text-slate-600" />
    }
  }  
      
 
  return (
    <DashboardShell>
      <DashboardHeader
        heading="Repayment Schedule"
        text="Track your loan EMIs and payment schedule."
      >
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setViewMode(viewMode === "calendar" ? "list" : "calendar")}
            className="border-slate-200 hover:border-violet-300 hover:bg-violet-50 hover:text-violet-700 transition-all duration-300"
          >
            <Calendar className="h-4 w-4 mr-2" />
            {viewMode === "calendar" ? "List View" : "Calendar View"}
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            className="border-slate-200 hover:border-violet-300 hover:bg-violet-50 hover:text-violet-700 transition-all duration-300"
          >
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
        </div>
      </DashboardHeader>

      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="border-slate-200 hover:shadow-md transition-shadow duration-300 overflow-hidden">
            <div className="hidden md:absolute h-1 w-full top-0 bg-gradient-to-r from-violet-500 to-indigo-500"></div>
            <CardHeader>
              <CardTitle className="text-slate-800">Loan Summary</CardTitle>
              <CardDescription className="text-slate-500">Overview of your loan repayment details</CardDescription>
            </CardHeader>
            <CardContent>
              {loanDetails ? (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  <div className="space-y-1 p-3 bg-violet-50 rounded-lg">
                    <p className="text-sm text-slate-600">Loan Amount</p>
                    <p className="text-2xl font-bold text-slate-800">₹{loanDetails.loanAmount.toLocaleString()}</p>
                  </div>
                  <div className="space-y-1 p-3 bg-indigo-50 rounded-lg">
                    <p className="text-sm text-slate-600">EMI Amount</p>
                    <p className="text-2xl font-bold text-slate-800">₹{loanDetails.emiAmount.toLocaleString()}</p>
                  </div>
                  <div className="space-y-1 p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-slate-600">Tenure</p>
                    <p className="text-2xl font-bold text-slate-800">{loanDetails.tenure} Months</p>
                  </div>
                  <div className="space-y-1 p-3 bg-purple-50 rounded-lg">
                    <p className="text-sm text-slate-600">Interest Rate</p>
                    <p className="text-2xl font-bold text-slate-800">{loanDetails.interestRate}%</p>
                  </div>
                </div>
              ) : (
                <div className="flex justify-center items-center h-32">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-violet-500"></div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="space-y-4"
        >
          <h2 className="text-xl font-semibold text-slate-800">Repayment Schedule</h2>
          
          {/* Mobile View */}
          <div className="md:hidden space-y-4">
            {repaymentSchedule.map((emi) => (
              <Card key={emi.id} className="border-slate-200 overflow-hidden">
                <div className={`h-1 w-full ${emi.status === 'paid' ? 'bg-green-500' : emi.status === 'upcoming' ? 'bg-blue-500' : 'bg-slate-300'}`}></div>
                <CardHeader className="p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle className="text-base text-slate-800">{emi.month} {emi.year}</CardTitle>
                      <CardDescription className="text-xs">Due: {emi.emiDate} {emi.month}</CardDescription>
                    </div>
                    <Badge className={getStatusColor(emi.status)}>
                      <span className="flex items-center gap-1">
                        {getStatusIcon(emi.status)}
                        {emi.status.charAt(0).toUpperCase() + emi.status.slice(1)}
                      </span>
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-xs text-slate-500">EMI Amount</p>
                      <p className="text-lg font-bold text-slate-800">₹{emi.emiAmount.toLocaleString()}</p>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-xs border-slate-200 hover:border-violet-300 hover:bg-violet-50 hover:text-violet-700"
                      onClick={() => toggleMonth(emi.id)}
                    >
                      {expandedMonth === emi.id ? "Hide Details" : "View Details"}
                    </Button>
                  </div>
                  
                  <AnimatePresence>
                    {expandedMonth === emi.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="pt-4 space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-slate-600">Principal</span>
                            <span className="text-slate-800">₹{emi.principal.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-600">Interest</span>
                            <span className="text-slate-800">₹{emi.interest.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-600">Remaining Principal</span>
                            <span className="text-slate-800">₹{emi.remainingPrincipal.toLocaleString()}</span>
                          </div>
                          {emi.status === 'paid' && (
                            <div className="flex justify-between">
                              <span className="text-slate-600">Payment Date</span>
                              <span className="text-green-600">{emi.paymentDate?.toLocaleDateString()}</span>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {/* Desktop View */}
          <div className="hidden md:block">
            <Card className="border-slate-200">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200">
                      <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Month</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Due Date</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">EMI Amount</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Principal</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Interest</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Remaining Principal</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Payment Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {repaymentSchedule.map((emi) => (
                      <tr 
                        key={emi.id} 
                        className={`
                          ${emi.status === 'paid' ? 'bg-green-50' : emi.status === 'upcoming' ? 'bg-blue-50' : ''}
                          hover:bg-slate-50 transition-colors
                        `}
                      >
                        <td className="px-4 py-3 text-sm text-slate-800">{emi.month} {emi.year}</td>
                        <td className="px-4 py-3 text-sm text-slate-800">{emi.emiDate} {emi.month}</td>
                        <td className="px-4 py-3 text-sm font-medium text-slate-800">₹{emi.emiAmount.toLocaleString()}</td>
                        <td className="px-4 py-3 text-sm text-slate-800">₹{emi.principal.toLocaleString()}</td>
                        <td className="px-4 py-3 text-sm text-slate-800">₹{emi.interest.toLocaleString()}</td>
                        <td className="px-4 py-3 text-sm text-slate-800">₹{emi.remainingPrincipal.toLocaleString()}</td>
                        <td className="px-4 py-3 text-sm">
                          <Badge className={getStatusColor(emi.status)}>
                            <span className="flex items-center gap-1">
                              {getStatusIcon(emi.status)}
                              {emi.status.charAt(0).toUpperCase() + emi.status.slice(1)}
                            </span>
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-sm text-slate-800">
                        {emi.status === 'paid' ? emi.paymentDate?.toLocaleDateString() : '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        </motion.div>
      </div>
    </DashboardShell>
  )
}
