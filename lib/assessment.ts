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
  steps: string[];
  owner: string;
  effort: string;
};

export const simulatedFindings: SecurityFinding[] = [
  { id: "mfa", label: "Verificación en dos pasos", status: "pendiente", summary: "No se ha confirmado su uso en las cuentas principales." },
  { id: "backups", label: "Respaldos", status: "parcial", summary: "El respaldo depende de una rutina manual." },
  { id: "access", label: "Accesos", status: "parcial", summary: "No hay una revisión reciente de cuentas con acceso." },
  { id: "updates", label: "Actualizaciones", status: "parcial", summary: "La instalación de actualizaciones no sigue una rutina definida." },
  { id: "incident", label: "Respuesta a incidentes", status: "pendiente", summary: "No se ha documentado qué hacer ante una interrupción o cuenta sospechosa." },
];

const actions: Omit<PriorityAction, "steps" | "owner" | "effort">[] = [
  { id: "mfa", priority: 1, title: "Activar la verificación en dos pasos", issue: "Las cuentas principales podrían depender solo de una contraseña.", whyItMatters: "Un segundo paso dificulta que alguien entre aunque conozca una contraseña." },
  { id: "backups", priority: 2, title: "Configurar respaldos automáticos", issue: "Un respaldo manual puede olvidarse o quedar desactualizado.", whyItMatters: "Una copia reciente ayuda a recuperar archivos y seguir operando después de un problema." },
  { id: "access", priority: 3, title: "Revisar quién tiene acceso", issue: "No se ha confirmado quién conserva acceso a las cuentas del negocio.", whyItMatters: "Quitar accesos que ya no se necesitan reduce oportunidades de cambios o consultas no autorizadas." },
  { id: "updates", priority: 4, title: "Actualizar dispositivos y programas", issue: "Sin una rutina, algunas actualizaciones importantes pueden quedarse pendientes.", whyItMatters: "Las actualizaciones corrigen fallas que podrían afectar la información o interrumpir el trabajo." },
  { id: "incident", priority: 5, title: "Definir un plan de respuesta a incidentes", issue: "Sin pasos acordados, el equipo puede perder tiempo al enfrentar algo sospechoso.", whyItMatters: "Saber a quién avisar y cómo cuidar la operación ayuda a responder con calma." },
];

const actionDetails: Record<string, Pick<PriorityAction, "steps" | "owner" | "effort">> = {
  mfa: { steps: ["Elige primero el correo y la banca del negocio.", "En la configuraci\u00f3n de seguridad, activa la verificaci\u00f3n en dos pasos.", "Guarda los c\u00f3digos de recuperaci\u00f3n en un lugar seguro."], owner: "Due\u00f1a o due\u00f1o del negocio", effort: "15 a 30 minutos" },
  backups: { steps: ["Identifica los archivos que el negocio necesita para operar.", "Activa el respaldo autom\u00e1tico en el servicio que ya utilizas.", "Prueba abrir un archivo de muestra y anota cu\u00e1ndo hiciste la prueba."], owner: "Persona responsable de administraci\u00f3n", effort: "30 a 60 minutos" },
  access: { steps: ["Revisa qui\u00e9nes tienen acceso a las cuentas del negocio.", "Confirma qu\u00e9 accesos necesita cada responsable.", "Retira los accesos que ya no se usan y registra el cambio."], owner: "Due\u00f1a o due\u00f1o del negocio", effort: "20 a 40 minutos" },
  updates: { steps: ["Elige un momento de poco movimiento para revisar los equipos.", "Instala las actualizaciones pendientes del sistema y programas.", "Activa las actualizaciones autom\u00e1ticas cuando est\u00e9n disponibles."], owner: "Persona encargada de los equipos", effort: "20 a 45 minutos" },
  incident: { steps: ["Anota c\u00f3mo reportar un problema y a qui\u00e9n contactar.", "Acuerden c\u00f3mo cuidar la operaci\u00f3n mientras revisan el problema.", "Define qui\u00e9n pide apoyo especializado y qui\u00e9n confirma los pasos."], owner: "Due\u00f1a o due\u00f1o del negocio", effort: "30 minutos" },
};

export function getAssessment() {
  return {
    label: "Evaluación simulada" as const,
    risk: "Medio" as RiskLevel,
    findings: simulatedFindings,
    actions: actions.slice(0, 5).map((action) => ({ ...action, ...actionDetails[action.id] })),
  };
}
