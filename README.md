# BORANGA — Landing page premium

Experiência digital mobile-first para o **Licor Extra Luxo de Jabuticaba BORANGA**, pensada para acesso por QR Code no rótulo da garrafa.

## O que está incluído

- Landing page responsiva em Next.js 16, React 19, TypeScript e Tailwind CSS 4.
- Imagens locais otimizadas em WebP, centralizadas em `src/lib/site-config.ts`.
- Hero, história, essência da jabuticaba, perfil sensorial, ritual, harmonizações, serviço, experiências, ingredientes e presente.
- Identificação sanitizada de lote, garrafa e total por query string.
- Certificado digital com Web Share API e fallback para copiar o link.
- SEO básico com metadata, Open Graph, Twitter Card, sitemap e robots.
- Sistema de motion reutilizável, narrativa de scroll no perfil sensorial e no ritual, com respeito a `prefers-reduced-motion`.
- Script para gerar URLs individuais e um CSV pronto para produção de QR Codes.

## Requisitos

- Node.js 24 ou superior (tooling de testes e pnpm).
- pnpm 11.19.0 (fixado em package.json).

## Rodar localmente

No Windows, a forma mais simples é executar `iniciar-site.cmd`. Ele localiza automaticamente o runtime disponível e inicia o servidor.

Também é possível iniciar pelo terminal:

```bash
pnpm install
pnpm dev
```

