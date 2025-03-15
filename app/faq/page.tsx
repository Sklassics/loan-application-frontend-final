"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { ChevronDown, ChevronUp, Search, MessageCircle, FileText, HelpCircle } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export default function FAQPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null)
  const [activeCategory, setActiveCategory] = useState("all")

  // Sample FAQ data
  const faqCategories = [
    { id: "all", name: "All FAQs" },
    { id: "loan", name: "Loan Process" },
    { id: "repayment", name: "Repayment" },
    { id: "eligibility", name: "Eligibility" },
    { id: "documents", name: "Documents" },
    { id: "account", name: "Account" },
  ]

  const faqs = [
    {
      id: 1,
      question: "What documents do I need to apply for a loan?",
      answer:
        "To apply for a loan, you'll need to provide your identity proof (Aadhar Card, PAN Card, Voter ID), address proof (Utility bills, Rental agreement), income proof (Salary slips, Bank statements), and employment details. Additional documents may be required based on the loan type and amount.",
      category: "documents",
      colorScheme: "from-violet-500 to-indigo-500",
    },
    {
      id: 2,
      question: "How is my loan eligibility calculated?",
      answer:
        "Your loan eligibility is calculated based on several factors including your income, existing debt obligations, credit score, employment stability, age, and the loan tenure you're applying for. We use these factors to determine your repayment capacity and the maximum loan amount you can comfortably repay.",
      category: "eligibility",
      colorScheme: "from-blue-500 to-cyan-500",
    },
    {
      id: 3,
      question: "Can I repay my loan before the tenure ends?",
      answer:
        "Yes, you can repay your loan before the tenure ends. This is called foreclosure or prepayment. However, there might be a prepayment penalty, typically 2-5% of the outstanding loan amount. The exact terms are mentioned in your loan agreement. Prepayment can help you save on interest costs in the long run.",
      category: "repayment",
      colorScheme: "from-emerald-500 to-teal-500",
    },
    {
      id: 4,
      question: "How long does the loan approval process take?",
      answer:
        "The loan approval process typically takes 2-3 business days after all required documents are submitted. For pre-approved loans, the process can be faster. Once approved, the loan amount is disbursed to your registered bank account within 24-48 hours. You can track the status of your application in the dashboard.",
      category: "loan",
      colorScheme: "from-amber-500 to-orange-500",
    },
    {
      id: 5,
      question: "What happens if I miss an EMI payment?",
      answer:
        "If you miss an EMI payment, a late payment fee will be charged. Continued missed payments can negatively impact your credit score and may result in additional penalties. It's important to contact our customer support immediately if you anticipate difficulty in making a payment. We can work with you to find a solution.",
      category: "repayment",
      colorScheme: "from-red-500 to-pink-500",
    },
    {
      id: 6,
      question: "How do I update my personal information?",
      answer:
        "You can update your personal information through your account settings in the dashboard. Navigate to the Profile section, where you can edit details like your phone number, email address, and mailing address. For changes to critical information like your name or PAN number, you may need to submit supporting documentation.",
      category: "account",
      colorScheme: "from-purple-500 to-pink-500",
    },
    {
      id: 7,
      question: "What is the interest rate on loans?",
      answer:
        "The interest rate on loans varies based on the loan type, amount, tenure, and your credit profile. Personal loans typically range from 10.5% to 18% per annum, education loans from 9% to 15%, and home loans from 7.5% to 11%. Your specific rate will be communicated during the loan approval process.",
      category: "loan",
      colorScheme: "from-blue-500 to-indigo-500",
    },
    {
      id: 8,
      question: "How can I get my loan statement?",
      answer:
        "You can download your loan statement directly from the dashboard. Go to the Loan Details section, select the loan for which you need a statement, and click on 'Download Statement'. You can choose the time period for the statement. The statement includes details of all transactions, payments, and the current outstanding balance.",
      category: "account",
      colorScheme: "from-green-500 to-emerald-500",
    },
  ]

  const toggleFaq = (faqId: number) => {
    setExpandedFaq(expandedFaq === faqId ? null : faqId)
  }

  const filteredFaqs = faqs.filter(
    (faq) =>
      (activeCategory === "all" || faq.category === activeCategory) &&
      (searchTerm === "" ||
        faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  return (
    <DashboardShell>
      <DashboardHeader
        heading="Frequently Asked Questions"
        text="Find answers to common questions about our loan services."
      >
        <Button
          className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 transition-all duration-300"
          onClick={() => (window.location.href = "/support")}
        >
          <MessageCircle className="h-4 w-4 mr-2" />
          Contact Support
        </Button>
      </DashboardHeader>

      <div className="space-y-6">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-violet-600/20 to-indigo-600/20 rounded-lg blur-xl opacity-50"></div>
          <Card className="border-slate-200 relative overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle className="text-center text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-indigo-600">
                How can we help you?
              </CardTitle>
              <CardDescription className="text-center text-slate-500">
                Search for answers or browse through categories
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative max-w-xl mx-auto">
                <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />
                <Input
                  type="text"
                  placeholder="Search for answers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 py-6 text-base border-slate-300 focus:border-violet-500 focus:ring-violet-500/20"
                />
              </div>

              <div className="mt-6 flex flex-wrap gap-2 justify-center">
                {faqCategories.map((category) => (
                  <Button
                    key={category.id}
                    variant={activeCategory === category.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => setActiveCategory(category.id)}
                    className={
                      activeCategory === category.id
                        ? "bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 transition-all duration-300"
                        : "border-slate-200 hover:border-violet-300 hover:bg-violet-50 hover:text-violet-700 transition-all duration-300"
                    }
                  >
                    {category.name}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-4"
        >
          {filteredFaqs.length > 0 ? (
            filteredFaqs.map((faq) => (
              <motion.div
                key={faq.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card
                  className={`border-slate-200 hover:shadow-md transition-all duration-300 overflow-hidden ${expandedFaq === faq.id ? "ring-2 ring-violet-200" : ""}`}
                >
                  <div className={`h-1 w-full bg-gradient-to-r ${faq.colorScheme}`}></div>
                  <CardHeader className="p-4 cursor-pointer" onClick={() => toggleFaq(faq.id)}>
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-base font-medium text-slate-800">{faq.question}</CardTitle>
                      <Button variant="ghost" size="sm" className="p-0 h-8 w-8 rounded-full">
                        {expandedFaq === faq.id ? (
                          <ChevronUp className="h-5 w-5 text-slate-600" />
                        ) : (
                          <ChevronDown className="h-5 w-5 text-slate-600" />
                        )}
                      </Button>
                    </div>
                  </CardHeader>
                  <AnimatePresence>
                    {expandedFaq === faq.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <CardContent className="pt-0 pb-4 px-4">
                          <div className="pl-0 border-l-0 md:pl-6 md:border-l-2 border-violet-200">
                            <p className="text-slate-600">{faq.answer}</p>
                          </div>
                        </CardContent>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Card>
              </motion.div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center p-8 text-center">
              <div className="rounded-full bg-slate-100 p-3 mb-4">
                <HelpCircle className="h-6 w-6 text-slate-400" />
              </div>
              <h3 className="text-lg font-medium text-slate-800">No results found</h3>
              <p className="text-sm text-slate-500 mt-1">
                {searchTerm ? `No FAQs matching "${searchTerm}"` : "No FAQs in this category"}
              </p>
              <Button
                variant="link"
                className="mt-4 text-violet-600 hover:text-violet-800"
                onClick={() => {
                  setSearchTerm("")
                  setActiveCategory("all")
                }}
              >
                Clear filters
              </Button>
            </div>
          )}
        </motion.div>

        <div className="bg-gradient-to-r from-violet-50 to-indigo-50 rounded-lg p-6 text-center">
          <h3 className="text-lg font-medium text-slate-800 mb-2">Still have questions?</h3>
          <p className="text-slate-600 mb-4">Our support team is here to help you with any questions you may have.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              variant="outline"
              className="border-violet-200 text-violet-700 hover:bg-violet-50 hover:text-violet-800 hover:border-violet-300 transition-colors"
            >
              <FileText className="h-4 w-4 mr-2" />
              Browse Documentation
            </Button>
            <Button className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 transition-all duration-300">
              <MessageCircle className="h-4 w-4 mr-2" />
              Contact Support
            </Button>
          </div>
        </div>
      </div>
    </DashboardShell>
  )
}

