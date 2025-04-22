"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu } from "lucide-react"
import { CreditCard, FileText, Home, LifeBuoy, Settings, User, Calculator, Calendar, Clock } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

const items = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: Home,
  },
  // {
  //   title: "Apply for Loan",
  //   href: "/apply-loan",
  //   icon: FileText,
  // },
  // {
  //   title: "Loan Calculator",
  //   href: "/loan-calculator",
  //   icon: Calculator,
  // },
  // {
  //   title: "Verification",
  //   href: "/verification",
  //   icon: User,
  // },
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
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
  },
  {
    title: "Support",
    href: "/support",
    icon: LifeBuoy,
  },
]

export function MobileNav() {
  const [open, setOpen] = useState(false)
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
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
        >
          <Menu className="h-6 w-6 text-violet-700" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="pr-0 bg-gradient-to-br from-white to-indigo-50">
        <div className="px-7">
          <Link href="/" className="flex items-center" onClick={() => setOpen(false)}>
            <span className="font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-indigo-600">
              Sklassics
            </span>
          </Link>
        </div>
        <div className="my-4 h-[calc(100vh-8rem)] pb-10 pl-6 overflow-y-auto">
          <AnimatePresence>
            {open && (
              <motion.div className="flex flex-col space-y-3" variants={container} initial="hidden" animate="show">
                {items.map((item, index) => (
                  <motion.div key={index}>
                    <Link
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className={cn(
                        "flex items-center rounded-md px-3 py-2 text-sm font-medium transition-all duration-200 ease-in-out",
                        pathname === item.href
                          ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white"
                          : "text-slate-700 hover:bg-violet-100/50 hover:text-violet-700",
                      )}
                    >
                      <item.icon
                        className={cn(
                          "mr-2 h-4 w-4",
                          pathname === item.href ? "text-white" : "text-slate-500 group-hover:text-violet-600",
                        )}
                      />
                      <span>{item.title}</span>
                    </Link>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </SheetContent>
    </Sheet>
  )
}

