"use client";
import { useEffect, useRef, useState } from "react";
import { BrandMark } from "@/components/BrandMark";
const links = [
  { label: "História", href: "#historia" }, { label: "Ritual", href: "#ritual" },
  { label: "Harmonização", href: "#harmonizacao" }, { label: "Sua garrafa", href: "#sua-garrafa" },
];
export function Header() {
  const [open, setOpen] = useState(false);
  const header = useRef<HTMLElement>(null);
  const toggle = useRef<HTMLButtonElement>(null);
  const logo = useRef<HTMLAnchorElement>(null);
  const menu = useRef<HTMLElement>(null);
  useEffect(() => {
    const scroll = () => { if (header.current) header.current.dataset.scrolled = String(window.scrollY > 48); };
    scroll();
    window.addEventListener("scroll", scroll, { passive: true });
    return () => window.removeEventListener("scroll", scroll);
  }, []);
  useEffect(() => {
    document.body.dataset.menuOpen = String(open);
    const main = document.querySelector("main");
    const footer = document.querySelector("footer");
    if (main) main.inert = open;
    if (footer) footer.inert = open;
    const desktop = matchMedia("(min-width: 860px)");
    const resize = () => {
      if (desktop.matches && open) {
        setOpen(false);
        requestAnimationFrame(() => logo.current?.focus());
      }
    };
    desktop.addEventListener("change", resize);
    // Move focus after the panel's open styles have reached the browser.
    const focusFrame = open ? requestAnimationFrame(() => {
      menu.current?.querySelector("a")?.focus({ preventScroll: true });
    }) : undefined;
    const keydown = (event: KeyboardEvent) => {
      if (!open) return;
      if (event.key === "Escape") { setOpen(false); toggle.current?.focus(); }
      if (event.key === "Tab") {
        const items = [toggle.current!, ...Array.from(menu.current!.querySelectorAll<HTMLAnchorElement>("a"))];
        const first = items[0], last = items[items.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
      }
    };
    document.addEventListener("keydown", keydown);
    return () => {
      if (focusFrame !== undefined) cancelAnimationFrame(focusFrame);
      delete document.body.dataset.menuOpen;
      if (main) main.inert = false;
      if (footer) footer.inert = false;
      desktop.removeEventListener("change", resize);
      document.removeEventListener("keydown", keydown);
    };
  }, [open]);
  return <header className="site-header" ref={header}>
    <a ref={logo} href="#topo" className="header-logo" aria-label="BORANGA — início" inert={open}><BrandMark compact /></a>
    <nav className="desktop-nav" aria-label="Navegação principal">
      {links.map((link) => <a key={link.href} href={link.href}>{link.label}</a>)}
    </nav>
    <button ref={toggle} type="button" className="menu-toggle" aria-label={open ? "Fechar menu" : "Abrir menu"}
      aria-expanded={open} aria-controls="mobile-menu" onClick={() => setOpen((value) => !value)}><span /><span /></button>
    <nav ref={menu} id="mobile-menu" className="mobile-nav" data-open={open || undefined} inert={!open}
      aria-hidden={!open} aria-label="Navegação mobile">
      {links.map((link, index) => <a style={{ transitionDelay: open ? `${100 + index * 65}ms` : "0ms" }} key={link.href} href={link.href}
        onClick={() => { setOpen(false); toggle.current?.focus(); }}>{link.label}</a>)}
      <p>Beba com moderação.</p>
    </nav>
  </header>;
}
