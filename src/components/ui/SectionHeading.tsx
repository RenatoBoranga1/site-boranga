import { TextReveal } from "./TextReveal";
type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  intro?: string;
  align?: "left" | "center";
  tone?: "dark" | "light";
};

export function SectionHeading({
  eyebrow,
  title,
  intro,
  align = "left",
  tone = "dark",
}: SectionHeadingProps) {
  return (
    <div
      className="section-heading"
      data-align={align}
      data-tone={tone}
    >
      <p className="eyebrow">{eyebrow}</p>
      <h2><TextReveal lines={title === "A essência da jabuticaba" ? ["A essência da", "jabuticaba"] : [title]} /></h2>
      {intro && <p className="section-intro">{intro}</p>}
    </div>
  );
}
