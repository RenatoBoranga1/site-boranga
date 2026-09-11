import type { CSSProperties } from "react";
export function TextReveal({ lines }: { lines: string[] }) {
  return <span className="text-reveal">{lines.map((line, index) => (
    <span className="text-reveal__line" key={index}><span style={{ "--line-index": index } as CSSProperties}>{line}</span>{index < lines.length - 1 && " "}</span>
  ))}</span>;
}
