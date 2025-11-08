"use client"

import { motion, AnimatePresence } from "framer-motion"
import { CheckCircle2, Circle, ExternalLink, BookOpen, Youtube, ChevronDown } from "lucide-react"
import type { Level } from "@/lib/learning-data"

interface RoadmapListItemProps {
  level: Level
  index: number
  isExpanded: boolean
  completedTopics: number
  domain: string
  onToggle: () => void
  isTopicCompleted: (domain: string, levelId: string, topicId: string) => boolean
  toggleTopic: (domain: string, levelId: string, topicId: string) => void
}

export function RoadmapListItem({
  level,
  index,
  isExpanded,
  completedTopics,
  domain,
  onToggle,
  isTopicCompleted,
  toggleTopic,
}: RoadmapListItemProps) {
  const progressPercent = (completedTopics / level.topics.length) * 100

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-card dark:bg-slate-900 rounded-xl border-2 border-red-200 dark:border-red-900/50 overflow-hidden shadow-lg"
    >
      {/* Header - Always Visible */}
      <button
        onClick={onToggle}
        className="w-full p-6 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
      >
        <div className="flex items-center gap-4 flex-1">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center text-white font-bold">
            {index + 1}
          </div>
          <div className="text-left">
            <p className="text-xs font-semibold text-red-600 dark:text-red-400 uppercase">{level.id}</p>
            <h3 className="text-lg font-bold text-foreground">{level.title}</h3>
            <p className="text-sm text-muted-foreground mt-1">
              {completedTopics}/{level.topics.length} topics completed
            </p>
          </div>
        </div>

        {/* Progress Circle */}
        <div className="flex items-center gap-4">
          <div className="relative w-16 h-16">
            <svg className="transform -rotate-90 w-16 h-16">
              <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="4" fill="none" className="text-gray-200 dark:text-slate-700" />
              <circle
                cx="32"
                cy="32"
                r="28"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
                strokeDasharray={`${2 * Math.PI * 28}`}
                strokeDashoffset={2 * Math.PI * 28 * (1 - progressPercent / 100)}
                className="text-red-500 transition-all duration-500"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xs font-bold text-foreground">{Math.round(progressPercent)}%</span>
            </div>
          </div>
          <motion.div animate={{ rotate: isExpanded ? 180 : 0 }} transition={{ duration: 0.3 }}>
            <ChevronDown className="w-6 h-6 text-muted-foreground" />
          </motion.div>
        </div>
      </button>

      {/* Expandable Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="border-t border-border"
          >
            <div className="p-6 space-y-6">
              {/* Topics Checklist */}
              <div>
                <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                  <span className="text-sm">📋 Key Concepts</span>
                </h4>
                <div className="space-y-2">
                  {level.topics.map((topic) => {
                    const isCompleted = isTopicCompleted(domain, level.id, topic.id)
                    return (
                      <motion.button
                        key={topic.id}
                        whileHover={{ x: 4 }}
                        onClick={() => toggleTopic(domain, level.id, topic.id)}
                        className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-left"
                      >
                        {isCompleted ? (
                          <CheckCircle2 className="w-5 h-5 text-red-500 flex-shrink-0" />
                        ) : (
                          <Circle className="w-5 h-5 text-gray-300 dark:text-slate-600 flex-shrink-0" />
                        )}
                        <span
                          className={`text-sm ${
                            isCompleted ? "text-muted-foreground line-through" : "text-foreground font-medium"
                          }`}
                        >
                          {topic.name}
                        </span>
                      </motion.button>
                    )
                  })}
                </div>
              </div>

              {/* Resources */}
              <div>
                <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                  <span className="text-sm">🔗 Learning Resources</span>
                </h4>
                <div className="space-y-2">
                  {level.resources.map((resource) => (
                    <motion.a
                      key={resource.id}
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ x: 4 }}
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors group"
                    >
                      {resource.type === "youtube" && (
                        <Youtube className="w-4 h-4 text-red-600 dark:text-red-400 flex-shrink-0" />
                      )}
                      {resource.type === "docs" && (
                        <BookOpen className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                      )}
                      {resource.type === "course" && (
                        <BookOpen className="w-4 h-4 text-purple-600 dark:text-purple-400 flex-shrink-0" />
                      )}
                      <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors flex-1">
                        {resource.name}
                      </span>
                      <ExternalLink className="w-3 h-3 text-muted-foreground group-hover:text-red-500 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </motion.a>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}