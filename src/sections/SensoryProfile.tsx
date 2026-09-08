import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

const sensoryNotes = [
  { name: "Cor", value: "Vinho-rubi profundo", strength: "94%" },
  { name: "Aroma", value: "Frutado e intenso", strength: "86%" },
  { name: "Paladar", value: "Equilibrado, macio e envolvente", strength: "90%" },
  { name: "Finalização", value: "Persistente e elegante", strength: "82%" },
];

export function SensoryProfile() {
  return (
    <section id="perfil" className="section sensory-section">
      <div className="page-shell">
        <Reveal>
          <SectionHeading
            eyebrow="Notas de degustação"
            title="Perfil sensorial"
            intro="Quatro dimensões que revelam a personalidade de BORANGA — da primeira luz no copo à memória que permanece."
            align="center"
          />
        </Reveal>

        <div className="sensory-grid">
          {sensoryNotes.map((note, index) => (
            <Reveal key={note.name} className="sensory-card" delay={(index % 4) as 0 | 1 | 2 | 3}>
              <span className="sensory-card__number">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3>{note.name}</h3>
              <p>{note.value}</p>
              <div className="sensory-meter" aria-hidden="true">
                <i style={{ width: note.strength }} />
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
