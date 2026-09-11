# Entrega — segunda evolução de motion BORANGA

Refinamento incremental da experiência existente em Next.js, React, TypeScript e Tailwind. Esta etapa organiza o motion, acrescenta narrativa durante a rolagem e refina os momentos de abertura, edição, certificado e encerramento. A identidade visual, as fotografias locais, o conteúdo e as regras de identificação foram preservados.

O relatório [ENTREGA.md](ENTREGA.md) registra a primeira evolução. A criação do parser, registro demonstrativo de tokens, gerador CSV, CI e infraestrutura original de testes pertence àquela entrega; não integra a lista de novidades desta etapa.

## Sistema reutilizável

| Componente em `src/components/motion/` | Responsabilidade |
| --- | --- |
| `Reveal.tsx` | Entrada progressiva com preset e índice de atraso |
| `FadeUp.tsx` | Atalho para a entrada vertical padrão |
| `TextReveal.tsx` | Máscara por linha para títulos, slogans e números |
| `LineReveal.tsx` | Divisor dourado com crescimento a partir do centro |
| `StaggerGroup.tsx` | Entrada em sequência para grupos selecionados |
| `ParallaxImage.tsx` | Camada de imagem com `next/image`, controlada pelo runtime |
| `MaskReveal.tsx` | Cortina editorial e aproximação inicial discreta da imagem |
| `SectionTransition.tsx` | Camada de atmosfera vinho, dourada ou preta |
| `TiltSurface.tsx` | Superfície para profundidade sutil com mouse |

`Reveal`, `TextReveal` e `ParallaxImage` foram consolidados nessa pasta; os imports anteriores de `components/ui/` continuam disponíveis como reexports. Não há duas implementações paralelas. `MotionRuntime` conecta a página ao runtime compartilhado, preservando o HTML das seções no servidor.

`src/lib/motion/motion-config.ts` reúne parâmetros de observação, amplitudes, mouse, preferência de movimento e duração do feedback de compartilhamento. `motion-presets.ts` concentra os presets `fadeUp`, `fade` e `image`. `scroll-runtime.ts` coordena os observadores, etapas, parallax, atmosfera, progresso e tilt. O caminho anterior `src/lib/motion-config.ts` é mantido por compatibilidade. O easing visual é definido uma vez em `src/styles/tokens.css`.

## Animações e narrativa

| Momento | Comportamento implementado |
| --- | --- |
| Abertura | Imagem em 1800 ms, com escala 1.04 → 1; monograma, marca, título, slogan, texto, CTA e indicação de scroll em sequência |
| Profundidade do hero | Imagem até ±6 px, texto sobe até 18 px e uma camada escura acompanha o primeiro scroll |
| História e imagens selecionadas | Cortina editorial, escala 1.02 → 1 e reveal de títulos por linhas |
| Atmosfera | Gradientes discretos de vinho/dourado/preto, com deslocamento e variação de opacidade da camada |
| Perfil sensorial | Imagem sticky no desktop e destaque sequencial de Cor, Aroma, Paladar e Finalização |
| Ritual | Sirva, Observe, Sinta e Deguste acompanham a rolagem, com um fio dourado de progresso e destaque da etapa atual |
| Harmonizações e experiências | Aproximação de imagem até 1.025 no hover desktop, mudança sutil de overlay/borda e título sobe 4 px |
| A sua edição | Número original centralizado e ampliado, revelado por máscara; zeros preservados e sem contador |
| Certificado | Borda, monograma, título, lote, número, selo e botão em sequência de aproximadamente 1,36 s |
| Encerramento | Monograma, BORANGA, divisor dourado e slogan, sobre fundo que termina em preto; links e informações do produto mantidos |

As revelações comuns usam 800 ms; imagens, 1100 ms; microinterações, 220 ms. O easing principal é `cubic-bezier(0.22, 1, 0.36, 1)`. O hero usa intervalos de 150 ms; o certificado usa etapas de 550 ms com intervalos de 135 ms. Os reflexos dourados são acionados uma vez ao entrar na viewport.

