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

## Next session first move

Configure Supabase Auth and user-scoped RLS-backed persistence before enabling storage of real business profiles, action progress, or incident reports.
