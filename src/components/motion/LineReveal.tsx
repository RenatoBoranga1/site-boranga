export function LineReveal({ className = "" }: { className?: string }) {
  return <span className={`reveal line-reveal light-sweep ${className}`} aria-hidden="true" />;
}
