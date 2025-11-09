import { motion } from "framer-motion"
import { useEffect, useState } from "react"

interface SpriteCharacterProps {
  xp: number
  level: number
  selectedSprite?: string
}

export default function SpriteCharacter({ xp, level, selectedSprite = 'sprite1' }: SpriteCharacterProps) {
  const [isCelebrating, setIsCelebrating] = useState(false)
  const [previousXp, setPreviousXp] = useState(xp)

  // Trigger celebration animation when XP increases
  useEffect(() => {
    if (xp > previousXp) {
      setIsCelebrating(true)
      setTimeout(() => setIsCelebrating(false), 2000)
    }
    setPreviousXp(xp)
  }, [xp, previousXp])

  const spriteImage = `/${selectedSprite}.png`;

  return (
    <div className="relative flex flex-col items-center justify-center">
      {/* Sprite Character */}
      <motion.div
        animate={{
          y: [0, -10, 0],
          scale: isCelebrating ? [1, 1.2, 1] : 1,
        }}
        transition={{
          y: {
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          },
          scale: {
            duration: 0.5,
            ease: "easeOut",
          },
        }}
        className="relative"
      >
        {/* Character Image - Pixel art sprite */}
        <div className="relative w-48 h-48 md:w-56 md:h-56 flex items-center justify-center">
          <img 
            src={spriteImage}
            alt="Character Sprite"
            className="w-full h-full object-contain drop-shadow-2xl"
            style={{
              imageRendering: 'pixelated',
            }}
            onError={(e) => {
              // Fallback if image fails to load
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              console.error('Failed to load sprite:', spriteImage);
            }}
          />
        </div>

        {/* Celebration particles */}
        {isCelebrating && (
          <>
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 1, scale: 0, x: 0, y: 0 }}
                animate={{
                  opacity: [1, 1, 0],
                  scale: [0, 1, 0.5],
                  x: Math.cos((i / 8) * Math.PI * 2) * 60,
                  y: Math.sin((i / 8) * Math.PI * 2) * 60,
                }}
                transition={{
                  duration: 1,
                  ease: "easeOut",
                }}
                className="absolute top-1/2 left-1/2 w-3 h-3 bg-yellow-400 rounded-full"
              />
            ))}
          </>
        )}
      </motion.div>

      {/* Level Badge */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="mt-4 px-4 py-1 bg-gradient-to-r from-[#527853] to-[#3a5f24] rounded-full border border-[#8B6F47]/50 shadow-lg"
      >
        <span className="text-white text-sm font-bold">Level {level}</span>
      </motion.div>
    </div>
  )
}

