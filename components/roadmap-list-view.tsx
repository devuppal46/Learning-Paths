"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import type { Level } from "@/lib/learning-data"
import { RoadmapListItem } from "./roadmap-list-item"

interface RoadmapListViewProps {
  levels: Level[]
  domain: string
  isTopicCompleted: (domain: string, levelId: string, topicId: string) => boolean
  toggleTopic: (domain: string, levelId: string, topicId: string) => void
}

export function RoadmapListView({ levels, domain, isTopicCompleted, toggleTopic }: RoadmapListViewProps) {
  const [expandedLevels, setExpandedLevels] = useState<Set<string>>(new Set())

  const toggleLevel = (levelId: string) => {
    const newExpanded = new Set(expandedLevels)
    if (newExpanded.has(levelId)) {
      newExpanded.delete(levelId)
    } else {
      newExpanded.add(levelId)
    }
    setExpandedLevels(newExpanded)
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="max-w-4xl mx-auto space-y-4"
    >
      {levels.map((level, index) => {
        const isExpanded = expandedLevels.has(level.id)
        const completedTopics = level.topics.filter((t) => isTopicCompleted(domain, level.id, t.id)).length

        return (
          <RoadmapListItem
            key={level.id}
            level={level}
            index={index}
            isExpanded={isExpanded}
            completedTopics={completedTopics}
            domain={domain}
            onToggle={() => toggleLevel(level.id)}
            isTopicCompleted={isTopicCompleted}
            toggleTopic={toggleTopic}
          />
        )
      })}
    </motion.div>
  )
}
