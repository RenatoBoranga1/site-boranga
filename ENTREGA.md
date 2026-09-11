# Entrega — evolução BORANGA

## Atualização: experiências individuais por cliente

A nova etapa adiciona `/e/[token]`, registro exclusivo do servidor, abertura por cliente, catálogo de harmonizações, ritual individual, personalização da edição/certificado e geradores de token/QR. A página e os recursos anteriores foram preservados. O relatório completo, os arquivos e os resultados atuais estão em [ENTREGA-EXPERIENCIAS.md](ENTREGA-EXPERIENCIAS.md); o passo a passo operacional está no [README.md](README.md#experiência-personalizada-por-cliente).

Nenhum commit, push ou deploy foi realizado. As seções abaixo preservam o histórico da primeira evolução; a segunda está em [ENTREGA-MOTION.md](ENTREGA-MOTION.md).

## Histórico da primeira evolução

Implementação incremental na base existente. Nenhuma recriação do projeto ou publicação remota.

## Diagnóstico e decisões

- O parser anterior removia caracteres e truncava códigos; entradas diferentes podiam se transformar na mesma identificação. Agora rejeita formatos inválidos, duplicatas e garrafa maior que total.
- Página e gerador tinham regras duplicadas e divergentes (parseInt aceitava sufixos no CSV). Ambos usam a mesma validação TypeScript.
- Cada Reveal criava um observador e ocultava conteúdo sem JavaScript. Agora o HTML nasce visível, com observação central e entrada única.
- Header não acompanhava a rolagem e o menu não continha o foco. Agora há header fixo compacto, Escape, foco contido e fundo inerte.
- O fallback de compartilhamento podia falhar sem tratamento. Agora há estados de processamento, sucesso, cancelamento e falha, com mensagens acessíveis.
- O CSS monolítico foi dividido em seis arquivos; imagens, tipografia, SEO e conteúdo da marca foram preservados.

## Melhorias e componentes

Novos: MotionRuntime, TextReveal, ParallaxImage e YourEdition. Reveal, Header, BottleIdentity, DigitalCertificate e SectionHeading evoluídos.

Hero com imagem progressiva, logo revelado e CTA em sequência; imagens principais com parallax discreto; seção A sua edição; certificado com número destacado, lote, total, estado e contorno animado; interação sutil em botões, links e imagens. Reduced-motion desativa os movimentos.

O registro local fornece o token demonstrativo BRG-001-00037-X8Y2. Token desconhecido nunca utiliza os números da query como fallback. Query tradicional continua suportada e não recebe alegação de verificação por registro.

## Verificações executadas

| Verificação | Resultado |
| --- | --- |
| pnpm install --frozen-lockfile | Aprovado |
| pnpm lint | Aprovado, sem avisos |
| pnpm test | 55 testes aprovados |
| pnpm build | Aprovado, compilação e TypeScript |
| pnpm test:e2e | 4 cenários aprovados |
| Viewports | 360, 375, 390, 430, 768, 1024, 1440, 1920 — sem overflow horizontal |
| Navegador | Menu, Escape, compartilhamento, tokens, query, generic/invalid, reduced-motion e conteúdo sem JavaScript |
| Revisão visual | Capturas de hero e certificado em artifacts/ |

A revisão ocorreu em Chromium automatizado no Windows. Não foi feita medição em aparelhos físicos ou validação Safari/iOS; nenhum escore Lighthouse foi atribuído.

## Testar agora

Prévia local da build: http://localhost:3100/
- Token: http://localhost:3100/?token=BRG-001-00037-X8Y2
- Query antiga: http://localhost:3100/?lote=001&garrafa=037&total=250
- Inválido: http://localhost:3100/?lote=001&garrafa=250&total=50
- Token desconhecido: http://localhost:3100/?token=desconhecido

Para iniciar novamente em desenvolvimento, executar iniciar-site.cmd; ele usa a porta 3000. Node 24 e pnpm 11.19.0 estão documentados.

## Limites e publicação

O token desta fase é demonstrativo e público no código. A correspondência com o registro não comprova autenticidade física. A migração para registro privado, tokens imprevisíveis e revogação está documentada no README. Não há banco de dados, blockchain, login, ecommerce ou serviço de analytics.

O workflow de GitHub foi criado para push/pull_request, com cache pnpm, lint, testes, build e E2E. Ainda não foi executado pelo GitHub porque as alterações permanecem locais, sem commit/push/deploy.

## Arquivos alterados ou adicionados


- .github/workflows/ci.yml
- .gitignore
- AGENTS.md
- ENTREGA.md
- iniciar-site.cmd
- package.json
- playwright.config.ts
- pnpm-lock.yaml
- pnpm-workspace.yaml
- README.md
- scripts/generate-bottle-urls.mjs
- src/app/globals.css
- src/app/page.tsx
- src/components/Header.tsx
- src/components/MotionRuntime.tsx
- src/components/ui/ParallaxImage.tsx
- src/components/ui/Reveal.tsx
- src/components/ui/SectionHeading.tsx
- src/components/ui/TextReveal.tsx
- src/data/bottles.ts
- src/lib/analytics.ts
- src/lib/bottle-display.ts
- src/lib/bottle.ts
- src/lib/motion-config.ts
- src/sections/BottleIdentity.tsx
- src/sections/BrandStory.tsx
- src/sections/DigitalCertificate.tsx
- src/sections/Hero.tsx
- src/sections/JabuticabaSection.tsx
- src/sections/RitualSection.tsx
- src/sections/ServingGuide.tsx
- src/sections/YourEdition.tsx
- src/styles/base.css
- src/styles/components.css
- src/styles/motion.css
- src/styles/responsive.css
- src/styles/sections.css
- src/styles/tokens.css
- src/types/bottle.ts
- tests/bottle.test.ts
- tests/components.test.tsx
- tests/e2e/mobile.spec.ts
- tests/generator.test.ts
- tests/setup.ts
- vitest.config.mts
