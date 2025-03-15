"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { Calendar, Download, ChevronDown, ChevronUp, CheckCircle, Clock, AlertCircle } from 'lucide-react'
import { motion, AnimatePresence } from "framer-motion"
import { Badge } from "@/components/ui/badge"

export default function RepaymentSchedulePage() {
  const [expandedMonth, setExpandedMonth] = useState<number | null>(0)
  const [viewMode, setViewMode] = useState<"calendar" | "list">("list")

  // Sample repayment data
  const loanDetails = {
    loanAmount: 500000,
    interestRate: 12,
    tenure: 36,
    emiAmount: 16571,
    startDate: "2023-03-15",
    endDate: "2026-03-15",
    totalInterest: 96556,
    totalAmount: 596556,
    paidEMIs: 3,
    remainingEMIs: 33
  }

  // Generate sample repayment schedule
  const repaymentSchedule = Array.from({ length: 12 }, (_, monthIndex) => {
    const month = new Date(loanDetails.startDate)
    month.setMonth(month.getMonth() + monthIndex)
    
    const emiDate = month.getDate()
    const monthName = month.toLocaleString('default', { month: 'long' })
    const year = month.getFullYear()
    
    const isPaid = monthIndex < 3
    const isUpcoming = monthIndex === 3
    
    return {
      id: monthIndex,
      month: monthName,
      year,
      emiDate,
      emiAmount: loanDetails.emiAmount,
      principal: Math.round(loanDetails.emiAmount * 0.7),
      interest: Math.round(loanDetails.emiAmount * 0.3),
      remainingPrincipal: loanDetails.loanAmount - (Math.round(loanDetails.emiAmount * 0.7) * (monthIndex + 1)),
      status: isPaid ? "paid" : isUpcoming ? "upcoming" : "scheduled",
      paymentDate: isPaid ? new Date(month.setDate(emiDate - Math.floor(Math.random() * 3))) : null
    }
  })

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

              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <p className="text-sm text-slate-600">Total Interest</p>
                    <p className="text-sm font-medium text-slate-800">₹{loanDetails.totalInterest.toLocaleString()}</p>
                  </div>
                  <div className="flex justify-between">
                    <p className="text-sm text-slate-600">Total Amount</p>
                    <p className="text-sm font-medium text-slate-800">₹{loanDetails.totalAmount.toLocaleString()}</p>
                  </div>
                  <div className="flex justify-between">
                    <p className="text-sm text-slate-600">Start Date</p>
                    <p className="text-sm font-medium text-slate-800">{new Date(loanDetails.startDate).toLocaleDateString()}</p>
                  </div>
                  <div className="flex justify-between">
                    <p className="text-sm text-slate-600">End Date</p>
                    <p className="text-sm font-medium text-slate-800">{new Date(loanDetails.endDate).toLocaleDateString()}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-slate-600">EMIs Paid</p>
                    <div className="flex items-center gap-2">
                      <Badge variant="success" className="bg-green-100 text-green-800 hover:bg-green-200">
                        {loanDetails.paidEMIs} / {loanDetails.tenure}
                      </Badge>
                    </div>
                  </div>
                  <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-violet-500 to-indigo-500 rounded-full"
                      style={{ width: `${(loanDetails.paidEMIs / loanDetails.tenure) * 100}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs text-slate-500 mt-1">
                    <span>0%</span>
                    <span>Progress: {Math.round((loanDetails.paidEMIs / loanDetails.tenure) * 100)}%</span>
                    <span>100%</span>
                  </div>
                </div>
              </div>
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
