import type { CSSProperties } from "react";
export const motionPresets = {
  fadeUp: { "--reveal-distance": "24px", "--reveal-duration": "var(--duration-reveal)" } as CSSProperties,
  fade: { "--reveal-distance": "0px", "--reveal-duration": "var(--duration-base)" } as CSSProperties,
  image: { "--reveal-distance": "0px", "--reveal-duration": "var(--duration-slow)" } as CSSProperties,
} satisfies Record<string, CSSProperties>;
export type MotionPreset = keyof typeof motionPresets;
