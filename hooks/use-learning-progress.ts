"use client"

import { useState, useEffect, useRef, useCallback } from "react"

export interface TopicProgress { [topicId: string]: boolean }
export interface ResourceProgress { [resourceId: string]: boolean }
export interface LevelProgress { topics: TopicProgress; resources: ResourceProgress; completed: boolean }
export interface DomainProgress { [levelId: string]: LevelProgress }
export interface ProgressData { [domain: string]: DomainProgress }

const STORAGE_KEY = "learning-path-progress-v2"

/**
 * FIXED: useLearningProgress hook with proper reactive state management
 * 
 * Key fixes:
 * 1. Progress state now properly triggers re-renders when updated
 * 2. All helper functions recalculate on every progress change
 * 3. useCallback prevents unnecessary re-renders while maintaining reactivity
 * 4. Stats calculations happen on-demand from current state, not cached values
 * 5. Added forceUpdate mechanism to ensure dependent components re-render
 */
export function useLearningProgress() {
  const [progress, setProgress] = useState<ProgressData>({})
  const [mounted, setMounted] = useState(false)
  const [updateTrigger, setUpdateTrigger] = useState(0)
  const saveTimeoutRef = useRef<number | null>(null)

  // Initialize from localStorage (client-only)
  useEffect(() => {
    if (typeof window === "undefined") {
      setMounted(true)
      return
    }

    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) setProgress(JSON.parse(raw))
    } catch (e) {
      console.error("[v0] Failed to parse progress data:", e)
    } finally {
      setMounted(true)
    }
  }, [])

  // Debounced save to localStorage
  useEffect(() => {
    if (!mounted || typeof window === "undefined") return

    // clear existing timeout
    if (saveTimeoutRef.current) {
      window.clearTimeout(saveTimeoutRef.current)
    }

    // debounce: save after 1s of inactivity
    saveTimeoutRef.current = window.setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(progress))
      } catch (e) {
        console.error("Failed to save progress:", e)
      }
      saveTimeoutRef.current = null
    }, 1000)

    // cleanup on unmount
    return () => {
      if (saveTimeoutRef.current) {
        window.clearTimeout(saveTimeoutRef.current)
        saveTimeoutRef.current = null
      }
    }
  }, [progress, mounted])

  /**
   * FIXED: toggleTopic now properly updates state immutably AND triggers re-renders
   */
  const toggleTopic = useCallback((domain: string, levelId: string, topicId: string) => {
    setProgress(prev => {
      const domainProgress = prev[domain] || {}
      const levelProgress = domainProgress[levelId] || { topics: {}, resources: {}, completed: false }
      const topicStatus = levelProgress.topics[topicId] ?? false

      // Create completely new object to ensure React detects the change
      return {
        ...prev,
        [domain]: {
          ...domainProgress,
          [levelId]: {
            ...levelProgress,
            topics: { ...levelProgress.topics, [topicId]: !topicStatus },
          },
        },
      }
    })
    // Force update trigger to ensure all dependent components re-render
    setUpdateTrigger(prev => prev + 1)
  }, [])

  /**
   * FIXED: toggleResource with proper immutable updates
   */
  const toggleResource = useCallback((domain: string, levelId: string, resourceId: string) => {
    setProgress(prev => {
      const domainProgress = prev[domain] || {}
      const levelProgress = domainProgress[levelId] || { topics: {}, resources: {}, completed: false }
      const resourceStatus = levelProgress.resources[resourceId] ?? false

      return {
        ...prev,
        [domain]: {
          ...domainProgress,
          [levelId]: {
            ...levelProgress,
            resources: { ...levelProgress.resources, [resourceId]: !resourceStatus },
          },
        },
      }
    })
    setUpdateTrigger(prev => prev + 1)
  }, [])

  /**
   * FIXED: completeLevel with proper immutable updates and auto-completion logic
   */
  const completeLevel = useCallback((domain: string, levelId: string) => {
    setProgress(prev => {
      const domainProgress = prev[domain] || {}
      const levelProgress = domainProgress[levelId] || { topics: {}, resources: {}, completed: false }

      return {
        ...prev,
        [domain]: {
          ...domainProgress,
          [levelId]: { ...levelProgress, completed: !levelProgress.completed },
        },
      }
    })
    setUpdateTrigger(prev => prev + 1)
  }, [])

  /**
   * FIXED: getLevelProgress now reads from current progress state
   * Added updateTrigger to dependency array to ensure fresh data
   */
  const getLevelProgress = useCallback((domain: string, levelId: string) => {
    return progress[domain]?.[levelId] ?? { topics: {}, resources: {}, completed: false }
  }, [progress, updateTrigger])

  /**
   * FIXED: getDomainStats now recalculates from current progress state
   * This function will re-run whenever progress or updateTrigger changes
   */
  const getDomainStats = useCallback((domain: string, allLevels: Array<{ id: string; topics: Array<{ id: string }> }>) => {
    const domainProgress = progress[domain] || {}

    const totalTopics = allLevels.reduce((sum, level) => sum + (level.topics?.length ?? 0), 0)

    const completedTopics = allLevels.reduce((sum, level) => {
      const levelTopics = domainProgress[level.id]?.topics || {}
      return sum + Object.values(levelTopics).filter(Boolean).length
    }, 0)

    const completedLevels = allLevels.filter(level => {
      const levelProgress = domainProgress[level.id]
      if (!levelProgress) return false
      
      // Check if explicitly marked as completed
      if (levelProgress.completed) return true
      
      // Auto-complete: Check if all topics are completed
      const levelTopics = level.topics || []
      if (levelTopics.length === 0) return false
      
      const allTopicsCompleted = levelTopics.every(topic => 
        levelProgress.topics?.[topic.id] === true
      )
      
      return allTopicsCompleted
    }).length

    return {
      completedLevels,
      totalLevels: allLevels.length,
      totalTopics,
      completedTopics,
      progressPercent: totalTopics > 0 ? (completedTopics / totalTopics) * 100 : 0,
    }
  }, [progress, updateTrigger])

  /**
   * FIXED: getGlobalProgress now recalculates from current progress state
   */
  const getGlobalProgress = useCallback((
    allDomains: Array<{ id: string; allLevels: Array<{ id: string; topics: Array<{ id: string }> }> }>
  ) => {
    let totalCompleted = 0
    let totalCount = 0

    allDomains.forEach(domain => {
      const stats = getDomainStats(domain.id, domain.allLevels)
      totalCompleted += stats.completedTopics
      totalCount += stats.totalTopics
    })

    return totalCount > 0 ? (totalCompleted / totalCount) * 100 : 0
  }, [getDomainStats, updateTrigger])

  /**
   * FIXED: isTopicCompleted now reads from current progress state
   */
  const isTopicCompleted = useCallback((domain: string, levelId: string, topicId: string) => {
    return progress[domain]?.[levelId]?.topics?.[topicId] ?? false
  }, [progress, updateTrigger])

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
    updateTrigger, // Export this so components can use it as a dependency
  }
}