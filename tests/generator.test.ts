// @vitest-environment node
import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { expect, it } from "vitest";
it("generates legacy QR codes with shared validation and CSV escaping", () => {
  const directory = mkdtempSync(join(tmpdir(), "boranga-test-"));
  try {
    const output = join(directory, "bottles.csv");
    execFileSync(process.execPath, ["--import", "tsx", resolve("scripts/generate-bottle-urls.mjs"), "--lot=ab-1", "--total=2", "--baseUrl=https://example.com/?a=x,y&token=stale", `--output=${output}`]);
    const lines = readFileSync(output, "utf8").trim().split("\n");
    expect(lines).toHaveLength(3);
    expect(lines[1]).toContain('"001","AB-1"');
    expect(lines[1]).toContain("garrafa=001");
    expect(lines[2]).toContain("garrafa=002");
    expect(lines[1]).not.toContain("token=");
  } finally { rmSync(directory, { recursive: true, force: true }); }
});
it.each(["2oops", "0", "-1"])("generator rejects malformed total %s before writing", (total) => {
  expect(() => execFileSync(process.execPath, ["--import", "tsx", resolve("scripts/generate-bottle-urls.mjs"), `--total=${total}`], { stdio: "pipe" })).toThrow();
});
