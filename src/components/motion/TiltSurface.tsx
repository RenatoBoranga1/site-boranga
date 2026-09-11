import type { ReactNode } from "react";
export function TiltSurface({ children }: { children: ReactNode }) {
  return <div className="tilt-container" data-tilt><div className="tilt-surface">{children}</div></div>;
}
