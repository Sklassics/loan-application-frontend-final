"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DashboardHeader } from "@/components/dashboard-header";
import { DashboardShell } from "@/components/dashboard-shell";
import { ArrowRight, BadgeCheck, Clock, FileText, IndianRupee, Percent } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import AnimatedCounter from "@/hooks/use-animated-counter";
import axios from "axios";

// Define the Loan type
interface Loan {
  loanId: string;
  creditLimit: number;
  loanStatus: string;
  loanRequestedAt: string;
  withdrawAmount?: number;
  loanInterest?: number;
}

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("overview");
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("auth_token");

        const headers = {
          Authorization: `Bearer ${token}`,
          "ngrok-skip-browser-warning": "true",
        };

        const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/dashboard`, {
          headers,
        });

        setDashboardData(response.data.dashboardData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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
      <DashboardHeader heading="Dashboard" text="Manage your loan applications and account details." />
      <Tabs defaultValue="overview" className="space-y-4" onValueChange={setActiveTab} value={activeTab}>
        <TabsList className="bg-slate-100/80 backdrop-blur-sm">
          <TabsTrigger
            value="overview"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-violet-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white"
          >
            Overview
          </TabsTrigger>
          <TabsTrigger
            value="applications"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-violet-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white"
          >
            Applications
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <motion.div
            className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {/* Loan Eligibility */}
            <Card className="overflow-hidden border-slate-200 hover:shadow-md transition-shadow duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-700">Loan Eligibility</CardTitle>
                <BadgeCheck className="h-4 w-4 text-violet-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-slate-800">
                  ₹
                  <AnimatedCounter
                    from={0}
                    to={dashboardData?.loans?.[0]?.creditLimit || 0}
                    duration={2}
                  />
                </div>
                <p className="text-xs text-slate-500">Maximum eligible amount</p>
                <Progress
                  value={75} // Example progress value
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

            {/* Active Loans */}
            <Card className="overflow-hidden border-slate-200 hover:shadow-md transition-shadow duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-700">Active Loans</CardTitle>
                <IndianRupee className="h-4 w-4 text-indigo-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-slate-800">
                  ₹
                  <AnimatedCounter
                    from={0}
                    to={dashboardData?.loans?.[0]?.withdrawAmount || 0}
                    duration={2}
                  />
                </div>
                <p className="text-xs text-slate-500">Current outstanding amount</p>
                <div className="mt-2 flex items-center gap-2">
                  <Percent className="h-4 w-4 text-indigo-600" />
                  <span className="text-sm text-slate-700">
                    {dashboardData?.loans?.[0]?.loanInterest  || 0}% interest rate
                  </span>
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

            {/* Verification Status */}
            <Card className="overflow-hidden border-slate-200 hover:shadow-md transition-shadow duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-700">Verification Status</CardTitle>
                <Clock className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-slate-800">
                  {dashboardData?.profile?.pancardNumber ? "Verified" : "Pending"}
                </div>
                <p className="text-xs text-slate-500">ID verification required</p>
                <div className="mt-4 flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-600">PAN Card</span>
                    <span
                      className={`text-xs font-medium ${
                        dashboardData?.profile?.pancardNumber ? "text-green-500" : "text-yellow-500"
                      }`}
                    >
                      {dashboardData?.profile?.pancardNumber ? "Approved" : "Pending"}
                    </span>
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
        </TabsContent>

        {/* Applications Tab */}
        <TabsContent value="applications" className="space-y-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Card className="border-slate-200 hover:shadow-md transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="text-slate-800">Loan Applications</CardTitle>
                <CardDescription className="text-slate-500">Manage your loan applications</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                    {dashboardData?.loans?.map((loan: Loan, index: number) => (
                    <div
                      key={index}
                      className="rounded-lg border border-slate-200 p-4 hover:border-violet-200 hover:bg-violet-50/30 transition-colors duration-300"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium text-slate-800">Loan #{loan.loanId}</h3>
                          <p className="text-sm text-slate-500">₹{loan.creditLimit.toLocaleString()}</p>
                        </div>
                        <span
                          className={`rounded-full px-2 py-1 text-xs font-medium ${
                            loan.loanStatus === "ACTIVE"
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {loan.loanStatus}
                        </span>
                      </div>
                      <div className="mt-4 flex items-center justify-between text-sm">
                        <span className="text-slate-500">
                          Applied on: {new Date(loan.loanRequestedAt).toLocaleDateString()}
                        </span>
                        <Link href={`/applications/${loan.loanId}`}>
                          <Button variant="link" size="sm" className="h-auto p-0 text-violet-600 hover:text-violet-800">
                            View Details
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))}
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
      </Tabs>
    </DashboardShell>
  );
}