O parallax das outras imagens é limitado a ±14 px. A profundidade com mouse é limitada a 1,5° por eixo e só é habilitada com ponteiro fino, hover e viewport a partir de 860 px. O scroll permanece nativo; a narrativa seleciona a etapa mais próxima do centro de leitura e responde nos dois sentidos da rolagem, sem trocar o conteúdo por painéis ocultos.

## Interação e acessibilidade

O header preserva sua redução ao rolar e acrescenta redução suave da marca. O menu mobile usa painel escuro, blur, transformação do botão em X e links em sequência de 65 ms. Mantém Escape, contenção de foco, fundo inerte e retorno de foco ao fechar ou passar para desktop. Os links do menu desktop recebem sublinhado dourado; os botões mantêm alvo de toque e feedback ao pressionar.

O compartilhamento mantém Web Share API e fallback de clipboard. O botão mostra **Preparando…**, impede pedidos repetidos e confirma com **Link copiado** ou **Experiência pronta para compartilhar**, mais um check dourado. O rótulo inicial retorna após 4 segundos. Há anúncio por `role="status"`, `aria-busy`, tratamento de cancelamento, orientação de erro e limpeza do timer ao sair do componente. No fallback de cópia antigo, o campo temporário é removido e o foco é restaurado.

Somente o token válido encontrado no registro demonstrativo recebe **Identificação verificada**. Query tradicional continua mostrando **Identificação da edição**. Token inválido ou desconhecido não usa os números da query como alternativa. O registro público demonstrativo continua sem comprovar autenticidade física; os limites e a evolução para registro privado permanecem documentados no README.

## Mobile, reduced-motion e ausência de JavaScript

No mobile, o perfil sensorial usa fluxo normal, o ritual permanece legível e não há tilt. O número, certificado e botão foram dimensionados para telas estreitas; o conteúdo dos cards independe de hover. A rolagem continua disponível durante a leitura das etapas.

Com `prefers-reduced-motion`, são desativados parallax, tilt, zoom, light sweep, máscaras em movimento e transições. A imagem sensorial deixa de ser sticky. O conteúdo permanece visível e o destaque sem deslocamento continua indicando a etapa atual. Alterar a preferência durante a visita também limpa as transformações ativas.

Sem JavaScript, o HTML inclui títulos, textos, números, certificado e as quatro etapas de cada narrativa. Os reveals só ocultam elementos após a inicialização do runtime, com observador disponível e movimento permitido. Menu e compartilhamento continuam sendo interações dependentes de JavaScript.

## Performance e dependências

Nenhuma biblioteca ou dependência foi adicionada nesta segunda etapa. A implementação usa CSS, `IntersectionObserver`, `requestAnimationFrame`, media queries e APIs do navegador.

As seções continuam renderizadas no servidor. O runtime compartilha uma fila de atualização acionada por scroll, resize ou mouse, sem loop permanente. As medições de geometria são agrupadas antes das alterações de estilo, e as camadas de scroll só são atualizadas quando próximas à viewport. Observadores, listeners e frames são limpos na desmontagem.

As imagens continuam locais e usam `next/image`, `sizes`, hero prioritário e carregamento lazy nas demais seções. Gradientes são camadas estáticas cuja opacidade e transform mudam; não há filtro pesado animado continuamente, vídeo, WebGL ou biblioteca de scroll.

## Validação desta etapa

Validação concluída em 11 de setembro de 2026, usando a build de produção local.

| Verificação | Resultado final |
| --- | --- |
| `pnpm lint` | Aprovado, sem erros |
| `pnpm test` | 64 testes aprovados em 4 arquivos |
| `pnpm build` | Aprovado, incluindo compilação e TypeScript |
| `pnpm test:e2e` | 10 testes aprovados em Chromium |
| Revisão visual e viewports | Sem overflow em 360, 375, 390, 430, 768, 1024, 1440 e 1920 px; hero, narrativas, certificado e footer revisados; sem erros de página |
| Emulação de desempenho mobile | Fluxo de menu e certificado aprovado com CPU 4× mais lenta, em 390 px |

