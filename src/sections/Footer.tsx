import { BrandMark } from "@/components/BrandMark";
import { Reveal } from "@/components/ui/Reveal";
import { TextReveal } from "@/components/ui/TextReveal";

const links = [
  { label: "História", href: "#historia" },
  { label: "Ritual", href: "#ritual" },
  { label: "Harmonização", href: "#harmonizacao" },
  { label: "Sua Garrafa", href: "#sua-garrafa" },
  { label: "Contato", href: "#contato" },
];

export function Footer() {
  return (
    <footer id="contato" className="footer">
      <div className="page-shell">
        <Reveal className="footer__closing">
          <div className="footer__brand"><BrandMark /></div>
          <span className="footer__divider" aria-hidden="true" />
          <p className="footer__slogan"><TextReveal lines={["Mais que um licor.", "Uma experiência."]} /></p>
        </Reveal>
      </div>
      <div className="page-shell footer__top">
        <nav aria-label="Navegação do rodapé">
          {links.map((link) => (
            <a key={link.href} href={link.href}>
              {link.label}
            </a>
          ))}
        </nav>
      </div>
      <div className="page-shell footer__bottom">
        <p>Licor Extra Luxo de Jabuticaba · 750 mL · 30% vol.</p>
        <p>Beba com moderação.</p>
      </div>
    </footer>
  );
}
