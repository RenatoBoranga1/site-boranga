import { MaskReveal } from "@/components/motion/MaskReveal";
import { SectionTransition } from "@/components/motion/SectionTransition";
import { ParallaxImage } from "@/components/ui/ParallaxImage";
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
    <section
      id="ritual"
      className="section ritual-section section-atmosphere"
      data-scroll-story="ritual"
      data-active-step="0"
    >
      <SectionTransition tone="gold" />
      <div className="page-shell ritual-grid">
        <MaskReveal className="ritual-visual">
          <ParallaxImage
            src={image.src}
            alt={image.alt}
            fill
            sizes="(max-width: 859px) calc(100vw - 40px), (max-width: 1320px) 44vw, 560px"
            className="ritual-visual__image"
          />
          <p className="ritual-quote">“O tempo também faz parte do sabor.”</p>
        </MaskReveal>

        <div className="ritual-content">
          <Reveal>
            <SectionHeading
              eyebrow="Um gesto de cada vez"
              title="O ritual BORANGA"
              intro="Uma pausa intencional transforma cada taça em uma experiência completa."
            />
          </Reveal>
          <ol className="ritual-steps ritual-story">
            {steps.map((step, index) => (
              <li
                key={step.title}
                data-story-step
                data-active={index === 0}
                aria-current={index === 0 ? "step" : undefined}
              >
                <Reveal>
                  <span className="ritual-story__number" aria-hidden="true">
                    {String(index + 1).padStart(2, "0")}
                  </span>
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
