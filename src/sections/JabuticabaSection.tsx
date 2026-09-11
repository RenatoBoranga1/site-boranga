import { ParallaxImage } from "@/components/ui/ParallaxImage";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { siteConfig } from "@/lib/site-config";
import { MaskReveal } from "@/components/motion/MaskReveal";
import { SectionTransition } from "@/components/motion/SectionTransition";

const qualities = ["Brasileira", "Frutada", "Profunda", "Marcante"];

export function JabuticabaSection() {
  const image = siteConfig.images.essence;

  return (
    <section id="essencia" className="section essence-section">
      <SectionTransition tone="wine" />
      <div className="page-shell essence-grid">
        <MaskReveal className="essence-visual">
          <ParallaxImage
            src={image.src}
            alt={image.alt}
            fill
            sizes="(max-width: 820px) 100vw, 48vw"
            className="essence-visual__image"
          />
          <div className="essence-orbit" aria-hidden="true">
            <span />
          </div>
        </MaskReveal>

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
