"use client";

import { useState } from "react";
import { ArrowIcon } from "@/components/ui/ArrowIcon";
import { BrandMark } from "@/components/BrandMark";
import { getBottleShareText } from "@/lib/bottle";
import type { BottleIdentityData } from "@/types/bottle";

type DigitalCertificateProps = {
  bottle: BottleIdentityData;
};

async function copyText(value: string) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(value);
    return;
  }

  const textarea = document.createElement("textarea");
  textarea.value = value;
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand("copy");
  textarea.remove();
}

export function DigitalCertificate({ bottle }: DigitalCertificateProps) {
  const [status, setStatus] = useState("");

  async function shareBottle() {
    const url = window.location.href;
    const shareData = {
      title: "Minha garrafa BORANGA",
      text: getBottleShareText(bottle),
      url,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
        setStatus("Compartilhamento aberto.");
      } else {
        await copyText(url);
        setStatus("Link da garrafa copiado.");
      }
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return;
      await copyText(url);
      setStatus("Link da garrafa copiado.");
    }
  }

  return (
    <section className="certificate-section" aria-labelledby="certificate-title">
      <div className="page-shell">
        <div className="certificate">
          <div className="certificate__corner certificate__corner--tl" />
          <div className="certificate__corner certificate__corner--tr" />
          <div className="certificate__corner certificate__corner--bl" />
          <div className="certificate__corner certificate__corner--br" />

          <p className="eyebrow">Certificado BORANGA</p>
          <BrandMark />
          <h2 id="certificate-title">Uma criação para momentos extraordinários.</h2>

          {bottle.isPersonalized ? (
            <p className="certificate__identity">
              Lote <strong>{bottle.lot}</strong>
              <i aria-hidden="true" />
              Garrafa <strong>{bottle.bottle}</strong>
              {bottle.total && <> de <strong>{bottle.total}</strong></>}
            </p>
          ) : (
            <p className="certificate__identity">Edição Especial BORANGA</p>
          )}

          <button type="button" className="gold-button" onClick={shareBottle}>
            Compartilhar minha garrafa <ArrowIcon />
          </button>
          <p className="share-status" role="status" aria-live="polite">
            {status}
          </p>
        </div>
      </div>
    </section>
  );
}
