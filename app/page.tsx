"use client";

import { FormEvent, useEffect, useState } from "react";
import { getAssessment } from "@/lib/assessment";
import type { IncidentCategory, TriageSuggestion } from "@/lib/incident";

type BusinessProfile = { name: string; type: string; size: string };

export default function HomePage() {
  const [profile, setProfile] = useState<BusinessProfile | null>(null);
  const [error, setError] = useState("");
  const assessment = getAssessment();
  const [completed, setCompleted] = useState<Record<string, boolean>>({});
  const [backupVerified, setBackupVerified] = useState(false);
  const [progressLoaded, setProgressLoaded] = useState(false);
  const [incidentResult, setIncidentResult] = useState<TriageSuggestion | null>(null);
  const [incidentError, setIncidentError] = useState("");
  const [incidentLoading, setIncidentLoading] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("escudo-pyme-demo-progress");
      if (!saved || saved.length > 1000) return;
      const parsed: unknown = JSON.parse(saved);
      if (typeof parsed !== "object" || parsed === null) return;
      const value = parsed as { completed?: unknown; backupVerified?: unknown };
      if (typeof value.completed === "object" && value.completed !== null) {
        const safeProgress: Record<string, boolean> = {};
        for (const action of assessment.actions) {
          const status = (value.completed as Record<string, unknown>)[action.id];
          if (typeof status === "boolean") safeProgress[action.id] = status;
        }
        setCompleted(safeProgress);
      }
      if (typeof value.backupVerified === "boolean") setBackupVerified(value.backupVerified);
    } catch {
      setCompleted({});
      setBackupVerified(false);
    } finally {
      setProgressLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!progressLoaded) return;
    try {
      localStorage.setItem("escudo-pyme-demo-progress", JSON.stringify({ completed, backupVerified }));
    } catch {
      // Progress remains available for the current visit if browser storage is unavailable.
    }
  }, [completed, backupVerified, progressLoaded]);

  function startOnboarding(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = String(data.get("name") ?? "").trim();
    const type = String(data.get("type") ?? "");
    const size = String(data.get("size") ?? "");
    if (name.length < 2 || name.length > 60 || !["comercio", "servicios", "alimentos", "otro"].includes(type) || !["1-5", "6-15", "16-50"].includes(size)) {
      setError("Revisa los datos: el nombre debe tener entre 2 y 60 caracteres y las opciones deben ser válidas.");
      return;
    }
    setError("");
    setProfile({ name, type, size });
  }

  async function reportIncident(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIncidentLoading(true);
    setIncidentError("");
    setIncidentResult(null);
    const data = new FormData(event.currentTarget);
    let noticedAt: string;
    try {
      noticedAt = new Date(String(data.get("noticedAt") ?? "")).toISOString();
    } catch {
      setIncidentError("Indica una fecha y hora válidas.");
      setIncidentLoading(false);
      return;
    }
    const report = {
      category: String(data.get("category")) as IncidentCategory,
      description: String(data.get("description") ?? ""),
      noticedAt,
      operationsAffected: data.get("operationsAffected") === "si",
    };
    try {
      const response = await fetch("/api/triage", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(report) });
      const result = await response.json() as TriageSuggestion | { error?: string };
      if (!response.ok || "error" in result || !("severity" in result)) {
        setIncidentError("error" in result && result.error ? result.error : "No pudimos revisar el reporte. Intenta de nuevo.");
        return;
      }
      setIncidentResult(result);
    } catch {
      setIncidentError("No pudimos conectar con la guía de incidentes. Intenta de nuevo.");
    } finally {
      setIncidentLoading(false);
    }
  }

  return (
    <main className="min-h-screen">
      <header className="border-b border-emerald-950/10 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
          <a href="#inicio" className="flex items-center gap-3 font-bold text-ink" aria-label="Escudo PyME, inicio">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-mint text-xl" aria-hidden="true">✳</span>
            <span>Escudo PyME</span>
          </a>
          <span className="hidden text-sm text-slate-600 sm:block">Seguridad clara para tu negocio</span>
        </div>
      </header>

      {!profile ? <section id="inicio" className="mx-auto grid max-w-6xl gap-10 px-5 py-12 md:grid-cols-[1.05fr_.95fr] md:py-20">
        <div className="flex flex-col justify-center">
          <span className="mb-5 w-fit rounded-full bg-mint px-3 py-1.5 text-xs font-semibold tracking-wide text-forest">CLARO · PRÁCTICO · PARA PyMES</span>
          <h1 className="max-w-xl text-4xl font-bold leading-tight tracking-tight text-ink md:text-5xl">Protege lo más importante de tu negocio.</h1>
          <p className="mt-5 max-w-lg text-lg leading-7 text-slate-600">Encuentra por dónde empezar con recomendaciones sencillas, responsables claros y pasos que sí caben en tu día.</p>
          <div className="mt-8 flex flex-wrap gap-3 text-sm text-slate-700">
            <span className="rounded-lg border border-emerald-950/10 bg-white px-3 py-2">Sin tecnicismos</span>
            <span className="rounded-lg border border-emerald-950/10 bg-white px-3 py-2">Tú decides qué hacer</span>
            <span className="rounded-lg border border-emerald-950/10 bg-white px-3 py-2">Sin vigilar a tu equipo</span>
          </div>
          <p className="mt-10 max-w-lg text-sm leading-6 text-slate-600">Escudo PyME reduce riesgos, pero ningún sistema puede garantizar seguridad total.</p>
        </div>

        <section className="rounded-3xl border border-emerald-950/10 bg-white p-6 shadow-card sm:p-8" aria-labelledby="onboarding-title">
          <div>
            <div className="mb-6">
              <p className="text-sm font-semibold text-forest">EMPECEMOS POR LO BÁSICO</p>
              <h2 id="onboarding-title" className="mt-2 text-2xl font-bold text-ink">Cuéntanos de tu negocio</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">Esta demo usa datos ficticios y una evaluación simulada. No revisa tus dispositivos ni tus cuentas.</p>
            </div>
            <form onSubmit={startOnboarding} className="space-y-4">
              <label className="block text-sm font-medium text-slate-700">Nombre de tu negocio
                <input name="name" required minLength={2} maxLength={60} autoComplete="organization" placeholder="Ej. Mi negocio" className="mt-1.5 w-full rounded-xl border border-slate-300 px-4 py-3" />
              </label>
              <label className="block text-sm font-medium text-slate-700">¿A qué se dedica?
                <select name="type" required defaultValue="" className="mt-1.5 w-full rounded-xl border border-slate-300 bg-white px-4 py-3">
                  <option value="" disabled>Selecciona una opción</option><option value="comercio">Comercio</option><option value="servicios">Servicios</option><option value="alimentos">Alimentos y bebidas</option><option value="otro">Otro giro</option>
                </select>
              </label>
              <label className="block text-sm font-medium text-slate-700">¿Cuántas personas trabajan aquí?
                <select name="size" required defaultValue="" className="mt-1.5 w-full rounded-xl border border-slate-300 bg-white px-4 py-3">
                  <option value="" disabled>Selecciona un rango</option><option value="1-5">De 1 a 5</option><option value="6-15">De 6 a 15</option><option value="16-50">De 16 a 50</option>
                </select>
              </label>
              {error && <p role="alert" className="text-sm text-rose-700">{error}</p>}
              <button className="w-full rounded-xl bg-forest px-5 py-3.5 font-semibold text-white transition hover:bg-ink">Ver mi guía de seguridad <span aria-hidden="true">→</span></button>
              <p className="text-center text-xs leading-5 text-slate-500">No pedimos contraseñas ni datos de tus clientes o colaboradores.</p>
            </form>
          </div>
        </section>
      </section> : <section className="mx-auto max-w-6xl px-5 py-8 md:py-12">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div><p className="text-sm font-semibold text-forest">Panel de {profile.name}</p><h1 className="mt-2 text-3xl font-bold text-ink">Tu guía para cuidar el negocio</h1></div>
          <button onClick={() => setProfile(null)} className="w-fit rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-ink hover:bg-slate-50">Editar datos del negocio</button>
        </div>
        <div className="mt-7 grid gap-5 md:grid-cols-[.8fr_1.2fr]">
          <section className="rounded-2xl border border-emerald-950/10 bg-white p-6 shadow-card" aria-label="Resumen de riesgo">
            <div className="flex items-center justify-between gap-3"><h2 className="text-lg font-bold">Nivel de riesgo actual: {assessment.risk}</h2><span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-900">{assessment.label}</span></div>
            <p className="mt-4 text-sm leading-6 text-slate-600">Este resultado se basa en datos de demostración. No revisamos dispositivos, cuentas ni actividad de tu negocio.</p>
            <p className="mt-4 rounded-xl bg-amber-50 p-3 text-xs leading-5 text-amber-950">Datos de demostración · Evaluación simulada</p>
          </section>
          <section className="rounded-2xl border border-emerald-950/10 bg-white p-6 shadow-card" aria-labelledby="findings-heading">
            <h2 id="findings-heading" className="text-lg font-bold">Revisión inicial</h2>
            <ul className="mt-3 divide-y divide-slate-100">{assessment.findings.map((finding) => <li key={finding.id} className="flex items-start justify-between gap-3 py-3"><div><p className="text-sm font-semibold">{finding.label}</p><p className="mt-1 text-xs leading-5 text-slate-600">{finding.summary}</p></div><span className="shrink-0 rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-600">{finding.status === "pendiente" ? "Por revisar" : "Parcial"}</span></li>)}</ul>
          </section>
        </div>
        <section className="mt-8" aria-labelledby="actions-heading">
          <div className="mb-4 flex flex-wrap items-end justify-between gap-2"><div><p className="text-sm font-semibold text-forest">Empieza por lo más importante</p><h2 id="actions-heading" className="mt-1 text-2xl font-bold">Tus 5 acciones prioritarias</h2></div><p className="text-sm text-slate-600">Guía inicial · Datos de demostración</p></div>
          <p className="mb-3 text-sm text-slate-600">{Object.values(completed).filter(Boolean).length} de 5 acciones completadas.</p>
          <ol className="grid gap-4 md:grid-cols-2">{assessment.actions.map((action) => <li key={action.id} className="rounded-2xl border border-emerald-950/10 bg-white p-5 shadow-card"><div className="flex items-center gap-3"><span className="grid h-9 w-9 place-items-center rounded-full bg-mint text-sm font-bold text-forest">{action.priority}</span><span className="text-xs font-semibold uppercase tracking-wide text-forest">Prioridad {action.priority}</span>{completed[action.id] && <span className="ml-auto rounded-full bg-emerald-100 px-2 py-1 text-xs">Completada</span>}</div><h3 className="mt-4 text-lg font-bold">{action.title}</h3><p className="mt-2 text-sm leading-6 text-slate-700"><strong>Qué pasa:</strong> {action.issue}</p><p className="mt-2 text-sm leading-6 text-slate-600"><strong>Por qué importa:</strong> {action.whyItMatters}</p><div className="mt-4 rounded-xl bg-paper p-4"><h4 className="text-sm font-bold">Qué hacer</h4><ol className="mt-2 list-inside list-decimal space-y-1.5 text-sm leading-5 text-slate-700">{action.steps?.map((step) => <li key={step}>{step}</li>)}</ol><p className="mt-4 text-sm"><strong>Responsable:</strong> {action.owner}</p><p className="mt-1 text-sm"><strong>Tiempo estimado:</strong> {action.effort}</p></div><button type="button" onClick={() => setCompleted((current) => ({ ...current, [action.id]: !current[action.id] }))} className="mt-4 rounded-xl border border-forest px-4 py-2.5 text-sm font-semibold text-forest hover:bg-mint">{completed[action.id] ? "Marcar como pendiente" : "Marcar como completada"}</button>{action.id === "backups" && <div className="mt-4 border-t border-slate-200 pt-4"><p className="text-sm font-semibold">Verificación del respaldo</p><p className="mt-1 text-xs leading-5 text-slate-600">Marca esto solo después de comprobar que puedes recuperar un archivo. Esta demo no revisa tus archivos.</p><label className="mt-3 flex items-center gap-2 text-sm"><input type="checkbox" checked={backupVerified} onChange={(event) => setBackupVerified(event.target.checked)} />Confirmo que probé un respaldo</label><p className="mt-2 text-xs font-medium text-forest">{backupVerified ? "Prueba registrada en este navegador" : "Aún falta probar el respaldo"}</p></div>}</li>)}</ol>
        </section>
        <section className="mt-8 grid gap-5 md:grid-cols-[.8fr_1.2fr]" aria-labelledby="incident-heading">
          <div><p className="text-sm font-semibold text-forest">Si algo no parece normal</p><h2 id="incident-heading" className="mt-1 text-2xl font-bold">Reportar un posible incidente</h2><p className="mt-3 text-sm leading-6 text-slate-600">Comparte solo lo necesario. No incluyas nombres, contraseñas, códigos, datos bancarios ni información de clientes. El reporte no se guarda en esta demo; si la IA está activa, el texto se envía a OpenAI para preparar la orientación.</p></div>
          <form onSubmit={reportIncident} className="space-y-4 rounded-2xl border border-emerald-950/10 bg-white p-5 shadow-card">
            <label className="block text-sm font-medium">Tipo de problema<select name="category" required defaultValue="" className="mt-1.5 w-full rounded-xl border border-slate-300 bg-white px-4 py-3"><option value="" disabled>Selecciona una categoría</option><option value="cuenta">Cuenta o acceso</option><option value="archivos">Archivos o información</option><option value="dispositivo">Dispositivo</option><option value="servicio">Servicio que no funciona</option><option value="otro">No estoy seguro / otro</option></select></label>
            <label className="block text-sm font-medium">¿Qué notaste?<textarea name="description" required minLength={10} maxLength={500} rows={3} placeholder="Describe brevemente lo que pasó" className="mt-1.5 w-full resize-y rounded-xl border border-slate-300 px-4 py-3" /></label>
            <label className="block text-sm font-medium">¿Cuándo lo notaste?<input name="noticedAt" type="datetime-local" required max={new Date().toISOString().slice(0, 16)} className="mt-1.5 w-full rounded-xl border border-slate-300 px-4 py-3" /></label>
            <label className="block text-sm font-medium">¿Afecta la operación del negocio?<select name="operationsAffected" required defaultValue="no" className="mt-1.5 w-full rounded-xl border border-slate-300 bg-white px-4 py-3"><option value="no">No</option><option value="si">Sí</option></select></label>
            {incidentError && <p role="alert" className="text-sm text-rose-700">{incidentError}</p>}
            <button disabled={incidentLoading} className="w-full rounded-xl bg-forest px-4 py-3 font-semibold text-white disabled:opacity-60">{incidentLoading ? "Revisando el reporte…" : "Recibir orientación inicial"}</button>
            {incidentResult && <div className="rounded-xl border border-slate-200 bg-paper p-4" aria-live="polite"><div className="flex flex-wrap items-center gap-2"><h3 className="font-bold">Nivel sugerido: {incidentResult.severity}</h3>{incidentResult.simulated ? <span className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-950">Respuesta de IA simulada para demostración.</span> : <span className="rounded-full bg-mint px-2.5 py-1 text-xs font-semibold text-forest">Orientación asistida por IA</span>}</div><p className="mt-2 text-sm leading-6">{incidentResult.summary}</p><ol className="mt-3 list-inside list-decimal space-y-1.5 text-sm leading-5">{incidentResult.steps.map((step) => <li key={step}>{step}</li>)}</ol>{incidentResult.humanConfirmationRequired && <div className="mt-4 rounded-xl border border-amber-300 bg-amber-50 p-4"><p className="font-bold text-amber-950">Se requiere confirmación humana.</p><p className="mt-1 text-sm leading-5 text-amber-950">Una persona responsable debe revisar el caso y confirmar los siguientes pasos. Comparte esta orientación por tu canal habitual; este formulario no la contacta automáticamente y Escudo PyME no puede cerrar este incidente.</p></div>}<p className="mt-3 text-xs leading-5 text-slate-500">La orientación no confirma si hubo un ataque ni sustituye a una persona especialista.</p></div>}
          </form>
        </section>
        <p className="mt-8 border-t border-emerald-950/10 py-5 text-sm text-slate-600">Escudo PyME reduce riesgos, pero ningún sistema puede garantizar seguridad total.</p>
      </section>}

      <footer className="border-t border-emerald-950/10 bg-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-5 py-5 text-xs leading-5 text-slate-500 sm:flex-row sm:justify-between">
          <span>Escudo PyME · Guía de seguridad para pequeñas empresas</span><span>La evaluación es simulada y no sustituye el apoyo de una persona especialista.</span>
        </div>
      </footer>
    </main>
  );
}
