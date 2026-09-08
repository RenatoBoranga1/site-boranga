import Image from "next/image";
import { Reveal } from "@/components/ui/Reveal";
import { ArrowIcon } from "@/components/ui/ArrowIcon";
import { siteConfig } from "@/lib/site-config";

export function GiftSection() {
  const image = siteConfig.images.gift;

  return (
    <section id="presenteie" className="gift-section">
      <Image
        src={image.src}
        alt={image.alt}
        fill
        sizes="100vw"
        className="gift-section__image"
      />
      <div className="gift-section__veil" />
      <div className="page-shell gift-section__content">
        <Reveal>
          <p className="eyebrow">Presenteie</p>
          <h2>Uma experiência feita para ser compartilhada.</h2>
          <p>
            Garrafa, caixa premium e edição especial — uma apresentação à altura
            dos momentos que merecem permanecer.
          </p>
          <a href="#sua-garrafa" className="outline-button">
            Conhecer a edição <ArrowIcon />
          </a>
        </Reveal>
      </div>
    </section>
  );
}
