import { Reveal, type RevealProps } from "./Reveal";
export function FadeUp(props: Omit<RevealProps, "preset">) {
  return <Reveal {...props} preset="fadeUp" />;
}
