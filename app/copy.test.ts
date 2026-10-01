import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const page = readFileSync(new URL("./page.tsx", import.meta.url), "utf8");
const incident = readFileSync(new URL("../lib/incident.ts", import.meta.url), "utf8");

describe("Spanish UI and shadow constraints", () => {
  it("contains the required core Spanish product copy", () => {
    expect(page).toContain("Escudo PyME");
    expect(page).toContain("Protege lo más importante de tu negocio.");
    expect(page).toContain("Tus 5 acciones prioritarias");
    expect(page).toContain("Nivel de riesgo simulado:");
    expect(page).toContain("Se requiere confirmación humana.");
    expect(page).toContain("Escudo PyME reduce riesgos, pero ningún sistema puede garantizar seguridad total.");
    expect(page).toContain("Respuesta de IA simulada para demostración.");
    expect(page).toContain("el texto se envía a OpenAI");
    expect(page).toContain("Sin vigilar a tu equipo");
  });

  it("does not claim total safety or automated incident closure", () => {
    expect(`${page}\n${incident}`).not.toMatch(/completamente seguro|completamente segura|100% seguro/i);
    expect(page).toContain("no puede cerrar este incidente");
  });
});
