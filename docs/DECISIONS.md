# Implementation decisions

## Week 8 implementation

- Keep `docs/PACKET.md` and `assets/mockup-escudo-pyme.png` as immutable packet-before-code evidence.
- Use Next.js App Router, React, and Tailwind CSS for the Spanish-first responsive product.
- Treat all security findings in the first release as structured simulated data and label them in the interface.
- Keep initial demo profile and progress in browser-local state only. Do not represent this as authentication or durable secure storage.
- Do not enable collection of real business or personal data until Supabase Auth, per-user RLS policies, and persistence are configured and reviewed.
- Route any OpenAI use through server code and `OPENAI_API_KEY`; provide a visibly labeled deterministic fallback when the key is absent.
- Human responsibility is required for important or ambiguous incidents; AI suggestions never close an incident.

## Next session first move

Configure Supabase Auth and user-scoped RLS-backed persistence before enabling storage of real business profiles, action progress, or incident reports.
