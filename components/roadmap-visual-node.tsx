"use client"

import { motion } from "framer-motion"
import type { Level } from "@/lib/learning-data"

interface RoadmapVisualNodeProps {
  level: Level
  index: number
  isSelected: boolean
  completion: number
  onClick: () => void
}

export function RoadmapVisualNode({
  level,
  index,
  isSelected,
  completion,
  onClick,
}: RoadmapVisualNodeProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.1 }}
      className="flex justify-center"
    >
      {/* Node Button with layered z-index to prevent line showing through */}
      <motion.button
        onClick={onClick}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`relative w-48 h-48 rounded-full border-4 transition-all ${
          isSelected
            ? "border-red-500 bg-red-500/10"
            : "border-red-200 dark:border-red-900 bg-card dark:bg-slate-900 hover:border-red-400 dark:hover:border-red-700"
        } shadow-lg`}
        style={{ zIndex: 20 }}
      >
        {/* Solid background layer to block connecting lines */}
        <div className="absolute inset-0 rounded-full bg-card dark:bg-slate-900" style={{ zIndex: 1 }} />
        
        {/* Completion Ring */}
        <svg className="absolute inset-0 w-full h-full -rotate-90" style={{ zIndex: 2 }}>
          <circle
            cx="50%"
            cy="50%"
            r="45%"
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
            className="text-gray-200 dark:text-slate-700"
          />
          <circle
            cx="50%"
            cy="50%"
            r="45%"
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
            strokeDasharray={`${2 * Math.PI * 86} ${2 * Math.PI * 86}`}
            strokeDashoffset={2 * Math.PI * 86 * (1 - completion / 100)}
            className="text-red-500 transition-all duration-500"
          />
        </svg>

        {/* Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center p-4" style={{ zIndex: 3 }}>
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center text-white font-bold text-sm mb-2">
            {index + 1}
          </div>
          <h3 className="text-sm font-bold text-foreground text-center line-clamp-2">{level.title}</h3>
          <p className="text-xs text-muted-foreground mt-2">{Math.round(completion)}%</p>
        </div>
      </motion.button>
    </motion.div>
  )
}
