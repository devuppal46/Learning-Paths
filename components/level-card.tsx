"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown, Check, ExternalLink } from "lucide-react"
import { useLearningProgress } from "@/hooks/use-learning-progress"
import type { Level } from "@/lib/learning-data"

interface LevelCardProps {
  level: Level
  domain: string
  index: number
}

export function LevelCard({ level, domain, index }: LevelCardProps) {
  const { toggleTopic, toggleResource, completeLevel, getLevelProgress } = useLearningProgress()
  const [isExpanded, setIsExpanded] = useState(false)
  const levelProgress = getLevelProgress(domain, level.id)

  const topicsCompleted = Object.values(levelProgress.topics).filter(Boolean).length
  const resourcesCompleted = Object.values(levelProgress.resources).filter(Boolean).length

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { delay: index * 0.1 } },
  }

  const getResourceTypeColor = (type: "youtube" | "docs" | "course") => {
    switch (type) {
      case "youtube":
        return "text-red-500 bg-red-500/10"
      case "docs":
        return "text-blue-500 bg-blue-500/10"
      case "course":
        return "text-purple-500 bg-purple-500/10"
      default:
        return "text-gray-500 bg-gray-500/10"
    }
  }

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show">
      <div
        className={`rounded-xl border transition-all overflow-hidden ${
          levelProgress.completed
            ? "border-green-500/50 bg-green-500/5"
            : "border-border hover:border-red-500/50 bg-card"
        }`}
      >
        {/* Header */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-between p-6 hover:bg-muted/50 transition-colors text-left"
        >
          <div className="flex items-center gap-4 flex-1">
            <div
              className={`w-10 h-10 rounded-full font-bold flex items-center justify-center flex-shrink-0 ${
                levelProgress.completed ? "bg-green-500 text-white" : "bg-red-500/20 text-red-600 dark:text-red-400"
              }`}
            >
              {levelProgress.completed ? <Check className="w-5 h-5" /> : level.id}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">{level.title}</h3>
              <p className="text-sm text-muted-foreground">
                {topicsCompleted}/{level.topics.length} topics • {resourcesCompleted}/{level.resources.length} resources
              </p>
            </div>
          </div>
          <ChevronDown
            className={`w-5 h-5 text-muted-foreground transition-transform ${isExpanded ? "rotate-180" : ""}`}
          />
        </button>

        {/* Content */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="border-t border-border"
            >
              <div className="p-6 space-y-6">
                {/* Topics Checklist */}
                <div>
                  <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                    <span className="text-sm">📋 Topics to Master</span>
                  </h4>
                  <div className="space-y-2">
                    {level.topics.map((topic) => {
                      const isChecked = levelProgress.topics[topic.id] ?? false
                      return (
                        <label
                          key={topic.id}
                          className="flex items-center gap-3 p-2 rounded cursor-pointer group"
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => toggleTopic(domain, level.id, topic.id)}
                            className="w-5 h-5 rounded border-2 border-muted-foreground checked:bg-green-500 checked:border-green-500 cursor-pointer"
                          />
                          <span
                            className={`text-sm transition-colors ${
                              isChecked
                                ? "text-muted-foreground line-through"
                                : "text-foreground group-hover:text-red-500"
                            }`}
                          >
                            {topic.name}
                          </span>
                        </label>
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
                    {level.resources.map((resource) => {
                      const isChecked = levelProgress.resources[resource.id] ?? false
                      return (
                        <div
                          key={resource.id}
                          className="flex items-center justify-between p-3 rounded bg-muted/30 transition-colors group"
                        >
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => toggleResource(domain, level.id, resource.id)}
                              className="w-5 h-5 rounded border-2 border-muted-foreground checked:bg-green-500 checked:border-green-500 cursor-pointer flex-shrink-0"
                            />
                            <a
                              href={resource.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={`text-sm font-medium hover:text-red-500 transition-colors truncate ${
                                isChecked ? "text-muted-foreground line-through" : "text-foreground"
                              }`}
                            >
                              {resource.name}
                            </a>
                            <span
                              className={`text-xs px-2 py-1 rounded-full flex-shrink-0 ${getResourceTypeColor(
                                resource.type,
                              )}`}
                            >
                              {resource.type}
                            </span>
                          </div>
                          <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-red-500 transition-colors ml-2 flex-shrink-0" />
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Mark Complete Button */}
                <button
                  onClick={() => completeLevel(domain, level.id)}
                  className={`w-full py-3 rounded-lg font-semibold transition-all ${
                    levelProgress.completed
                      ? "bg-green-500/20 text-green-600 dark:text-green-400 border border-green-500/50"
                      : "bg-red-500 text-white hover:bg-red-600"
                  }`}
                >
                  {levelProgress.completed ? "✓ Level Completed" : "Mark Level Complete"}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}
