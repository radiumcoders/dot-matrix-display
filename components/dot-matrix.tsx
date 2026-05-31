import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "motion/react"
import { FONT, GlyphMatrix } from "@/lib/fonts"

// ─── config ────────────────────────────────────────────────────
const DOT_SIZE = 7 // px — diameter of each dot
const DOT_GAP = 2 // px — gap between dots
const CHAR_GAP = 6 // px — gap between characters

// ─── types ─────────────────────────────────────────────────────
type DisplayMode = "static" | "scroll" | "wave"

interface DotProps {
  on: boolean
  color: string
  delay?: number
}

interface CharGridProps {
  char: string
  color: string
  charIndex?: number
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

interface ColorOption {
  label: string
  value: string
}

// ─── helpers ───────────────────────────────────────────────────
function getPattern(ch: string): GlyphMatrix {
  return FONT[ch.toUpperCase()] ?? FONT[" "]
}

// ─── Dot ───────────────────────────────────────────────────────
function Dot({ on, color, delay = 0 }: DotProps) {
  return (
    <motion.div
      style={{ width: DOT_SIZE, height: DOT_SIZE }}
      animate={{
        backgroundColor: on ? color : "var(--muted)",
        boxShadow: on ? `0 0 ${DOT_SIZE}px ${color}99` : "none",
        scale: on ? 1 : 0.85,
      }}
      transition={{ duration: 0.08, delay }}
    />
  )
}

// ─── CharGrid ──────────────────────────────────────────────────
function CharGrid({ char, color, charIndex = 0 }: CharGridProps) {
  const pattern = getPattern(char)

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, delay: charIndex * 0.05 }}
      style={{ display: "flex", flexDirection: "column", gap: DOT_GAP }}
    >
      {pattern.map((row, r) => (
        <div key={r} style={{ display: "flex", gap: DOT_GAP }}>
          {row.map((bit, c) => (
            <Dot
              key={c}
              on={bit === 1}
              color={color}
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

  return (
    <div
      className={className}
      style={{
        display: "inline-flex",
        gap: CHAR_GAP,
        padding: "20px 24px",
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
        gap: CHAR_GAP,
        padding: "20px 24px",
        background: "var(--background)",
        border: "1px solid var(--border)",
        overflow: "hidden",
      }}
    >
      {visible.split("").map((char, i) => (
        <CharGrid key={i} char={char} color={color} charIndex={0} />
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

  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 80)
    return () => clearInterval(id)
  }, [])

  return (
    <div
      className={className}
      style={{
        display: "inline-flex",
        gap: CHAR_GAP,
        padding: "20px 24px",
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
            style={{ display: "flex", flexDirection: "column", gap: DOT_GAP }}
          >
            {getPattern(char).map((row, r) => (
              <div key={r} style={{ display: "flex", gap: DOT_GAP }}>
                {row.map((bit, c) => (
                  <div
                    key={c}
                    style={{
                      width: DOT_SIZE,
                      height: DOT_SIZE,
                      backgroundColor: bit ? color : "var(--muted)",
                      boxShadow: bit ? `0 0 ${DOT_SIZE}px ${color}66` : "none",
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
