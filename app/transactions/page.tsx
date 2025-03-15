"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { ArrowDownUp, Calendar, Download, Filter, Search } from "lucide-react"
import { motion } from "framer-motion"

export default function TransactionsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [dateRange, setDateRange] = useState({ from: "", to: "" })
  
  // Sample transaction data
  const transactions = [
    {
      id: "TXN123456",
      date: "2023-03-15",
      description: "Loan Disbursement",
      amount: 200000,
      type: "credit",
      status: "completed"
    },
    {
      id: "TXN123457",
      date: "2023-04-15",
      description: "EMI Payment",
      amount: 18500,
      type: "debit",
      status: "completed"
    },
    {
      id: "TXN123458",
      date: "2023-05-15",
      description: "EMI Payment",
      amount: 18500,
      type: "debit",
      status: "completed"
    },
    {
      id: "TXN123459",
      date: "2023-06-15",
      description: "EMI Payment",
      amount: 18500,
      type: "debit",
      status: "completed"
    },
    {
      id: "TXN123460",
      date: "2023-07-15",
      description: "EMI Payment",
      amount: 18500,
      type: "debit",
      status: "completed"
    },
    {
      id: "TXN123461",
      date: "2023-08-15",
      description: "EMI Payment",
      amount: 18500,
      type: "debit",
      status: "pending"
    }
  ]
  
  // Filter transactions based on search query and date range
  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = searchQuery === "" || 
      transaction.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transaction.description.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesDateRange = (dateRange.from === "" || transaction.date >= dateRange.from) &&
      (dateRange.to === "" || transaction.date <= dateRange.to)
    
    return matchesSearch && matchesDateRange
  })
  
  const handleDownloadStatement = () => {
    alert("Statement download initiated. Your file will be ready shortly.")
  }

  return (
    <DashboardShell>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <DashboardHeader
          heading="Transactions"
          text="View and manage your loan transactions."
        >
          <Button variant="outline" onClick={handleDownloadStatement}>
            <Download className="mr-2 h-4 w-4" /> Download Statement
          </Button>
        </DashboardHeader>
      </motion.div>
      
      <Card className="animate-fade-in-up">
        <CardHeader className="animate-fade-in">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <CardTitle>Transaction History</CardTitle>
            <CardDescription>
              View all your loan-related transactions
            </CardDescription>
          </motion.div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-4 md:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search transactions..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <Input
                  type="date"
                  placeholder="From"
                  className="w-32"
                  value={dateRange.from}
                  onChange={(e) => setDateRange({ ...dateRange, from: e.target.value })}
                />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">to</span>
                <Input
                  type="date"
                  placeholder="To"
                  className="w-32"
                  value={dateRange.to}
                  onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
                />
              </div>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon">
                <ArrowDownUp className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="rounded-md border">
            <div className="overflow-x-auto">
              <motion.table
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="w-full"
              >
                <motion.thead
                  initial={{ y: -20 }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <tr className="bg-muted/50">
                    <motion.th
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ duration: 0.5 }}
                      className="whitespace-nowrap px-4 py-3 text-left font-medium text-muted-foreground"
                    >
                      Transaction ID
                    </motion.th>
                    <motion.th
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ duration: 0.5, delay: 0.1 }}
                      className="whitespace-nowrap px-4 py-3 text-left font-medium text-muted-foreground"
                    >
                      Date
                    </motion.th>
                    <motion.th
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                      className="whitespace-nowrap px-4 py-3 text-left font-medium text-muted-foreground"
                    >
                      Description
                    </motion.th>
                    <motion.th
                      initial={{ x: 20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ duration: 0.5, delay: 0.3 }}
                      className="whitespace-nowrap px-4 py-3 text-right font-medium text-muted-foreground"
                    >
                      Amount
                    </motion.th>
                    <motion.th
                      initial={{ x: 20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ duration: 0.5, delay: 0.4 }}
                      className="whitespace-nowrap px-4 py-3 text-left font-medium text-muted-foreground"
                    >
                      Status
                    </motion.th>
                  </tr>
                </motion.thead>
                <motion.tbody
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {filteredTransactions.map((transaction, index) => (
                    <>
                    <motion.tr
                      key={transaction.id}
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: 20, opacity: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="border-t hover:bg-muted/50 transition-colors"
                    >
                      <motion.td
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.5 }}
                        className="whitespace-nowrap px-4 py-3 text-sm"
                      >
                        {transaction.id}
                      </motion.td>
                      <motion.td
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="whitespace-nowrap px-4 py-3 text-sm"
                      >
                        {new Date(transaction.date).toLocaleDateString()}
                      </motion.td>
                      <motion.td
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="px-4 py-3 text-sm"
                      >
                        {transaction.description}
                      </motion.td>
                      <motion.td
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className={`whitespace-nowrap px-4 py-3 text-right text-sm font-medium ${
                          transaction.type === "credit" ? "text-green-600" : "text-red-600"
                        }`}
                      >
                         {transaction.type === "credit" ? "+" : "-"}₹{transaction.amount.toLocaleString()}
                      </motion.td>
                      <motion.td
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="whitespace-nowrap px-4 py-3 text-sm"
                      >
                        {transaction.status}
                      </motion.td>
                    </motion.tr>
                    </>
                  ))}
                </motion.tbody>
              </motion.table>
            </div>
          </div>
        </CardContent>
      </Card>
    </DashboardShell>
  )
}
                    

