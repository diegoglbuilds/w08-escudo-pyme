export type RiskLevel = "Bajo" | "Medio" | "Alto";
export type FindingStatus = "pendiente" | "parcial" | "cubierto";

export type SecurityFinding = {
  id: string;
  label: string;
  status: FindingStatus;
  summary: string;
};

export type PriorityAction = {
  id: string;
  priority: number;
  title: string;
  issue: string;
  whyItMatters: string;
};

export const simulatedFindings: SecurityFinding[] = [
  { id: "mfa", label: "Verificación en dos pasos", status: "pendiente", summary: "No se ha confirmado su uso en las cuentas principales." },
  { id: "backups", label: "Respaldos", status: "parcial", summary: "El respaldo depende de una rutina manual." },
  { id: "access", label: "Accesos", status: "parcial", summary: "No hay una revisión reciente de cuentas con acceso." },
  { id: "updates", label: "Actualizaciones", status: "parcial", summary: "La instalación de actualizaciones no sigue una rutina definida." },
  { id: "incident", label: "Respuesta a incidentes", status: "pendiente", summary: "No se ha documentado qué hacer ante una interrupción o cuenta sospechosa." },
];

const actions: PriorityAction[] = [
  { id: "mfa", priority: 1, title: "Activar la verificación en dos pasos", issue: "Las cuentas principales podrían depender solo de una contraseña.", whyItMatters: "Un segundo paso dificulta que alguien entre aunque conozca una contraseña." },
  { id: "backups", priority: 2, title: "Configurar respaldos automáticos", issue: "Un respaldo manual puede olvidarse o quedar desactualizado.", whyItMatters: "Una copia reciente ayuda a recuperar archivos y seguir operando después de un problema." },
  { id: "access", priority: 3, title: "Revisar quién tiene acceso", issue: "No se ha confirmado quién conserva acceso a las cuentas del negocio.", whyItMatters: "Quitar accesos que ya no se necesitan reduce oportunidades de cambios o consultas no autorizadas." },
  { id: "updates", priority: 4, title: "Actualizar dispositivos y programas", issue: "Sin una rutina, algunas actualizaciones importantes pueden quedarse pendientes.", whyItMatters: "Las actualizaciones corrigen fallas que podrían afectar la información o interrumpir el trabajo." },
  { id: "incident", priority: 5, title: "Definir un plan de respuesta a incidentes", issue: "Sin pasos acordados, el equipo puede perder tiempo al enfrentar algo sospechoso.", whyItMatters: "Saber a quién avisar y cómo cuidar la operación ayuda a responder con calma." },
];

export function getAssessment() {
  return {
    label: "Evaluación simulada" as const,
    risk: "Medio" as RiskLevel,
    findings: simulatedFindings,
    actions: actions.slice(0, 5),
  };
}
