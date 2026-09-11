"use client";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { ArrowIcon } from "@/components/ui/ArrowIcon";
import { motionConfig } from "@/lib/motion/motion-config";
import { trackEvent, type ExperienceEventPayload } from "@/lib/analytics";

export function ExperienceGate({ invitation, children, analytics }: {
  invitation: ReactNode; children: ReactNode; analytics: ExperienceEventPayload;
}) {
  const [phase, setPhase] = useState<"invitation" | "closing" | "started">("invitation");
  const root = useRef<HTMLDivElement>(null);
  const body = useRef<HTMLDivElement>(null);
  const start = useRef<HTMLAnchorElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const started = useRef(false);
  useEffect(() => {
    root.current!.dataset.enhanced = "true";
    body.current!.inert = true;
    const frame = requestAnimationFrame(() => start.current?.focus({ preventScroll: true }));
    return () => { cancelAnimationFrame(frame); clearTimeout(timer.current); };
  }, []);
  function begin(event: React.MouseEvent<HTMLAnchorElement>) {
    event.preventDefault();
    if (started.current) return;
    started.current = true;
    trackEvent("experience_started", analytics);
    setPhase("closing");
    const duration = matchMedia(motionConfig.reducedMotion).matches ? 0 : motionConfig.invitationExitDuration;
    timer.current = setTimeout(() => {
      body.current!.inert = false;
      setPhase("started");
      document.getElementById("hero-title")?.focus({ preventScroll: true });
      window.scrollTo({ top: 0, behavior: "instant" });
    }, duration);
  }
  return <div ref={root} className="experience-gate" data-state={phase}>
    {phase !== "started" && <section className="invitation" aria-labelledby="invitation-name">
      <div className="invitation__panel">
        {invitation}
        <a ref={start} href="#topo" className="gold-button invitation__start" onClick={begin}
          onKeyDown={(event) => { if (event.key === "Tab" && root.current?.dataset.enhanced === "true") event.preventDefault(); }}>
          Iniciar experiência <ArrowIcon />
        </a>
      </div>
    </section>}
    <div ref={body} className="experience-body">{children}</div>
  </div>;
}
