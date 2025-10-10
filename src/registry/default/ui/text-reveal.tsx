import clsx from "clsx";
import type React from "react";

interface TextRevealProps {
  text: string; // content to reveal
  baseOpacity?: number | string;
  start?: string;
  offset?: number;
  offsetMultiplier?: number;
  className?: string;
}

export function TextReveal({
  text,
  baseOpacity = 0.1,
  className = "",
  start = "10%",
  offset = 10,
  offsetMultiplier = 1.1,
}: TextRevealProps) {
  const chars = text.trim().split("");

  return (
    <div
      style={
        {
          "--_chars": chars.length,
          "--base": baseOpacity,
          "--start": start,
          "--offset": offset,
          "--offset-multiplier": offsetMultiplier,
        } as React.CSSProperties
      }
      className={clsx("text-reveal", className)}
    >
      {chars.map((char, idx) => (
        <span
          // biome-ignore lint/suspicious/noArrayIndexKey: this will not change order
          key={char + idx}
          className="char"
          style={{ "--idx": idx } as React.CSSProperties}
        >
          {char}
        </span>
      ))}
    </div>
  );
}
