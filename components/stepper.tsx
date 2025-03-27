import React from "react"
import { cn } from "@/lib/utils"
import { Check } from "lucide-react"

interface StepperProps {
  currentStep: number
  className?: string
  children: React.ReactNode
}

export function Stepper({ currentStep, className, children }: StepperProps) {
  // Count the number of steps
  const steps = React.Children.toArray(children)
  const totalSteps = steps.length

  return (
    <div className={cn("w-full", className)}>
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <React.Fragment key={index}>
            {/* Step circle */}
            <div className="relative flex flex-col items-center">
              <div
                className={cn(
                  "flex h-10 w-10 items-center justify-center  rounded-full border-2 transition-colors  duration-300",
                  index < currentStep
                    ? "border-primary bg-primary text-primary-foreground bg-green-500 border-green-500"
                    : index === currentStep
                      ? "border-primary  bg-background  text-primary"
                      : "border-muted-foreground bg-background text-muted-foreground",
                )}
              >
                {index < currentStep ? <Check className="h-5 w-5" /> : <span>{index + 1}</span>}
              </div>
              <span
                className={cn(
                  "absolute -bottom-6 w-max text-center text-xs border-green-500 font-medium",
                  index <= currentStep ? "text-primary" : "text-muted-foreground",
                )}
              >
                {(step as React.ReactElement<StepProps>).props.title}
              </span>
            </div>

            {/* Connector line between steps */}
            {index < totalSteps - 1 && (
              <div
                className={cn(
                  "h-0.5 w-full transition-colors duration-300",
                  index < currentStep ? "bg-primary" : "bg-muted-foreground/30",
                )}
              />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  )
}

interface StepProps {
  title: string
}

export function Step({ title }: StepProps) {
  return null
}

