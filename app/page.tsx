"use client"

import { AnimatedMarqueeHero } from "@/components/ui/hero"
import { LearningPathsGrid } from "@/components/learning-paths-grid"
import { useLearningProgress } from "@/hooks/use-learning-progress"
import { ProgressBar } from "@/components/progress-bar"
import { learningPaths } from "@/lib/learning-data"
import { useRef, useMemo } from "react"



export default function Home() {
  const { getDomainStats, mounted, updateTrigger } = useLearningProgress()
  const pathsGridRef = useRef<HTMLDivElement>(null)

  const handleExploreClick = () => {
    pathsGridRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  // CRITICAL FIX: Recalculate global progress whenever updateTrigger changes
  const { webDevStats, dsaStats, pythonStats, globalProgress } = useMemo(() => {
    if (!mounted) {
      return {
        webDevStats: { completedTopics: 0, totalTopics: 0 },
        dsaStats: { completedTopics: 0, totalTopics: 0 },
        pythonStats: { completedTopics: 0, totalTopics: 0 },
        globalProgress: 0
      }
    }

    const webDevStats = getDomainStats("web-development", learningPaths["web-development"].levels)
    const dsaStats = getDomainStats("data-structures", learningPaths["data-structures"].levels)
    const pythonStats = getDomainStats("python-aiml", learningPaths["python-aiml"].levels)

    const totalTopics = webDevStats.totalTopics + dsaStats.totalTopics + pythonStats.totalTopics
    const completedTopics = webDevStats.completedTopics + dsaStats.completedTopics + pythonStats.completedTopics
    const globalProgress = totalTopics > 0 ? (completedTopics / totalTopics) * 100 : 0

    return { webDevStats, dsaStats, pythonStats, globalProgress }
  }, [mounted, getDomainStats, updateTrigger])

  if (!mounted) {
    return (
      <div>
        <AnimatedMarqueeHero
          tagline="Structured Learning Paths"
          title={
            <>
              Master Tech Skills
              <br />
              with Expert-Guided Paths
            </>
          }
          description="Fostering a vibrant coding culture and empowering innovation at MAIT — powered by MindFlare."
          ctaText="Explore Paths"
          onCtaClick={handleExploreClick}
        />
        <div ref={pathsGridRef}>
          <LearningPathsGrid />
        </div>
      </div>
    )
  }

  return (
    <div>
      <AnimatedMarqueeHero
        tagline="Structured Learning Paths"
        title={
          <>
            Master Tech Skills
            <br />
            with Expert-Guided Paths
          </>
        }
        description="Fostering a vibrant coding culture and empowering innovation at MAIT — powered by MindFlare."
        ctaText="Explore Paths"
        onCtaClick={handleExploreClick}
      />

      {/* Global Progress Section - Now reactive */}
      <section className="px-4 py-12 bg-card dark:bg-card border-b border-border">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-foreground mb-2">Your Overall Progress</h2>
          <p className="text-muted-foreground mb-6">Track your learning journey across all domains</p>
          <ProgressBar progress={globalProgress} label="Total Learning Progress" size="lg" />
        </div>
      </section>

      <div ref={pathsGridRef}>
        <LearningPathsGrid />
      </div>
    </div>
  )
}