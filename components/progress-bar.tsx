"use client"

import { motion } from "framer-motion"

interface ProgressBarProps {
  progress: number
  label?: string
  showPercentage?: boolean
  size?: "sm" | "md" | "lg"
}

export function ProgressBar({ progress, label, showPercentage = true, size = "md" }: ProgressBarProps) {
  const heightClasses = {
    sm: "h-1.5",
    md: "h-2.5",
    lg: "h-4",
  }

  const labelClasses = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
  }

  return (
    <div>
      {label && (
        <div className="flex justify-between items-center mb-2">
          <span className={`font-medium text-foreground ${labelClasses[size]}`}>{label}</span>
          {showPercentage && (
            <span className={`text-muted-foreground ${labelClasses[size]}`}>{Math.round(progress)}%</span>
          )}
        </div>
      )}
      <div className={`w-full bg-secondary rounded-full overflow-hidden ${heightClasses[size]}`}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="h-full bg-gradient-to-r from-red-500 to-red-600"
        />
      </div>
    </div>
  )
}
