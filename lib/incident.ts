export const incidentCategories = ["cuenta", "archivos", "dispositivo", "servicio", "otro"] as const;
export type IncidentCategory = (typeof incidentCategories)[number];
export type Severity = "Baja" | "Media" | "Alta";

export type IncidentInput = {
  category: IncidentCategory;
  description: string;
  noticedAt: string;
  operationsAffected: boolean;
};

export type TriageSuggestion = {
  severity: Severity;
  summary: string;
  steps: string[];
  humanConfirmationRequired: boolean;
  simulated: boolean;
};

export function validateIncident(value: unknown): { ok: true; data: IncidentInput } | { ok: false; error: string } {
  if (typeof value !== "object" || value === null || Array.isArray(value)) return { ok: false, error: "Revisa el reporte e intenta de nuevo." };
  const input = value as Record<string, unknown>;
  if (typeof input.category !== "string" || !incidentCategories.includes(input.category as IncidentCategory)) return { ok: false, error: "Selecciona una categoría válida." };
  if (typeof input.description !== "string") return { ok: false, error: "Escribe una descripción breve." };
  const description = input.description.trim().replace(/[\u0000-\u001f\u007f]/g, " ").replace(/\s+/g, " ");
  if (description.length < 10 || description.length > 500) return { ok: false, error: "La descripción debe tener entre 10 y 500 caracteres." };
  if (typeof input.noticedAt !== "string" || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(input.noticedAt)) return { ok: false, error: "Indica cuándo lo notaste." };
  const noticed = new Date(input.noticedAt);
  if (Number.isNaN(noticed.getTime()) || noticed.getTime() > Date.now() + 60_000) return { ok: false, error: "La fecha y hora deben ser válidas y no futuras." };
  if (typeof input.operationsAffected !== "boolean") return { ok: false, error: "Indica si la operación del negocio está afectada." };
  return { ok: true, data: { category: input.category as IncidentCategory, description, noticedAt: input.noticedAt, operationsAffected: input.operationsAffected } };
}

export function getPolicySeverity(input: IncidentInput): Severity {
  if (input.operationsAffected || input.category === "cuenta" || input.category === "archivos") return "Alta";
  if (input.category === "otro") return "Media";
  return "Baja";
}

export function requiresHumanConfirmation(input: IncidentInput, severity: Severity): boolean {
  return input.operationsAffected || severity === "Alta" || input.category === "otro";
}

export function simulatedTriage(input: IncidentInput): TriageSuggestion {
  const severity = getPolicySeverity(input);
  const stepsByCategory: Record<IncidentCategory, string[]> = {
    cuenta: ["Evita compartir códigos o contraseñas.", "Desde otro dispositivo confiable, revisa las opciones oficiales para proteger la cuenta.", "Por tratarse de una cuenta, pide a una persona responsable que confirme los siguientes pasos."],
    archivos: ["Evita editar o borrar más archivos afectados.", "Revisa si hay un respaldo conocido sin conectar dispositivos sospechosos.", "Pide a una persona responsable que confirme el plan de recuperación."],
    dispositivo: ["Anota qué dejó de funcionar y cuándo lo notaste.", "Si el equipo muestra algo extraño, evita usarlo para entrar a cuentas importantes.", "Pide apoyo a la persona responsable de los equipos si el problema continúa."],
    servicio: ["Confirma el estado del servicio por su canal oficial.", "Anota qué tareas del negocio siguen funcionando.", "Si la operación se detiene, avisa a la persona responsable."],
    otro: ["No borres mensajes ni archivos relacionados.", "Anota los cambios que notaste y evita compartir información sensible.", "Pide a una persona responsable que revise el caso antes de tomar medidas."],
  };
  return {
    severity,
    summary: "Esta es una orientación inicial basada solo en lo que reportaste; no se revisaron cuentas ni dispositivos.",
    steps: stepsByCategory[input.category],
    humanConfirmationRequired: requiresHumanConfirmation(input, severity),
    simulated: true,
  };
}
