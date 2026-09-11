import Image from "next/image";
import { MaskReveal } from "@/components/motion/MaskReveal";
import { Reveal } from "@/components/motion/Reveal";
import { TextReveal } from "@/components/motion/TextReveal";
import { LineReveal } from "@/components/motion/LineReveal";
import { SectionTransition } from "@/components/motion/SectionTransition";
import type { Pairing } from "@/types/pairing";

export function PersonalPairing({ pairing, customerName }: { pairing: Pairing; customerName?: string }) {
  return <section id="sua-experiencia" className="section personal-pairing section-atmosphere" data-scroll-story="pairing" aria-labelledby="personal-pairing-title">
    <SectionTransition tone="gold" />
    <div className="page-shell">
      <Reveal className="personal-pairing__heading">
        <p className="eyebrow">Uma seleção preparada para você</p>
        <h2 id="personal-pairing-title"><TextReveal lines={["Sua experiência", "BORANGA"]} /></h2>
        {customerName && <p className="personal-pairing__dedication">Uma escolha para {customerName}.</p>}
      </Reveal>
      <div className="personal-pairing__story">
        <div className="personal-pairing__visual">
          <MaskReveal className="personal-pairing__frame">
            <Image src={pairing.image} alt={pairing.imageAlt} fill sizes="(min-width: 860px) 45vw, 100vw" />
            {pairing.experienceName && <span className="personal-pairing__signature">{pairing.experienceName}</span>}
          </MaskReveal>
          <Reveal className="personal-pairing__caption">
            <p className="eyebrow">{pairing.category}</p>
            <h3>{pairing.name}</h3>
            <p>{pairing.shortDescription}</p>
          </Reveal>
        </div>
        <div className="personal-pairing__content">
          <Reveal><p className="personal-pairing__intro">{pairing.intro}</p><LineReveal /></Reveal>
          <ol className="personal-pairing__steps">
            {pairing.howToEnjoy.map((step, index) => <li key={step.title} data-story-step data-active={index === 0 ? "true" : undefined} aria-current={index === 0 ? "step" : undefined}>
              <Reveal className="personal-pairing__step">
                <span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
                <div><h4>{step.title}</h4><p>{step.description}</p></div>
              </Reveal>
            </li>)}
          </ol>
          <Reveal className="personal-pairing__notes">
            <p className="personal-pairing__sensory">{pairing.sensoryNote}</p>
            {pairing.allergenNote && <p><strong>Alergênicos</strong>{pairing.allergenNote}</p>}
            {pairing.storageNote && <p><strong>Armazenamento</strong>{pairing.storageNote}</p>}
            {pairing.servingNote && <p><strong>Serviço</strong>{pairing.servingNote}</p>}
          </Reveal>
        </div>
      </div>
    </div>
  </section>;
}
