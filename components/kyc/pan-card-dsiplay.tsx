"use client"

import { motion } from "framer-motion"
import { IndianRupee } from "lucide-react"

interface PanCardDisplayProps {
  panNumber: string
  fullName: string
  dateOfBirth: string
  fatherName: string
}

export function PanCardDisplay({ panNumber, fullName, dateOfBirth, fatherName }: PanCardDisplayProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md mx-auto"
    >
      <div className="relative bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-lg">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-3 flex justify-between items-center">
          <div className="flex items-center">
            <IndianRupee className="h-5 w-5 mr-2" />
            <span className="font-bold">INCOME TAX DEPARTMENT</span>
          </div>
          <div className="text-xs">GOVT. OF INDIA</div>
        </div>

        {/* Content */}
        <div className="p-4">
          <div className="flex">
            {/* Left side with photo */}
            <div className="w-1/3 flex flex-col items-center justify-center p-2">
              <div className="w-24 h-28 border-2 border-gray-300 dark:border-gray-600 rounded flex items-center justify-center bg-white dark:bg-gray-800">
                <span className="text-xs text-gray-400 text-center">Photo</span>
              </div>
              <div className="mt-2 w-full">
                <div className="w-full h-10 border border-gray-300 dark:border-gray-600 rounded flex items-center justify-center bg-white dark:bg-gray-800">
                  <span className="text-xs text-gray-400">Signature</span>
                </div>
              </div>
            </div>

            {/* Right side with details */}
            <div className="w-2/3 pl-4">
              <div className="mb-4">
                <div className="text-xs text-gray-500 dark:text-gray-400">Permanent Account Number</div>
                <div className="text-lg font-bold tracking-wider text-gray-800 dark:text-gray-200">
                  {panNumber || "ABCDE1234F"}
                </div>
              </div>

              <div className="mb-4">
                <div className="text-xs text-gray-500 dark:text-gray-400">Name</div>
                <div className="font-medium text-gray-800 dark:text-gray-200">{fullName || "JOHN DOE"}</div>
              </div>

              <div className="mb-4">
                <div className="text-xs text-gray-500 dark:text-gray-400">Father's Name</div>
                <div className="font-medium text-gray-800 dark:text-gray-200">{fatherName || "RICHARD DOE"}</div>
              </div>

              <div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Date of Birth</div>
                <div className="font-medium text-gray-800 dark:text-gray-200">{dateOfBirth || "01/01/1990"}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-100 dark:bg-gray-800 p-2 text-center text-xs text-gray-500 dark:text-gray-400">
          This card is the property of the Income Tax Department
        </div>
      </div>
    </motion.div>
  )
}

