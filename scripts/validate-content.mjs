// Safety check, run by GitHub before publishing. If data/content.js has a
// typo or a broken question, the build stops here with a clear message and
// the last working version of the app stays online.
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const file = path.join(root, 'data', 'content.js');
const problems = [];
let DATA;
try {
  const ctx = {}; vm.createContext(ctx);
  vm.runInContext(fs.readFileSync(file, 'utf8') + '\n;globalThis.__DATA = DATA;', ctx, { filename: 'data/content.js' });
  DATA = ctx.__DATA;
} catch (e) {
  const where = (e.stack || '').split('\n').find(l => l.includes('content.js')) || '';
  console.error('\n✗ data/content.js has a typo, so the app would not load.');
  console.error('  ' + e.message + (where ? `\n  near ${where.trim()}` : ''));
  console.error('  Common causes: a missing comma between items, a missing quote, or an unescaped " inside text (write \\" instead).\n');
  process.exit(1);
}

const str = v => typeof v === 'string' && v.trim().length > 0;
function mcq(qs, where) {
  if (!Array.isArray(qs) || !qs.length) { problems.push(`${where}: has no questions`); return; }
  qs.forEach((q, i) => {
    const w = `${where}, question ${i + 1}`;
    if (!str(q.q)) problems.push(`${w}: question text is missing`);
    if (!Array.isArray(q.options) || q.options.length < 2) problems.push(`${w}: needs at least 2 options`);
    else if (!Number.isInteger(q.answer) || q.answer < 0 || q.answer >= q.options.length)
      problems.push(`${w}: "answer" must be a number from 0 to ${q.options.length - 1} (0 = first option)`);
  });
}
function lines(ls, where) {
  if (!Array.isArray(ls) || !ls.length) { problems.push(`${where}: "lines" is missing`); return; }
  ls.forEach((l, i) => { if (!str(l.t)) problems.push(`${where}, line ${i + 1}: text "t" is missing`); if (l.s !== 0 && l.s !== 1) problems.push(`${where}, line ${i + 1}: "s" must be 0 or 1`); });
}
const NEED = {
  ctw: (it, w) => { if (!str(it.text) || (it.text.match(/\[[A-Za-z']+\]/g) || []).length < 3) problems.push(`${w}: needs text with at least 3 [bracketed] words`); },
  daily: (it, w) => { if (!str(it.text)) problems.push(`${w}: "text" is missing`); mcq(it.questions, w); },
  academic: (it, w) => { if (!Array.isArray(it.paras) || !it.paras.length) problems.push(`${w}: "paras" is missing`); mcq(it.questions, w); },
  skim: (it, w) => { if (!Array.isArray(it.paras) || !it.paras.length) problems.push(`${w}: "paras" is missing`); mcq(it.questions, w); },
  trans: (it, w) => { if (!str(it.text) || !/\[\[[a-z ]+:[^\]]+\]\]/.test(it.text)) problems.push(`${w}: needs [[function:Correct|Wrong|Wrong]] gaps`); mcq(it.predict, w + ' (predict)'); },
  vic: (it, w) => (it.items || []).forEach((x, i) => { if (!/\{\{.+?\}\}/.test(x.text || '')) problems.push(`${w}, item ${i + 1}: mark the word with {{double braces}}`); mcq([{ q: 'x', options: x.options, answer: x.answer }], `${w}, item ${i + 1}`); }),
  respond: (it, w) => (it.items || []).forEach((x, i) => { if (!str(x.say)) problems.push(`${w}, item ${i + 1}: "say" is missing`); mcq([{ q: 'x', options: x.options, answer: x.answer }], `${w}, item ${i + 1}`); }),
  convo: (it, w) => { lines(it.lines, w); mcq(it.questions, w); },
  announce: (it, w) => { lines(it.lines, w); mcq(it.questions, w); },
  talk: (it, w) => { lines(it.lines, w); mcq(it.questions, w); },
  notes: (it, w) => { lines(it.lines, w); mcq(it.questions, w); },
  guided: (it, w) => { lines(it.lines, w); if (!str(it.skeleton) || !/\[\[[^\]]+\]\]/.test(it.skeleton)) problems.push(`${w}: "skeleton" needs [[answer]] gaps`); },
  segment: (it, w) => { if (!Array.isArray(it.segments) || !it.segments.length) problems.push(`${w}: "segments" is missing`); else it.segments.forEach((g, i) => { if (!str(g.t) || !str(g.model) || !Array.isArray(g.keys)) problems.push(`${w}, part ${i + 1}: needs "t", "keys", and "model"`); }); },
  build: (it, w) => (it.items || []).forEach((x, i) => { if (!str(x.context) || !str(x.answer)) problems.push(`${w}, item ${i + 1}: needs "context" and "answer"`); }),
  email: (it, w) => { if (!str(it.scenario) || !Array.isArray(it.points)) problems.push(`${w}: needs "scenario" and "points"`); },
  discuss: (it, w) => { if (!str(it.prompt) || !Array.isArray(it.students)) problems.push(`${w}: needs "prompt" and "students"`); },
  repeat: (it, w) => { if (!Array.isArray(it.sentences) || !it.sentences.length) problems.push(`${w}: "sentences" is missing`); },
  interview: (it, w) => { if (!Array.isArray(it.questions) || !it.questions.length) problems.push(`${w}: "questions" is missing`); }
};
for (const [id, check] of Object.entries(NEED)) {
  const sets = DATA[id];
  if (!Array.isArray(sets) || !sets.length) { problems.push(`DATA.${id} is missing or empty`); continue; }
  sets.forEach((it, i) => {
    const w = `DATA.${id}, set ${i + 1}${it && it.title ? ` ("${it.title}")` : ''}`;
    if (!it || !str(it.title)) problems.push(`${w}: "title" is missing`);
    try { check(it || {}, w); } catch (e) { problems.push(`${w}: ${e.message}`); }
  });
}
if (problems.length) {
  console.error(`\n✗ Found ${problems.length} problem${problems.length > 1 ? 's' : ''} in data/content.js:`);
  problems.forEach(p => console.error('  - ' + p));
  console.error('\nFix these, commit again, and GitHub will retry.\n');
  process.exit(1);
}
// Academic Word List (data/awl.js)
try {
  const ctx = { DATA: {} }; vm.createContext(ctx);
  vm.runInContext(fs.readFileSync(path.join(root, 'data', 'awl.js'), 'utf8'), ctx, { filename: 'data/awl.js' });
  const awl = ctx.DATA.awl;
  if (!Array.isArray(awl) || !awl.length) throw new Error('DATA.awl is missing or empty');
  awl.forEach(s => s.words.forEach((w, i) => { if (!w.t || !w.d) throw new Error(`Sublist ${s.n}, word ${i + 1}: needs "t" (word) and "d" (definition)`); }));
  console.log(`✓ data/awl.js looks good: ${awl.reduce((n, s) => n + s.words.length, 0)} words in ${awl.length} sublists.`);
} catch (e) {
  console.error('\n✗ data/awl.js has a problem: ' + e.message + '\n'); process.exit(1);
}
const count = Object.keys(NEED).reduce((n, id) => n + DATA[id].length, 0);
console.log(`✓ data/content.js looks good: ${count} practice sets across ${Object.keys(NEED).length} task types.`);
