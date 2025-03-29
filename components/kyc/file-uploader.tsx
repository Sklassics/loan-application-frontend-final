"use client"

import type React from "react"

import { useState, useRef } from "react"
import { motion } from "framer-motion"
import { Upload, User, CreditCard, AlertCircle, X, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"

interface FileUploaderProps {
  onFileUpload: (file: File) => void
  acceptedFileTypes: string[]
  maxSize: number
  label: string
  description: string
  icon: "user" | "card" | "document"
  initialPreview?: string
}

export function FileUploader({
  onFileUpload,
  acceptedFileTypes,
  maxSize,
  label,
  description,
  icon,
  initialPreview,
}: FileUploaderProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(initialPreview || null)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0])
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0])
    }
  }

  const validateAndSetFile = (file: File) => {
    setError(null)

    // Check file type
    if (!acceptedFileTypes.includes(file.type)) {
      setError(`Invalid file type. Please upload ${acceptedFileTypes.join(", ")}`)
      return
    }

    // Check file size
    if (file.size > maxSize) {
      setError(`File size exceeds ${(maxSize / (1024 * 1024)).toFixed(1)}MB limit`)
      return
    }

    setFile(file)
    onFileUpload(file)

    // Create preview for image files
    if (file.type.startsWith("image/")) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setPreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    } else if (file.type === "application/pdf") {
      // For PDFs, we'll just show an icon
      setPreview(null)
    }
  }

  const handleRemoveFile = () => {
    setFile(null)
    setPreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const getIcon = () => {
    switch (icon) {
      case "user":
        return <User className="h-10 w-10 text-gray-400" />
      case "card":
        return <CreditCard className="h-10 w-10 text-gray-400" />
      case "document":
        return <FileText className="h-10 w-10 text-gray-400" />
      default:
        return <Upload className="h-10 w-10 text-gray-400" />
    }
  }

  return (
    <div className="w-full" onClick={() => fileInputRef.current?.click()}>
      <div
        className={`relative border-2 border-dashed rounded-lg p-6 transition-all duration-300 ${
          isDragging
            ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20"
            : "border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50"
        } ${error ? "border-red-300 bg-red-50 dark:border-red-800 dark:bg-red-900/20" : ""}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          onChange={handleFileChange}
          accept={acceptedFileTypes.join(",")}
        />

        {!file ? (
          <div className="flex flex-col items-center justify-center space-y-4 py-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="rounded-full bg-gray-100 dark:bg-gray-800 p-4"
            >
              {getIcon()}
            </motion.div>
            <div className="text-center">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{description}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Drag & drop or{" "}
                <button
                  type="button"
                  className="text-indigo-600 dark:text-indigo-400 hover:underline focus:outline-none"
                  onClick={() => fileInputRef.current?.click()}
                >
                  browse
                </button>
              </p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center space-y-4 py-4">
            {preview ? (
              <div className="relative w-32 h-32 rounded-lg overflow-hidden">
                <img src={preview || "/placeholder.svg"} alt="Preview" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={handleRemoveFile}
                  className="absolute top-1 right-1 bg-gray-800/70 text-white rounded-full p-1 hover:bg-gray-900/90 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <div className="rounded-full bg-indigo-100 dark:bg-indigo-900/30 p-2">
                  {file.type === "application/pdf" ? <FileText className="h-5 w-5 text-indigo-600" /> : getIcon()}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{file.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{(file.size / 1024).toFixed(2)} KB</p>
                </div>
                <button
                  type="button"
                  onClick={handleRemoveFile}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              className="mt-2"
            >
              Replace File
            </Button>
          </div>
        )}

        {error && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute inset-x-0 -bottom-8 flex items-center text-xs text-red-600 dark:text-red-400 mt-1"
          >
            <AlertCircle className="h-3 w-3 mr-1 flex-shrink-0" />
            {error}
          </motion.div>
        )}
      </div>
    </div>
  )
}

