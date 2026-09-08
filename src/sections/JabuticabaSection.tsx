import Image from "next/image";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { siteConfig } from "@/lib/site-config";

const qualities = ["Brasileira", "Frutada", "Profunda", "Marcante"];

export function JabuticabaSection() {
  const image = siteConfig.images.essence;

  return (
    <section id="essencia" className="section essence-section">
      <div className="essence-glow" aria-hidden="true" />
      <div className="page-shell essence-grid">
        <Reveal className="essence-visual">
          <Image
            src={image.src}
            alt={image.alt}
            fill
            sizes="(max-width: 820px) 100vw, 48vw"
            className="essence-visual__image"
          />
          <div className="essence-orbit" aria-hidden="true">
            <span />
          </div>
        </Reveal>

        <Reveal className="essence-copy" delay={1}>
          <SectionHeading
            eyebrow="A fruta"
            title="A essência da jabuticaba"
            intro="De cor intensa e personalidade marcante, a jabuticaba é a essência de BORANGA. Seu caráter frutado e sua profundidade dão origem a um licor de presença elegante, criado para ser apreciado lentamente."
          />
          <div className="quality-list" aria-label="Qualidades da jabuticaba">
            {qualities.map((quality, index) => (
              <span key={quality}>
                <i>{String(index + 1).padStart(2, "0")}</i>
                {quality}
              </span>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
