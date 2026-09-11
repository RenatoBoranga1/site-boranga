import { BrandMark } from "@/components/BrandMark";
import Link from "next/link";
export function UnavailableExperience({ disabled = false }: { disabled?: boolean }) {
  return <main className="unavailable-experience">
    <BrandMark />
    <h1>{disabled ? "Esta experiência não está disponível." : "Não foi possível validar esta experiência."}</h1>
    <Link className="gold-button" href="/">Conhecer BORANGA <span aria-hidden="true">→</span></Link>
  </main>;
}
