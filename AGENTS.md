<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Convenções BORANGA
- Preserve a renderização no servidor das seções; mantenha JS de interação em Header, MotionRuntime e DigitalCertificate.
- Identidade: token tem prioridade; token desconhecido nunca recorre à query. Não remova a distinção entre validação de formato e registro demonstrativo.
- Não importe o registro completo de garrafas em componentes client. Use bottle-display para texto e compartilhamento.
- Códigos inválidos são rejeitados, nunca corrigidos/truncados em outro código.
- Reveals precisam permanecer visíveis sem JS. Respeite reduced-motion também após alteração da preferência.
- CSS modular em src/styles; timings visuais e easing centralizados em tokens.css, parâmetros de interação em src/lib/motion/motion-config.ts.
- Use os componentes reutilizáveis em src/components/motion e os presets em src/lib/motion/motion-presets.ts. O runtime de scroll fica em src/lib/motion/scroll-runtime.ts; evite observadores ou loops por componente.
- Antes de entregar: pnpm lint, pnpm test, pnpm build; alterações visuais/interativas também pnpm test:e2e.
- Use Node 24 e pnpm 11.19.0. O gerador mjs roda via tsx para compartilhar as regras TypeScript.

## Experiências individuais
- Preserve `server-only` em data/experiences, lib/experience e ExperiencePage. Dados pessoais completos nunca entram no grafo de imports client.
- O gate do convite é uma ilha client; conteúdo da página e harmonização continuam no servidor. Nome apenas em convite, seção individual, edição e certificado.
- Nova seleção usa os tipos em types/experience e types/pairing. Scripts geram configuração e QR; nunca alteram automaticamente o cadastro.
- Toda rota individual é dinâmica, noindex/nofollow, fora do sitemap e compartilha texto neutro. Token presente inválido ou disabled nunca usa query como fallback.
- Analytics de experiência deve passar por sanitizeExperienceEvent e não receber nome, mensagem, token bruto ou URL.
