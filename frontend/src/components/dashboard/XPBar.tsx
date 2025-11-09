import { motion } from "framer-motion"
import { useEffect, useState } from "react"

interface XPBarProps {
  currentXp: number
  xpToNextLevel: number
  level: number
}

export default function XPBar({ currentXp, xpToNextLevel, level }: XPBarProps) {
  const [displayXp, setDisplayXp] = useState(currentXp)
  const [previousXp, setPreviousXp] = useState(currentXp)

  // Animate XP bar fill
  useEffect(() => {
    if (currentXp > previousXp) {
      // Animate from previous to current
      const duration = 1000
      const startXp = previousXp
      const endXp = currentXp
      const startTime = Date.now()

      const animate = () => {
        const elapsed = Date.now() - startTime
        const progress = Math.min(elapsed / duration, 1)
        const easeOut = 1 - Math.pow(1 - progress, 3) // Ease out cubic
        setDisplayXp(startXp + (endXp - startXp) * easeOut)

        if (progress < 1) {
          requestAnimationFrame(animate)
        } else {
          setDisplayXp(endXp)
        }
      }

      animate()
    } else {
      setDisplayXp(currentXp)
    }
    setPreviousXp(currentXp)
  }, [currentXp, previousXp])

  const xpPercentage = Math.min((displayXp % xpToNextLevel) / xpToNextLevel * 100, 100)

  return (
    <div className="w-full max-w-md space-y-2">
      {/* XP Text */}
      <div className="flex items-center justify-between text-sm">
        <span className="text-[#C9B896] font-medium">XP Progress</span>
        <span className="text-[#F5F1E8] font-bold">
          {Math.floor(displayXp % xpToNextLevel)} / {xpToNextLevel} XP
        </span>
      </div>

      {/* XP Bar Container */}
      <div className="relative h-6 bg-[#1a0f08]/60 border border-[#8B6F47]/30 rounded-full overflow-hidden shadow-inner">
        {/* XP Fill */}
        <motion.div
          initial={false}
          animate={{
            width: `${xpPercentage}%`,
          }}
          transition={{
            duration: 0.8,
            ease: "easeOut",
          }}
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-[#527853] via-[#628963] to-[#527853] rounded-full shadow-lg"
          style={{
            boxShadow: 'inset 0 2px 4px rgba(82, 120, 83, 0.3)',
          }}
        >
          {/* Shine effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
        </motion.div>

        {/* Level up indicator */}
        {xpPercentage >= 100 && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <span className="text-white text-xs font-bold animate-pulse">LEVEL UP!</span>
          </motion.div>
        )}
      </div>

      {/* Total XP */}
      <div className="text-center">
        <span className="text-xs text-[#8B6F47]">
          Total: {Math.floor(displayXp)} XP
        </span>
      </div>
    </div>
  )
}

