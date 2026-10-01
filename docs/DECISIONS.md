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

## Next session first move

Configure Supabase Auth and user-scoped RLS-backed persistence before enabling storage of real business profiles, action progress, or incident reports.
