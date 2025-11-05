"use client"

import { motion } from "framer-motion"
import { CheckCircle2, Circle, ExternalLink, BookOpen, Youtube } from "lucide-react"
import { useLearningProgress } from "@/hooks/use-learning-progress"
import type { Level } from "@/lib/learning-data"

interface RoadmapProps {
  levels: Level[]
  domain: string
}

export function Roadmap({ levels, domain }: RoadmapProps) {
  const { toggleTopic, isTopicCompleted, mounted } = useLearningProgress()

  if (!mounted) return null

  return (
    <div className="py-16 px-4">
      {/* Central Timeline Line */}
      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-red-500 to-red-200 dark:to-red-900" />

        {/* Levels */}
        <div className="space-y-12 max-w-6xl mx-auto">
          {levels.map((level, index) => {
            const isLeft = index % 2 === 0
            const topicsCount = level.topics.length
            const completedTopics = level.topics.filter((t) => isTopicCompleted(domain, level.id, t.id)).length

            return (
              <motion.div
                key={level.id}
                initial={{ opacity: 0, x: isLeft ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="relative"
              >
                <div className="grid grid-cols-2 gap-8 items-center">
                  {/* Left Side */}
                  {isLeft ? (
                    <div className="flex justify-end pr-4">
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        className="bg-card dark:bg-slate-900 rounded-xl p-6 shadow-lg border-2 border-red-200 dark:border-red-900/50 hover:border-red-400 dark:hover:border-red-700 transition-colors w-full"
                      >
                        {/* Level Header */}
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center text-white font-bold text-sm">
                              {index + 1}
                            </div>
                            <div>
                              <p className="text-xs font-semibold text-red-600 dark:text-red-400 uppercase">
                                {level.id}
                              </p>
                              <h3 className="text-lg font-bold text-foreground">{level.title}</h3>
                            </div>
                          </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="mb-4">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-medium text-muted-foreground">Progress</span>
                            <span className="text-sm font-bold text-red-600 dark:text-red-400">
                              {completedTopics}/{topicsCount}
                            </span>
                          </div>
                          <div className="w-full h-2 bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden">
                            <motion.div
                              className="h-full bg-gradient-to-r from-red-500 to-red-600"
                              animate={{ width: `${(completedTopics / topicsCount) * 100}%` }}
                              transition={{ duration: 0.5 }}
                            />
                          </div>
                        </div>

                        {/* Topics Checklist */}
                        <div className="mb-4">
                          <p className="text-sm font-semibold text-foreground mb-3">Key Concepts</p>
                          <div className="space-y-2">
                            {level.topics.map((topic) => {
                              const isCompleted = isTopicCompleted(domain, level.id, topic.id)
                              return (
                                <motion.button
                                  key={topic.id}
                                  whileHover={{ x: -4 }}
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
                          <div className="space-y-2">
                            {level.resources.map((resource) => (
                              <motion.a
                                key={resource.id}
                                href={resource.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                whileHover={{ x: -2 }}
                                className="flex items-center gap-2 p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors group"
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
                                <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                                  {resource.name}
                                </span>
                                <ExternalLink className="w-3 h-3 text-muted-foreground group-hover:text-red-500 ml-auto flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                              </motion.a>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    </div>
                  ) : (
                    <div />
                  )}

                  {/* Right Side */}
                  {!isLeft ? (
                    <div className="flex justify-start pl-4">
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        className="bg-card dark:bg-slate-900 rounded-xl p-6 shadow-lg border-2 border-red-200 dark:border-red-900/50 hover:border-red-400 dark:hover:border-red-700 transition-colors w-full"
                      >
                        {/* Level Header */}
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center text-white font-bold text-sm">
                              {index + 1}
                            </div>
                            <div>
                              <p className="text-xs font-semibold text-red-600 dark:text-red-400 uppercase">
                                {level.id}
                              </p>
                              <h3 className="text-lg font-bold text-foreground">{level.title}</h3>
                            </div>
                          </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="mb-4">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-medium text-muted-foreground">Progress</span>
                            <span className="text-sm font-bold text-red-600 dark:text-red-400">
                              {completedTopics}/{topicsCount}
                            </span>
                          </div>
                          <div className="w-full h-2 bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden">
                            <motion.div
                              className="h-full bg-gradient-to-r from-red-500 to-red-600"
                              animate={{ width: `${(completedTopics / topicsCount) * 100}%` }}
                              transition={{ duration: 0.5 }}
                            />
                          </div>
                        </div>

                        {/* Topics Checklist */}
                        <div className="mb-4">
                          <p className="text-sm font-semibold text-foreground mb-3">Key Concepts</p>
                          <div className="space-y-2">
                            {level.topics.map((topic) => {
                              const isCompleted = isTopicCompleted(domain, level.id, topic.id)
                              return (
                                <motion.button
                                  key={topic.id}
                                  whileHover={{ x: 4 }}
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
                          <div className="space-y-2">
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
                                {resource.type === "docs" && (
                                  <BookOpen className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                                )}
                                {resource.type === "course" && (
                                  <BookOpen className="w-4 h-4 text-purple-600 dark:text-purple-400 flex-shrink-0" />
                                )}
                                <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                                  {resource.name}
                                </span>
                                <ExternalLink className="w-3 h-3 text-muted-foreground group-hover:text-red-500 ml-auto flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                              </motion.a>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    </div>
                  ) : (
                    <div />
                  )}
                </div>

                {/* Center Circle */}
                <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 bg-white dark:bg-slate-900 border-4 border-red-500 rounded-full z-10" />
              </motion.div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
