"use client"

import { motion, AnimatePresence } from "framer-motion"
import type { Level } from "@/lib/learning-data"
import { RoadmapVisualNode } from "./roadmap-visual-node"
import { RoadmapSidePanel } from "./roadmap-side-panel"

interface RoadmapVisualMapProps {
  levels: Level[]
  domain: string
  selectedLevel: string | null
  setSelectedLevel: (id: string | null) => void
  isTopicCompleted: (domain: string, levelId: string, topicId: string) => boolean
  toggleTopic: (domain: string, levelId: string, topicId: string) => void
}

export function RoadmapVisualMap({
  levels,
  domain,
  selectedLevel,
  setSelectedLevel,
  isTopicCompleted,
  toggleTopic,
}: RoadmapVisualMapProps) {
  const getCompletionPercentage = (level: Level) => {
    const completed = level.topics.filter((t) => isTopicCompleted(domain, level.id, t.id)).length
    return (completed / level.topics.length) * 100
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="relative max-w-6xl mx-auto"
    >
      <div className="flex gap-6">
        {/* Main Map Area */}
        <div className="flex-1">
          <div className="relative">
            {/* Connection Lines - Positioned behind nodes */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }}>
              {levels.slice(0, -1).map((level, index) => {
                const fromY = 120 + index * 200
                const toY = 120 + (index + 1) * 200
                return (
                  <line
                    key={`line-${level.id}`}
                    x1="50%"
                    y1={fromY}
                    x2="50%"
                    y2={toY}
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeDasharray="5,5"
                    className="text-red-300 dark:text-red-800"
                  />
                )
              })}
            </svg>

            {/* Level Nodes */}
            <div className="space-y-12 relative" style={{ zIndex: 10 }}>
              {levels.map((level, index) => (
                <RoadmapVisualNode
                  key={level.id}
                  level={level}
                  index={index}
                  isSelected={selectedLevel === level.id}
                  completion={getCompletionPercentage(level)}
                  onClick={() => setSelectedLevel(selectedLevel === level.id ? null : level.id)}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Side Panel for Selected Level */}
        <AnimatePresence>
          {selectedLevel && (
            <RoadmapSidePanel
              level={levels.find((l) => l.id === selectedLevel)!}
              domain={domain}
              isTopicCompleted={isTopicCompleted}
              toggleTopic={toggleTopic}
            />
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}