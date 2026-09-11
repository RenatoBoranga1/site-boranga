export const motionConfig = {
  invitationExitDuration: 700,
  observer: { rootMargin: "0px 0px -5%", threshold: 0.06 },
  parallaxAmplitude: 14,
  heroParallaxAmplitude: 6,
  tiltDegrees: 1.5,
  shareFeedbackDuration: 4000,
  reducedMotion: "(prefers-reduced-motion: reduce)",
  finePointer: "(hover: hover) and (pointer: fine) and (min-width: 860px)",
} as const;
