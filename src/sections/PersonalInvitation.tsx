import { BrandMark } from "@/components/BrandMark";
import { TextReveal } from "@/components/motion/TextReveal";

export function PersonalInvitation({ name, message, pairingName }: { name: string; message?: string; pairingName?: string }) {
  return <>
    <div className="invitation__brand"><BrandMark /></div>
    <p className="eyebrow invitation__eyebrow">Uma experiência reservada para você</p>
    <h2 id="invitation-name" className="invitation__name"><TextReveal lines={[name]} /></h2>
    <p className="invitation__quote">Há momentos que merecem ser lembrados.</p>
    <p className="invitation__message">{message ?? "Esta experiência BORANGA foi preparada especialmente para você."}</p>
    {pairingName && <p className="invitation__selection"><span>Experiência selecionada</span>{pairingName}</p>}
  </>;
}
