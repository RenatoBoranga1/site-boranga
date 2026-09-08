# BORANGA — Landing page premium

Experiência digital mobile-first para o **Licor Extra Luxo de Jabuticaba BORANGA**, pensada para acesso por QR Code no rótulo da garrafa.

## O que está incluído

- Landing page responsiva em Next.js 16, React 19, TypeScript e Tailwind CSS 4.
- Imagens locais otimizadas em WebP, centralizadas em `src/lib/site-config.ts`.
- Hero, história, essência da jabuticaba, perfil sensorial, ritual, harmonizações, serviço, experiências, ingredientes e presente.
- Identificação sanitizada de lote, garrafa e total por query string.
- Certificado digital com Web Share API e fallback para copiar o link.
- SEO básico com metadata, Open Graph, Twitter Card, sitemap e robots.
- Animações discretas com respeito a `prefers-reduced-motion`.
- Script para gerar URLs individuais e um CSV pronto para produção de QR Codes.

## Requisitos

- Node.js 20.9 ou superior.
- pnpm 10 ou superior.

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

Sem `lote` e `garrafa` válidos, a interface mostra **Edição Especial BORANGA**. A leitura e a sanitização ficam em `src/lib/bottle.ts`. O mesmo arquivo exporta `buildBottleUrl`, função utilitária para montar URLs individuais.

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
├── sections/            # Seções da experiência BORANGA
├── lib/                 # Configuração, sanitização e URLs
└── types/               # Tipos da identidade da garrafa
public/
├── images/              # Fotografias locais otimizadas
└── examples/            # CSV de exemplo
scripts/
└── generate-bottle-urls.mjs
```

## Conteúdo responsável

O site exibe `750 mL`, `30% vol.` e a mensagem **Beba com moderação**. Não inclui alegações nutricionais, premiações, certificações ou detalhes de origem/processo que não tenham sido fornecidos.
