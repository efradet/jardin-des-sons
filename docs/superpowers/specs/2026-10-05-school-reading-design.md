# Le petit chemin de lecture — design for review

Date: 5 October 2026
Status: approved for implementation. On 5 October the parent requested lessons 9–12 as the first playable set, replacing the proposed lessons 1–3 pilot.

## Purpose

Extend Le Jardin des Sons for Elisabeth with guided French reading and early dictée aligned with the photographed Léo et Léa lessons. Preserve the familiar garden, existing games, comfort settings and earned flowers. Success means she can understand what to do, receive specific help, and practise the same sound-to-writing relationships in both directions. Game results are practice observations, not a diagnosis or an assessment of oral reading.

The parent approved the overall extension proposal. Her current school lesson and actual dictée list are unknown. Provide a parent-selectable starting lesson; never infer mastery from her age or from the latest photographed page.

## Source and project

All 24 JPEGs in `C:/projects/Github/LeoLea` were reviewed. The main implementation target is `C:/projects/Github/JardinDesSons`, the existing Site-linked checkout. A second checkout, `JardinDesSons-GitHub`, exists; do not write changes to both. Publishing is a separate delivery step after implementation and verification.

The existing React/Vite app has five exercise modes, recorded vocabulary, a garden reward system and browser-local progress. Its question generator and result validator assume the existing modes and five/eight-question sessions. Add a dedicated school lesson engine rather than force guided teaching into that multiple-choice format.

## School sequence

| Lesson | Focus seen in photos |
| --- | --- |
| 1 | a, o; oral sound awareness |
| 2 | a, o, é, l; la, lé, lo |
| 3 | i, v; vi, va, vo, vé and cumulative l syllables |
| 4 | m, u; cumulative consonant-vowel blending |
| 5 | f; words and short sentences |
| 6 | s; cumulative syllables and phrases |
| 7 | ch as a two-letter grapheme representing one consonant sound |
| 8 | e, r; blending and consonant-vowel-consonant sequences |
| 9 | p; ap/pa, closed syllables and pr combinations |
| 10 | o in pot and pomme; contextual pronunciation |
| 11 | d and y pronounced like i in the examples |
| 12 | j; phrases, action sentences and stories |

Use these as a curriculum reference. Author short exercise text and use existing or original game illustrations. Do not publish textbook page scans. Mark silent letters, irregular parts and words needing adult assistance explicitly. A word in an oral vocabulary activity may contain untaught spelling; a word labelled independent decoding may not, except an explicitly taught exception.

## Release sequence

First deliver a complete set covering lessons 9–12, including revision, guided blending, prepared words and dictée. Default to lesson 9 with a parent selector for 9, 10, 11 and 12. Use whole-syllable and whole-word models rather than unverified isolated consonant synthesis. Explain silent letters, doubled consonants and the two sounds of o before recall. Earlier school material is a prerequisite, with practice support always available.

Include a short sentence reading activity and paper dictée option in this release. Earlier lesson packs, cursive matching and independent sentence dictée remain future extensions. Do not display unavailable lessons as playable.

## Child experience

Add a navigation entry, « Mon chemin », alongside the map and garden. Its home presents one selected lesson and a prominent « On commence » button. Put lesson choice and progress details in « Le coin des parents » rather than requiring the child to configure a session.

A pilot session uses a predictable sequence:

1. A familiar warm-up item, or a demonstration on first use.
2. « Je te montre »: show the target spelling and model the sound.
3. « On essaie ensemble »: highlight components from left to right, play the joined syllable, and invite repetition.
4. « À toi »: two or three blending/recognition items with optional help.
5. A short dictée of two or three already practised syllables, or a prepared word.
6. Celebrate practice with one flower and offer return to the garden or finish.

Five to eight minutes is an adjustable suggestion, never a countdown. Allow stopping at any point without punishment. Replay is unlimited. Use one instruction and one target at a time. Small choices, large tap targets, adjustable text and reduced-motion support apply throughout.

## Blending

Show grapheme tiles, a left-to-right pointer and the resulting joined syllable. Keep sounds distinct from letter names. A demonstration of m+a uses the consonant sound, not « em ». Do not stretch stop consonants or add an artificial vowel to them.

Author segmentation per item rather than split strings mechanically. Later ch is one grapheme tile; pr is two consonant tiles. Never imply every letter group is one phoneme. Optional vowel/consonant colour cues follow the photographed convention and are accompanied by highlighting or underlining.

Audio playback and pointer movement must follow verified audio timing or explicit child-controlled steps. Do not animate an apparently synchronized pointer using guessed speech durations. The simpler pilot may use tap-to-advance components and a separate joined-syllable recording.

## Dictée

