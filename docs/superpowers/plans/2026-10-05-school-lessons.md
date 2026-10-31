# School lessons 9–12 Implementation Plan

> **For agentic workers:** Use superpowers:executing-plans to implement inline, followed by a fresh review. Parent has requested implementation and specified lessons 9–12.

**Goal:** Ship four guided school lessons with blending, prepared words, reading and dictée inside the existing garden.
**Architecture:** Add authored school content, a pure answer/progress engine and focused React activity components. Store school results alongside legacy progress in the same atomic browser record. Use a dedicated cancellable recorded-audio player for the new flows.
**Tech Stack:** Existing React, Vite, Node test runner; no new runtime dependency.
**Spec:** ../specs/2026-10-05-school-reading-design.md (parent's lessons 9–12 amendment takes precedence).

## Global Constraints
- French child-facing content; no timers, microphone, penalty or account.
- Preserve old games, flowers and historical rows.
- Whole-syllable/word recorded models; no synthetic isolated consonant claims.
- One task on screen; tap/keyboard access, reduced motion, large text.
- Missing audio must not reveal answers or count as independent dictée.
- Work in existing Site checkout on feature branch; source lifecycle uses Sites workflow.

## Review Focus
- Double submission/reload cannot duplicate flowers (task 1).
- Accent errors and repeated letters remain editable, correct positions persist (task 1).
- Cancelled/replaced audio cannot unlock the next dictée (task 2).
- Parent-marked paper work is distinct from digitally checked spelling (task 3).
- Screen reader labels and small screens must not expose hidden answers or clip controls (task 3).

## Task 1: Content and progress
Files: src/school/content.js, src/school/engine.js, src/game.js, tests/school.test.js.
Interfaces: lessons array; checkSpelling(item, tiles) returns correct/locked/firstMismatch; readSchool(data), recordSchool(progress,result), chooseItems(lesson,history).
- [x] Write tests for repeated letters/accents, malformed progress, legacy preservation, reward idempotence and review selection; run and observe failure.
- [x] Author four lesson packs and implement pure checking/validated history; integrate into readSaved without changing legacy result validation.
- [x] Run npm test; commit verified changes.

## Task 2: Recorded audio
Files: src/school/audio.js, src/school/audio-manifest.json, scripts/generate-school-audio.py, public/audio/school/, tests/school-audio.test.js.
Interface: createSchoolPlayer(resolveUrl, createAudio) returns play(key):Promise<boolean>, stop(); true only after finished playback.
- [x] Test completion, failure and stale/cancelled playback using a controlled HTMLAudio boundary; observe failure.
- [x] Implement player; generate fixed generic lesson/instruction clips with existing French voice. Keep phoneme instruction in contextual syllable/word examples.
- [x] Verify required files and run tests; review representative audio; commit.

## Task 3: Child flow and parent controls
Files: src/school/SchoolPath.jsx, SchoolSession.jsx, DictationActivity.jsx, school.css; src/App.jsx.
Interfaces: SchoolPath({progress,onComplete}) owns lesson choice and session; onComplete emits validated result including unique session ID and per-item support records.
- [x] Implement lesson selection, full lesson and dictée-only entry, prepared-word study, child-controlled blending, short sentence and meaning choice, correction and paper mode.
- [x] Integrate atomic school results and flowers in App; add parent summaries and persistent local lesson preference.
- [x] Run existing tests/build; browser-check all lessons, full lesson, dictée correction, paper mode, reload, keyboard and mobile widths. Fix demonstrated failures.

## Task 4: Review and delivery
- [x] Fresh bounded code review of engine/audio/UI; fix important issues with regression tests.
- [x] Final tests/build and README updates; preserve publication audience.
- [ ] Publish the existing Site and return its confirmed successful URL.

## Execution record
- Baseline: 19 tests pass. Approved scope: lessons 9–12.
- Ruling: execute inline in the existing Site checkout on a feature branch; repeated permission requests are unnecessary after the parent's explicit go-ahead.

- Final verification: 29 tests pass; production build succeeds. Browser: complete lesson 10, complete lesson 9 dictation with correction/reload, lesson 11 accent correction, complete lesson 12 paper workflow. Mobile width 390 tested without horizontal overflow; no browser console errors.
- Independent review: fixed silent-letter explanation in main blending model, with regression test.
- User correction: keep Ma carte as the opening view; add an explicit lessons 9–12 entry alongside older exercises.
- Limitation: clips are synthesized; playback and coverage checked, pronunciation still merits a parent/teacher listening check.
