import type { CSSProperties, ReactNode } from "react";
import { motionPresets, type MotionPreset } from "@/lib/motion/motion-presets";
export type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: 0 | 1 | 2 | 3;
  preset?: MotionPreset;
};
export function Reveal({ children, className = "", delay = 0, preset = "fadeUp" }: RevealProps) {
  return <div className={`reveal ${className}`} data-delay={delay}
    style={{ ...motionPresets[preset], "--reveal-index": delay } as CSSProperties}>{children}</div>;
}