Os testes de componente acrescentam preparação, bloqueio de solicitações repetidas, sucesso, retorno do rótulo em 4 segundos, cleanup de timers, cancelamento e fallbacks de compartilhamento. Também verificam o número exato da edição, estados inválidos, conteúdo do footer e HTML anterior à inicialização do motion.

A suíte E2E de motion cobre as narrativas sensorial/ritual em 390 e 1440 px, scroll nos dois sentidos, foco do menu, mudança para desktop, limites de tilt, toque, reduced-motion alterado durante a visita e leitura sem JavaScript. A suíte existente conserva a cobertura de identidade e larguras responsivas.

As verificações disponíveis são em Chromium no Windows, incluindo emulação de viewport, toque e preferências. Não houve acesso a aparelho físico intermediário. Não se atribui resultado de Safari/iOS, teste em hardware real ou pontuação Lighthouse.

## Arquivos desta segunda etapa

Os caminhos abaixo correspondem ao refinamento de motion. Arquivos de identidade, scripts, dependências e CI modificados na primeira entrega não são apresentados como alterações desta etapa.

### Adicionados

- `src/components/motion/FadeUp.tsx`
- `src/components/motion/LineReveal.tsx`
- `src/components/motion/MaskReveal.tsx`
- `src/components/motion/ParallaxImage.tsx`
- `src/components/motion/Reveal.tsx`
- `src/components/motion/SectionTransition.tsx`
- `src/components/motion/StaggerGroup.tsx`
- `src/components/motion/TextReveal.tsx`
- `src/components/motion/TiltSurface.tsx`
- `src/lib/motion/motion-config.ts`
- `src/lib/motion/motion-presets.ts`
- `src/lib/motion/scroll-runtime.ts`
- `src/styles/storytelling.css`
- `src/styles/ceremony.css`
- `tests/ceremony.test.tsx`
- `tests/e2e/motion.spec.ts`
- `ENTREGA-MOTION.md`

### Atualizados

- `src/app/globals.css`
- `src/components/BrandMark.tsx`
- `src/components/Header.tsx`
- `src/components/MotionRuntime.tsx`
- `src/components/ui/ParallaxImage.tsx`
- `src/components/ui/Reveal.tsx`
- `src/components/ui/TextReveal.tsx`
- `src/lib/motion-config.ts`
- `src/sections/BottleIdentity.tsx`
- `src/sections/BrandStory.tsx`
- `src/sections/DigitalCertificate.tsx`
- `src/sections/ExperienceCards.tsx`
- `src/sections/Footer.tsx`
- `src/sections/GiftSection.tsx`
- `src/sections/Hero.tsx`
- `src/sections/JabuticabaSection.tsx`
- `src/sections/PairingSection.tsx`
- `src/sections/RitualSection.tsx`
- `src/sections/SensoryProfile.tsx`
- `src/sections/ServingGuide.tsx`
- `src/sections/YourEdition.tsx`
- `src/styles/motion.css`
- `src/styles/sections.css`
- `src/styles/tokens.css`
- `tests/components.test.tsx`
- `README.md`
- `AGENTS.md`

## Executar e conferir

Use Node 24 e pnpm 11.19.0. No Windows, `iniciar-site.cmd` inicia o desenvolvimento em [http://localhost:3000](http://localhost:3000). Pelo terminal:

```bash
pnpm dev
```

Para a validação completa:

```bash
pnpm lint
pnpm test
pnpm build
pnpm exec playwright install chromium
pnpm test:e2e
```

A suíte E2E usa a build de produção na porta 3100. Os comandos e exemplos de token/query continuam no [README.md](README.md). Mantenha o servidor em execução enquanto usar a prévia local.
