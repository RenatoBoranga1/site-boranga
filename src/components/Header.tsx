"use client";

import { useEffect, useState } from "react";
import { BrandMark } from "@/components/BrandMark";

const links = [
  { label: "História", href: "#historia" },
  { label: "Ritual", href: "#ritual" },
  { label: "Harmonização", href: "#harmonizacao" },
  { label: "Sua garrafa", href: "#sua-garrafa" },
];

export function Header() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.dataset.menuOpen = open ? "true" : "false";
    return () => {
      delete document.body.dataset.menuOpen;
    };
  }, [open]);

  return (
    <header className="site-header">
      <a href="#topo" className="header-logo" aria-label="BORANGA — início">
        <BrandMark compact />
      </a>

      <nav className="desktop-nav" aria-label="Navegação principal">
        {links.map((link) => (
          <a key={link.href} href={link.href}>
            {link.label}
          </a>
        ))}
      </nav>

      <button
        type="button"
        className="menu-toggle"
        aria-label={open ? "Fechar menu" : "Abrir menu"}
        aria-expanded={open}
        aria-controls="mobile-menu"
        onClick={() => setOpen((value) => !value)}
      >
        <span />
        <span />
      </button>

      <nav
        id="mobile-menu"
        className="mobile-nav"
        data-open={open || undefined}
        aria-label="Navegação mobile"
      >
        {links.map((link) => (
          <a key={link.href} href={link.href} onClick={() => setOpen(false)}>
            {link.label}
          </a>
        ))}
        <p>Beba com moderação.</p>
      </nav>
    </header>
  );
}
