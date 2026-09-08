import Image from "next/image";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { siteConfig } from "@/lib/site-config";

export function BrandStory() {
  const image = siteConfig.images.story;

  return (
    <section id="historia" className="section section--ivory">
      <div className="page-shell story-grid">
        <Reveal className="story-copy">
          <SectionHeading eyebrow="A origem" title="A história BORANGA" tone="light" />
          <div className="prose-luxury">
            <p>
              BORANGA nasceu do desejo de transformar momentos especiais em
              experiências inesquecíveis.
            </p>
            <p>
              Inspirado pela tradição dos grandes licores e pelo cuidado artesanal
              em cada detalhe, reúne equilíbrio, sabor marcante e sofisticação em
              uma bebida feita para ser apreciada sem pressa.
            </p>
            <p>
              Mais do que um licor, BORANGA representa tradição, identidade e
              exclusividade.
            </p>
          </div>
          <div className="story-signature" aria-label="Características do produto">
            <span>
              <strong>750 mL</strong>
              Presença
            </span>
            <span>
              <strong>30% vol.</strong>
              Intensidade
            </span>
            <span>
              <strong>Extra luxo</strong>
              Identidade
            </span>
          </div>
        </Reveal>

        <Reveal className="portrait-frame" delay={1}>
          <Image
            src={image.src}
            alt={image.alt}
            fill
            sizes="(max-width: 820px) 100vw, 46vw"
            className="portrait-frame__image"
          />
          <span className="portrait-frame__caption">Tempo · detalhe · presença</span>
        </Reveal>
      </div>
    </section>
  );
}
