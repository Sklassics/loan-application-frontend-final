"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardHeader } from "@/components/dashboard-header";
import { DashboardShell } from "@/components/dashboard-shell";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download, CheckCircle, Clock, AlertCircle, FileText, CreditCard, Filter, Search } from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function LoanHistoryPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("active");
  const [searchTerm, setSearchTerm] = useState("");
  const [loans, setLoans] = useState<Array<{
    id: string;
    type: string;
    amount: number;
    disbursedAmount: number;
    processingFee: number;
    interestRate: number;
    tenure: number;
    emiAmount: number;
    startDate: string;
    endDate: string;
    totalInterest: number;
    totalAmount: number;
    paidEMIs: number;
    remainingEMIs: number;
    status: string;
    disbursementDate: string;
    purpose: string;
    accountNumber: string;
    loanNumber: string;
    colorScheme: string;
  }>>([]);
  const [loading, setLoading] = useState(true); // State for loading

  // Fetch loans from the API
  useEffect(() => {
    const fetchLoans = async () => {
      try {
        const token = localStorage.getItem("auth_token");
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/dashboard`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "ngrok-skip-browser-warning": "true",
          },
        });

        if (response.data && response.data.dashboardData && response.data.dashboardData.loans) {
          const apiLoans = response.data.dashboardData.loans.map((loan: { loanId: string; creditLimit: number; withdrawAmount: number; loanInterest: number; tenure: number; loanRequestedAt: string; repaymentSchedules: { repayableAmount: number; dueDate: string; interestAmount: number }[]; loanStatus: string }) => ({
            id: loan.loanId,
            type: "Loan",
            amount: loan.creditLimit,
            disbursedAmount: loan.withdrawAmount,
            processingFee: 0, // Not provided in the API response
            interestRate: loan.loanInterest, // Convert to percentage
            tenure: loan.tenure,
            emiAmount: loan.repaymentSchedules[0]?.repayableAmount || 0,
            startDate: loan.loanRequestedAt.split("T")[0],
            endDate: loan.repaymentSchedules[0]?.dueDate || "",
            totalInterest: loan.repaymentSchedules[0]?.interestAmount || 0,
            totalAmount: loan.repaymentSchedules[0]?.repayableAmount || 0,
            paidEMIs: 0, // Not provided in the API response
            remainingEMIs: loan.tenure, // Assuming all EMIs are unpaid
            status: loan.loanStatus.toLowerCase(),
            disbursementDate: loan.loanRequestedAt.split("T")[0],
            purpose: "General Purpose", // Not provided in the API response
            accountNumber: "XXXXXXXXXXXX2187", // Placeholder
            loanNumber: `LN-${loan.loanId}`, // Generate a loan number
            colorScheme: "from-violet-500 to-indigo-500", // Default color scheme
          }));
          setLoans(apiLoans);
        } else {
          console.error("Unexpected API response:", response.data);
        }
      } catch (error) {
        console.error("Failed to fetch loans", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLoans();
  }, []);

  const filteredLoans = loans.filter(
    (loan) =>
      (activeTab === "all" || loan.status === activeTab) &&
      (searchTerm === "" ||
        loan.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        loan.loanNumber.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <Clock className="h-4 w-4 text-blue-600" />;
      case "closed":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      default:
        return <AlertCircle className="h-4 w-4 text-slate-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-blue-100 text-blue-800";
      case "closed":
        return "bg-green-100 text-green-800";
      default:
        return "bg-slate-100 text-slate-800";
    }
  };

  const viewLoanDetails = (loanId: string) => {
    router.push(`/loan-details/${loanId}`);
  };

  const viewTransactions = (loanId: string) => {
    router.push(`/transactions?loanId=${loanId}`);
  };
  const [loadingLoader, setLoadingLoader] = useState(false);
  
  if (loadingLoader) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-violet-500"></div>
      </div>
    );
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

        {loading ? (
          <div className="text-center py-10">Loading...</div>
        ) : (
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
        )}
      </div>
    </DashboardShell>
  );
}

