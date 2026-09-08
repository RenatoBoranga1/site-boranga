import Image from "next/image";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { siteConfig } from "@/lib/site-config";

const steps = [
  { title: "Sirva", copy: "Entre 8 °C e 12 °C." },
  { title: "Observe", copy: "Aprecie a tonalidade vinho-rubi." },
  { title: "Sinta", copy: "Perceba os aromas frutados." },
  { title: "Deguste", copy: "Um gole de cada vez, sem pressa." },
];

export function RitualSection() {
  const image = siteConfig.images.ritual;

  return (
    <section id="ritual" className="section ritual-section">
      <div className="page-shell ritual-grid">
        <Reveal className="ritual-visual">
          <Image
            src={image.src}
            alt={image.alt}
            fill
            sizes="(max-width: 820px) 100vw, 48vw"
            className="ritual-visual__image"
          />
          <p className="ritual-quote">“O tempo também faz parte do sabor.”</p>
        </Reveal>

        <div className="ritual-content">
          <Reveal>
            <SectionHeading
              eyebrow="Um gesto de cada vez"
              title="O ritual BORANGA"
              intro="Uma pausa intencional transforma cada taça em uma experiência completa."
            />
          </Reveal>
          <ol className="ritual-steps">
            {steps.map((step, index) => (
              <li key={step.title}>
                <Reveal delay={(index % 4) as 0 | 1 | 2 | 3}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <div>
                    <h3>{step.title}</h3>
                    <p>{step.copy}</p>
                  </div>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
