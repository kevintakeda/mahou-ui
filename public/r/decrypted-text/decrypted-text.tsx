'use client'

import { useMemo, useState } from 'react'
import { useAnimationFrame } from 'motion/react'

export const CHARS =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!@#$%^&*()_+'

function easeInOutQuint(x: number): number {
  return x < 0.5 ? 16 * x * x * x * x * x : 1 - (-2 * x + 2) ** 5 / 2
}

interface DecryptedCharProps {
  char: string
  startTime: number
  isAnimating: boolean
  updateRate: number
  charDuration: number
  chars: string
}

function DecryptedChar({
  char,
  startTime,
  isAnimating,
  updateRate,
  charDuration,
  chars,
}: DecryptedCharProps) {
  const [displayChar, setDisplayChar] = useState(char)
  const [opacity, setOpacity] = useState(1)

  useAnimationFrame((time) => {
    if (!isAnimating) {
      if (displayChar !== char) {
        setDisplayChar(char)
      }
      if (opacity !== 1) {
        setOpacity(1)
      }
      return
    }

    if (time < startTime) {
      return
    }

    const elapsed = time - startTime

    const progress = Math.min(elapsed / charDuration, 1)
    const easedProgress = easeInOutQuint(progress)

    if (elapsed < charDuration) {
      const currentUpdateRate = updateRate + updateRate * 3 * easedProgress

      if (elapsed % currentUpdateRate < 16) {
        const randomChar = chars[Math.floor(Math.random() * chars.length)]
        setDisplayChar(randomChar)
      }

      setOpacity(0.4)
    } else {
      if (opacity !== 1) {
        setOpacity(1)
      }
      if (displayChar !== char) {
        setDisplayChar(char)
      }
    }
  })

  return (
    <span
      style={{ opacity }}
      className="transition-opacity duration-150 ease-in-out"
    >
      {displayChar}
    </span>
  )
}

export interface DecryptedTextProps {
  text: string
  chars?: string
  stagger?: number
  updateRate?: number
  charDuration?: number
}

export default function DecryptedText({
  text = 'Decrypted Text',
  stagger = 16,
  updateRate = 16,
  charDuration = 500,
  chars = CHARS,
}: DecryptedTextProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [hoverStartTime, setHoverStartTime] = useState<number>(0)

  const characters = useMemo(() => {
    return text.split('').map((char, i) => ({
      char,
      index: i,
    }))
  }, [text])

  useAnimationFrame((time) => {
    if (isHovered && hoverStartTime === 0) {
      setHoverStartTime(time)
    }
  })

  const handleMouseEnter = () => {
    setIsHovered(true)
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
    setHoverStartTime(0)
  }

  return (
    <button
      type="button"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="cursor-pointer p-4 font-mono dark:text-white uppercase tracking-wide"
    >
      {characters.map(({ char, index }) => (
        <DecryptedChar
          key={index}
          char={char}
          chars={chars}
          updateRate={updateRate}
          charDuration={charDuration}
          startTime={hoverStartTime + index * stagger}
          isAnimating={isHovered}
        />
      ))}
    </button>
  )
}
