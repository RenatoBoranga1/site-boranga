import { getBottleIdentity } from "../src/lib/bottle.ts";
import { getPairingById } from "../src/data/pairings.ts";
import { buildExperienceUrl } from "../src/lib/experience-token.ts";
import { createToken, humanText, parseArgs } from "./experience-cli.mjs";

try {
  const args = parseArgs(process.argv.slice(2), ["name", "lot", "bottle", "total", "pairing", "message", "baseUrl"]);
  const name = humanText(args.name, 160, "Nome");
  const bottle = getBottleIdentity({ lote: args.lot, garrafa: args.bottle, total: args.total });
  if (bottle.status !== "valid" || !bottle.total) throw new Error("Informe lote, garrafa e total válidos; a garrafa não pode exceder o total.");
  const pairing = getPairingById(args.pairing);
  if (args.pairing !== undefined && !pairing) throw new Error("Harmonização não cadastrada. Confira src/data/pairings.ts.");
  const message = args.message === undefined ? undefined : humanText(args.message, 600, "Mensagem");
  const token = createToken();
  const url = buildExperienceUrl(args.baseUrl ?? "https://boranga.com.br", token);
  const record = {
    token, customer: { name }, bottle: { lot: bottle.lot, number: bottle.bottle, total: bottle.total },
    ...(message ? { message } : {}), ...(pairing ? { pairingId: pairing.id } : {}), status: "active",
  };
  console.log(`Cliente: ${name}\nToken: ${token}\nLote: ${bottle.lot}\nGarrafa: ${bottle.bottle} de ${bottle.total}\nHarmonização: ${pairing?.name ?? "Sem seleção específica"}\nURL: ${url}`);
  console.log(`\nBloco TypeScript para src/data/experiences.ts:\n${JSON.stringify(token)}: ${JSON.stringify(record, null, 2)},`);
  console.log("\nNenhum cadastro foi alterado. A URL só funciona após inserir o bloco no registro e executar a versão atualizada do site. Confira se o token ainda não existe antes de cadastrar.");
} catch (error) {
  console.error(error instanceof Error ? error.message : "Não foi possível gerar a experiência.");
  process.exitCode = 1;
}
