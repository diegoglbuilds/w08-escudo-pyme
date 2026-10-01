# Implementation decisions

## Week 8 implementation

- Keep `docs/PACKET.md` and `assets/mockup-escudo-pyme.png` as immutable packet-before-code evidence.
- Use Next.js App Router, React, and Tailwind CSS for the Spanish-first responsive product.
- Treat all security findings in the first release as structured simulated data and label them in the interface.
- Keep initial demo profile and progress in browser-local state only. Do not represent this as authentication or durable secure storage.
- Do not enable collection of real business or personal data until Supabase Auth, per-user RLS policies, and persistence are configured and reviewed.
- Route any OpenAI use through server code and `OPENAI_API_KEY`; provide a visibly labeled deterministic fallback when the key is absent.
- Human responsibility is required for important or ambiguous incidents; AI suggestions never close an incident.
- Incident reports are validated server-side and are not persisted. The route uses strict enums, a 500-character description limit, and a bounded request body.
- The model receives only the validated incident category, short description, timestamp, and operations-impact flag. Model text is bounded and checked against a schema; deterministic policy sets a severity floor and enforces human confirmation.
- With no usable OpenAI response, the incident route returns a deterministic result visibly labeled as simulated AI. A live API key is read only on the server and is never sent to client code.
- Action completion and backup verification use browser storage solely for this local demo. They are not authentication or secure persistence.
- Upgrade to the patched Next.js 16.3.8 release and React 19 after the installed 14.x line was reported vulnerable; the resulting npm audit reported zero vulnerabilities.
- Normalize the incident form's local date/time to ISO UTC before submission, and require an explicit UTC timestamp in the API, to avoid timezone-dependent future-date checks.
- Keep the first deployment demo-only. Supabase Auth, Postgres, and user-scoped RLS are prerequisites before enabling real business or incident data persistence.
- Do not configure a Supabase service-role key in this demo; the app has no Supabase client or persistence layer yet, and the key is not needed for client Auth with RLS.

## Mechanical test pass

- Fictional test persona: Distribuidora La Estrella, Distribución, 8 employees; no real personal data used.
- Bug found: the incident report date field could accept a future local time, then receive a validation error from the server.
- Reproduction: in a Mexico City browser, open the incident form and note that its `datetime-local` maximum uses the UTC hour; enter a time two hours ahead of local time and submit a fictional report. The browser permits it, while `/api/triage` returns HTTP 400 because the corresponding absolute timestamp is in the future.
- Root cause: the form derived a wall-clock field maximum with `new Date().toISOString().slice(0, 16)`, which contains UTC fields; the server validates the timestamp as an absolute instant.
- Fix: format the maximum from local date and time fields, so the browser prevents future local times before submission.
- Regression verification: added a unit test that checks local `datetime-local` formatting. Full test suite and production build results are recorded with the fix commit.

## Persona test

- Persona: Laura, 46, owner of an eight-person distribution business in Mexico; uses common office and online tools, has no cybersecurity training, reads unfamiliar software terms slowly, and prioritizes keeping operations running.
- Screens/steps evaluated: initial screen, onboarding, simulated assessment, risk summary, five prioritized actions, action instructions and completion, backup verification, incident reporting, human escalation, and product limitations. Review used the supplied deployment URL and the matching local implementation. Browser clicking was unavailable; the deployment returned HTTP 200, but no interactive browser runner was available, so downstream screens were evaluated from their actual source and behavior, not claimed as observed clicks.
- Confusion log:
  - Initial screen — Minor. “Escudo PyME” and “Protege lo más importante de tu negocio” tell me this is practical help for my business. “PyME” is a little formal, but the no-technical-terms promise and clear form make me continue. I expect a short guide, not an automatic security check.
  - Onboarding — Minor. I understand name, type of business, and number of employees. “Evaluación simulada” is unfamiliar, but the next sentence explains it uses made-up data and does not inspect devices or accounts. I expect a demo guide and continue.
  - Simulated assessment — Moderate. The next view presents “Revisión inicial” with items “Por revisar” or “Parcial.” I can understand the labels, but may read them as findings about my own business even though the panel says it uses demonstration data. I continue because the listed actions could still be useful.
  - Current risk summary — Severe. “Nivel de riesgo actual: Medio” sounds like an assessment of my business. The nearby simulation notice conflicts with “actual”; I may treat “Medio” as a real measured result and use it to decide how urgently to act. I hesitate and might either relax too much or spend time responding to a score that was never measured.
  - Five prioritized actions — Minor. “Tus 5 acciones prioritarias” and numbered priorities are easy to scan. “Verificación en dos pasos” is slightly unfamiliar, but the first action names email and online banking and explains an extra step. I continue, expecting tasks that protect access and files.
  - Action detail — Moderate. “Responsable” and “Tiempo estimado” help me decide who can do the work. Some steps still say “configuración de seguridad” or “códigos de recuperación” without naming the exact service, so I may need to find the setting in Gmail or banking myself. I try the step because its business value and time estimate are clear.
  - Action completion — Minor. “Marcar como completada” is understandable as my own progress marker, but it does not check whether I did the steps. I expect it to record my claim in this browser and can leave it pending if I have not finished.
  - Backup verification — Moderate. “Respaldo” and “recuperar un archivo” are understandable, but I need to actually try opening a sample file before checking the box. I hesitate if I do not know where the copy is; the page clearly says it does not inspect my files, so I would leave it unchecked.
  - Incident reporting — Moderate. “Tipo de problema,” “¿Qué notaste?” and whether operations are affected are understandable. The exact date and time and warning about sending text to OpenAI if enabled make me pause; I should omit sensitive details. I would continue only for a real problem because the form asks for a concise description and promises initial guidance.
  - Human escalation — Minor. “Se requiere confirmación humana” could sound like Escudo will arrange a person, but the following copy says I must share this through my usual channel and that the form does not contact anyone automatically. I understand I need to call/message my responsible person and continue.
  - Limitations/disclaimer — Minor. The repeated notes say the review is simulated, does not inspect accounts or devices, and cannot guarantee security or close an incident. This is clear, though it is easy to skim past while working through the dashboard.
- Worst confusion: the diagnostic-sounding “Nivel de riesgo actual: Medio” in the dashboard. Laura can mistake fixed demonstration data for a real reading and misjudge the urgency of protecting business operations. This is worse than the action wording or form friction because it can directly distort her understanding of her business risk before she chooses what to do.
- Fix made: changed only the risk heading to “Nivel de riesgo simulado” and added a copy regression assertion. The score and rest of the flow remain as authored.
- Verification result: `npm test` passed (3 files, 9 tests); `npm run build` completed successfully.

## Next session first move

Configure Supabase Auth and user-scoped RLS-backed persistence before enabling storage of real business profiles, action progress, or incident reports.
