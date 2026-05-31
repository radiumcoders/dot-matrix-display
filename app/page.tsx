"use client"

import { useState } from "react"
import { DotMatrixDisplay, WaveDisplay } from "@/components/dot-matrix"
import { Input } from "@/components/ui/input"
import { Toggle } from "@/components/ui/toggle"

type Mode = "static" | "wave"

const COLORS = [
  { label: "Warm white", value: "#e8e0d0" },
  { label: "Cyan", value: "#00e5ff" },
  { label: "Amber", value: "#ffb300" },
  { label: "Green", value: "#69ff47" },
  { label: "Red", value: "#ff3d71" },
  { label: "Purple", value: "#bf5af2" },
]

export default function Page() {
  const [text, setText] = useState("HELLO")
  const [committed, setCommitted] = useState("HELLO")
  const [mode, setMode] = useState<Mode>("static")
  const [color, setColor] = useState("#e8e0d0")

  return (
    <div className="flex min-h-svh flex-col">
      <div className="flex flex-1 flex-col items-center justify-center gap-4 p-4 sm:gap-8 sm:p-8">
        {mode === "static" && <DotMatrixDisplay text={committed} color={color} />}
        {mode === "wave" && <WaveDisplay text={committed} color={color} />}

        <div className="flex flex-col items-center gap-3 sm:gap-4">
          <Input
            value={text}
            onChange={(e) => setText(e.target.value.slice(0, 12))}
            onKeyDown={(e) => e.key === "Enter" && setCommitted(text)}
            placeholder="Type something..."
            className="w-44 sm:w-56 font-mono text-sm"
          />

          <div className="flex items-center gap-2">
            {COLORS.map((c) => (
              <button
                key={c.value}
                title={c.label}
                onClick={() => setColor(c.value)}
                className="size-5 cursor-pointer rounded-full border-2 transition-all hover:scale-110"
                style={{
                  backgroundColor: c.value,
                  borderColor: color === c.value ? "var(--foreground)" : "var(--border)",
                }}
              />
            ))}
          </div>

          <div className="flex rounded-none border border-input overflow-hidden">
            {(["static", "wave"] as Mode[]).map((m) => (
              <Toggle
                key={m}
                pressed={mode === m}
                onPressedChange={() => setMode(m)}
                variant="outline"
                className="rounded-none border-0 capitalize"
              >
                {m}
              </Toggle>
            ))}
          </div>
        </div>
      </div>

      <footer className="flex items-center justify-center gap-2 py-4 text-xs text-muted-foreground">
        <span>Built with love by</span>
        <a
          href="https://radiumcoders.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-foreground hover:underline"
        >
          radiumcoders
        </a>
        <span>·</span>
        <a
          href="https://x.com/radiumcoders"
          target="_blank"
          rel="noopener noreferrer"
          className="text-foreground hover:underline"
        >
          @radiumcoders
        </a>
      </footer>
    </div>
  )
}
