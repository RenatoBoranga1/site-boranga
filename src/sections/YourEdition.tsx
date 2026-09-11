import { Reveal } from "@/components/ui/Reveal";
import { TextReveal } from "@/components/ui/TextReveal";
import { getIdentityLabel } from "@/lib/bottle-display";
import type { BottleIdentityData } from "@/types/bottle";
import type { ExperiencePersonalization } from "@/types/experience";
export function YourEdition({ bottle, personalization }: { bottle: BottleIdentityData; personalization?: ExperiencePersonalization }) {
  return <section id="sua-edicao" className="section edition-section" aria-labelledby="edition-title">
    <Reveal className="page-shell edition-content">
      <p className="eyebrow">BORANGA · Edição Especial</p>
      <h2 id="edition-title"><TextReveal lines={["A sua edição"]} /></h2>
      {bottle.isPersonalized ? <div className="edition-number edition-number--personalized">
        <p className="edition-number__lot">Lote {bottle.lot}</p>
        <p className="edition-number__bottle"><span className="edition-number__label">Garrafa Nº</span>{" "}<TextReveal lines={[bottle.bottle ?? ""]} />{bottle.total && <small className="edition-number__total">de {bottle.total}</small>}</p>
      </div>
        : <p className="edition-number">{getIdentityLabel(bottle)}</p>}
      <p className="edition-note">{bottle.status === "invalid" ? "Não foi possível validar esta identificação." : "Cada garrafa integra uma produção limitada criada para momentos extraordinários."}</p>
      {personalization?.customerName && <p className="edition-recipient">Preparada para <strong>{personalization.customerName}</strong></p>}
      {personalization?.pairingName && <p className="edition-pairing"><span>Experiência selecionada</span>{personalization.pairingName}</p>}
      {personalization?.message && <p className="edition-message">“{personalization.message}”</p>}
      <a className="edition-link" href="#certificado">Explorar o certificado <span aria-hidden="true">↓</span></a>
    </Reveal>
  </section>;
}