Guided syllable dictée plays the target without displaying its written answer. Elisabeth chooses letter tiles in order. The initial bank contains few options and supports repeated letters. Tiles are usable by tapping and keyboard; dragging is optional, never required. Include accents as first-class characters.

Validate only after « Vérifier ». Preserve correct positions; identify one part to revisit and offer a sound/model hint. Never repeatedly play a failure sound. A help request or corrected attempt is recorded as supported practice. Normal replay of the dictated target is not an error or an answer-revealing hint.

Prepared-word mode has an explicit study stage, guided building stage, hidden-model dictation stage and review. Silent letters and ambiguous spelling must be taught before recall. For example, listening alone cannot determine the t of chat or choose between o/au/eau. Do not present homophones as distinguishable by sound alone.

Later independent dictée uses an expanded tile bank or keyboard. Sentence dictée plays the whole sentence and meaningful chunks, and gives separate feedback for spelling, spaces, capitals and punctuation. « Sur mon cahier » plays audio and reveals a model for a parent check; it must not automatically claim a correct written answer.

## Help and progress

Track recognition, blending practice and spelling separately. Do not label a multiple-choice success as successful oral reading. Adult-observed oral reading can be recorded separately in a future release.

Each result stores lesson, activity, item identifiers, attempts and whether a model/hint was shown. Parent summaries use « avec aide », « seul » and « à revoir ». Avoid a global mastery percentage. Revisit difficult items in a later session, mixed with familiar ones; never trap the child in a loop. Initial review scheduling is a transparent deterministic rule based on the last supported/independent attempts, with parent override.

Use a versioned school-progress record and validate loaded data. Preserve the existing progress key, historical rows and flowers. School sessions have unique IDs and reward once only. Since flower totals and completed school IDs must stay consistent, implement and test a recoverable write strategy or a single authoritative versioned reward ledger; never rely on two uncoordinated localStorage writes for duplicate prevention. Invalid school data must not erase legacy progress.

No account or microphone is needed. School progress remains in this browser and origin. If persistence is unavailable, retain the session in memory and show an adult-readable notice. Stop audio when leaving an activity; prevent stale callbacks from changing the next item.

## Audio

Reuse existing verified vocabulary clips and add reviewed French instructional and blending recordings. The current audio helper resolves when playback starts, so it cannot alone drive a completed-audio teaching sequence. Extend playback with explicit completion/cancellation semantics while preserving existing callers.

Do not trust text-to-speech to pronounce isolated consonants correctly. Each phoneme model and blend needs listening verification. Where a reliable isolated model is unavailable, use a verified syllable demonstration and parent guidance until suitable audio is available; do not ship misleading phoneme audio.

An unavailable dictation clip blocks answer submission and offers retry or return. It must not reveal the target and then record independent dictée success. Do not silently substitute another pronunciation source for instructional audio.

## Component boundaries

- `school-content`: authored lessons, prerequisites, grapheme units, items, hints and audio references.
- `school-engine`: pure session transitions, answer checking, support flags and review selection.
- `school-progress`: versioned validation, session records and integration with rewards.
- `SchoolPath`: lesson start and parent lesson selection integration.
- `SchoolSession`: orchestration of demonstration, practice, dictée and completion.
- `BlendActivity` and `DictationActivity`: focused, accessible activity views.
- Existing `App`, audio helper and garden: narrow integration changes only.

## Verification and acceptance

Run existing tests and production build. Add meaningful tests for cumulative lesson prerequisites, authored segmentation, repeated-letter tiles, accents, correction preserving correct letters, support tracking, audio cancellation, missing-audio behavior, malformed stored data and exactly-once rewards across reloads.

Exercise the complete pilot in a browser at desktop and phone widths, with keyboard and touch-style input, large text and reduced motion. Test leaving and restarting mid-session. Confirm existing modes, flowers and history survive the change. Listen to every added teaching clip; automated file-presence tests do not establish pronunciation quality.

The pilot is ready for family use when a parent can choose a lesson, complete a guided reading-and-dictée sequence, replay or request help, receive a single flower, reload, and see accurate supported/independent practice records. Following family feedback, adjust pacing and prompts before expanding the remaining packs.

## Educational references

- International Dyslexia Association: explicit, systematic, cumulative instruction connecting sounds, spelling and reading: https://dyslexiaida.org/structured-literacy-effective-instruction-for-students-with-dyslexia-and-related-reading-difficulties/
- British Dyslexia Association, typography and layout guidance: https://cdn.bdadyslexia.org.uk/uploads/documents/Advice/style-guide/BDA-Style-Guide-2023.pdf

These inform design choices; the game is practice support to adapt alongside school and orthophonic guidance.
