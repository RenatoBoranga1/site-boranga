export function SectionTransition({ tone = "wine" }: { tone?: "wine" | "gold" | "black" }) {
  return <div className="section-transition" data-atmosphere data-tone={tone} aria-hidden="true" />;
}
