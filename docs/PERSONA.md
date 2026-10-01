# PERSONA TEST — Escudo PyME

## Synthetic user

Laura is 46 and owns a small distribution business in Mexico with eight employees. She uses WhatsApp, Gmail, online banking, spreadsheets, and basic office software. She has no cybersecurity training, reads slowly when software uses unfamiliar terms, distrusts jargon, and is busy enough to abandon unclear tools. Her priority is keeping the business operating; a score matters only when it helps her make a continuity decision.

## Test context

The current deployment supplied for this test was `https://w08-escudo-pyme-9ujkw0d66-diegobuilds.vercel.app`. It returned HTTP 200. An interactive browser runner was unavailable, so no clicks or screenshots are claimed. The deployed initial page and the matching local implementation were inspected; the remaining flow was walked from the actual UI and source behavior. Laura’s answers below are a source-based persona walkthrough, not recorded browser interactions.

## Journey tested

Initial screen → onboarding → simulated assessment → current risk summary → five prioritized actions → action instructions and completion → backup verification → incident reporting → human escalation → limitations and disclaimer.

For incident reporting, Laura considers a possible suspicious sign-in to the business email. This is an illustrative scenario used to follow the form and its account-category guidance, not a claim that an incident was submitted in the deployed app.

## Confusion log

| Screen or step | As Laura: what I understand, next action, hesitation, and likely outcome | Confusion | Severity |
|---|---|---|---|
| Initial screen | “This offers practical help to protect my business.” I would enter the business details. “PyME” is a little formal, but the promise of no jargon and the clear next step are enough. I expect a guide, not an automatic check. I continue. | “PyME” may be unfamiliar, though context explains it. | Minor |
| Onboarding | I understand business name, type, and employee range. “Evaluación simulada” is unfamiliar, but the adjacent explanation says the data is fictional and nothing on my devices or accounts is checked. I expect a demo guide and continue. | “Simulada” needs the plain-language explanation beside it. | Minor |
| Simulated assessment | “Revisión inicial” and “Por revisar” or “Parcial” look like findings about my business. The demo notice says otherwise, so I may keep going while uncertain which parts apply to me. | Statuses can look personalized even though the result is demo data. | Moderate |
| Current risk summary | “Nivel de riesgo actual: Medio” sounds like somebody assessed my business. The nearby demo note conflicts with “actual.” I might use this to decide how urgently to act, and I could relax too much or spend time responding to a score that was never measured. | The headline suggests a real reading while the body calls it a demo. | Severe |
| Five prioritized actions | The numbered list is easy to scan, and the explanations connect account and file protection to operations. “Verificación en dos pasos” is unfamiliar, but the steps start with business email and banking and explain it as an extra step. I choose the first useful action and continue. | One security term takes a moment to decode. | Minor |
| Action instructions | The steps, owner, and time estimate help me decide who can do each task. “Configuración de seguridad” and “códigos de recuperación” do not tell me exactly where a setting is in Gmail or online banking, so I may need to find it myself. I try if the task fits my day. | Some instructions do not name the exact service or menu. | Moderate |
| Action completion | “Marcar como completada” reads as my progress marker. It does not verify the work, so I should only mark it after doing it. I expect this browser to remember my selection. | Completion is self-reported. | Minor |
| Backup verification | The instruction to prove I can recover a file makes sense. I must open a sample file before checking the box; the demo cannot inspect my files. If I do not know where the backup is, I leave it unchecked and ask the person who handles administration. | I may not know where to find the backup to test it. | Moderate |
| Incident reporting | For a suspicious email sign-in I select an account problem, describe briefly what I noticed, give the date/time, and say whether operations are affected. The warning not to include passwords, codes, bank or customer details is useful. The date/time and the OpenAI disclosure make me pause; I submit only for a real problem and expect initial guidance. | The exact time and conditional AI disclosure add effort and give me a privacy decision. | Moderate |
| Human escalation | “Se requiere confirmación humana” might initially sound as if the product will find a person. The next sentences say I must share the guidance through my usual channel and that nobody is contacted automatically. I understand I need to call or message my responsible person. | The headline alone could imply an arranged handoff; the explanation resolves it. | Minor |
| Limitations and disclaimer | The product says it has not checked my accounts or devices, cannot confirm an attack, cannot close an incident, and cannot guarantee total security. I understand this is guidance, not an emergency service or verified diagnosis. Repeated notes are easy to skim while busy. | Repeated limitations may be skimmed. | Minor |

## Worst confusion

The risk summary’s “Nivel de riesgo actual: Medio” is the worst confusion. Laura can read the fixed demonstration score as a real assessment and make an operational decision based on it. This is more consequential than unclear menu wording or the extra effort in the incident form because it directly changes her view of the business’s current risk before she chooses a priority.

## Fix implemented

Changed the heading to “Nivel de riesgo simulado: Medio” so the status itself identifies its source, before Laura has to reconcile the heading with a note lower in the card. Added a copy test for the heading. No other product flow or escalation rule was changed.

## Verification

`npm test` passed (3 test files, 9 tests). `npm run build` completed successfully, including TypeScript checking and static page generation.

## What changed my mind

I initially treated the dashboard’s simulation note as enough context. Reading the risk card as Laura showed that she meets the words “Nivel de riesgo actual: Medio” first; “actual” suggests a business-specific reading even though the score is fixed. The later note cannot undo that first impression reliably, so the heading itself needed to say “simulado.”
