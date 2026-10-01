import { describe, expect, it } from "vitest";
import { getPolicySeverity, requiresHumanConfirmation, simulatedTriage, toLocalDateTimeInputValue, validateIncident, type IncidentInput } from "./incident";

function validInput(overrides: Partial<IncidentInput> = {}): IncidentInput {
  return {
    category: "servicio",
    description: "El sistema de ventas no carga desde esta mañana.",
    noticedAt: new Date(Date.now() - 3_600_000).toISOString(),
    operationsAffected: false,
    ...overrides,
  };
}

describe("incident validation and escalation policy", () => {
  it("formats the datetime-local maximum using local clock fields", () => {
    const date = new Date(2026, 9, 1, 13, 5, 42);
    expect(toLocalDateTimeInputValue(date)).toBe("2026-10-01T13:05");
  });

  it("accepts the minimum structured report", () => {
    expect(validateIncident(validInput()).ok).toBe(true);
    expect(validateIncident({ ...validInput(), noticedAt: new Date().toISOString().slice(0, 16) }).ok).toBe(false);
  });

  it("rejects unknown categories, short descriptions, oversized text, and future dates", () => {
    expect(validateIncident({ ...validInput(), category: "password" }).ok).toBe(false);
    expect(validateIncident({ ...validInput(), description: "corto" }).ok).toBe(false);
    expect(validateIncident({ ...validInput(), description: "x".repeat(501) }).ok).toBe(false);
    expect(validateIncident({ ...validInput(), noticedAt: "2999-01-01T12:00" }).ok).toBe(false);
    expect(validateIncident({ ...validInput(), operationsAffected: "yes" }).ok).toBe(false);
  });

  it("requires human confirmation for high-impact and ambiguous incidents", () => {
    const impact = validInput({ operationsAffected: true });
    const ambiguous = validInput({ category: "otro" });
    expect(getPolicySeverity(impact)).toBe("Alta");
    expect(requiresHumanConfirmation(impact, getPolicySeverity(impact))).toBe(true);
    expect(requiresHumanConfirmation(ambiguous, getPolicySeverity(ambiguous))).toBe(true);
  });

  it("keeps account and file reports at high severity and labels fallback output", () => {
    expect(getPolicySeverity(validInput({ category: "cuenta" }))).toBe("Alta");
    expect(getPolicySeverity(validInput({ category: "archivos" }))).toBe("Alta");
    expect(simulatedTriage(validInput()).simulated).toBe(true);
  });
});
