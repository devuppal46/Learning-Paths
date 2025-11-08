"use client"

import { AnimatedMarqueeHero } from "@/components/ui/hero"
import { LearningPathsGrid } from "@/components/learning-paths-grid"
import { useLearningProgress } from "@/hooks/use-learning-progress"
import { ProgressBar } from "@/components/progress-bar"
import { learningPaths } from "@/lib/learning-data"
import { useRef } from "react"

const LEARNING_IMAGES = [
  "https://images.unsplash.com/photo-1625535069654-cfeb8f829088?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0",
  "https://images.unsplash.com/photo-1625535069654-cfeb8f829088?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0",
  "https://images.unsplash.com/photo-1625535069654-cfeb8f829088?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0",
  "https://images.unsplash.com/photo-1625535069654-cfeb8f829088?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0",
  "https://images.unsplash.com/photo-1625535069654-cfeb8f829088?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0",
]

export default function Home() {
  const { getDomainStats, mounted } = useLearningProgress()
  const pathsGridRef = useRef<HTMLDivElement>(null)

  const handleExploreClick = () => {
    pathsGridRef.current?.scrollIntoView({ behavior: "smooth" })
  }

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
          description="Build real-world skills through guided, structured learning — from mastering code logic to creating impactful projects."
          ctaText="Explore Paths"
          images={LEARNING_IMAGES}
          onCtaClick={handleExploreClick}
        />
        <div ref={pathsGridRef}>
          <LearningPathsGrid />
        </div>
      </div>
    )
  }

  const webDevStats = getDomainStats("web-development", learningPaths["web-development"].levels)
  const dsaStats = getDomainStats("data-structures", learningPaths["data-structures"].levels)
  const pythonStats = getDomainStats("python-aiml", learningPaths["python-aiml"].levels)

  const totalTopics = webDevStats.totalTopics + dsaStats.totalTopics + pythonStats.totalTopics
  const completedTopics = webDevStats.completedTopics + dsaStats.completedTopics + pythonStats.completedTopics
  const globalProgress = totalTopics > 0 ? (completedTopics / totalTopics) * 100 : 0

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
        description="Build real-world skills through guided, structured learning — from mastering code logic to creating impactful projects."
        ctaText="Explore Paths"
        images={LEARNING_IMAGES}
        onCtaClick={handleExploreClick}
      />

      {/* Global Progress Section */}
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
