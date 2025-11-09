"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Code, Database, Brain } from "lucide-react"
import { useLearningProgress } from "@/hooks/use-learning-progress"
import { ProgressBar } from "@/components/progress-bar"
import { learningPaths } from "@/lib/learning-data"
import { useMemo } from "react"

const LEARNING_PATHS = [
  {
    id: "web-dev",
    title: "Web Development",
    description: "Master HTML, CSS, JavaScript, React, and modern web frameworks",
    icon: Code,
    color: "from-blue-500 to-blue-600",
    href: "/paths/web-development",
    domain: "web-development",
  },
  {
    id: "dsa",
    title: "Data Structures & Algorithms",
    description: "Learn fundamental DSA concepts, problem-solving, and optimization",
    icon: Database,
    color: "from-purple-500 to-purple-600",
    href: "/paths/data-structures",
    domain: "data-structures",
  },
  {
    id: "python-ai",
    title: "Python & AIML",
    description: "Explore Python programming, Machine Learning, and AI fundamentals",
    icon: Brain,
    color: "from-emerald-500 to-emerald-600",
    href: "/paths/python-aiml",
    domain: "python-aiml",
  },
]

/**
 * FIXED: LearningPathsGrid with reactive progress updates
 * 
 * Key changes:
 * 1. Added updateTrigger to dependencies
 * 2. Wrapped stats calculations in useMemo
 * 3. Stats now update whenever progress changes
 */
export function LearningPathsGrid() {
  const { getDomainStats, mounted, updateTrigger } = useLearningProgress()

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } },
  }

  // CRITICAL FIX: Recalculate all path stats when updateTrigger changes
  const pathStats = useMemo(() => {
    if (!mounted) {
      return LEARNING_PATHS.map(path => ({
        ...path,
        stats: { progressPercent: 0, completedTopics: 0, totalTopics: 0 }
      }))
    }

    return LEARNING_PATHS.map(path => {
      const pathData = learningPaths[path.domain]
      const stats = pathData 
        ? getDomainStats(path.domain, pathData.levels)
        : { progressPercent: 0, completedTopics: 0, totalTopics: 0 }
      
      return { ...path, stats }
    })
  }, [mounted, getDomainStats, updateTrigger])

  return (
    <section className="py-20 px-4 bg-background">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Choose Your Learning Path</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Select a domain and progress through carefully structured levels with hands-on concepts, resources, and
            real-world projects.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {pathStats.map((path, index) => {
            const IconComponent = path.icon

            return (
              <motion.div key={path.id} variants={itemVariants}>
                <Link href={path.href}>
                  <div className="group cursor-pointer h-full">
                    <div className="bg-card dark:bg-card-dark rounded-2xl p-8 border border-border hover:border-red-500/50 transition-all duration-300 h-full flex flex-col">
                      <div
                        className={`w-14 h-14 rounded-lg bg-gradient-to-br ${path.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}
                      >
                        <IconComponent className="w-7 h-7 text-white" />
                      </div>
                      <h3 className="text-2xl font-bold text-foreground mb-3">{path.title}</h3>
                      <p className="text-muted-foreground mb-6 flex-grow">{path.description}</p>
                      <div className="mb-4">
                        <ProgressBar
                          progress={path.stats.progressPercent}
                          label={`${path.stats.completedTopics}/${path.stats.totalTopics} topics`}
                          showPercentage={true}
                          size="sm"
                        />
                      </div>
                      <div className="inline-flex items-center text-red-500 font-semibold group-hover:translate-x-2 transition-transform">
                        Explore Path
                        <span className="ml-2">→</span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}