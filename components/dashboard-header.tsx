"use client"

import type React from "react"
import { motion } from "framer-motion"

interface DashboardHeaderProps {
  heading: string
  text?: string
  children?: React.ReactNode
}

export function DashboardHeader({ heading, text, children }: DashboardHeaderProps) {
  return (
    <div className="flex items-center justify-between px-2 mb-6">
      <motion.div
        className="grid gap-1"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl bg-clip-text text-transparent bg-gradient-to-r from-violet-700 to-indigo-700">
          {heading}
        </h1>
        {text && <p className="text-slate-600">{text}</p>}
      </motion.div>
      {children && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {children}
        </motion.div>
      )}
    </div>
  )
}

