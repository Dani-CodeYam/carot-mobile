# Crash Recovery — 2026-07-20 (build session b6b567cd)

The previous build session wedged. Its transcript file
(`~/.claude/projects/-Users-nani-Dev-carot-mobile/b6b567cd-*.jsonl`) was deleted
mid-session, the Claude TUI render loop died, and the conversation history is
unrecoverable. The tail of what was still on screen is preserved in
`.codeyam/recovered-session-tail.txt`.

**No file changes were executed after the last decision.** The working tree is
exactly as the wedged session left it. Nothing was deleted or reverted.

Workflow position at the time of the crash: feature **Daily Card**, step **10
(Approve Demo)**, mode `ui`.

## Decisions the user had already made

1. Discard the Daily Card work built in that session (history screen +
   tap-to-reveal lock). The web app does not have it.
2. Port the mobile app from the existing web app instead.
3. The mobile app gets "today's card" and the AI interpretations by calling the
   **web app's API**, not by reimplementing the backend.
4. Sequence the remaining web screens by grouping them into a few batches.

## The exact pending action (approved in principle, never executed)

Delete (untracked, not recoverable):
`app/daily.tsx`, `app/history.tsx`, `components/LangToggle.tsx`,
`lib/dailyCard.ts`, `lib/lang.tsx`, `lib/nav.ts`, `.codeyam/seeds/`,
`.codeyam/data-structure.json`

Revert to HEAD:
`app/_layout.tsx`, `app/index.tsx`, `app/reading.tsx`,
`components/TarotCard.tsx`

Leave untouched (pre-existing before the session):
`.gitignore`, `lib/cardImages.ts`, `tsconfig.json`, `assets/card-back.*`,
`package.json`, `package-lock.json`, `.claude/`, `.codex/`, `.gitattributes`

Notes carried over from the wedged session:

- `package.json` / `package-lock.json` were already modified before the session,
  and Playwright is now required by the editor's capture tooling, so leave them
  alone.
- Reverting `TarotCard.tsx` restores the face-up-before-tap bug, which is fine
  because the web's flip is being ported anyway.

## Known open bug

In the live preview the back button is dead: the preview deep-links straight
into `/daily`, so there is no history entry to go back to.

## First thing to do on resume

Re-confirm the delete/revert list above with the user before touching anything,
then execute it and start the port from the web app.
