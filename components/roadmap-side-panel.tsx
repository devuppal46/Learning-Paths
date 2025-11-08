"use client"

import { motion } from "framer-motion"
import { CheckCircle2, Circle, ExternalLink, BookOpen, Youtube } from "lucide-react"
import type { Level } from "@/lib/learning-data"

interface RoadmapSidePanelProps {
  level: Level
  domain: string
  isTopicCompleted: (domain: string, levelId: string, topicId: string) => boolean
  toggleTopic: (domain: string, levelId: string, topicId: string) => void
}

export function RoadmapSidePanel({
  level,
  domain,
  isTopicCompleted,
  toggleTopic,
}: RoadmapSidePanelProps) {
  const completedTopics = level.topics.filter((t) => isTopicCompleted(domain, level.id, t.id)).length

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 50 }}
      className="w-96 flex-shrink-0"
    >
      <div className="sticky top-24 bg-card dark:bg-slate-900 rounded-xl p-6 shadow-lg border-2 border-red-200 dark:border-red-900/50">
        {/* Header */}
        <div className="mb-4">
          <p className="text-xs font-semibold text-red-600 dark:text-red-400 uppercase">{level.id}</p>
          <h3 className="text-xl font-bold text-foreground">{level.title}</h3>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-muted-foreground">Progress</span>
            <span className="text-sm font-bold text-red-600 dark:text-red-400">
              {completedTopics}/{level.topics.length}
            </span>
          </div>
          <div className="w-full h-2 bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-red-500 to-red-600"
              initial={{ width: 0 }}
              animate={{ width: `${(completedTopics / level.topics.length) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        {/* Topics Checklist */}
        <div className="mb-6">
          <p className="text-sm font-semibold text-foreground mb-3">Key Concepts</p>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {level.topics.map((topic) => {
              const isCompleted = isTopicCompleted(domain, level.id, topic.id)
              return (
                <motion.button
                  key={topic.id}
                  whileHover={{ x: 2 }}
                  onClick={() => toggleTopic(domain, level.id, topic.id)}
                  className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-left"
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
          <p className="text-sm font-semibold text-foreground mb-3">Resources</p>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {level.resources.map((resource) => (
              <motion.a
                key={resource.id}
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ x: 2 }}
                className="flex items-center gap-2 p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors group"
              >
                {resource.type === "youtube" && (
                  <Youtube className="w-4 h-4 text-red-600 dark:text-red-400 flex-shrink-0" />
                )}
                {(resource.type === "docs" || resource.type === "course") && (
                  <BookOpen className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                )}
                <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors flex-1 truncate">
                  {resource.name}
                </span>
                <ExternalLink className="w-3 h-3 text-muted-foreground group-hover:text-red-500 flex-shrink-0" />
              </motion.a>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  )
}