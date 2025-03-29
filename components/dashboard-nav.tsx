"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { CreditCard, FileText, Home, LifeBuoy, Settings, User, Calculator, Calendar, Clock } from "lucide-react"
import { motion } from "framer-motion"

const items = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: Home,
  },
  {
    title: "Apply for Loan",
    href: "/apply-loan",
    icon: FileText,
  },
  {
    title: "Loan Calculator",
    href: "/loan-calculator",
    icon: Calculator,
  },
  {
    title: "Verification",
    href: "/verification",
    icon: User,
  },
  {
    title: "Transactions",
    href: "/transactions",
    icon: CreditCard,
  },
  {
    title: "Repayment Schedule",
    href: "/repayment-schedule",
    icon: Calendar,
  },
  {
    title: "Loan History",
    href: "/loan-history",
    icon: Clock,
  },
  {
    title: "Profile",
    href: "/profile",
    icon: User,
  },
  // {
  //   title: "Settings",
  //   href: "/settings",
  //   icon: Settings,
  // },
  {
    title: "Support",
    href: "/support",
    icon: LifeBuoy,
  },
]

export function DashboardNav() {
  const pathname = usePathname()

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.1,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, x: -20 },
    show: { opacity: 1, x: 0 },
  }

  return (
    <motion.nav className="grid items-start gap-2 py-4" variants={container} initial="hidden" animate="show">
      {items.map((navItem, index) => (
        <motion.div key={index} variants={item}>
          <Link
            href={navItem.href}
            className={cn(
              "group flex items-center rounded-md px-3 py-2 text-sm font-medium transition-all duration-200 ease-in-out",
              pathname === navItem.href
                ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white"
                : "text-slate-700 hover:bg-violet-100/50 hover:text-violet-700",
            )}
          >
            <navItem.icon
              className={cn(
                "mr-2 h-4 w-4",
                pathname === navItem.href ? "text-white" : "text-slate-500 group-hover:text-violet-600",
              )}
            />
            <span>{navItem.title}</span>
          </Link>
        </motion.div>
      ))}
    </motion.nav>
  )
}

