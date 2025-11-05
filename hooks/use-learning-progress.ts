"use client"

import { useState, useEffect } from "react"

export interface TopicProgress {
  [topicId: string]: boolean
}

export interface ResourceProgress {
  [resourceId: string]: boolean
}

export interface LevelProgress {
  topics: TopicProgress
  resources: ResourceProgress
  completed: boolean
}

export interface DomainProgress {
  [levelId: string]: LevelProgress
}

export interface ProgressData {
  [domain: string]: DomainProgress
}

const STORAGE_KEY = "learning-path-progress-v2"

export function useLearningProgress() {
  const [progress, setProgress] = useState<ProgressData>({})
  const [mounted, setMounted] = useState(false)

  // Initialize from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      try {
        setProgress(JSON.parse(saved))
      } catch (e) {
        console.error("[v0] Failed to parse progress data:", e)
      }
    }
    setMounted(true)
  }, [])

  // Save to localStorage whenever progress changes
  useEffect(() => {
    if (mounted) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress))
    }
  }, [progress, mounted])

  const toggleTopic = (domain: string, levelId: string, topicId: string) => {
    setProgress((prev) => {
      const domainProgress = prev[domain] || {}
      const levelProgress = domainProgress[levelId] || { topics: {}, resources: {}, completed: false }
      const topicStatus = levelProgress.topics[topicId] ?? false

      return {
        ...prev,
        [domain]: {
          ...domainProgress,
          [levelId]: {
            ...levelProgress,
            topics: {
              ...levelProgress.topics,
              [topicId]: !topicStatus,
            },
          },
        },
      }
    })
  }

  const toggleResource = (domain: string, levelId: string, resourceId: string) => {
    setProgress((prev) => {
      const domainProgress = prev[domain] || {}
      const levelProgress = domainProgress[levelId] || { topics: {}, resources: {}, completed: false }
      const resourceStatus = levelProgress.resources[resourceId] ?? false

      return {
        ...prev,
        [domain]: {
          ...domainProgress,
          [levelId]: {
            ...levelProgress,
            resources: {
              ...levelProgress.resources,
              [resourceId]: !resourceStatus,
            },
          },
        },
      }
    })
  }

  const completeLevel = (domain: string, levelId: string) => {
    setProgress((prev) => {
      const domainProgress = prev[domain] || {}
      const levelProgress = domainProgress[levelId] || { topics: {}, resources: {}, completed: false }

      return {
        ...prev,
        [domain]: {
          ...domainProgress,
          [levelId]: {
            ...levelProgress,
            completed: !levelProgress.completed,
          },
        },
      }
    })
  }

  const getLevelProgress = (domain: string, levelId: string) => {
    return progress[domain]?.[levelId] ?? { topics: {}, resources: {}, completed: false }
  }

  const getDomainStats = (domain: string, allLevels: Array<{ id: string; topics: Array<{ id: string }> }>) => {
    const domainProgress = progress[domain] || {}

    // Calculate total topics across all levels
    const totalTopics = allLevels.reduce((sum, level) => sum + level.topics.length, 0)

    // Calculate completed topics across all levels
    const completedTopics = allLevels.reduce((sum, level) => {
      const levelTopics = domainProgress[level.id]?.topics || {}
      return sum + Object.values(levelTopics).filter(Boolean).length
    }, 0)

    // Count completed levels
    const completedLevels = allLevels.filter((level) => domainProgress[level.id]?.completed === true).length

    return {
      completedLevels,
      totalLevels: allLevels.length,
      totalTopics,
      completedTopics,
      progressPercent: totalTopics > 0 ? (completedTopics / totalTopics) * 100 : 0,
    }
  }

  const getGlobalProgress = (
    allDomains: Array<{ id: string; allLevels: Array<{ id: string; topics: Array<{ id: string }> }> }>,
  ) => {
    let totalCompleted = 0
    let totalCount = 0

    allDomains.forEach((domain) => {
      const stats = getDomainStats(domain.id, domain.allLevels)
      totalCompleted += stats.completedTopics
      totalCount += stats.totalTopics
    })

    return totalCount > 0 ? (totalCompleted / totalCount) * 100 : 0
  }

  const isTopicCompleted = (domain: string, levelId: string, topicId: string) => {
    return progress[domain]?.[levelId]?.topics?.[topicId] ?? false
  }

  return {
    progress,
    toggleTopic,
    toggleResource,
    completeLevel,
    getLevelProgress,
    getDomainStats,
    getGlobalProgress,
    isTopicCompleted,
    mounted,
  }
}
