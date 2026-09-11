"use client";
import { useEffect } from "react";
import { mountScrollMotion } from "@/lib/motion/scroll-runtime";
import { trackEvent, type ExperienceEventPayload } from "@/lib/analytics";
import type { BottleIdentityData } from "@/types/bottle";
export function MotionRuntime({ bottle, analytics }: { bottle: BottleIdentityData; analytics?: ExperienceEventPayload }) {
  useEffect(() => {
    if (bottle.source !== "none") trackEvent("qr_scan", { source: bottle.source, status: bottle.status });
    if (analytics?.identifier) trackEvent("experience_opened", analytics);
    return mountScrollMotion(analytics);
  }, [bottle.source, bottle.status, analytics]);
  return <div className="reading-progress" aria-hidden="true" />;
}
