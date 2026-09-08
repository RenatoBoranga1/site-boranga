import Image from "next/image";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { siteConfig } from "@/lib/site-config";
import type { BottleIdentityData } from "@/types/bottle";

type BottleIdentityProps = {
  bottle: BottleIdentityData;
};

export function BottleIdentity({ bottle }: BottleIdentityProps) {
  const image = siteConfig.images.city;

  return (
    <section id="sua-garrafa" className="section bottle-section">
      <div className="page-shell bottle-grid">
        <Reveal className="bottle-image">
          <Image
            src={image.src}
            alt={image.alt}
            fill
            sizes="(max-width: 820px) 100vw, 43vw"
            className="bottle-image__photo"
          />
          <div className="bottle-image__monogram" aria-hidden="true">B</div>
        </Reveal>

        <Reveal className="bottle-content" delay={1}>
          <SectionHeading
            eyebrow="Origem identificada"
            title="Sua garrafa BORANGA"
            intro={
              bottle.isPersonalized
                ? "Esta garrafa faz parte de uma produção especial BORANGA."
                : "Escaneie o QR Code de uma garrafa numerada para revelar sua identidade individual."
            }
          />

          {bottle.isPersonalized ? (
            <dl className="identity-table">
              <div>
                <dt>Lote</dt>
                <dd>{bottle.lot}</dd>
              </div>
              <div>
                <dt>Garrafa</dt>
                <dd>
                  {bottle.bottle}
                  {bottle.total && <small> / {bottle.total}</small>}
                </dd>
              </div>
              <div>
                <dt>Produção</dt>
                <dd>{bottle.edition}</dd>
              </div>
            </dl>
          ) : (
            <div className="identity-fallback">
              <span aria-hidden="true">B</span>
              <p>
                <small>Produção</small>
                Edição Especial BORANGA
              </p>
            </div>
          )}

          <p className="identity-note">
            Cada identificação conecta o rótulo físico à experiência digital da
            sua edição.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
