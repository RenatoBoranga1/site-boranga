type BrandMarkProps = {
  compact?: boolean;
  inverse?: boolean;
};

export function BrandMark({ compact = false, inverse = false }: BrandMarkProps) {
  return (
    <span className="brand-mark" data-compact={compact || undefined}>
      <span className="brand-mark__seal" aria-hidden="true">
        B
      </span>
      <span className="brand-mark__wording">
        <span className={inverse ? "text-ivory" : "text-gold-gradient"}>
          BORANGA
        </span>
        {!compact && <small>Extra Luxo · Jabuticaba</small>}
      </span>
    </span>
  );
}
