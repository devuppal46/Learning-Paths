"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Code, Database, Brain, Sparkles } from "lucide-react"

interface AnimatedMarqueeHeroProps {
  tagline: string
  title: React.ReactNode
  description: string
  ctaText: string
  className?: string
  onCtaClick?: () => void
}

const ActionButton = ({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) => (
  <motion.button
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    onClick={onClick}
    className="mt-8 px-8 py-3 rounded-full bg-red-500 text-white font-semibold shadow-lg transition-colors hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-75"
  >
    {children}
  </motion.button>
)

// Domain cards data
const LEARNING_DOMAINS = [
  {
    title: "Web Development",
    icon: Code,
    gradient: "from-blue-500 to-cyan-500",
    image: "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=800&auto=format&fit=crop&q=80",
    alt: "Web development code on screen",
  },
  {
    title: "Data Structures",
    icon: Database,
    gradient: "from-purple-500 to-pink-500",
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&auto=format&fit=crop&q=80",
    alt: "Data structures and algorithms visualization",
  },
  {
    title: "Python & AI/ML",
    icon: Brain,
    gradient: "from-emerald-500 to-teal-500",
    image: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800&auto=format&fit=crop&q=80",
    alt: "AI and machine learning concept",
  },
  {
    title: "Web Development",
    icon: Code,
    gradient: "from-blue-500 to-cyan-500",
    image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&auto=format&fit=crop&q=80",
    alt: "Programming workspace",
  },
  {
    title: "Data Structures",
    icon: Database,
    gradient: "from-purple-500 to-pink-500",
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=900&auto=format&fit=crop&q=80",
    alt: "Technology and code",
  },
  {
    title: "Python & AI/ML",
    icon: Brain,
    gradient: "from-emerald-500 to-teal-500",
    image: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=800&auto=format&fit=crop&q=80",
    alt: "Code editor with colorful syntax",
  },
]

export const AnimatedMarqueeHero: React.FC<AnimatedMarqueeHeroProps> = ({
  tagline,
  title,
  description,
  ctaText,
  className,
  onCtaClick,
}) => {
  const FADE_IN_ANIMATION_VARIANTS = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 20 } },
  }

  // Duplicate array for seamless animation
  const duplicatedDomains = [...LEARNING_DOMAINS, ...LEARNING_DOMAINS]

  // Track window size safely
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 })

  useEffect(() => {
    if (typeof window !== "undefined") {
      const handleResize = () => {
        setWindowSize({
          width: window.innerWidth,
          height: window.innerHeight,
        })
      }
      handleResize()
      window.addEventListener("resize", handleResize)
      return () => window.removeEventListener("resize", handleResize)
    }
  }, [])

  return (
    <section
      className={`relative w-full h-screen overflow-hidden bg-background flex flex-col items-center justify-center text-center px-4 ${className || ""}`}
    >
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-red-500/5 to-background animate-gradient-slow" />

      {/* Floating Particles (Safe for SSR) */}
      {windowSize.width > 0 && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-red-500/20 rounded-full"
              initial={{
                x: Math.random() * windowSize.width,
                y: Math.random() * windowSize.height,
              }}
              animate={{
                y: [Math.random() * windowSize.height, Math.random() * windowSize.height],
                x: [Math.random() * windowSize.width, Math.random() * windowSize.width],
              }}
              transition={{
                duration: Math.random() * 10 + 10,
                repeat: Infinity,
                repeatType: "reverse",
              }}
            />
          ))}
        </div>
      )}

      {/* Hero Content */}
      <div className="z-10 -mt-28 flex flex-col items-center max-w-5xl">
        <motion.div
          initial="hidden"
          animate="show"
          variants={FADE_IN_ANIMATION_VARIANTS}
          className="mb-4 inline-flex items-center gap-2 rounded-full border border-border bg-card/50 px-4 py-1.5 text-sm font-medium text-muted-foreground backdrop-blur-sm"
        >
          <Sparkles className="w-4 h-4 text-red-500" />
          {tagline}
        </motion.div>

        <motion.h1
          initial="hidden"
          animate="show"
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.1 } },
          }}
          className="text-5xl md:text-7xl font-bold tracking-tighter text-foreground"
        >
          {typeof title === "string"
            ? title.split(" ").map((word, i) => (
                <motion.span key={i} variants={FADE_IN_ANIMATION_VARIANTS} className="inline-block">
                  {word}&nbsp;
                </motion.span>
              ))
            : title}
        </motion.h1>

        <motion.p
          initial="hidden"
          animate="show"
          variants={FADE_IN_ANIMATION_VARIANTS}
          transition={{ delay: 0.5 }}
          className="mt-6 max-w-2xl text-lg text-muted-foreground"
        >
          {description}
        </motion.p>

        <motion.div initial="hidden" animate="show" variants={FADE_IN_ANIMATION_VARIANTS} transition={{ delay: 0.6 }}>
          <ActionButton onClick={onCtaClick}>{ctaText}</ActionButton>
        </motion.div>
      </div>

      {/* Domain Marquee Section */}
      <div className="absolute bottom-0 left-0 w-full h-1/3 md:h-2/5 [mask-image:linear-gradient(to_bottom,transparent,black_15%,black_85%,transparent)]">
        <motion.div
          className="flex gap-6"
          animate={{
            x: ["-50%", "0%"],
            transition: { ease: "linear", duration: 30, repeat: Infinity },
          }}
        >
          {duplicatedDomains.map((domain, index) => {
            const IconComponent = domain.icon
            return (
              <motion.div
                key={index}
                className="relative group flex-shrink-0"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                style={{
                  rotate: `${index % 3 === 0 ? -2 : index % 3 === 1 ? 2 : 0}deg`,
                }}
              >
                <div className="relative w-64 h-80 rounded-2xl overflow-hidden shadow-2xl border-2 border-border/50 bg-card/50 backdrop-blur-sm transition-all duration-300 group-hover:scale-105 group-hover:shadow-red-500/20">
                  <div className="relative h-full w-full overflow-hidden">
                    <img
                      src={domain.image}
                      alt={domain.alt}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className={`absolute inset-0 bg-gradient-to-t ${domain.gradient} opacity-60 mix-blend-multiply`} />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <div className="flex items-center gap-3 mb-2">
                      <div
                        className={`w-10 h-10 rounded-lg bg-gradient-to-br ${domain.gradient} flex items-center justify-center shadow-lg`}
                      >
                        <IconComponent className="w-5 h-5 text-white" />
                      </div>
                      <h3 className="text-white font-bold text-lg">{domain.title}</h3>
                    </div>

                    <div className="mt-3 h-1.5 bg-white/20 rounded-full overflow-hidden">
                      <motion.div
                        className={`h-full bg-gradient-to-r ${domain.gradient}`}
                        initial={{ width: "0%" }}
                        animate={{ width: "65%" }}
                        transition={{ duration: 1.5, delay: index * 0.2 }}
                      />
                    </div>
                  </div>

                  <div
                    className={`absolute inset-0 bg-gradient-to-t ${domain.gradient} opacity-0 group-hover:opacity-20 transition-opacity duration-300`}
                  />
                </div>
              </motion.div>
            )
          })}
        </motion.div>
      </div>

      {/* Bottom fade effect */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent pointer-events-none" />
    </section>
  )
}
