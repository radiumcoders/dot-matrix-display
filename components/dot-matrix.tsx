import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "motion/react"
import { FONT, GlyphMatrix } from "@/lib/fonts"

// ─── config ────────────────────────────────────────────────────
const BASE_DOT_SIZE = 7
const BASE_DOT_GAP = 2
const BASE_CHAR_GAP = 6

function useResponsiveScale() {
  const [scale, setScale] = useState(1)

  useEffect(() => {
    function update() {
      const w = window.innerWidth
      if (w < 380) setScale(0.4)
      else if (w < 480) setScale(0.5)
      else if (w < 640) setScale(0.65)
      else if (w < 768) setScale(0.8)
      else setScale(1)
    }
    update()
    window.addEventListener("resize", update)
    return () => window.removeEventListener("resize", update)
  }, [])

  return scale
}

// ─── types ─────────────────────────────────────────────────────
interface DotProps {
  on: boolean
  color: string
  delay?: number
  size: number
}

interface CharGridProps {
  char: string
  color: string
  charIndex?: number
  dotSize: number
  dotGap: number
}

interface DotMatrixDisplayProps {
  text?: string
  color?: string
  className?: string
}

interface ScrollingDisplayProps extends DotMatrixDisplayProps {
  visibleChars?: number
  speed?: number
}

// ─── helpers ───────────────────────────────────────────────────
function getPattern(ch: string): GlyphMatrix {
  return FONT[ch.toUpperCase()] ?? FONT[" "]
}

// ─── Dot ───────────────────────────────────────────────────────
function Dot({ on, color, delay = 0, size }: DotProps) {
  return (
    <motion.div
      style={{ width: size, height: size }}
      animate={{
        backgroundColor: on ? color : "var(--muted)",
        boxShadow: on ? `0 0 ${size}px ${color}99` : "none",
        scale: on ? 1 : 0.85,
      }}
      transition={{ duration: 0.08, delay }}
    />
  )
}

// ─── CharGrid ──────────────────────────────────────────────────
function CharGrid({ char, color, charIndex = 0, dotSize, dotGap }: CharGridProps) {
  const pattern = getPattern(char)

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, delay: charIndex * 0.05 }}
      style={{ display: "flex", flexDirection: "column", gap: dotGap }}
    >
      {pattern.map((row, r) => (
        <div key={r} style={{ display: "flex", gap: dotGap }}>
          {row.map((bit, c) => (
            <Dot
              key={c}
              on={bit === 1}
              color={color}
              size={dotSize}
              delay={charIndex * 0.04 + r * 0.01}
            />
          ))}
        </div>
      ))}
    </motion.div>
  )
}

// ─── DotMatrixDisplay ──────────────────────────────────────────
export function DotMatrixDisplay({
  text = "HELLO",
  color = "#e8e0d0",
  className = "",
}: DotMatrixDisplayProps) {
  const chars = text.toUpperCase().split("")
  const scale = useResponsiveScale()

  return (
    <div
      className={className}
      style={{
        display: "inline-flex",
        gap: BASE_CHAR_GAP * scale,
        padding: `${20 * scale}px ${24 * scale}px`,
        background: "var(--background)",
        border: "1px solid var(--border)",
      }}
    >
      <AnimatePresence mode="wait">
        {chars.map((char, i) => (
          <CharGrid
            key={`${char}-${i}`}
            char={char}
            color={color}
            charIndex={i}
            dotSize={BASE_DOT_SIZE * scale}
            dotGap={BASE_DOT_GAP * scale}
          />
        ))}
      </AnimatePresence>
    </div>
  )
}

// ─── ScrollingDisplay ──────────────────────────────────────────
export function ScrollingDisplay({
  text = "HELLO WORLD",
  color = "#e8e0d0",
  visibleChars = 8,
  speed = 200,
  className = "",
}: ScrollingDisplayProps) {
  const padded = "     " + text.toUpperCase() + "     "
  const [offset, setOffset] = useState(0)
  const scale = useResponsiveScale()

  useEffect(() => {
    const id = setInterval(() => {
      setOffset((o) => (o + 1) % padded.length)
    }, speed)
    return () => clearInterval(id)
  }, [padded.length, speed])

  const visible = padded
    .slice(offset, offset + visibleChars)
    .padEnd(visibleChars, " ")

  return (
    <div
      className={className}
      style={{
        display: "inline-flex",
        gap: BASE_CHAR_GAP * scale,
        padding: `${20 * scale}px ${24 * scale}px`,
        background: "var(--background)",
        border: "1px solid var(--border)",
        overflow: "hidden",
      }}
    >
      {visible.split("").map((char, i) => (
        <CharGrid
          key={i}
          char={char}
          color={color}
          charIndex={0}
          dotSize={BASE_DOT_SIZE * scale}
          dotGap={BASE_DOT_GAP * scale}
        />
      ))}
    </div>
  )
}

// ─── WaveDisplay ───────────────────────────────────────────────
export function WaveDisplay({
  text = "WAVE",
  color = "#e8e0d0",
  className = "",
}: DotMatrixDisplayProps) {
  const [tick, setTick] = useState(0)
  const chars = text.toUpperCase().split("")
  const scale = useResponsiveScale()
  const dotSize = BASE_DOT_SIZE * scale
  const dotGap = BASE_DOT_GAP * scale

  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 80)
    return () => clearInterval(id)
  }, [])

  return (
    <div
      className={className}
      style={{
        display: "inline-flex",
        gap: BASE_CHAR_GAP * scale,
        padding: `${20 * scale}px ${24 * scale}px`,
        background: "var(--background)",
        border: "1px solid var(--border)",
      }}
    >
      {chars.map((char, ci) => {
        const wave = Math.sin((tick - ci * 3) * 0.4)
        const alpha = Math.round((0.35 + 0.65 * Math.max(0, wave)) * 100) / 100
        return (
          <motion.div
            key={ci}
            animate={{ opacity: alpha }}
            transition={{ duration: 0.08 }}
            style={{ display: "flex", flexDirection: "column", gap: dotGap }}
          >
            {getPattern(char).map((row, r) => (
              <div key={r} style={{ display: "flex", gap: dotGap }}>
                {row.map((bit, c) => (
                  <div
                    key={c}
                    style={{
                      width: dotSize,
                      height: dotSize,
                      backgroundColor: bit ? color : "var(--muted)",
                      boxShadow: bit ? `0 0 ${dotSize}px ${color}66` : "none",
                    }}
                  />
                ))}
              </div>
            ))}
          </motion.div>
        )
      })}
    </div>
  )
}
