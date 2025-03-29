"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Download, CheckCircle, Clock, AlertCircle, FileText, CreditCard, Filter, Search } from "lucide-react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"

export default function LoanHistoryPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("active")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedLoan, setSelectedLoan] = useState<number | null>(null)

  // Sample loan history data
  const loans = [
    {
      id: 1,
      type: "Personal Loan",
      amount: 500000,
      disbursedAmount: 485000,
      processingFee: 15000,
      interestRate: 12,
      tenure: 36,
      emiAmount: 16571,
      startDate: "2023-03-15",
      endDate: "2026-03-15",
      totalInterest: 96556,
      totalAmount: 596556,
      paidEMIs: 3,
      remainingEMIs: 33,
      status: "active",
      disbursementDate: "2023-03-10",
      purpose: "Home Renovation",
      accountNumber: "XXXX1234",
      loanNumber: "PL-2023-78945",
      colorScheme: "from-violet-500 to-indigo-500",
    },
    {
      id: 2,
      type: "Education Loan",
      amount: 300000,
      disbursedAmount: 291000,
      processingFee: 9000,
      interestRate: 10,
      tenure: 48,
      emiAmount: 7608,
      startDate: "2022-08-10",
      endDate: "2026-08-10",
      totalInterest: 65184,
      totalAmount: 365184,
      paidEMIs: 8,
      remainingEMIs: 40,
      status: "active",
      disbursementDate: "2022-08-05",
      purpose: "MBA Program",
      accountNumber: "XXXX5678",
      loanNumber: "EL-2022-45678",
      colorScheme: "from-blue-500 to-cyan-500",
    },
    {
      id: 3,
      type: "Vehicle Loan",
      amount: 200000,
      disbursedAmount: 194000,
      processingFee: 6000,
      interestRate: 9.5,
      tenure: 24,
      emiAmount: 9174,
      startDate: "2021-05-20",
      endDate: "2023-05-20",
      totalInterest: 20176,
      totalAmount: 220176,
      paidEMIs: 24,
      remainingEMIs: 0,
      status: "closed",
      disbursementDate: "2021-05-15",
      purpose: "Two-wheeler Purchase",
      accountNumber: "XXXX9012",
      loanNumber: "VL-2021-12345",
      colorScheme: "from-emerald-500 to-teal-500",
    },
  ]

  const filteredLoans = loans.filter(
    (loan) =>
      (activeTab === "all" || loan.status === activeTab) &&
      (searchTerm === "" ||
        loan.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        loan.loanNumber.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <Clock className="h-4 w-4 text-blue-600" />
      case "closed":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      default:
        return <AlertCircle className="h-4 w-4 text-slate-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-blue-100 text-blue-800"
      case "closed":
        return "bg-green-100 text-green-800"
      default:
        return "bg-slate-100 text-slate-800"
    }
  }

  const viewLoanDetails = (loanId: number) => {
    router.push(`/loan-details/${loanId}`)
  }

  const viewTransactions = (loanId: number) => {
    router.push(`/transactions?loanId=${loanId}`)
  }

  return (
    <DashboardShell>
      <DashboardHeader heading="Loan History" text="View and manage your current and past loans.">
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="border-slate-200 hover:border-violet-300 hover:bg-violet-50 hover:text-violet-700 transition-all duration-300"
          >
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="border-slate-200 hover:border-violet-300 hover:bg-violet-50 hover:text-violet-700 transition-all duration-300"
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </DashboardHeader>

      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <Tabs defaultValue="active" value={activeTab} onValueChange={setActiveTab} className="w-full sm:w-auto">
            <TabsList className="bg-slate-100/80 backdrop-blur-sm w-full sm:w-auto">
              <TabsTrigger
                value="active"
                className="flex-1 sm:flex-initial data-[state=active]:bg-gradient-to-r data-[state=active]:from-violet-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white"
              >
                Active Loans
              </TabsTrigger>
              <TabsTrigger
                value="closed"
                className="flex-1 sm:flex-initial data-[state=active]:bg-gradient-to-r data-[state=active]:from-violet-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white"
              >
                Closed Loans
              </TabsTrigger>
              <TabsTrigger
                value="all"
                className="flex-1 sm:flex-initial data-[state=active]:bg-gradient-to-r data-[state=active]:from-violet-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white"
              >
                All Loans
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Search loans..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-md border border-slate-300 bg-white pl-10 px-3 py-2 text-sm focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 outline-none transition-colors"
            />
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
        >
          {filteredLoans.length > 0 ? (
            filteredLoans.map((loan) => (
              <motion.div
                key={loan.id}
                layoutId={`loan-${loan.id}`}
                className="h-full"
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                <Card className="border-slate-200 hover:shadow-lg transition-all duration-300 h-full flex flex-col overflow-hidden">
                  <div className={`h-2 w-full bg-gradient-to-r ${loan.colorScheme}`}></div>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-slate-800">{loan.type}</CardTitle>
                        <CardDescription className="text-slate-500">{loan.loanNumber}</CardDescription>
                      </div>
                      <Badge className={getStatusColor(loan.status)}>
                        <span className="flex items-center gap-1">
                          {getStatusIcon(loan.status)}
                          {loan.status.charAt(0).toUpperCase() + loan.status.slice(1)}
                        </span>
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <div className="space-y-4">
                      <div className="text-center p-4 bg-slate-50 rounded-lg">
                        <p className="text-sm text-slate-600">Loan Amount</p>
                        <p className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-indigo-600">
                          ₹{loan.amount.toLocaleString()}
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <p className="text-xs text-slate-500">EMI Amount</p>
                          <p className="text-lg font-semibold text-slate-800">₹{loan.emiAmount.toLocaleString()}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-xs text-slate-500">Interest Rate</p>
                          <p className="text-lg font-semibold text-slate-800">{loan.interestRate}%</p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <p className="text-sm text-slate-600">EMIs Paid</p>
                          <p className="text-sm font-medium text-slate-800">
                            <span className="text-lg font-bold text-violet-600">{loan.paidEMIs}</span> / {loan.tenure}
                          </p>
                        </div>
                        <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                          <div
                            className={`h-full bg-gradient-to-r ${loan.colorScheme} rounded-full`}
                            style={{ width: `${(loan.paidEMIs / loan.tenure) * 100}%` }}
                          ></div>
                        </div>
                        <div className="flex justify-between text-xs text-slate-500">
                          <span>Progress: {Math.round((loan.paidEMIs / loan.tenure) * 100)}%</span>
                          {loan.status === "active" && <span>{loan.remainingEMIs} EMIs left</span>}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex flex-col gap-2">
                    <Button
                      className="w-full bg-violet-150 transition-all duration-300"
                      onClick={() => viewLoanDetails(loan.id)}
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      View Loan Details
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full border-slate-200 hover:border-violet-300 hover:bg-violet-50 hover:text-violet-700 transition-all duration-300"
                      onClick={() => viewTransactions(loan.id)}
                    >
                      <CreditCard className="h-4 w-4 mr-2" />
                      View Transactions
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center p-8 text-center">
              <div className="rounded-full bg-slate-100 p-3 mb-4">
                <Search className="h-6 w-6 text-slate-400" />
              </div>
              <h3 className="text-lg font-medium text-slate-800">No loans found</h3>
              <p className="text-sm text-slate-500 mt-1">
                {searchTerm ? `No loans matching "${searchTerm}"` : "No loans in this category"}
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </DashboardShell>
  )
}

