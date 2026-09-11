"use client";
import { useEffect, useRef, useState } from "react";
import { ArrowIcon } from "@/components/ui/ArrowIcon";
import { Reveal } from "@/components/ui/Reveal";
import { TextReveal } from "@/components/ui/TextReveal";
import { BrandMark } from "@/components/BrandMark";
import { getBottleShareText, getIdentityLabel, getShareUrl } from "@/lib/bottle-display";
import { trackEvent, type ExperienceEventPayload } from "@/lib/analytics";
import { motionConfig } from "@/lib/motion-config";
import type { BottleIdentityData } from "@/types/bottle";
import type { ExperiencePersonalization } from "@/types/experience";

async function copyText(value: string) {
  if (navigator.clipboard?.writeText) { await navigator.clipboard.writeText(value); return; }
  const active = document.activeElement as HTMLElement | null;
  const textarea = document.createElement("textarea");
  textarea.value = value;
  textarea.readOnly = true;
  textarea.tabIndex = -1;
  textarea.setAttribute("aria-hidden", "true");
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  try {
    textarea.select();
    if (!document.execCommand("copy")) throw new Error("Clipboard unavailable");
  } finally { textarea.remove(); active?.focus(); }
}
export function DigitalCertificate({ bottle, personalization, experiencePath, analytics }: {
  bottle: BottleIdentityData; personalization?: ExperiencePersonalization; experiencePath?: string; analytics?: ExperienceEventPayload;
}) {
  const [status, setStatus] = useState("");
  const [shareState, setShareState] = useState<"idle" | "preparing" | "copied" | "shared">("idle");
  const sharing = useRef(false);
  const busy = shareState === "preparing";
  const succeeded = shareState === "copied" || shareState === "shared";
  const verified = bottle.status === "valid" && bottle.source === "token";
  const initialLabel = bottle.isPersonalized ? "Compartilhar minha garrafa" : "Compartilhar BORANGA";
  const shareLabel = busy ? "Preparando…" : shareState === "copied" ? "Link copiado" : shareState === "shared" ? "Experiência pronta para compartilhar" : initialLabel;

  useEffect(() => {
    if (!succeeded) return;
    const timer = window.setTimeout(() => {
      setShareState("idle");
      setStatus("");
    }, motionConfig.shareFeedbackDuration);
    return () => window.clearTimeout(timer);
  }, [succeeded, shareState]);

  async function shareBottle() {
    if (sharing.current) return;
    sharing.current = true;
    trackEvent("share_clicked", analytics ?? {});
    setShareState("preparing");
    setStatus("");
    try {
      const url = getShareUrl(window.location.href, bottle, experiencePath);
      if (navigator.share) {
        try {
          await navigator.share({ title: experiencePath ? "BORANGA" : "Minha garrafa BORANGA", text: experiencePath ? "Conheça minha experiência BORANGA." : getBottleShareText(bottle), url });
          trackEvent("share", { method: "native" });
          setShareState("shared");
          setStatus("Compartilhamento concluído.");
          return;
        } catch (error) {
          if (error && typeof error === "object" && "name" in error && error.name === "AbortError") {
            setShareState("idle");
            return;
          }
        }
      }
      await copyText(url);
      trackEvent("share", { method: "clipboard" });
      setShareState("copied");
      setStatus("Link da garrafa copiado.");
    } catch {
      setShareState("idle");
      setStatus("Não foi possível copiar. Copie o endereço na barra do navegador.");
    } finally { sharing.current = false; }
  }
  return <section id="certificado" className="certificate-section" aria-labelledby="certificate-title">
    <div className="page-shell">
      <Reveal className="certificate">
        <div className="certificate__border" aria-hidden="true"><span /><span /><span /><span /></div>
        <div className="certificate__corner certificate__corner--tl" aria-hidden="true" />
        <div className="certificate__corner certificate__corner--tr" aria-hidden="true" />
        <div className="certificate__corner certificate__corner--bl" aria-hidden="true" />
        <div className="certificate__corner certificate__corner--br" aria-hidden="true" />
        <div className="certificate__content">
          <div className="certificate__brand" data-ceremony-step="1"><BrandMark /></div>
          <p className="eyebrow certificate__title" data-ceremony-step="2">Certificado BORANGA</p>
          {bottle.isPersonalized && <p className="certificate__identity" data-ceremony-step="3">Lote <strong>{bottle.lot}</strong><i aria-hidden="true" />{bottle.total && <>de <strong>{bottle.total}</strong> garrafas</>}<span>{bottle.edition}</span></p>}
          <h2 id="certificate-title" data-ceremony-step="4">
            {bottle.isPersonalized ? <><span className="certificate__number-label">Garrafa Nº</span>{" "}<TextReveal lines={[bottle.bottle ?? ""]} /></> : <TextReveal lines={[bottle.status === "invalid" ? "Não foi possível validar esta identificação." : "Edição Especial BORANGA"]} />}
          </h2>
          {(personalization?.customerName || personalization?.pairingName) && <div className="certificate__personalization" data-ceremony-step="4">
            {personalization.customerName && <p><span>Preparada para</span><strong>{personalization.customerName}</strong></p>}
            {personalization.pairingName && <p><span>Experiência selecionada</span>{personalization.pairingName}</p>}
          </div>}
          <p className="certificate__status light-sweep" data-status={bottle.status} data-verified={verified || undefined} data-ceremony-step="5">
            <span aria-hidden="true">{verified ? "✓" : "◇"}</span>
            {experiencePath && verified ? "Identificação digital verificada" : getIdentityLabel(bottle)}
          </p>
          <p className="certificate__note" data-ceremony-step="6">{bottle.isPersonalized ? "Esta garrafa integra uma edição numerada BORANGA." : "Mais que um licor. Uma experiência."}</p>
          <div className="certificate__share" data-ceremony-step="6">
            <button type="button" className="gold-button certificate-share" onClick={shareBottle} disabled={busy} aria-busy={busy} data-share-state={shareState}>
              <span>{shareLabel}</span>
              {succeeded ? <svg className="certificate-share__check" viewBox="0 0 24 24" aria-hidden="true"><path d="m5 12 4 4L19 6" /></svg> : <ArrowIcon />}
            </button>
          </div>
          <p className="share-status" role="status" aria-live="polite">{status}</p>
        </div>
      </Reveal>
    </div>
  </section>;
}
