# Entrega — experiências individuais BORANGA

Esta evolução acrescenta convites por cliente à base existente. Antes da primeira edição foram executados `git status` e `git diff --stat` e revisados os arquivos locais de dados, scripts, rotas, configurações, UI, motion, testes e documentação. A base anterior estava completa e coerente; os recursos individuais estavam ausentes. Nenhum commit, push ou deploy foi feito.

## Modelo e resolução

`ExperienceRecord` associa um token opaco a `customer?: { name }`, `bottle: { lot, number, total }`, `message?`, `pairingId?` e `status`. O catálogo `Pairing` contém as descrições, fotografia, passos `{ title, description }` e campos opcionais `experienceName`, `allergenNote`, `storageNote` e `servingNote`.

O registro `src/data/experiences.ts` e o resolvedor `src/lib/experience.ts` usam `server-only`. O navegador recebe apenas a experiência atual. `getExperienceByToken` verifica formato, existência, status, identificação da garrafa e a referência ao pairing. Dados inconsistentes falham sem exibir nome ou números. `resolveExperience` mantém a prioridade token da rota → token da query → query antiga → página geral. Token presente e inválido nunca utiliza fallback.

Estados: `personalized_pairing`, `personalized`, `bottle`, `generic`, `invalid` e `disabled`. Há exemplos públicos de demonstração para os estados ativos, sem seleção, cítrico, apenas garrafa e desativado. Não são cadastros reais nem tokens privados de produção.

O gerador produz 12 caracteres aleatórios úteis com `crypto.randomInt`, separados em três grupos após `BRG-`. Não codifica nome, lote ou outros dados pessoais. O formato também aceita os exemplos de 8 caracteres e o resolvedor preserva o token anterior de garrafa.

## Experiência e harmonização

`ExperiencePage` reúne a composição anterior e é reutilizado por `/` e `/e/[token]`. Hero, textos, fotos anteriores, perfil sensorial, ritual, harmonizações gerais, edição, certificado, serviço, experiências, ingredientes e footer foram mantidos.

`ExperienceGate` apresenta o convite com monograma, nome, mensagem, seleção e início. O clique encerra a abertura e revela o Hero sem navegação. O estado existe somente na página atual, com cleanup de timer e foco transferido ao título do Hero. Recarregar pode mostrar o convite novamente; nenhum cookie ou storage é usado. Sem JavaScript, o convite fica em fluxo normal e seu link leva ao Hero.

`PersonalPairing` cria “Sua experiência BORANGA” apenas quando uma seleção está resolvida. A fotografia acompanha os passos no desktop; mobile usa fluxo normal. O runtime de motion atual fornece máscara, reveals, etapas, fio dourado, intensidade e analytics. Não há nova biblioteca de animação. Chocolate amargo 70% e casca de laranja estão cadastrados uma única vez.

A edição e o certificado recebem nome e harmonização atuais. O certificado da nova rota válida mostra “Identificação digital verificada”. A query antiga continua com “Identificação da edição”. Isso verifica correspondência com um registro digital; não é prova absoluta de autenticidade física, documento legal ou blockchain.

A abertura dura aproximadamente 1,85 s e a saída 700 ms. Reduced-motion remove animações e encerra a abertura imediatamente. O cliente não precisa esperar uma tela de carregamento artificial; o botão continua funcional durante a entrada.

## Cadastro e operação

1. Para escolher ingrediente, use `dark-chocolate-70` ou `orange-peel` no argumento `--pairing`; omita-o se não houver seleção.
2. Execute:

```bash
pnpm generate:experience -- --name="Renato" --lot=001 --bottle=001 --total=5 --pairing=dark-chocolate-70 --message="Esta experiência BORANGA foi preparada especialmente para você."
```

3. Copie o bloco retornado para `src/data/experiences.ts`, verificando a ausência de token duplicado. O script não altera esse arquivo.
4. Gere o QR com o token retornado e a base de URL desejada:

```bash
pnpm generate:qr -- --token=BRG-7X9K-P2M8 --baseUrl=https://boranga.com.br
```

5. Para novo ingrediente, cadastre um item em `src/data/pairings.ts`, inclua fotografia em `public/images/pairings/` e referencie o novo `id` no cliente. Informe notas de alimento apenas quando forem conhecidas.
6. Para desativar, use `status: "disabled"` e execute a versão atualizada. Alterações em arquivos locais precisam de nova build para produção.

As imagens de QR ficam em `public/qrcodes/TOKEN.png` e `.svg`, com nome de arquivo sem cliente. Saídas existentes não são sobrescritas. `--outputDir` permite manter QR de trabalho fora de `public/`. Há exemplo PNG/SVG criado para o token demonstrativo `BRG-7X9K-P2M8`, apontando para `https://boranga.com.br/e/BRG-7X9K-P2M8`. O domínio é configurável e não indica que esta versão tenha sido publicada ali.

Teste atual neste PC: `http://localhost:3100/e/BRG-7X9K-P2M8`. Para desenvolvimento, `iniciar-site.cmd` / `pnpm dev` e porta 3000. O README contém os demais exemplos, passo a passo de cadastro, desativação, geração local e conceito frente/verso do cartão premium.

## Privacidade e compartilhamento

Rotas individuais são dinâmicas, com resposta sem cache compartilhado, `noindex`, `nofollow` e referrer `no-referrer`. O sitemap permanece somente com a página geral. Metadata e OG nunca recebem nome ou mensagem. A query com token também recebe `noindex`.

