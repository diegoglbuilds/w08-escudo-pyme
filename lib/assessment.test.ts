import { describe, expect, it } from "vitest";
import { getAssessment } from "./assessment";

describe("simulated assessment", () => {
  it("always generates exactly five actions in priority order", () => {
    const result = getAssessment();
    expect(result.actions).toHaveLength(5);
    expect(result.actions.map((action) => action.priority)).toEqual([1, 2, 3, 4, 5]);
  });

  it("keeps the demo risk visible and provides action detail", () => {
    const result = getAssessment();
    expect(result.label).toBe("Evaluación simulada");
    expect(result.risk).toBe("Medio");
    for (const action of result.actions) {
      expect(action.issue.length).toBeGreaterThan(0);
      expect(action.whyItMatters.length).toBeGreaterThan(0);
      expect(action.steps?.length).toBeGreaterThanOrEqual(2);
      expect(action.owner?.length).toBeGreaterThan(0);
      expect(action.effort?.length).toBeGreaterThan(0);
    }
  });
});
