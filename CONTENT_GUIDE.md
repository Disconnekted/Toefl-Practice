# Writing new practice sets

This guide is for anyone (including the weekly Claude task) adding practice
sets to `data/content.js`. Every set is a plain JavaScript object appended to
the end of one task's array. The build checks the file before publishing
(`node scripts/validate-content.mjs`), and records audio for any new spoken
lines automatically.

## General rules

- Add new sets to the **end** of the task's array. Never edit or reorder
  existing sets: students' progress points at set positions.
- Every set needs a short, unique `"title"` naming its topic. Don't repeat a
  topic already used in that task.
- English: natural, accurate, CEFR B2 to C1 (TOEFL level). Campus and
  academic settings. Facts in lectures and passages must be true.
- Write everything originally. Never copy text from books, articles, or
  test-prep materials.
- Multiple-choice questions: exactly 4 `"options"`, `"answer"` is the index
  of the correct option (0 = first). Vary the correct index across questions.
- Every question gets a `"why"`: one short sentence explaining the answer,
  quoting the text where possible.
- Spoken text (`"t"`, `"say"`, `"sentences"`, `"questions"` in interviews):
  write numbers as words, avoid symbols and abbreviations, so the recorded
  voices read them naturally.
- Speaker numbers `"s"` are 0 or 1. In conversations, alternate them between
  the two people.
- Escape double quotes inside strings as `\"`. Use straight apostrophes.

## Formats by task

Field names must match exactly. Copy the shape of an existing set in the same
array when in doubt.

**ctw** (Complete the Words): `{ title, text }`. An academic paragraph of
70 to 90 words. The first and last sentences have no brackets; in between,
put `[square brackets]` around about 10 ordinary words, roughly every second
word (articles, prepositions, common verbs and nouns, letters only).

**daily** (Read in Daily Life): `{ title, kind, text, questions }`. `kind`
names the text type (Notice, Email, Online post, Menu, Schedule…). `text` is
90 to 140 words, using `\n` for line breaks. 3 questions: purpose, detail,
meaning in context.

**academic**: `{ title, paras, questions }`. 4 paragraphs, 230 to 280 words
total. 5 questions: one vocabulary in context, two detail, one author's
purpose, one inference.

**skim**: `{ title, paras, questions }`. 4 paragraphs, each starting with a
clear topic sentence; the thesis is the last sentence of paragraph 1. 4
questions answerable ONLY from the title, the first sentence of each
paragraph, and the last sentences of paragraphs 1 and 4.

**trans** (Signal words): `{ title, text, predict }`. A 90 to 120 word
paragraph with 4 or 5 gaps written `[[function:Correct|Wrong|Wrong|Wrong]]`,
correct option first. `function` is one of: contrast, concession, cause,
result, example, addition, time. `predict`: 2 questions quoting a sentence
ending in a transition ("However, …") and asking what comes next.

**vic** (Vocabulary in context): `{ title, items }`. 5 items, each
`{ text, options, answer, clue, why }`. `text` contains the target word in
`{{double braces}}` and the clue phrase in `[[double brackets]]`. `clue` is
one of: definition, synonym, contrast, example, general sense (use at least
4 different types per set). Target words come from `DATA.vicWords` and must
not already appear in another vic set.

**respond**: `{ title, items }`. 5 items, each
`{ say, options, answer, why }`. `say` is one sentence someone says on
campus; options are written replies (one natural, three that reuse words or
answer the wrong question).

**convo**: `{ title, lines, questions }`. 7 to 10 turns between two people
(student with professor, staff member, or classmate) about a practical
problem; each line `{ s, name, t }`. 3 questions: main problem, a detail or
suggestion, what happens next.

**announce**: `{ title, lines, questions }`. One line
`{ s: 0, name: "Speaker", t }`, 70 to 100 words. 2 questions: purpose, key
detail.

**talk**: `{ title, lines, questions }`. One line
`{ s: 0, name: "Professor", t }`, 140 to 190 words. 3 questions: main topic,
detail, why the professor mentions something.

**notes** (Lecture notes and tone): `{ title, lines, attitude, model,
questions }`. One professor line of 200 to 250 words with a clear stance
(skeptical, enthusiastic, cautiously optimistic…) shown through wording.
`attitude`: 4 to 6 exact short phrases copied from the lecture that show the
stance. `model`: 6 to 10 lines of plain-word notes joined with `\n` (no
special symbols). 5 questions: main idea, a detail or definition, two about
attitude or tone, one about why the professor says something.

**guided** (Guided notes): `{ title, lines, skeleton }`. One professor line of
160 to 200 words. `skeleton`: 7 to 10 lines of partial notes joined with
`\n`, starting with `TOPIC:`, with 9 to 12 gaps written
`[[answer|variant|variant]]` (lowercase single key words the listener
actually hears). Include one line starting `Speaker's view:`.

**segment** (One note per chunk): `{ title, segments }`. Exactly 5 segments,
each `{ t, keys, model }`: `t` is 1 to 3 spoken sentences continuing one
lecture; `keys` is 2 to 4 arrays of lowercase keywords or word stems a good
note must contain; `model` is a note of 8 words or fewer. Segment 5 gives the
professor's opinion.

**build** (Build a Sentence): `{ title, items }`. 5 items, each
`{ context, answer, end, distractor, why }` plus optional `alts`. `answer` is
a 6 to 10 word reply without final punctuation, testing word order (embedded
questions, tenses, conditionals, comparatives, reported speech). `end` is
`"."` or `"?"`. `distractor` is one plausible wrong word not in the answer.
`alts` lists other fully correct orders of exactly the same words. `why` names
the grammar point.

**email**: `{ title, scenario, points, model }`. `scenario` is 2 sentences
ending "Write an email to …". Exactly 3 `points`. `model` is a 110 to 150
word email using `\n` for line breaks.

**discuss** (Academic Discussion): `{ title, professor, prompt, students,
model }`. `professor` like "Dr. Kim"; `prompt` 60 to 90 words posing a
debatable question; `students`: exactly 2 `{ name, post }` of 40 to 60 words
taking different sides; `model` 110 to 140 words engaging with one
classmate.

**repeat** (Listen and Repeat): `{ title, context, sentences }`. `context`:
"You are learning to … Listen and repeat exactly what you hear." Exactly 7
sentences in that setting, growing from 3 or 4 words to 16 to 20 words.

**interview**: `{ title, intro, questions }`. `intro`: "You have agreed to
take part in a study about … An interviewer will ask you four questions."
Exactly 4 questions: personal experience, preference, opinion, hypothetical.

Do not add sets to **byo** (it has no sets).

## Before committing

1. `node scripts/validate-content.mjs` must print ✓.
2. Re-read each new set once as a student would: is exactly one answer
   correct, and does each `why` match it?
