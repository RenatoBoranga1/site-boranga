import { Reveal, type RevealProps } from "./Reveal";
export function MaskReveal({ className = "", children, ...props }: Omit<RevealProps, "preset">) {
  return <Reveal {...props} className={`mask-reveal ${className}`} preset="image">{children}<div className="mask-reveal__curtain" aria-hidden="true" /></Reveal>;
}
