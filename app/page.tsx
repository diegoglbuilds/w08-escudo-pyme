"use client";

import { FormEvent, useState } from "react";

type BusinessProfile = { name: string; type: string; size: string };

export default function HomePage() {
  const [profile, setProfile] = useState<BusinessProfile | null>(null);
  const [error, setError] = useState("");

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

      <section id="inicio" className="mx-auto grid max-w-6xl gap-10 px-5 py-12 md:grid-cols-[1.05fr_.95fr] md:py-20">
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
          {!profile ? <>
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
          </> : <div className="flex h-full min-h-80 flex-col justify-center">
            <span className="grid h-12 w-12 place-items-center rounded-full bg-mint text-xl text-forest" aria-hidden="true">✓</span>
            <h2 className="mt-5 text-2xl font-bold text-ink">¡Listo, {profile.name}!</h2>
            <p className="mt-3 leading-7 text-slate-600">Ya tenemos lo necesario para preparar una guía inicial. La evaluación que verás usa datos de demostración, no una revisión real del negocio.</p>
            <button onClick={() => setProfile(null)} className="mt-6 w-fit rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-ink hover:bg-slate-50">Editar mis respuestas</button>
          </div>}
        </section>
      </section>

      <footer className="border-t border-emerald-950/10 bg-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-5 py-5 text-xs leading-5 text-slate-500 sm:flex-row sm:justify-between">
          <span>Escudo PyME · Guía de seguridad para pequeñas empresas</span><span>La evaluación es simulada y no sustituye el apoyo de una persona especialista.</span>
        </div>
      </footer>
    </main>
  );
}