Compartilhar usa o texto “Conheça minha experiência BORANGA.” e a URL individual, sem acrescentar nome, mensagem ou ingrediente. Quem recebe o link consegue abrir a experiência atual e ler seus dados; o token funciona como convite por posse da URL. `noindex` não é autenticação. Dados reais não devem ser versionados em repositório público. QR em `public/` fica acessível caso seja publicado, por isso arquivos gerados foram excluídos do Git por padrão.

Eventos preparados: `experience_opened`, `experience_started`, `pairing_viewed`, `pairing_step_viewed`, `certificate_viewed`, `share_clicked`. Os payloads de experiência passam por uma lista permitida de lote, garrafa, pairingId, etapa e hash SHA-256 do token. Nome, mensagem, URL e token bruto não são enviados. O helper continua sem provedor externo e sem requisições. Hash de token é pseudônimo, não promessa de anonimato.

## Performance, bibliotecas e imagens

- `server-only` 0.0.1: bloqueio de imports indevidos de dados privados no cliente.
- `qrcode` 1.5.4: dependência de desenvolvimento para gerar QR em CLI; não entra no browser.
- `jsqr` 1.4.0: dependência de desenvolvimento para decodificar o PNG nos testes; não entra no browser.
- Imagens novas em WebP, 1000 × 1250: chocolate ~90 KB e laranja ~83 KB. Usam `next/image`, `sizes` e lazy loading.
- Duas imagens geradas com a ferramenta integrada ImageGen, de caráter ilustrativo/editorial. Prompts completos e caminhos estão em `IMAGENS-HARMONIZACOES.md`.
- O Hero mantém prioridade de carregamento. Seções continuam no servidor e motion reutiliza observadores e a fila de frames existente.

## Validação

| Verificação | Resultado |
| --- | --- |
| Lint | Aprovado, sem erros ou avisos |
| Unitários/componentes/scripts | 97 testes aprovados em 7 arquivos |
| Build | Aprovada na revisão final, incluindo TypeScript e todas as rotas |
| E2E | 18 testes aprovados, incluindo todos os 10 anteriores |
| Viewports | 360, 375, 390, 430, 768, 1024, 1440 e 1920 px, sem overflow nos cenários testados |
| Revisão visual | Convite, fotografia, narrativa, edição e certificado em 375/390/430/1440; nome longo em 375 × 667; sem erros de página |
| QR | PNG gerado e decodificado de volta para a URL individual correta; SVG válido produzido; preservação de arquivos existentes testada |
| Privacidade | Resposta atual e scripts de navegador sem dados de outros convites; metadata neutra; noindex; sitemap sem rotas individuais |

Os testes cobrem token válido/inválido/desativado, prioridade, pairing ausente/inexistente, estado geral, nome longo, mensagem opcional, incompatibilidade no cadastro, guard server-only, compartilhamento neutro, fluxos completos, reduced-motion, ausência de JavaScript, menu, tilt, narrativas e leitura de QR.

A avaliação de navegador foi em Chromium no Windows, com emulação de tamanhos e preferências. Não houve acesso a aparelho físico nem validação Safari/iOS. O workflow CI anterior foi preservado; nenhuma execução remota foi iniciada.

## Arquivos criados nesta etapa

- `src/types/experience.ts`, `src/types/pairing.ts`
- `src/data/experiences.ts`, `src/data/pairings.ts`
- `src/lib/experience.ts`, `src/lib/experience-token.ts`
- `src/app/e/[token]/page.tsx`
- `src/components/ExperiencePage.tsx`, `src/components/ExperienceGate.tsx`
- `src/sections/PersonalInvitation.tsx`, `src/sections/PersonalPairing.tsx`, `src/sections/UnavailableExperience.tsx`
- `src/styles/experience.css`
- `scripts/experience-cli.mjs`, `scripts/generate-experience.mjs`, `scripts/generate-qr.mjs`
- `tests/experience.test.ts`, `tests/experience-components.test.tsx`, `tests/experience-generator.test.ts`, `tests/e2e/experience.spec.ts`
- `public/images/pairings/dark-chocolate.webp`, `public/images/pairings/orange.webp`
- `public/qrcodes/BRG-7X9K-P2M8.png`, `public/qrcodes/BRG-7X9K-P2M8.svg` (gerados, ignorados pelo Git)
- `ENTREGA-EXPERIENCIAS.md`, `IMAGENS-HARMONIZACOES.md`

## Arquivos alterados nesta etapa

- `src/app/page.tsx`, `src/app/globals.css`
- `src/components/MotionRuntime.tsx`
- `src/sections/Hero.tsx`, `src/sections/YourEdition.tsx`, `src/sections/DigitalCertificate.tsx`
- `src/lib/analytics.ts`, `src/lib/bottle-display.ts`
- `src/lib/motion/motion-config.ts`, `src/lib/motion/scroll-runtime.ts`
- `package.json`, `pnpm-lock.yaml`, `eslint.config.mjs`, `.gitignore`
- `README.md`, `AGENTS.md`, `ENTREGA.md`

As capturas e os roteiros locais de revisão ficaram em `artifacts/`, que já era ignorado pelo Git. Arquivos de testes, estilos e dependências das etapas anteriores foram preservados.