Acesse [http://localhost:3000](http://localhost:3000).

Para testar uma garrafa identificada:

```text
http://localhost:3000/?lote=001&garrafa=037&total=250
```

## Identidade dinâmica da garrafa

Os parâmetros aceitos são:

- `lote`: letras, números e hífen; até 12 caracteres.
- `garrafa`: somente números positivos; até 7 dígitos.
- `total`: somente números positivos; até 7 dígitos.

Exemplo de URL de produção:

```text
https://seu-dominio.com/?lote=001&garrafa=037&total=250
```

Sem parâmetros de identificação, a interface mostra **Edição Especial BORANGA**. Parâmetros presentes e inválidos mostram **Identificação não validada.** A leitura e a sanitização ficam em `src/lib/bottle.ts`. O mesmo arquivo exporta `buildBottleUrl`, função utilitária para montar URLs individuais.

## Gerar CSV para QR Codes

O gerador cria uma linha por garrafa com as colunas `garrafa`, `lote`, `url` e `conteudo_qr`:

```bash
pnpm generate:urls -- --lot=001 --total=250 --baseUrl=https://seu-dominio.com/
```

Saída padrão:

```text
public/examples/boranga-lote-001.csv
```

Também é possível definir o arquivo:

```bash
pnpm generate:urls -- --lot=002 --total=100 --baseUrl=https://seu-dominio.com/ --output=./lote-002.csv
```

O valor de `url`/`conteudo_qr` é o conteúdo que deve ser convertido em QR Code por uma ferramenta de impressão ou geração de etiquetas.

## Imagens

Todos os caminhos usados pela interface estão em `src/lib/site-config.ts`. Para substituir uma foto oficial, mantenha o nome/caminho ou atualize somente essa configuração. As imagens não dependem de servidores remotos.

## Verificações

```bash
pnpm lint
pnpm build
```

## Deploy na Vercel

1. Importe este diretório como um novo projeto na Vercel.
2. Use `site-boranga` como raiz do projeto; na Vercel, mantenha **Root Directory** como `.`.
3. Mantenha o framework detectado como **Next.js**.
4. Configure `NEXT_PUBLIC_SITE_URL` com a URL pública final, sem barra no fim. Exemplo: `https://seu-dominio.com`.
5. Faça o deploy e aponte o domínio escolhido para o projeto.
6. Gere o CSV novamente usando a URL final antes de produzir os QR Codes.

Também é possível publicar pelo terminal:

```bash
pnpm dlx vercel
pnpm dlx vercel --prod
```

## Estrutura principal

```text
src/
├── app/                 # Página, metadata, estilos, robots e sitemap
├── components/          # Header, marca e elementos reutilizáveis
│   └── motion/          # Reveal, máscaras, parallax, divisores e tilt
├── sections/            # Seções da experiência BORANGA
├── lib/                 # Configuração, sanitização e URLs
│   └── motion/          # Configuração, presets e runtime compartilhado
├── styles/              # Tokens, layout, motion, storytelling e cerimônia
└── types/               # Tipos da identidade da garrafa
public/
├── images/              # Fotografias locais otimizadas
└── examples/            # CSV de exemplo
scripts/
└── generate-bottle-urls.mjs
```

## Conteúdo responsável

O site exibe `750 mL`, `30% vol.` e a mensagem **Beba com moderação**. Não inclui alegações nutricionais, premiações, certificações ou detalhes de origem/processo que não tenham sido fornecidos.

## Evolução da experiência

O projeto mantém Next.js, React, TypeScript, Tailwind, as fotografias locais, fontes e seções originais. A nova seção **A sua edição** fica entre a identidade e o certificado.

### Identidade e tokens

A prioridade é **token → query tradicional → edição genérica**. Um token presente, mas vazio, duplicado ou desconhecido resulta em identificação inválida; não há fallback para dados de query nesse caso.

- Token demonstrativo: [garrafa 037](http://localhost:3000/?token=BRG-001-00037-X8Y2).
- Query compatível: [lote 001, garrafa 037 de 250](http://localhost:3000/?lote=001&garrafa=037&total=250).
- Inválida: [garrafa maior que total](http://localhost:3000/?lote=001&garrafa=250&total=50).
- Token desconhecido: [identificação não validada](http://localhost:3000/?token=desconhecido).
- Genérica: [Edição Especial BORANGA](http://localhost:3000/).

Estados internos: `valid`, `generic`, `invalid`. A fonte também é explícita: `token`, `query`, `none`.

Lotes têm de 1 a 12 caracteres, começam com letra/número e aceitam letras ASCII, números e hífens. Espaços externos são removidos e letras normalizadas para maiúsculas. Números possuem até 7 dígitos, preservam zeros à esquerda e precisam ser positivos. Valores duplicados, sinais, decimais, caracteres removíveis e códigos longos são rejeitados; nunca são truncados ou transformados em outra identidade. Garrafa não pode exceder total. Links antigos com lote e garrafa, sem total, continuam aceitos; um total fornecido precisa ser válido.

O registro demonstrativo fica em `src/data/bottles.ts`, acessado por `getBottleByToken` no fluxo de renderização do servidor. O certificado recebe apenas a identidade resolvida; o registro completo não é importado pelo código de compartilhamento.

**Limite desta fase:** “Identificação verificada” significa correspondência com esse registro local demonstrativo. Tokens publicados neste repositório não são segredos, podem ser copiados e não comprovam a autenticidade física de uma garrafa. Antes de emitir QR Codes reais, substituir o registro por um repositório privado no servidor, usar tokens aleatórios de alta entropia e prever revogação. Query tradicional mostra “Identificação da edição” e não recebe alegação de verificação.

### Movimento e acessibilidade

A segunda evolução está detalhada em [ENTREGA-MOTION.md](ENTREGA-MOTION.md). O histórico da primeira entrega permanece em [ENTREGA.md](ENTREGA.md).

Os componentes de apresentação ficam em `src/components/motion/`: `Reveal`, `FadeUp`, `TextReveal`, `LineReveal`, `StaggerGroup`, `ParallaxImage`, `MaskReveal`, `SectionTransition` e `TiltSurface`. Eles geram HTML e mantêm a interação concentrada em `MotionRuntime`, `Header` e `DigitalCertificate`. Os caminhos antigos de `Reveal`, `TextReveal` e `ParallaxImage` em `components/ui/` continuam como reexports de compatibilidade.

`src/lib/motion/motion-config.ts` reúne parâmetros de observação, amplitudes, preferência de movimento, ponteiro e feedback. `motion-presets.ts` fornece os presets de entrada; `scroll-runtime.ts` coordena os observadores e uma fila compartilhada de `requestAnimationFrame`, acionada por eventos. `src/lib/motion-config.ts` mantém o import antigo funcionando. O easing e as durações visuais ficam em `src/styles/tokens.css`.

| Movimento | Configuração |
| --- | --- |
| Easing principal | `cubic-bezier(0.22, 1, 0.36, 1)` |
| Microinteração / base / imagem | 220 ms / 700 ms / 1100 ms |
| Reveal de conteúdo | 800 ms |
| Imagem do hero | 1800 ms; escala de 1.04 para 1 |
| Sequência do hero | Intervalos de 150 ms |
| Parallax | Até ±14 px; imagem do hero até ±6 px |
| Texto do hero no primeiro scroll | Deslocamento vertical de até 18 px |
| Tilt de garrafa | Até 1,5° por eixo, com mouse e viewport a partir de 860 px |
| Certificado | Etapas de 550 ms, com intervalo de 135 ms; cerca de 1,36 s no conjunto |
| Confirmação de compartilhamento | Retorno ao estado inicial após 4 s |

O hero apresenta imagem, monograma, marca, título, slogan e CTA em sequência, com escurecimento discreto durante o primeiro scroll. Máscaras editoriais revelam imagens selecionadas; títulos e o número da edição usam máscaras por linha. Divisores dourados crescem a partir do centro e reflexos metálicos passam uma vez pelos elementos selecionados.

No perfil sensorial, a imagem permanece sticky no desktop enquanto Cor, Aroma, Paladar e Finalização recebem destaque conforme a rolagem. O ritual segue Sirva, Observe, Sinta e Deguste, com um fio dourado de progresso. As etapas continuam no documento e na ordem de leitura; a atual recebe `aria-current="step"`. No mobile, a imagem sensorial acompanha o fluxo normal e o tilt fica desativado.

O certificado revela borda, monograma, título, lote, número, selo e compartilhamento. A seção **A sua edição** destaca o número original, sem contador. O encerramento reúne monograma, BORANGA, slogan e divisor, mantendo os links, informações do produto e consumo responsável.

O header preserva o comportamento transparente no topo e compacto ao rolar, com redução suave da marca. O menu mobile combina painel escuro, blur e links em sequência de 65 ms, mantendo Escape, foco contido, fundo inerte e retorno do foco ao fechar ou mudar para desktop. CTAs têm resposta ao toque; cards e links mantêm seu conteúdo acessível sem hover.

`prefers-reduced-motion` desativa parallax, tilt, zoom, light sweep, máscaras em movimento e transições, inclusive ao alterar a preferência com a página aberta. A imagem sensorial perde o sticky e as etapas continuam legíveis, com indicação da etapa atual. Sem JavaScript, o HTML contém todas as seções e números; os reveals não ocultam o conteúdo. As interações de menu e compartilhamento dependem de JavaScript.

As imagens usam `next/image`, com hero prioritário e demais imagens lazy. As atualizações de scroll medem os elementos próximos à viewport antes de aplicar transforms e opacidade; não há loop permanente ou interceptação da rolagem nativa. Nenhuma biblioteca de animação foi adicionada.

### CSS e design

`src/app/globals.css` importa, em ordem, `tokens.css`, `base.css`, `components.css`, `sections.css`, `responsive.css`, `motion.css`, `storytelling.css` e `ceremony.css` em `src/styles`. O motion compartilhado fica em `motion.css`; as seções sensorial e ritual em `storytelling.css`; edição, certificado e encerramento em `ceremony.css`. Cores, fontes, ritmo, sombra e easing têm tokens. A paleta preta, dourada, vinho e os contrastes marfim existentes foram preservados.

### Compartilhamento e medição

Web Share API com fallback de clipboard e tratamento de cancelamento/erro. O link compartilhado contém apenas a identidade resolvida, sem parâmetros conflitantes, rastreamento ou âncoras. Uma identificação inválida compartilha a página genérica.

O botão passa de **Compartilhar minha garrafa** para **Preparando…** e confirma com **Link copiado** ou **Experiência pronta para compartilhar**, acompanhado de check dourado. Após 4 segundos, retorna ao rótulo inicial. Durante a preparação, impede solicitações repetidas e informa `aria-busy`; o resultado também é anunciado por `role="status"`. Cancelar a interface nativa não copia o link. Uma falha nativa permite tentar o clipboard; indisponibilidade de cópia mantém uma orientação acessível para copiar o endereço manualmente. A edição genérica mantém o rótulo **Compartilhar BORANGA**.

`trackEvent(name, payload)` em `src/lib/analytics.ts` é um no-op tipado. Pontos preparados: entrada por identificação (`qr_scan`, inferida pela URL, não comprovação de leitura pela câmera), compartilhamento concluído, primeira visita a seção e clique em presente. Não coleta dados, não grava cookies e não envia tokens.

### Verificações automatizadas

```bash
pnpm lint
pnpm test
pnpm build
pnpm exec playwright install chromium
pnpm test:e2e
```

Vitest cobre sanitização, estados, prioridade de token, URLs, gerador CSV, componentes e compartilhamento, incluindo preparação, cancelamento, fallbacks, retorno temporizado e limpeza de timers. Playwright cobre navegação mobile, foco/Escape, compartilhamento, estados, reduced-motion, conteúdo sem JavaScript e ausência de overflow nas larguras 360, 375, 390, 430, 768, 1024, 1440 e 1920. A suíte de motion acrescenta as etapas sensorial/ritual nos dois sentidos do scroll, retorno do foco ao mudar de breakpoint, tilt limitado, tela de toque e alteração de reduced-motion durante a visita. As capturas de revisão são salvas em `artifacts/` (ignorado pelo Git).

As verificações usam Chromium no Windows, com emulação de viewport, toque e preferências. Não substituem teste em aparelho físico intermediário; Safari/iOS e desempenho em hardware real ainda precisam dessa revisão. Os resultados consolidados da segunda evolução são registrados em [ENTREGA-MOTION.md](ENTREGA-MOTION.md).

O E2E inicia a build de produção na porta **3100**. Execute `pnpm build` antes. O workflow `.github/workflows/ci.yml` roda install com lockfile congelado, lint, testes, build e E2E em push/pull_request, com cache pnpm e artefatos de falha. O workflow passará a executar no GitHub quando estas alterações forem enviadas ao repositório.

O gerador CSV usa a mesma validação da página, elimina tokens antigos da URL base, escapa os campos CSV e grava linha a linha. Continua produzindo links tradicionais; não emite tokens de autenticidade.

## Experiência personalizada por cliente

A rota `/e/[token]` reutiliza a página BORANGA completa. O registro local fica em `src/data/experiences.ts`, protegido por `server-only`; somente a experiência consultada é enviada ao navegador. Não há banco de dados nem painel administrativo.

O modelo `ExperienceRecord` contém `token`, `customer?: { name }`, `bottle: { lot, number, total }`, `message?`, `pairingId?` e `status: "active" | "disabled"`. `Pairing` centraliza nome, categoria, descrições, imagem, passos e notas opcionais. Cada cliente referencia apenas o `pairingId`, sem duplicar o texto do ingrediente.

### Cadastrar um cliente e escolher o ingrediente

1. Escolha um identificador em `src/data/pairings.ts`: inicialmente `dark-chocolate-70` ou `orange-peel`. Omita `--pairing` para uma experiência sem acompanhamento específico.
2. Gere um token aleatório e um bloco de cadastro:

```bash
pnpm generate:experience -- --name="Renato" --lot=001 --bottle=001 --total=5 --pairing=dark-chocolate-70 --message="Esta experiência BORANGA foi preparada especialmente para você." --baseUrl=https://boranga.com.br
```

3. Copie o bloco TypeScript exibido para dentro do objeto `experiences` em `src/data/experiences.ts`. Verifique que a chave/token ainda não existe. O script **não altera o registro**.
4. Mantenha lote e número como strings para preservar zeros. O número precisa estar entre 1 e o total da edição. Nome admite até 160 caracteres; mensagem opcional, até 600.
5. Execute novamente a aplicação. Em produção, alterações nesse arquivo exigem uma nova build/publicação autorizada. O gerador não publica o site.

Os tokens novos contêm 12 caracteres aleatórios úteis em três grupos, produzidos por `node:crypto.randomInt`, sem nome, lote, telefone ou documento. Tokens de exemplo são públicos e devem ser usados apenas em demonstração. Não reutilize os exemplos para clientes reais.

### Criar uma nova harmonização

Adicione um item único a `src/data/pairings.ts` com `id`, `name`, `category`, `shortDescription`, `intro`, `sensoryNote`, `image`, `imageAlt` e `howToEnjoy: [{ title, description }]`. `experienceName`, `allergenNote`, `storageNote` e `servingNote` são opcionais e só aparecem quando preenchidos. Depois use o novo `id` no campo `pairingId` do convite ou no argumento `--pairing`.

As fotos ficam em `public/images/pairings/`. As duas imagens iniciais são ilustrações fotográficas geradas por IA para a apresentação sensorial; não representam a embalagem ou a composição de um fornecedor. Substitua por fotos do acompanhamento físico se necessário. Os caminhos são definidos uma única vez no cadastro da harmonização.

Use descrições sensoriais e dados reais do produto. A nota de alergênicos é complementar: consulte a embalagem individual. Não invente validade, condições de armazenamento, benefícios nutricionais ou propriedades de saúde.

### Gerar URL e QR Code

```bash
pnpm generate:qr -- --token=BRG-7X9K-P2M8 --baseUrl=https://boranga.com.br
```

Saídas: `public/qrcodes/BRG-7X9K-P2M8.png` e `public/qrcodes/BRG-7X9K-P2M8.svg`. A imagem usa preto sobre branco, margem de quatro módulos e correção Q. O PNG tem 1200 px; o SVG é vetorial. O nome do arquivo contém apenas o token. O comando preserva arquivos existentes; para outra versão, use `--outputDir=artifacts/qr-local`.

A biblioteca [node-qrcode](https://github.com/soldair/node-qrcode) é usada somente pelo script local. O teste usa `jsqr` para ler de volta o PNG e conferir a URL.

O domínio `https://boranga.com.br` é a base padrão solicitada, **não uma confirmação de que esta versão esteja publicada nesse domínio**. Configure `--baseUrl` antes de produzir cartões. A URL só estará disponível quando o token estiver cadastrado, ativo e a aplicação atualizada estiver acessível nesse endereço.

QR Codes são convites por posse do link. Qualquer pessoa com a URL pode visualizar e compartilhar a experiência atual, inclusive nome e mensagem exibidos na página. Os arquivos gerados em `public/` também ficam acessíveis quando publicados. Eles foram excluídos do Git por padrão; para arquivos de trabalho privados, use um `--outputDir` fora de `public/`. Nunca coloque dados reais de clientes em um repositório público.

### Testar localmente

Execute `iniciar-site.cmd` ou `pnpm dev` e abra:

| Situação de demonstração | URL local |
| --- | --- |
| Renato + chocolate + mensagem | `http://localhost:3000/e/BRG-7X9K-P2M8` |
| Nome longo, sem pairing e mensagem opcional | `http://localhost:3000/e/BRG-N8Q4-T7W2` |
| Seleção cítrica | `http://localhost:3000/e/BRG-C6R9-V3K8` |
| Convite desativado | `http://localhost:3000/e/BRG-D4S8-B6T9` |
| Apenas garrafa, sem cliente | `http://localhost:3000/e/BRG-F5H8-J9M2` |
| Token inexistente | `http://localhost:3000/e/BRG-XXXX-YYYY` |

A build de produção usada pelos testes roda na porta 3100. Para QR de teste nessa build:

```bash
pnpm generate:qr -- --token=BRG-7X9K-P2M8 --baseUrl=http://localhost:3100 --outputDir=artifacts/qr-local
```

`localhost` funciona no próprio PC. Para abrir pelo celular na mesma rede, use o endereço de rede apresentado pelo servidor no lugar de `localhost`, desde que a rede e o firewall permitam acesso. A publicação externa depende de autorização posterior.

### Desativar e entender os estados

Troque `status: "active"` por `status: "disabled"` no registro e execute a versão atualizada. A resolução retorna a tela “Esta experiência não está disponível.” sem nome, mensagem, ingrediente ou números. Token inexistente, malformado ou cadastro inconsistente retorna uma tela elegante de identificação indisponível em `/e/[token]`.

`getExperienceByToken` e `resolveExperience`, em `src/lib/experience.ts`, resolvem os estados `personalized_pairing`, `personalized`, `bottle`, `generic`, `invalid` e `disabled`. O token da rota vence a query; qualquer token presente vence os parâmetros antigos. Token inválido/desativado nunca recorre a outro cliente ou à query. Um `pairingId` desconhecido falha sem expor o cadastro incompleto.

O token anterior `BRG-001-00037-X8Y2`, a query `?lote=001&garrafa=037&total=250` e `/` continuam funcionando. A query antiga identifica a edição, sem selo de registro verificado. O token válido na nova experiência recebe “Identificação digital verificada”, que confirma apenas correspondência com o registro, não autenticidade física absoluta.

### Abertura, acessibilidade e privacidade

A abertura apresenta nome, mensagem e seleção, com entrada de aproximadamente 1,85 s. “Iniciar experiência” revela o Hero sem navegação ou reload; a saída dura 700 ms. O estado permanece só na página aberta, sem cookies ou armazenamento persistente. Ao recarregar, o convite pode reaparecer. Sem JavaScript, a abertura fica no fluxo normal e o link leva ao Hero; todo o conteúdo continua legível.

O nome aparece somente no convite, na seção individual, na edição e no certificado. No desktop, a imagem da harmonização acompanha os passos com sticky; no mobile, segue o fluxo normal. O runtime de motion existente coordena os passos, os reveals e os eventos, sem outra biblioteca de animação. `prefers-reduced-motion` desativa movimentos e a saída da abertura é imediata. O foco passa do botão inicial para o Hero; o menu existente conserva teclado, Escape e foco.

Rotas `/e/[token]` têm `noindex`, `nofollow`, referrer `no-referrer` e renderização dinâmica sem cache compartilhado. Também há `noindex` quando um token é acessado pela query. O sitemap inclui apenas a página geral. Metadata e Open Graph mantêm conteúdo genérico. Essas medidas não substituem controle de acesso: o link é o convite.

O compartilhamento da experiência usa “Conheça minha experiência BORANGA.” e a URL individual limpa, sem acrescentar nome, mensagem, ingrediente ou parâmetros extras ao texto. A página de destino continua mostrando os dados dessa experiência a quem receber o link.

Eventos preparados: `experience_opened`, `experience_started`, `pairing_viewed`, `pairing_step_viewed`, `certificate_viewed`, `share_clicked`. O helper continua sem provedor e sem requisições externas. A lista de campos permitidos é lote, garrafa, pairingId, etapa e hash SHA-256 do token; o hash é um identificador pseudônimo, não garantia de anonimato. Nome, mensagem e token bruto são descartados pelo helper de eventos de experiência. Não habilite captura automática de URLs em uma futura integração.

### Cartão premium e evolução futura

Frente: monograma B, BORANGA, “UMA EXPERIÊNCIA RESERVADA PARA VOCÊ”, QR Code e “Escaneie para iniciar”. Verso: “Cada BORANGA guarda uma história. Esta começa com você.” O projeto não gera a arte gráfica do cartão nesta fase.

O fluxo futuro pode reutilizar os tipos, catálogo e validações: cadastrar cliente → escolher garrafa → escolher pairing → escrever mensagem → gerar token → gerar QR → imprimir cartão. Não há painel administrativo, banco de dados ou publicação automática nesta entrega.
