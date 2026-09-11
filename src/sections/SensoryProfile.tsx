import { MaskReveal } from "@/components/motion/MaskReveal";
import { SectionTransition } from "@/components/motion/SectionTransition";
import { ParallaxImage } from "@/components/ui/ParallaxImage";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { siteConfig } from "@/lib/site-config";

const sensoryNotes = [
  { name: "Cor", value: "Vinho-rubi profundo", strength: "94%" },
  { name: "Aroma", value: "Frutado e intenso", strength: "86%" },
  { name: "Paladar", value: "Equilibrado, macio e envolvente", strength: "90%" },
  { name: "Finalização", value: "Persistente e elegante", strength: "82%" },
];

export function SensoryProfile() {
  const image = siteConfig.images.ambience;

  return (
    <section
      id="perfil"
      className="section sensory-section section-atmosphere"
      data-scroll-story="sensory"
      data-active-step="0"
    >
      <SectionTransition tone="wine" />
      <div className="page-shell">
        <Reveal>
          <SectionHeading
            eyebrow="Notas de degustação"
            title="Perfil sensorial"
            intro="Quatro dimensões que revelam a personalidade de BORANGA — da primeira luz no copo à memória que permanece."
            align="center"
          />
        </Reveal>

        <div className="sensory-story">
          <div className="sensory-story__visual">
            <MaskReveal className="sensory-story__frame">
              <ParallaxImage
                src={image.src}
                alt={image.alt}
                fill
                sizes="(max-width: 859px) calc(100vw - 40px), (max-width: 1320px) 48vw, 590px"
                className="sensory-story__image"
              />
              <span className="sensory-story__signature" aria-hidden="true">BORANGA</span>
            </MaskReveal>
          </div>

          <ol className="sensory-story__steps">
            {sensoryNotes.map((note, index) => (
              <li
                key={note.name}
                className="sensory-card sensory-story__step"
                data-story-step
                data-active={index === 0}
                aria-current={index === 0 ? "step" : undefined}
              >
                <Reveal className="sensory-story__note">
                  <span className="sensory-card__number" aria-hidden="true">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h3>{note.name}</h3>
                  <p>{note.value}</p>
                  <div className="sensory-meter" aria-hidden="true">
                    <i style={{ width: note.strength }} />
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
