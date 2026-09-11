import Image from "next/image";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { siteConfig } from "@/lib/site-config";
import { StaggerGroup } from "@/components/motion/StaggerGroup";

const experiences = [
  {
    title: "BORANGA puro",
    tag: "O essencial",
    description: "Sirva fresco e permita que o perfil frutado conduza a experiência.",
    image: siteConfig.images.ambience,
  },
  {
    title: "BORANGA & chocolate",
    tag: "A harmonização",
    description: "Um pequeno pedaço de chocolate amargo entre goles cria um contraste elegante.",
    image: siteConfig.images.essence,
  },
  {
    title: "BORANGA Signature",
    tag: "O drink",
    description: "BORANGA, uma pedra grande de gelo e uma fina casca de laranja para perfumar.",
    image: siteConfig.images.celebration,
  },
];

export function ExperienceCards() {
  return (
    <section id="experiencias" className="section experiences-section">
      <div className="page-shell">
        <Reveal>
          <SectionHeading
            eyebrow="Três formas de descobrir"
            title="Experiências BORANGA"
            intro="Do serviço puro a uma assinatura contemporânea, escolha o ritual que combina com o seu momento."
          />
        </Reveal>
        <StaggerGroup className="experience-grid">
          {experiences.map((experience, index) => (
            <article key={experience.title} className="experience-card">
              <div className="experience-card__image">
                <Image
                  src={experience.image.src}
                  alt={experience.image.alt}
                  fill
                  sizes="(max-width: 760px) 100vw, 33vw"
                  className="experience-card__photo"
                />
                <span>{experience.tag}</span>
              </div>
              <div className="experience-card__content">
                <p>{String(index + 1).padStart(2, "0")}</p>
                <h3>{experience.title}</h3>
                <div>{experience.description}</div>
              </div>
            </article>
          ))}
        </StaggerGroup>
      </div>
    </section>
  );
}
