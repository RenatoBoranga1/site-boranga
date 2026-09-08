import Image from "next/image";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { siteConfig } from "@/lib/site-config";

const guidance = [
  { label: "Temperatura", value: "8 °C a 12 °C" },
  { label: "Copo", value: "Taça pequena ou copo baixo" },
  { label: "Serviço", value: "Puro, em pequenos goles" },
  { label: "Momento", value: "Após refeições" },
  { label: "Companhia", value: "Boas conversas e harmonizações" },
];

export function ServingGuide() {
  const image = siteConfig.images.rooftop;

  return (
    <section id="como-servir" className="section serving-section">
      <div className="page-shell serving-grid">
        <Reveal className="serving-copy">
          <SectionHeading
            eyebrow="Detalhes que importam"
            title="Como servir"
            intro="BORANGA pede apenas o essencial: a temperatura certa, o copo certo e tempo para perceber cada camada."
            tone="light"
          />
          <dl className="serving-list">
            {guidance.map((item) => (
              <div key={item.label}>
                <dt>{item.label}</dt>
                <dd>{item.value}</dd>
              </div>
            ))}
          </dl>
        </Reveal>
        <Reveal className="serving-image" delay={1}>
          <Image
            src={image.src}
            alt={image.alt}
            fill
            sizes="(max-width: 820px) 100vw, 48vw"
            className="serving-image__photo"
          />
          <span>Servir devagar é parte da experiência.</span>
        </Reveal>
      </div>
    </section>
  );
}
