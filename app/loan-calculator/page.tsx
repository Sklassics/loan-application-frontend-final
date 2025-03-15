"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { ArrowRight, Calculator } from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"

export default function LoanCalculatorPage() {
  const [loanAmount, setLoanAmount] = useState(100000)
  const [interestRate, setInterestRate] = useState(12)
  const [loanTerm, setLoanTerm] = useState(12)
  const [monthlyPayment, setMonthlyPayment] = useState(0)
  const [totalPayment, setTotalPayment] = useState(0)
  const [totalInterest, setTotalInterest] = useState(0)
  const [income, setIncome] = useState(50000)
  const [eligibleAmount, setEligibleAmount] = useState(0)

  // Calculate loan details
  useEffect(() => {
    const calculateLoan = () => {
      const monthlyInterest = interestRate / 100 / 12
      const totalMonths = loanTerm

      // Calculate monthly payment using the formula: P * r * (1 + r)^n / ((1 + r)^n - 1)
      const x = Math.pow(1 + monthlyInterest, totalMonths)
      const monthly = (loanAmount * monthlyInterest * x) / (x - 1)

      if (isFinite(monthly)) {
        setMonthlyPayment(monthly)
        setTotalPayment(monthly * totalMonths)
        setTotalInterest(monthly * totalMonths - loanAmount)
      }
    }

    calculateLoan()
  }, [loanAmount, interestRate, loanTerm])

  // Calculate eligible loan amount based on income
  useEffect(() => {
    // Assuming 50% of income can go towards EMI
    const maxMonthlyPayment = income * 0.5
    const monthlyInterest = interestRate / 100 / 12
    const totalMonths = loanTerm

    // Reverse the EMI formula to find the principal: EMI * ((1+r)^n - 1) / (r * (1+r)^n)
    const x = Math.pow(1 + monthlyInterest, totalMonths)
    const eligible = (maxMonthlyPayment * (x - 1)) / (monthlyInterest * x)

    if (isFinite(eligible) && eligible > 0) {
      setEligibleAmount(Math.round(eligible))
    } else {
      setEligibleAmount(0)
    }
  }, [income, interestRate, loanTerm])

  return (
    <DashboardShell>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="animate-fade-in-down"
      >
        <DashboardHeader heading="Loan Calculator" text="Calculate your loan EMI and check your eligibility." />
      </motion.div>
      <div className="grid gap-4 md:grid-cols-2">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
          <Card>
            <CardHeader>
              <motion.div initial={{ y: -10 }} animate={{ y: 0 }} transition={{ duration: 0.3 }}>
                <CardTitle>EMI Calculator</CardTitle>
                <CardDescription>Calculate your Equated Monthly Installment (EMI)</CardDescription>
              </motion.div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="loan-amount">Loan Amount (₹)</Label>
                    <Input
                      id="loan-amount-input"
                      type="number"
                      className="w-24 text-right"
                      value={loanAmount}
                      onChange={(e) => setLoanAmount(Number(e.target.value))}
                    />
                  </div>
                </motion.div>
                <Slider
                  id="loan-amount"
                  min={10000}
                  max={1000000}
                  step={10000}
                  value={[loanAmount]}
                  onValueChange={(value) => setLoanAmount(value[0])}
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>₹10,000</span>
                  <span>₹10,00,000</span>
                </div>
              </div>

              <div className="space-y-2">
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="interest-rate">Interest Rate (%)</Label>
                    <Input
                      id="interest-rate-input"
                      type="number"
                      className="w-24 text-right"
                      value={interestRate}
                      onChange={(e) => setInterestRate(Number(e.target.value))}
                      step={0.1}
                    />
                  </div>
                </motion.div>
                <Slider
                  id="interest-rate"
                  min={5}
                  max={24}
                  step={0.1}
                  value={[interestRate]}
                  onValueChange={(value) => setInterestRate(value[0])}
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>5%</span>
                  <span>24%</span>
                </div>
              </div>

              <div className="space-y-2">
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="loan-term">Loan Term (months)</Label>
                    <Input
                      id="loan-term-input"
                      type="number"
                      className="w-24 text-right"
                      value={loanTerm}
                      onChange={(e) => setLoanTerm(Number(e.target.value))}
                    />
                  </div>
                </motion.div>
                <Slider
                  id="loan-term"
                  min={3}
                  max={60}
                  step={1}
                  value={[loanTerm]}
                  onValueChange={(value) => setLoanTerm(value[0])}
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>3 months</span>
                  <span>60 months</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} transition={{ duration: 0.4 }}>
                <div className="w-full rounded-lg bg-muted p-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Monthly Payment (EMI)</span>
                      <span className="font-bold">₹{monthlyPayment.toFixed(2)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Total Payment</span>
                      <span>₹{totalPayment.toFixed(2)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Total Interest</span>
                      <span>₹{totalInterest.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
              <Link href="/apply-loan" className="w-full">
                <Button className="w-full">
                  Apply for Loan <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Loan Eligibility</CardTitle>
              <CardDescription>Check how much loan you are eligible for</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4 }}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="monthly-income">Monthly Income (₹)</Label>
                    <Input
                      id="monthly-income-input"
                      type="number"
                      className="w-24 text-right"
                      value={income}
                      onChange={(e) => setIncome(Number(e.target.value))}
                    />
                  </div>
                  <Slider
                    id="monthly-income"
                    min={10000}
                    max={200000}
                    step={5000}
                    value={[income]}
                    onValueChange={(value) => setIncome(value[0])}
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>₹10,000</span>
                    <span>₹2,00,000</span>
                  </div>
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4 }}
              >
                <div className="space-y-2">
                  <Label>Employment Type</Label>
                  <select className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                    <option value="salaried">Salaried</option>
                    <option value="self-employed">Self-Employed</option>
                    <option value="business">Business Owner</option>
                    <option value="student">Student</option>
                  </select>
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4 }}
              >
                <div className="space-y-2">
                  <Label>Credit Score Range</Label>
                  <select className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                    <option value="excellent">Excellent (750+)</option>
                    <option value="good">Good (700-749)</option>
                    <option value="fair">Fair (650-699)</option>
                    <option value="poor">Poor (below 650)</option>
                    <option value="no-score">No Credit History</option>
                  </select>
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4 }}
              >
                <div className="space-y-2">
                  <Label>Existing Loans</Label>
                  <select className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                    <option value="none">None</option>
                    <option value="one">One Loan</option>
                    <option value="multiple">Multiple Loans</option>
                  </select>
                </div>
              </motion.div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <div className="w-full rounded-lg bg-muted p-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Eligible Loan Amount</span>
                      <span className="font-bold">₹{eligibleAmount.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Maximum EMI Capacity</span>
                      <span>₹{(income * 0.5).toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Recommended Loan Term</span>
                      <span>{loanTerm} months</span>
                    </div>
                  </div>
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
              >
                <Button className="w-full flex items-center justify-center gap-2">
                  <Calculator className="h-4 w-4" />
                  Calculate Eligibility
                </Button>
              </motion.div>
            </CardFooter>
          </Card>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Card className="mt-4">
          <CardHeader>
            <CardTitle>Loan Comparison</CardTitle>
            <CardDescription>Compare different loan options based on your eligibility</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <motion.table
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="w-full"
              >
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Loan Type</th>
                    <th className="text-left p-2">Interest Rate</th>
                    <th className="text-left p-2">Max Amount</th>
                    <th className="text-left p-2">Processing Fee</th>
                    <th className="text-left p-2">Tenure</th>
                    <th className="text-left p-2">Action</th>
                  </tr>
                </thead>
                <tbody>
                  <motion.tr
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="border-b"
                  >
                    <td className="p-2">Personal Loan</td>
                    <td className="p-2">10.5% - 18%</td>
                    <td className="p-2">₹{eligibleAmount.toLocaleString()}</td>
                    <td className="p-2">1% - 2%</td>
                    <td className="p-2">12 - 60 months</td>
                    <td className="p-2">
                      <Button variant="outline" size="sm">
                        Apply
                      </Button>
                    </td>
                  </motion.tr>
                  <motion.tr
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="border-b"
                  >
                    <td className="p-2">Education Loan</td>
                    <td className="p-2">8.5% - 12%</td>
                    <td className="p-2">₹{(eligibleAmount * 1.5).toLocaleString()}</td>
                    <td className="p-2">0.5% - 1%</td>
                    <td className="p-2">12 - 84 months</td>
                    <td className="p-2">
                      <Button variant="outline" size="sm">
                        Apply
                      </Button>
                    </td>
                  </motion.tr>
                  <motion.tr
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    <td className="p-2">Business Loan</td>
                    <td className="p-2">12% - 24%</td>
                    <td className="p-2">₹{(eligibleAmount * 2).toLocaleString()}</td>
                    <td className="p-2">1.5% - 3%</td>
                    <td className="p-2">12 - 60 months</td>
                    <td className="p-2">
                      <Button variant="outline" size="sm">
                        Apply
                      </Button>
                    </td>
                  </motion.tr>
                </tbody>
              </motion.table>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </DashboardShell>
  )
}

