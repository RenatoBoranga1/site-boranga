// @vitest-environment node
import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync, readdirSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { createRequire } from "node:module";
import { expect, it } from "vitest";
import jsQR from "jsqr";

const run = (script: string, args: string[]) => execFileSync(process.execPath, ["--import", "tsx", resolve(`scripts/${script}.mjs`), ...args], { encoding: "utf8", stdio: "pipe" });
const valid = ["--name=Renato", "--lot=001", "--bottle=001", "--total=5"];
it("rejects unknown arguments without changing the registry", () => {
  const before = readFileSync("src/data/experiences.ts", "utf8");
  expect(() => run("generate-experience", [...valid, '--nameExtra=bad'])).toThrow();
  expect(readFileSync("src/data/experiences.ts", "utf8")).toBe(before);
});

it("generates a twelve-character random token and neutral individual URL", () => {
  const before = readFileSync("src/data/experiences.ts", "utf8");
  const results = Array.from({ length: 3 }, () => run("generate-experience", [...valid, "--pairing=dark-chocolate-70", "--baseUrl=https://example.com/?name=private"]));
  const tokens = results.map((output) => /Token: (BRG-[A-Z2-9]{4}-[A-Z2-9]{4}-[A-Z2-9]{4})/.exec(output)![1]);
  expect(new Set(tokens).size).toBe(3);
  expect(results[0]).toContain(`URL: https://example.com/e/${tokens[0]}`);
  expect(results[0]).toContain('"number": "001"');
  expect(results[0]).toContain('"pairingId": "dark-chocolate-70"');
  expect(readFileSync("src/data/experiences.ts", "utf8")).toBe(before);
});
it.each(["--pairing=missing", "--total=0", "--bottle=6", "--name=", "--nameExtra=bad"])("rejects bad or duplicate argument %s", (arg) => {
  const prefix = arg.split("=")[0] + "=";
  expect(() => run("generate-experience", [...valid.filter((item) => !item.startsWith(prefix)), arg])).toThrow();
});
it("escapes quotes and code-like text without injecting into the generated configuration", () => {
  const name = 'Name "quoted" ${literal}';
  const output = run("generate-experience", [`--name=${name}`, "--lot=001", "--bottle=001", "--total=5"]);
  expect(output).toContain(JSON.stringify(name));
  expect(output.split("URL: ")[1].split("\n")[0]).not.toContain("Name");
});
it("generates a decodable PNG and SVG and preserves existing QR files", () => {
  const directory = mkdtempSync(join(tmpdir(), "boranga-experience-"));
  try {
    const token = "BRG-7X9K-P2M8";
    run("generate-qr", [`--token=${token}`, "--baseUrl=https://example.com", `--outputDir=${directory}`]);
    const require = createRequire(import.meta.url);
    const { PNG } = createRequire(require.resolve("qrcode/package.json"))("pngjs");
    const raw = readFileSync(join(directory, `${token}.png`));
    const png = PNG.sync.read(raw);
    expect(jsQR(new Uint8ClampedArray(png.data), png.width, png.height)?.data).toBe(`https://example.com/e/${token}`);
    expect(readFileSync(join(directory, `${token}.svg`), "utf8")).toContain("<svg");
    expect(() => run("generate-qr", [`--token=${token}`, `--outputDir=${directory}`])).toThrow();
    expect(readFileSync(join(directory, `${token}.png`))).toEqual(raw);
    expect(readdirSync(directory).sort()).toEqual([`${token}.png`, `${token}.svg`]);
    expect(() => run("generate-qr", ["--token=../../escape", `--outputDir=${directory}`])).toThrow();
  } finally {
    if (dirname(directory) !== resolve(tmpdir())) throw new Error("Unexpected test directory");
    rmSync(directory, { recursive: true, force: true });
  }
}, 20000);
it("server-only blocks direct loading of the private registry outside a server context", () => {
  expect(() => execFileSync(process.execPath, ["--import", "tsx", "--eval", 'import("./src/data/experiences.ts")'], { stdio: "pipe" })).toThrow();
});
