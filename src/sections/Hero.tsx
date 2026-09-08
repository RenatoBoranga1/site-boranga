import Image from "next/image";
import { ArrowIcon } from "@/components/ui/ArrowIcon";
import { Header } from "@/components/Header";
import { siteConfig } from "@/lib/site-config";

export function Hero() {
  const image = siteConfig.images.hero;

  return (
    <section id="topo" className="hero" aria-labelledby="hero-title">
      <Image
        src={image.src}
        alt={image.alt}
        fill
        priority
        sizes="100vw"
        className="hero__image"
      />
      <div className="hero__veil" />
      <div className="hero__grain" aria-hidden="true" />
      <Header />

      <div className="hero__content page-shell">
        <p className="hero__edition">Edição especial · 750 mL · 30% vol.</p>
        <h1 id="hero-title">
          <span>BORANGA</span>
          <small>Licor Extra Luxo de Jabuticaba</small>
        </h1>
        <p className="hero__statement">Mais que um licor. Uma experiência.</p>
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
