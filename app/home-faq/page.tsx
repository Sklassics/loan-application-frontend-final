"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

const faqs = [
  { question: "How do I apply for a loan?", answer: "You can apply for a loan by creating an account, verifying your identity, and submitting the required documents through our online platform. The entire process is digital and can be completed in minutes." },
  { question: "What documents do I need to apply?", answer: "Typically, you'll need your ID proof, address proof, income proof (salary slips or bank statements), and PAN card. Additional documents may be required based on the loan type." },
  { question: "How long does the approval process take?", answer: "Most loan applications are processed within 24-48 hours, with funds disbursed shortly after approval." },
  { question: "What are the interest rates?", answer: "Interest rates vary based on the loan type, amount, and your credit profile. You can use our loan calculator to get an estimate. Our rates start from 8.5% per annum." },
  { question: "Can I prepay my loan?", answer: "Yes, you can prepay your loan. However, prepayment charges may apply depending on the loan type and tenure." },
  { question: "What is the minimum and maximum loan amount?", answer: "The minimum loan amount is ₹10,000, and the maximum can go up to ₹50 lakhs, depending on your eligibility and loan type." },
  { question: "How is my loan eligibility determined?", answer: "Your eligibility is based on factors such as your income, credit score, employment status, existing loans, and repayment history." },
  { question: "Do you offer loans to self-employed individuals?", answer: "Yes, self-employed individuals can apply for loans. Additional documents like business financials and IT returns may be required." },
  { question: "What happens if I miss an EMI payment?", answer: "Missing an EMI payment may lead to penalties and affect your credit score. We recommend setting up auto-debit to avoid delays." },
  { question: "Is my personal information secure?", answer: "Yes, we use advanced encryption and security measures to protect your personal and financial information." }
];

export default function FAQSection() {
  const [activeQuestion, setActiveQuestion] = useState<number | null>(null);
  const [showAll, setShowAll] = useState(false);
  const faqRef = useRef(null);

  const toggleQuestion = (index: number) => {
    setActiveQuestion(activeQuestion === index ? null : index);
  };

  return (
    <section id="faq" ref={faqRef} className="w-full py-2 bg-violet-50 relative">
      {/* Background Blur Effects */}
      <div className="absolute top-20 left-20 w-72 h-72 bg-purple-300/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-20 w-72 h-72 bg-indigo-300/20 rounded-full blur-3xl"></div>

      {/* FAQ Heading */}
      <div className="container px-4 md:px-6 relative z-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
          <div className="inline-block rounded-full bg-violet-600/10 px-3 py-1 text-sm font-medium bg-[#44ce6f] mb-4"> FAQ </div>
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl bg-clip-text text-gray-800">
              Frequently Asked Questions
            </h2>
            <p className="max-w-[900px] text-slate-700 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Find answers to common questions about our loan services
            </p>
          </div>
        </motion.div>

        {/* FAQ List */}
        <div className="mx-auto max-w-3xl">
          <div className="space-y-4">
            {(showAll ? faqs : faqs.slice(0, 5)).map((faq, index) => (
              <motion.div key={index} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 * index }} className="rounded-xl overflow-hidden">
                <div className={`bg-white p-6 rounded-xl shadow-md cursor-pointer transition-all duration-300 ${activeQuestion === index ? 'bg-gradient-to-r from-violet-50 to-indigo-50 shadow-lg' : 'hover:shadow-lg'}`} onClick={() => toggleQuestion(index)}>
                  <div className="flex justify-between items-center">
                    <h3 className={`text-lg font-semibold ${activeQuestion === index ? 'text-violet-800' : 'text-slate-800'}`}>
                      {faq.question}
                    </h3>
                    <ChevronDown className={`h-5 w-5 text-violet-600 transition-transform duration-300 ${activeQuestion === index ? 'rotate-180' : ''}`} />
                  </div>
                  <div className={`mt-2 text-slate-600 overflow-hidden transition-all duration-300 ${activeQuestion === index ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}>
                    <p className="pt-2">{faq.answer}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Toggle View More/Less Button */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.6 }} className="mt-8 text-center">
            <button onClick={() => setShowAll(!showAll)} className="border border-violet-600 text-violet-600 px-4 py-2 rounded-lg hover:bg-violet-600 hover:text-white transition-all duration-300">
              {showAll ? "Show Less" : "View All FAQs"}
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
