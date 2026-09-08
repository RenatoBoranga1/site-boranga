import { Reveal } from "@/components/ui/Reveal";

const ingredients = ["Aguardente", "Jabuticaba", "Açúcar"];

export function Ingredients() {
  return (
    <section id="ingredientes" className="ingredients-section">
      <div className="page-shell ingredients-grid">
        <Reveal>
          <p className="eyebrow">Clareza em cada escolha</p>
          <h2>Ingredientes</h2>
        </Reveal>
        <Reveal className="ingredient-list" delay={1}>
          {ingredients.map((ingredient, index) => (
            <span key={ingredient}>
              <i>{String(index + 1).padStart(2, "0")}</i>
              {ingredient}
            </span>
          ))}
        </Reveal>
        <Reveal className="moderation" delay={2}>
          <span aria-hidden="true">B</span>
          <p>
            <strong>750 mL · 30% vol.</strong>
            Consuma com moderação.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
