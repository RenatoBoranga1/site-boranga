import { ParallaxImage } from "@/components/ui/ParallaxImage";
import { ArrowIcon } from "@/components/ui/ArrowIcon";
import { siteConfig } from "@/lib/site-config";
import { TextReveal } from "@/components/motion/TextReveal";
import { SectionTransition } from "@/components/motion/SectionTransition";

export function Hero() {
  const image = siteConfig.images.hero;

  return (
    <section id="topo" className="hero" aria-labelledby="hero-title">
      <ParallaxImage
        src={image.src}
        alt={image.alt}
        fill
        priority
        sizes="100vw"
        className="hero__image"
      />
      <div className="hero__veil" />
      <div className="hero__grain" aria-hidden="true" />
      <SectionTransition tone="wine" />
      <div className="hero__scroll-shade" aria-hidden="true" />

      <div className="hero__content page-shell">
        <div className="hero__prelude">
          <span className="hero__monogram" aria-hidden="true">B</span>
          <p className="hero__edition">Edição especial · 750 mL · 30% vol.</p>
        </div>
        <h1 id="hero-title" tabIndex={-1}>
          <span className="hero__wordmark">BORANGA</span>
          <small>Licor Extra Luxo de Jabuticaba</small>
        </h1>
        <p className="hero__statement"><TextReveal lines={["Mais que um licor.", "Uma experiência."]} /></p>
        <p className="hero__copy">
          Descubra a história, o ritual e os detalhes de uma criação feita para
          momentos extraordinários.
        </p>
        <a className="gold-button" href="#historia">
          Descobrir a experiência <ArrowIcon />
        </a>
      </div>

      <a className="scroll-cue" href="#historia" aria-label="Ir para a história">
        <span>Explore</span>
        <i aria-hidden="true" />
      </a>
    </section>
  );
}
