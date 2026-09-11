import { Children, type CSSProperties, type ReactNode } from "react";
import { Reveal } from "./Reveal";
export function StaggerGroup({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <Reveal className={`stagger-group ${className}`} preset="fade">
    {Children.map(children, (child, index) => <div className="stagger-item" style={{ "--stagger-index": index } as CSSProperties}>{child}</div>)}
  </Reveal>;
}
