// Lists every line of built-in audio the app can play, assigns each one a
// voice, and writes:
//   scripts/audio_jobs.json  - clips the voice generator should create
//   audio/index.json         - clips that already exist (read by the app)
// It also tells GitHub Actions how many clips are still missing.
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const ctx = {}; vm.createContext(ctx);
vm.runInContext(
  fs.readFileSync(path.join(root, 'audio-key.js'), 'utf8') + '\n' +
  fs.readFileSync(path.join(root, 'data', 'content.js'), 'utf8') +
  '\n;globalThis.__DATA = DATA; globalThis.__key = audioKey;', ctx);
const DATA = ctx.__DATA, key = ctx.__key;

// Kokoro voices. The first letter is the accent: a = American, b = British.
// Each practice set gets one pair, so a conversation always has two
// different speakers and accents vary across sets, like the real test.
const PAIRS = [
  ['af_heart', 'am_michael'],
  ['bf_emma', 'bm_george'],
  ['am_fenrir', 'af_bella'],
];
const jobs = new Map();
function add(item, s, text) {
  if (!text || !String(text).trim()) return;
  const k = key(s, text);
  if (jobs.has(k)) return;
  const pair = PAIRS[parseInt(key(0, item.title || ''), 16) % PAIRS.length];
  jobs.set(k, { key: k, text: String(text).trim(), voice: pair[s === 1 ? 1 : 0] });
}
// These must match exactly how app.js calls speak() for each task.
for (const it of DATA.respond || []) it.items.forEach((x, i) => add(it, i % 2, x.say));
for (const id of ['convo', 'announce', 'talk', 'notes', 'guided'])
  for (const it of DATA[id] || []) it.lines.forEach(l => add(it, l.s || 0, l.t));
for (const it of DATA.segment || []) it.segments.forEach(g => add(it, 0, g.t));
for (const it of DATA.repeat || []) it.sentences.forEach(t => add(it, 0, t));
for (const it of DATA.interview || []) it.questions.forEach(t => add(it, 1, t));
for (const it of DATA.build || []) it.items.forEach(x => add(it, 0, x.context));

const all = [...jobs.values()];
const audioDir = path.join(root, 'audio');
fs.mkdirSync(audioDir, { recursive: true });
const exists = j => fs.existsSync(path.join(audioDir, j.key + '.mp3'));
const missing = all.filter(j => !exists(j));
fs.writeFileSync(path.join(root, 'scripts', 'audio_jobs.json'), JSON.stringify(missing, null, 1));
const files = Object.fromEntries(all.filter(exists).map(j => [j.key, j.key + '.mp3']));
fs.writeFileSync(path.join(audioDir, 'index.json'), JSON.stringify({ version: 1, count: Object.keys(files).length, files }));
console.log(`${all.length} clips in total, ${all.length - missing.length} ready, ${missing.length} to generate.`);
if (process.env.GITHUB_OUTPUT) fs.appendFileSync(process.env.GITHUB_OUTPUT, `missing=${missing.length}\n`);
