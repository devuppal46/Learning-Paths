"use client"

import { useState } from "react"
import { AnimatePresence } from "framer-motion"
import { useLearningProgress } from "@/hooks/use-learning-progress"
import type { Level } from "@/lib/learning-data"
import { RoadmapViewToggle } from "./roadmap-view-toggle"
import { RoadmapVisualMap } from "./roadmap-visual-map"
import { RoadmapListView } from "./roadmap-list-view"

interface RoadmapProps {
  levels: Level[]
  domain: string
}

type ViewMode = "visual" | "list"

export function Roadmap({ levels, domain }: RoadmapProps) {
  const { toggleTopic, isTopicCompleted, mounted } = useLearningProgress()
  const [viewMode, setViewMode] = useState<ViewMode>("list")
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null)

  if (!mounted) return null

  return (
    <div className="py-16 px-4">
      {/* View Toggle */}
      <RoadmapViewToggle viewMode={viewMode} setViewMode={setViewMode} />

      {/* Render based on view mode */}
      <AnimatePresence mode="wait">
        {viewMode === "visual" ? (
          <RoadmapVisualMap
            key="visual"
            levels={levels}
            domain={domain}
            selectedLevel={selectedLevel}
            setSelectedLevel={setSelectedLevel}
            isTopicCompleted={isTopicCompleted}
            toggleTopic={toggleTopic}
          />
        ) : (
          <RoadmapListView
            key="list"
            levels={levels}
            domain={domain}
            isTopicCompleted={isTopicCompleted}
            toggleTopic={toggleTopic}
          />
        )}
      </AnimatePresence>
    </div>
  )
}