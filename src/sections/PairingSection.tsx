import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

const pairings = [
  { title: "Chocolate amargo", note: "Intensidade que encontra intensidade", glyph: "◆" },
  { title: "Queijos", note: "Contrastes cremosos e persistentes", glyph: "◒" },
  { title: "Frutas", note: "Camadas frescas e perfumadas", glyph: "●" },
  { title: "Sobremesas", note: "Uma finalização envolvente", glyph: "✦" },
  { title: "Após refeições", note: "O encerramento no ritmo certo", glyph: "◇" },
  { title: "Ocasiões especiais", note: "Brindes que merecem memória", glyph: "✧" },
];

export function PairingSection() {
  return (
    <section id="harmonizacao" className="section pairing-section">
      <div className="pairing-wine" aria-hidden="true" />
      <div className="page-shell">
        <Reveal>
          <SectionHeading
            eyebrow="Encontros de sabor"
            title="Harmonize com BORANGA"
            intro="Escolhas simples, capazes de revelar novas nuances a cada gole."
            align="center"
          />
        </Reveal>
        <div className="pairing-grid">
          {pairings.map((pairing, index) => (
            <Reveal key={pairing.title} className="pairing-card" delay={(index % 3) as 0 | 1 | 2}>
              <span aria-hidden="true">{pairing.glyph}</span>
              <h3>{pairing.title}</h3>
              <p>{pairing.note}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
