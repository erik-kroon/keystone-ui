import fs from "node:fs";

describe("package exports", () => {
  it("declares the required public entrypoints", () => {
    const pkg = JSON.parse(fs.readFileSync("package.json", "utf8")) as {
      exports: Record<string, unknown>;
    };

    expect(Object.keys(pkg.exports)).toEqual([
      ".",
      "./core",
      "./solid-start",
      "./tanstack-start",
      "./package.json"
    ]);
  });
});
