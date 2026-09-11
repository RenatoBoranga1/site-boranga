export type ExperienceEventPayload = { lot?: string; bottle?: string; pairingId?: string; identifier?: string; step?: number };
type Events = {
  qr_scan: { source: string; status: string };
  share: { method: "native" | "clipboard" };
  section_view: { section: string };
  gift_click: Record<string, never>;
  experience_opened: ExperienceEventPayload;
  experience_started: ExperienceEventPayload;
  pairing_viewed: ExperienceEventPayload;
  pairing_step_viewed: ExperienceEventPayload;
  certificate_viewed: ExperienceEventPayload;
  share_clicked: ExperienceEventPayload;
};
export function sanitizeExperienceEvent(payload: ExperienceEventPayload): ExperienceEventPayload {
  return {
    ...(typeof payload.lot === "string" && /^[A-Z0-9-]{1,12}$/.test(payload.lot) ? { lot: payload.lot } : {}),
    ...(typeof payload.bottle === "string" && /^\d{1,7}$/.test(payload.bottle) ? { bottle: payload.bottle } : {}),
    ...(typeof payload.pairingId === "string" && /^[a-z0-9-]{1,60}$/.test(payload.pairingId) ? { pairingId: payload.pairingId } : {}),
    ...(typeof payload.identifier === "string" && /^[a-f0-9]{64}$/.test(payload.identifier) ? { identifier: payload.identifier } : {}),
    ...(Number.isInteger(payload.step) && payload.step! >= 1 && payload.step! <= 100 ? { step: payload.step } : {}),
  };
}
// Integration seam: no cookies, requests, raw tokens or personal data.
export function trackEvent<N extends keyof Events>(name: N, payload: Events[N]): void {
  void name;
  // Attach a future provider only after this allowlist; do not auto-capture URLs.
  const safePayload = ["experience_opened", "experience_started", "pairing_viewed", "pairing_step_viewed", "certificate_viewed", "share_clicked"].includes(name)
    ? sanitizeExperienceEvent(payload as ExperienceEventPayload) : payload;
  void safePayload;
}
