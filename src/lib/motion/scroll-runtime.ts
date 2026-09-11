import { motionConfig } from "./motion-config";
import { trackEvent, type ExperienceEventPayload } from "../analytics";

const clamp = (value: number, min = 0, max = 1) => Math.max(min, Math.min(max, value));

/** One event-driven frame queue; no permanent animation loop or scroll interception. */
export function mountScrollMotion(analytics?: ExperienceEventPayload) {
  const viewedSteps = new Set<number>();
  const reduced = matchMedia(motionConfig.reducedMotion);
  const fine = matchMedia(motionConfig.finePointer);
  const reveals = [...document.querySelectorAll<HTMLElement>(".reveal, .light-sweep")];
  const layers = [...document.querySelectorAll<HTMLElement>("[data-parallax]")];
  const atmospheres = [...document.querySelectorAll<HTMLElement>("[data-atmosphere]")];
  const stories = [...document.querySelectorAll<HTMLElement>("[data-scroll-story]")].map((node) => ({
    node, steps: [...node.querySelectorAll<HTMLElement>("[data-story-step]")], current: -1,
  }));
  const hero = document.querySelector<HTMLElement>(".hero");
  const heroContent = hero?.querySelector<HTMLElement>(".hero__content");
  const progress = document.querySelector<HTMLElement>(".reading-progress");
  const active = new Set<Element>();
  const tilts = [...document.querySelectorAll<HTMLElement>("[data-tilt]")].map((node) => ({
    node, surface: node.querySelector<HTMLElement>(".tilt-surface")!, rect: null as DOMRect | null,
    x: 0, y: 0, dirty: false,
  }));
  let frame = 0;
  let revealObserver: IntersectionObserver | undefined;
  const update = () => {
    frame = 0;
    const height = innerHeight;
    const scroll = scrollY;
    const scrollRange = Math.max(1, document.documentElement.scrollHeight - height);
    // Read geometry together before any transform or attribute writes.
    const layerRects = reduced.matches ? [] : layers.filter((node) => active.has(node)).map((node) => ({
      node, rect: node.parentElement!.getBoundingClientRect(),
    }));
    const atmosphereRects = reduced.matches ? [] : atmospheres.filter((node) => active.has(node)).map((node) => ({
      node, rect: node.parentElement!.getBoundingClientRect(),
    }));
    const storyRects = stories.filter(({ node }) => active.has(node)).map((story) => ({
      story, rects: story.steps.map((step) => step.getBoundingClientRect()),
    }));
    const heroRect = hero && active.has(hero) && !reduced.matches ? hero.getBoundingClientRect() : null;
    if (progress) progress.style.transform = `scaleX(${clamp(scroll / scrollRange)})`;
    for (const { node, rect } of layerRects) {
      const ratio = clamp((height / 2 - rect.top - rect.height / 2) / ((height + rect.height) / 2), -1, 1);
      const amplitude = node.closest(".hero") ? motionConfig.heroParallaxAmplitude : motionConfig.parallaxAmplitude;
      node.style.transform = `translate3d(0, ${ratio * amplitude}px, 0)`;
    }
    for (const { node, rect } of atmosphereRects) {
      const ratio = clamp((height / 2 - rect.top - rect.height / 2) / ((height + rect.height) / 2), -1, 1);
      node.style.opacity = String(.35 + (1 - Math.abs(ratio)) * .35);
      node.style.transform = `translate3d(0, ${ratio * 12}px, 0)`;
    }
    if (heroRect && hero) {
      const fraction = clamp(-heroRect.top / heroRect.height);
      hero.style.setProperty("--hero-shade", String(fraction * .36));
      if (heroContent) heroContent.style.transform = `translate3d(0, ${fraction * -18}px, 0)`;
    }
    for (const { story, rects } of storyRects) {
      if (!rects.length) continue;
      const focal = height * .52;
      let selected = 0;
      let distance = Infinity;
      rects.forEach((rect, index) => {
        const current = Math.abs(rect.top + rect.height / 2 - focal);
        if (current < distance) { distance = current; selected = index; }
      });
      if (selected !== story.current) {
        story.current = selected;
        story.node.dataset.activeStep = String(selected);
        story.steps.forEach((step, index) => {
          step.dataset.active = String(index === selected);
          if (index === selected) step.setAttribute("aria-current", "step");
          else step.removeAttribute("aria-current");
        });
      }
      const currentRect = rects[selected];
      if (story.node.dataset.scrollStory === "pairing" && analytics && currentRect.top < height && currentRect.bottom > 0 && !viewedSteps.has(selected)) {
        viewedSteps.add(selected);
        trackEvent("pairing_step_viewed", { ...analytics, step: selected + 1 });
      }
      const first = rects[0].top + rects[0].height / 2;
      const last = rects.at(-1)!.top + rects.at(-1)!.height / 2;
      story.node.style.setProperty("--story-progress", String(clamp((focal - first) / Math.max(1, last - first))));
    }
    for (const tilt of tilts) {
      if (!tilt.dirty || reduced.matches || !fine.matches) continue;
      tilt.dirty = false;
      tilt.surface.style.transform = `perspective(1100px) rotateX(${-tilt.y * motionConfig.tiltDegrees}deg) rotateY(${tilt.x * motionConfig.tiltDegrees}deg)`;
      tilt.surface.style.setProperty("--glint-x", `${tilt.x * 8}px`);
      tilt.surface.style.setProperty("--glint-y", `${tilt.y * 8}px`);
    }
  };
  const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
  const resetTilt = () => tilts.forEach((tilt) => {
    tilt.rect = null; tilt.dirty = false;
    tilt.surface.style.removeProperty("transform");
    tilt.surface.style.removeProperty("--glint-x"); tilt.surface.style.removeProperty("--glint-y");
    delete tilt.node.dataset.hovered;
  });
  const visibility = "IntersectionObserver" in window ? new IntersectionObserver((entries) => {
    entries.forEach((entry) => { if (entry.isIntersecting) active.add(entry.target); else active.delete(entry.target); });
    schedule();
  }, { rootMargin: "120px" }) : undefined;
  [...layers, ...atmospheres, ...stories.map(({ node }) => node), ...(hero ? [hero] : [])].forEach((node) => {
    if (visibility) visibility.observe(node); else active.add(node);
  });
  const configure = () => {
    revealObserver?.disconnect();
    resetTilt();
    layers.forEach((node) => { node.style.transform = ""; });
    atmospheres.forEach((node) => { node.style.transform = ""; node.style.opacity = ""; });
    hero?.style.removeProperty("--hero-shade");
    if (heroContent) heroContent.style.transform = "";
    if (reduced.matches || !("IntersectionObserver" in window)) {
      reveals.forEach((node) => { delete node.dataset.motion; node.dataset.visible = "true"; });
    } else {
      revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          (entry.target as HTMLElement).dataset.visible = "true";
          revealObserver?.unobserve(entry.target);
        });
      }, motionConfig.observer);
      reveals.forEach((node) => {
        if (node.dataset.visible !== "true") {
          node.dataset.motion = "ready";
          revealObserver!.observe(node);
        }
      });
    }
    schedule();
  };
  const pointerCleanups = tilts.map((tilt) => {
    const enter = (event: PointerEvent) => {
      if (reduced.matches || !fine.matches || event.pointerType !== "mouse") return;
      tilt.rect = tilt.node.getBoundingClientRect();
      tilt.node.dataset.hovered = "true";
    };
    const move = (event: PointerEvent) => {
      if (reduced.matches || !fine.matches || event.pointerType !== "mouse") return;
      if (!tilt.rect) {
        tilt.rect = tilt.node.getBoundingClientRect();
        tilt.node.dataset.hovered = "true";
      }
      tilt.x = clamp((event.clientX - tilt.rect.left) / tilt.rect.width * 2 - 1, -1, 1);
      tilt.y = clamp((event.clientY - tilt.rect.top) / tilt.rect.height * 2 - 1, -1, 1);
      tilt.dirty = true; schedule();
    };
    const leave = () => { tilt.rect = null; tilt.dirty = false; tilt.surface.style.transform = ""; delete tilt.node.dataset.hovered; };
    tilt.node.addEventListener("pointerenter", enter);
    tilt.node.addEventListener("pointermove", move, { passive: true });
    tilt.node.addEventListener("pointerleave", leave);
    return () => {
      tilt.node.removeEventListener("pointerenter", enter); tilt.node.removeEventListener("pointermove", move); tilt.node.removeEventListener("pointerleave", leave);
    };
  });
  const resize = () => { resetTilt(); schedule(); };
  const scrollHandler = () => { resetTilt(); schedule(); };
  configure();
  reduced.addEventListener("change", configure);
  fine.addEventListener("change", configure);
  window.addEventListener("scroll", scrollHandler, { passive: true });
  window.addEventListener("resize", resize);
  const visited = new Set<string>();
  const sectionObserver = "IntersectionObserver" in window ? new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && !visited.has(entry.target.id)) {
        visited.add(entry.target.id); trackEvent("section_view", { section: entry.target.id });
        if (analytics && entry.target.id === "sua-experiencia") trackEvent("pairing_viewed", analytics);
        if (analytics && entry.target.id === "certificado") trackEvent("certificate_viewed", analytics);
      }
    });
  }, { threshold: .15 }) : undefined;
  document.querySelectorAll("main section[id]").forEach((node) => sectionObserver?.observe(node));
  const click = (event: MouseEvent) => {
    if (event.target instanceof Element && event.target.closest("#presenteie a")) trackEvent("gift_click", {});
  };
  document.addEventListener("click", click);
  return () => {
    cancelAnimationFrame(frame);
    visibility?.disconnect(); revealObserver?.disconnect(); sectionObserver?.disconnect();
    reduced.removeEventListener("change", configure); fine.removeEventListener("change", configure);
    window.removeEventListener("scroll", scrollHandler); window.removeEventListener("resize", resize);
    document.removeEventListener("click", click);
    pointerCleanups.forEach((cleanup) => cleanup()); resetTilt();
    reveals.forEach((node) => { delete node.dataset.motion; });
    layers.forEach((node) => { node.style.transform = ""; });
    atmospheres.forEach((node) => { node.style.transform = ""; node.style.opacity = ""; });
    hero?.style.removeProperty("--hero-shade");
    if (heroContent) heroContent.style.transform = "";
  };
}
