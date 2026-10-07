
// ---------- Utilities ----------
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
const stage = $('#stage');
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const store = {
  get(k, d) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { } }
};
function toast(msg) { const t = document.createElement('div'); t.className = 'toast'; t.textContent = msg; document.body.appendChild(t); setTimeout(() => t.remove(), 4000); }
function shuffle(a) { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
const wordCount = s => (s.trim().match(/\S+/g) || []).length;

let SETTINGS = Object.assign({ rate: 0.9, exam: false, korean: true, voiceA: '', voiceB: '', haptics: true }, store.get('toefl26-settings', {}));
let STATS = store.get('toefl26-stats', {});
let EXTRA = store.get('toefl26-extra', {});
let CURSOR = store.get('toefl26-cursor', {});
let HIST = store.get('toefl26-hist', {});
function pushHist(id, v) { if (v == null || isNaN(v)) return; (HIST[id] = HIST[id] || []).push({ t: Date.now(), v: Math.max(0, Math.min(1, v)) }); HIST[id] = HIST[id].slice(-30); store.set('toefl26-hist', HIST); }
const saveSettings = () => store.set('toefl26-settings', SETTINGS);

function pool(id) { return DATA[id].concat(EXTRA[id] || []); }
function record(id, pts, tot) {
  if (typeof markStudyDay === 'function') markStudyDay();
  if (current && current.daily && DAILY && DAILY.steps[DAILY.i] && DAILY.steps[DAILY.i].id === id) dailyResult(pts, tot);
  buzz(tot && pts / tot >= 0.8 ? 25 : [25, 70, 25]);
  const s = STATS[id] || { sets: 0, pts: 0, tot: 0 };
  s.sets++; s.pts += pts; s.tot += tot; STATS[id] = s; store.set('toefl26-stats', STATS);
  if (tot) pushHist(id, pts / tot);
}
function recordAI(id, score) {
  if (typeof markStudyDay === 'function') markStudyDay();
  const s = STATS[id] || { sets: 0, pts: 0, tot: 0 };
  s.sets++; if (score != null) s.last = score; STATS[id] = s; store.set('toefl26-stats', STATS);
}
function setLast(id, score) {
  if (score == null) return;
  const s = STATS[id] || { sets: 1, pts: 0, tot: 0 };
  s.last = score; STATS[id] = s; store.set('toefl26-stats', STATS);
  pushHist(id, score / 5);
}

// ---------- Android helpers ----------
const IS_ANDROID = /Android/i.test(navigator.userAgent);
const COARSE = window.matchMedia && window.matchMedia('(pointer: coarse)').matches;
function buzz(pattern) { if (SETTINGS.haptics === false) return; try { navigator.vibrate && navigator.vibrate(pattern); } catch (e) { } }
// Keep the screen on during listening and speaking. Android turns the screen
// off after ~30 s by default, which also stops the audio mid-talk.
let wakeLock = null, wantWake = false;
async function keepAwake(on) {
  wantWake = on;
  try {
    if (on && !wakeLock && 'wakeLock' in navigator) { wakeLock = await navigator.wakeLock.request('screen'); wakeLock.addEventListener('release', () => { wakeLock = null; }); }
    if (!on && wakeLock) { await wakeLock.release(); wakeLock = null; }
  } catch (e) { wakeLock = null; }
}
document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible' && wantWake) keepAwake(true); });

// Wide screens (computers, tablets in landscape): reading tasks show the
// passage on the left and the questions on the right, like the real test.
function useWide(on) { document.body.classList.toggle('wide', !!on); }

// ---------- Cleanup between screens ----------
let cleanups = [];
function onLeave(fn) { cleanups.push(fn); }
function go(fn) {
  cleanups.forEach(f => { try { f(); } catch (e) { } }); cleanups = [];
  stopSpeech(); keepAwake(false); closeSheet(); useWide(false);
  fn(); window.scrollTo(0, 0);
}

// ---------- Theme ----------
function effectiveDark() {
  const t = document.documentElement.getAttribute('data-theme');
  if (t) return t === 'dark';
  return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
}
function paintThemeBtn() { $('#themeBtn').textContent = effectiveDark() ? '☀️' : '🌙'; }
(function initTheme() { const t = store.get('toefl26-theme', null); if (t) document.documentElement.setAttribute('data-theme', t); paintThemeBtn(); })();
$('#themeBtn').addEventListener('click', () => {
  const next = effectiveDark() ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next); store.set('toefl26-theme', next); paintThemeBtn();
});

// ---------- Text to speech ----------
// Ranks the browser's voices so the most human-sounding ones (Edge "Natural",
// Apple "Premium"/"Enhanced", Google) are picked first, and gives the two
// speakers in a conversation different voices (ideally one male, one female).
let VOICES = [];
const NOVELTY = /\b(Albert|Bad News|Bahh|Bells|Boing|Bubbles|Cellos|Wobble|Whisper|Zarvox|Trinoids|Jester|Organ|Superstar|Good News|Hysterical|Junior|Kathy|Ralph|Princess|Grandma|Grandpa|Rocko|Shelley|Sandy|Flo|Eddy|Reed|Fred)\b/i;
const MALE_N = /\b(Male|Guy|Davis|Andrew|Brian|Christopher|Eric|Roger|Steffan|Tony|Ryan|Alex|Aaron|Tom|Daniel|Evan|Nathan|David|Mark|Arthur|Oliver|George|James|Jason|Brandon|Jacob|Liam|Thomas|Rishi|Prabhat|Lee|William|Gordon|Matthew|Joey|Justin|Kevin|Noah|Ethan|Connor|Mitchell|Luke|Ken)\b/i;
const FEMALE_N = /\b(Female|Aria|Jenny|Michelle|Ava|Samantha|Allison|Susan|Zira|Emma|Sonia|Libby|Natasha|Karen|Moira|Tessa|Serena|Joanna|Salli|Kendra|Kimberly|Nicky|Zoe|Clara|Hazel|Catherine|Victoria|Nora|Jane|Sara|Amber|Ashley|Cora|Elizabeth|Monica|Nancy|Heera|Neerja|Molly|Kate|Fiona|Veena|Emily|Jessa|Leah|Maisie|Sonia|Abbi|Bella|Olivia|Isla)\b|Google US English/i;
const ANDROID_F = /-x-(sfg|iob|iog|tpc|tpf|fis|gba|rjs)/i, ANDROID_M = /-x-(iol|iom|tpd|gbb|gbd)/i;
function voiceGender(v) {
  const id = (v.voiceURI || '') + ' ' + v.name;
  if (ANDROID_M.test(id)) return 'm'; if (ANDROID_F.test(id)) return 'f';
  return MALE_N.test(v.name) ? 'm' : FEMALE_N.test(v.name) ? 'f' : '?';
}
function voiceScore(v) {
  const n = v.name; if (NOVELTY.test(n)) return -100;
  let s = 0;
  if (/Natural|Neural/i.test(n)) s += 100; else if (/Online/i.test(n)) s += 80;
  if (/Premium/i.test(n)) s += 95;
  if (/Enhanced/i.test(n)) s += 70;
  if (/Google/i.test(n)) s += 55;
  if (/network/i.test((v.voiceURI || '') + n)) s += 60; else if (/-x-.*local/i.test((v.voiceURI || '') + n)) s += 20;
  if (/en[-_]US/i.test(v.lang)) s += 15; else if (/en[-_](GB|CA|AU|NZ|IE)/i.test(v.lang)) s += 8;
  return s;
}
function loadVoices() {
  try {
    VOICES = speechSynthesis.getVoices()
      .filter(v => /^en[-_]/i.test(v.lang) && !NOVELTY.test(v.name))
      .sort((a, b) => voiceScore(b) - voiceScore(a));
  } catch (e) { VOICES = []; }
  if (document.getElementById('vA')) fillVoiceSelects();
}
if ('speechSynthesis' in window) { loadVoices(); speechSynthesis.onvoiceschanged = loadVoices; }
function autoPair() {
  if (!VOICES.length) return [null, null];
  const a = VOICES[0], ga = voiceGender(a), sa = voiceScore(a);
  const b = VOICES.find(v => v !== a && ga !== '?' && voiceGender(v) !== '?' && voiceGender(v) !== ga && voiceScore(v) >= sa - 45)
    || VOICES.find(v => v !== a && voiceScore(v) >= sa - 45)
    || VOICES.find(v => v !== a) || a;
  return [a, b];
}
function voicesForSpeakers() {
  const [aa, ab] = autoPair();
  const find = uri => uri && VOICES.find(v => v.voiceURI === uri);
  return [find(SETTINGS.voiceA) || aa, find(SETTINGS.voiceB) || ab];
}
let playToken = 0;
function stopSpeech() { playToken++; try { speechSynthesis.cancel(); } catch (e) { } try { studioPlayer.pause(); } catch (e) { } }
function splitSentences(t) { return (t.match(/[^.!?]+[.!?]*["']?\s*/g) || [t]).map(s => s.trim()).filter(Boolean); }
// Plays lines one speaker turn at a time, with a short, slightly varied
// pause between turns (like people taking turns), small per-turn changes
// in pace, and no artificial pitch-shifting unless both speakers share a voice.
// ---------- Studio audio: recorded clips made by the GitHub build ----------
// audio/index.json maps audioKey(speaker, text) → mp3 file. If every line in
// a request has a recording, play those; otherwise use the phone's voices.
let AUDIO_INDEX = null;
const studioPlayer = new Audio(); studioPlayer.preload = 'auto';
const clipUrls = new Map();
fetch('audio/index.json', { cache: 'no-cache' }).then(r => r.ok ? r.json() : null).then(j => {
  if (j && j.files && Object.keys(j.files).length) AUDIO_INDEX = j.files;
  const st = document.getElementById('studioStatus'); if (st) st.textContent = studioStatus();
}).catch(() => { });
function studioStatus() {
  return AUDIO_INDEX ? `${Object.keys(AUDIO_INDEX).length} recorded clips available.` : 'No recorded clips yet, so your phone\'s voices are used. They appear after GitHub finishes building the audio.';
}
function useStudio(lines) { return SETTINGS.studio !== false && AUDIO_INDEX && lines.length && lines.every(l => AUDIO_INDEX[audioKey(l.s || 0, l.t)]); }
async function clipUrl(file) {
  if (clipUrls.has(file)) return clipUrls.get(file);
  const r = await fetch('audio/' + file); if (!r.ok) throw new Error('missing clip');
  const u = URL.createObjectURL(await r.blob()); clipUrls.set(file, u); return u;
}
function playStudio(lines, onEnd, onProgress) {
  stopSpeech();
  const token = playToken; let i = 0;
  const fallback = () => { if (token !== playToken) return; speakTTS(lines.slice(Math.max(0, i - 1)), onEnd, onProgress); };
  const next = async () => {
    if (token !== playToken) return;
    if (i >= lines.length) { onEnd && onEnd(true); return; }
    const l = lines[i++];
    try {
      const url = await clipUrl(AUDIO_INDEX[audioKey(l.s || 0, l.t)]);
      if (token !== playToken) return;
      const rate = Math.max(0.6, Math.min(1.5, SETTINGS.rate / 0.9));
      studioPlayer.src = url; studioPlayer.defaultPlaybackRate = rate; studioPlayer.playbackRate = rate;
      try { studioPlayer.preservesPitch = true; } catch (e) { }
      studioPlayer.onended = () => { if (token === playToken) setTimeout(next, i < lines.length ? 350 + Math.random() * 300 : 0); };
      studioPlayer.onerror = fallback;
      studioPlayer.ontimeupdate = () => { if (token === playToken && onProgress && studioPlayer.duration) onProgress((i - 1 + studioPlayer.currentTime / studioPlayer.duration) / lines.length); };
      await studioPlayer.play();
    } catch (e) { fallback(); }
  };
  next();
}
async function saveAllAudio(btn, out) {
  if (!('caches' in window) || !AUDIO_INDEX) { out.textContent = 'There is no recorded audio to save yet.'; return; }
  const files = [...new Set(Object.values(AUDIO_INDEX))];
  const cache = await caches.open('toefl-audio');
  let done = 0, failed = 0; btn.disabled = true;
  for (const f of files) {
    const url = new URL('audio/' + f, location.href).href;
    try { if (!(await cache.match(url))) { const r = await fetch(url); if (r.ok) await cache.put(url, r); else failed++; } } catch (e) { failed++; }
    done++; if (done % 5 === 0 || done === files.length) out.textContent = `Saving ${done} of ${files.length}…`;
  }
  out.textContent = failed ? `Saved ${files.length - failed} of ${files.length}. Try again on a better connection.` : `All ${files.length} clips saved. Listening works offline now.`;
  btn.disabled = false;
}
function speak(lines, onEnd, onProgress) {
  if (useStudio(lines)) { playStudio(lines, onEnd, onProgress); return; }
  speakTTS(lines, onEnd, onProgress);
}
function speakTTS(lines, onEnd, onProgress) {
  if (!('speechSynthesis' in window)) { toast("Audio isn't available in this browser."); onEnd && onEnd(false); return; }
  stopSpeech();
  const token = playToken;
  const [vA, vB] = voicesForSpeakers();
  const same = !vA || !vB || vA.voiceURI === vB.voiceURI;
  const turns = lines.map(l => ({ s: l.s || 0, parts: splitSentences(l.t), jitter: 1 + (Math.random() * 0.06 - 0.03) }));
  const totalParts = turns.reduce((n, t) => n + t.parts.length, 0) || 1; let doneParts = 0;
  let ti = 0, started = false;
  const playTurn = () => {
    if (token !== playToken) return;
    if (ti >= turns.length) { onEnd && onEnd(true); return; }
    const T = turns[ti++], v = T.s === 1 ? vB : vA;
    const rate = Math.max(0.5, Math.min(1.6, SETTINGS.rate * (T.s === 1 ? 1.03 : 0.97) * T.jitter));
    let finished = false, idle = 0, watch = null;
    const turnEnd = () => {
      if (finished || token !== playToken) return;
      finished = true; clearInterval(watch);
      const gap = ti < turns.length ? 380 + Math.random() * 380 : 0;
      setTimeout(playTurn, gap);
    };
    T.parts.forEach((p, k) => {
      const u = new SpeechSynthesisUtterance(p);
      if (v) { u.voice = v; u.lang = v.lang; } else u.lang = 'en-US';
      u.rate = rate; u.pitch = same ? (T.s === 1 ? 1.12 : 0.92) : 1;
      u.onstart = () => { started = true; };
      u.addEventListener('end', () => { if (token === playToken && onProgress) onProgress(++doneParts / totalParts); });
      if (k === T.parts.length - 1) { u.onend = turnEnd; u.onerror = turnEnd; }
      speechSynthesis.speak(u);
    });
    // Some browsers never fire "end"; move on once speech has gone quiet.
    watch = setInterval(() => {
      if (token !== playToken) { clearInterval(watch); return; }
      if (!speechSynthesis.speaking && !speechSynthesis.pending) { if (++idle >= 5) turnEnd(); } else idle = 0;
    }, 250);
  };
  if (IS_ANDROID) setTimeout(playTurn, 150); else playTurn();
  setTimeout(() => {
    if (token === playToken && !started && !speechSynthesis.speaking) {
      stopSpeech(); toast("Audio didn't start. Check your volume or pick another voice in settings."); onEnd && onEnd(false);
    }
  }, 3000);
}
function voiceTip() {
  const great = VOICES.filter(v => voiceScore(v) >= 90).length;
  const ua = navigator.userAgent;
  if (!VOICES.length) return 'No English voices found yet. If this stays empty, try reloading the page.';
  if (great >= 2) return `Found ${great} natural-sounding voices on this device. ★ marks the best ones.`;
  if (/iPhone|iPad|iPod/.test(ua)) return 'For much more human voices: open Settings › Accessibility › Spoken Content › Voices › English, download a voice marked Premium or Enhanced (for example Ava, Zoe, or Evan), then reload this page.';
  if (/Macintosh/.test(ua) && !/Edg\//.test(ua)) return 'For much more human voices: open System Settings › Accessibility › Spoken Content › System voice › Manage Voices, download a Premium or Enhanced English voice (for example Ava, Zoe, or Evan), then reload. Or open this page in Microsoft Edge.';
  if (/Android/.test(ua)) return 'For better voices: open Settings and search "Text-to-speech output". Set the preferred engine to "Speech Services by Google" (Samsung phones often default to Samsung TTS). Tap the gear › Install voice data › English (United States) and download the voices. Then reload this page.';
  if (/Edg\//.test(ua)) return 'Edge\'s "Natural" voices need an internet connection. If none are listed, check your connection and reload.';
  return 'For the most human-sounding voices, open this page in Microsoft Edge. It includes free "Natural" neural voices that sound close to real speakers.';
}
function voiceLabel(v) {
  const g = { m: 'male', f: 'female', '?': '' }[voiceGender(v)];
  const code = /^[a-z]{2}[-_][a-z]{2}-x-([a-z]{3})-(network|local)/i.exec(v.name);
  if (code) return `${voiceScore(v) >= 90 ? '★ ' : ''}Voice ${code[1].toUpperCase()}${g ? `, ${g}` : ''}, ${code[2] === 'network' ? 'online, higher quality' : 'offline'} (${v.lang})`;
  return `${voiceScore(v) >= 90 ? '★ ' : ''}${v.name.replace(/^Microsoft\s+/, '').replace(/\s*-\s*English.*$/, '')}${g ? `, ${g}` : ''} (${v.lang})`;
}
function fillVoiceSelects() {
  const [aa, ab] = autoPair();
  [['vA', 'voiceA', aa], ['vB', 'voiceB', ab]].forEach(([elId, key, auto]) => {
    const el = document.getElementById(elId); if (!el) return;
    el.innerHTML = `<option value="">Automatic${auto ? `: ${esc(voiceLabel(auto))}` : ''}</option>` +
      VOICES.map(v => `<option value="${esc(v.voiceURI)}" ${SETTINGS[key] === v.voiceURI ? 'selected' : ''}>${esc(voiceLabel(v))}</option>`).join('');
  });
  const tip = document.getElementById('voiceTip'); if (tip) tip.textContent = voiceTip();
}

// A play control that respects exam mode (one play only)
function mountPlayer(el, lines, { label = '▶ Play audio', onFirstEnd, once = false } = {}) {
  let plays = 0, playing = false, firstDone = false;
  const single = () => once || SETTINGS.exam;
  el.innerHTML = `<button class="btn" data-p="play">${label}</button><button class="btn ghost small" data-p="stop" hidden>■ Stop</button><span class="state"></span><div class="pbar" role="progressbar" aria-label="Audio progress" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0"><i></i></div>`;
  const play = $('[data-p=play]', el), stop = $('[data-p=stop]', el), state = $('.state', el), bar = $('.pbar', el), fill = $('.pbar i', el);
  const setP = f => { const v = Math.round(Math.max(0, Math.min(1, f)) * 100); fill.style.width = v + '%'; bar.setAttribute('aria-valuenow', v); };
  const paint = () => {
    play.hidden = playing; stop.hidden = !playing || once;
    if (single() && plays >= 1 && !playing) { play.disabled = true; play.textContent = 'Played'; }
    else if (plays >= 1) play.textContent = '↺ Play again';
    state.textContent = playing ? (once ? 'Playing… one time only' : 'Playing…') : (once ? (plays ? 'Finished' : 'You will hear it once') : SETTINGS.exam ? 'Exam mode: one listen only' : (plays ? `Played ${plays}×` : ''));
  };
  play.addEventListener('click', () => {
    plays++; playing = true; paint(); setP(0);
    speak(lines, ok => {
      playing = false; if (ok !== false) setP(1);
      if (ok === false) { plays = Math.max(0, plays - 1); paint(); return; } // audio failed: allow another try
      paint(); if (!firstDone) { firstDone = true; onFirstEnd && onFirstEnd(); }
    }, setP);
  });
  stop.addEventListener('click', () => { stopSpeech(); playing = false; paint(); if (!firstDone) { firstDone = true; onFirstEnd && onFirstEnd(); } });
  paint();
}

// ---------- Speech recognition ----------
const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
let srBlocked = false;
const srAvailable = () => !!SR && !srBlocked;
function listen({ onText, onEnd, onBlocked }) {
  const r = new SR();
  // On Android, continuous mode returns each phrase several times over, so we
  // listen one phrase at a time and restart, keeping only finished phrases.
  r.lang = 'en-US'; r.continuous = !IS_ANDROID; r.interimResults = true;
  let finalText = '', latest = '', stopped = false, restarts = 0;
  const MAX_RESTARTS = IS_ANDROID ? 60 : 4;
  r.onresult = e => {
    let interim = '', phraseFinal = '';
    for (let i = e.resultIndex; i < e.results.length; i++) {
      const res = e.results[i];
      if (res.isFinal) phraseFinal += res[0].transcript + ' '; else interim += res[0].transcript;
    }
    if (phraseFinal) finalText += phraseFinal;
    latest = (finalText + interim).replace(/\s+/g, ' ').trim();
    onText && onText(latest);
  };
  r.onerror = e => {
    if (e.error === 'not-allowed' || e.error === 'service-not-allowed' || e.error === 'audio-capture') {
      srBlocked = true; stopped = true; onBlocked && onBlocked(e.error);
    }
  };
  r.onend = () => {
    if (!stopped && restarts < MAX_RESTARTS) { restarts++; try { r.start(); return; } catch (e) { } }
    onEnd && onEnd(latest);
  };
  try { r.start(); } catch (e) { srBlocked = true; onBlocked && onBlocked('start'); return { stop() { } }; }
  return { stop() { stopped = true; try { r.stop(); } catch (e) { } } };
}
const NUMS = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen', 'twenty'];
function tokens(s) {
  return s.toLowerCase().replace(/[’']/g, '').replace(/[^a-z0-9\s-]/g, ' ').replace(/-/g, ' ')
    .split(/\s+/).filter(Boolean).map(w => /^\d+$/.test(w) && +w <= 20 ? NUMS[+w] : w);
}
// Longest common subsequence: which target words were said, in order
function alignWords(target, said) {
  const a = tokens(target), b = tokens(said);
  const dp = Array.from({ length: a.length + 1 }, () => Array(b.length + 1).fill(0));
  for (let i = a.length - 1; i >= 0; i--) for (let j = b.length - 1; j >= 0; j--)
    dp[i][j] = a[i] === b[j] ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1]);
  const hit = Array(a.length).fill(false); let i = 0, j = 0;
  while (i < a.length && j < b.length) { if (a[i] === b[j]) { hit[i] = true; i++; j++; } else if (dp[i + 1][j] >= dp[i][j + 1]) i++; else j++; }
  return { hit, n: a.length, matched: hit.filter(Boolean).length };
}

// ---------- Claude (optional, with your own Anthropic API key) ----------
// The key is stored only in this browser (localStorage) and sent only to
// api.anthropic.com. Usage is billed to the key owner's Anthropic account.
const DEFAULT_MODEL = 'claude-sonnet-5-5';
let sample = null;
function parseJsonLoose(t) {
  try { return JSON.parse(t); } catch (e) { }
  const m = t.match(/```(?:json)?\s*([\s\S]*?)```/); if (m) { try { return JSON.parse(m[1]); } catch (e) { } }
  const a = t.search(/[\[{]/), b = Math.max(t.lastIndexOf('}'), t.lastIndexOf(']'));
  if (a >= 0 && b > a) { try { return JSON.parse(t.slice(a, b + 1)); } catch (e) { } }
  return undefined;
}
function makeApiSample() {
  const key = (SETTINGS.apiKey || '').trim(); if (!key) return null;
  const call = async (input, opts = {}) => {
    const messages = typeof input === 'string' ? [{ role: 'user', content: input }] : input;
    let res;
    try {
      res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST', signal: opts.signal,
        headers: { 'content-type': 'application/json', 'x-api-key': key, 'anthropic-version': '2023-06-01', 'anthropic-dangerous-direct-browser-access': 'true' },
        body: JSON.stringify({ model: (SETTINGS.model || DEFAULT_MODEL).trim(), max_tokens: 6000, messages })
      });
    } catch (e) {
      if (e && e.name === 'AbortError') throw { code: 'cancelled' };
      throw { code: navigator.onLine === false ? 'offline' : 'upstream_error' };
    }
    if (!res.ok) {
      let msg = ''; try { msg = (await res.json()).error?.message || ''; } catch (e) { }
      const code = res.status === 401 || res.status === 403 ? 'bad_key' : res.status === 429 ? 'rate_limited' : res.status === 400 || res.status === 404 ? 'bad_request' : 'upstream_error';
      throw { code, message: msg };
    }
    const data = await res.json();
    const text = (data.content || []).map(b => b.type === 'text' ? b.text : '').join('');
    if (!text.trim()) throw { code: 'empty_completion' };
    return { text, truncated: data.stop_reason === 'max_tokens' };
  };
  const fn = (input, opts) => call(input, opts);
  fn.json = async (input, opts) => {
    const { text } = await call(typeof input === 'string' ? input + '\n\nRespond with only the JSON value, with no other text.' : input, opts);
    const v = parseJsonLoose(text); if (v === undefined) throw { code: 'invalid_json', text }; return v;
  };
  return fn;
}
function refreshAI() { sample = makeApiSample(); document.documentElement.classList.toggle('has-ai', !!sample); }
refreshAI();
function aiOff() { sample = null; document.documentElement.classList.remove('has-ai'); }
function aiErrorText(e) {
  const c = e && e.code;
  if (c === 'bad_key') return 'Your Anthropic API key was rejected. Check it under Audio and practice settings on the home screen.';
  if (c === 'offline') return "You're offline. Claude features need an internet connection.";
  if (c === 'bad_request') return 'Claude could not process this request' + (e.message ? `: ${e.message}` : '.') + ' If it mentions the model, check the model name in settings.';
  if (['not_granted', 'sampling_disabled', 'not_declared', 'capability_disabled', 'capability_removed'].includes(c)) { aiOff(); return 'Claude feedback is turned off for this page. You can still use the model answers and self-checks.'; }
  if (c === 'rate_limited') return "You've hit a usage limit. Try again in a little while.";
  if (c === 'session_expired') return 'Your session expired. Sign in to Claude again, then retry.';
  if (c === 'invalid_json') return "Claude's reply couldn't be read. Try again.";
  if (c === 'refused') return 'Claude declined this request. Try different wording.';
  if (c === 'cancelled') return '';
  return 'Something went wrong reaching Claude. Try again.';
}
const koreanNote = () => SETTINGS.korean ? ' The learner is a Korean speaker: after each improvement and correction explanation, add a brief Korean gloss in parentheses where it helps understanding.' : '';

// ---------- Task registry ----------
const MCQ_SCHEMA_NOTE = 'Each question has "q", "options" (4 strings), "answer" (index 0-3 of the correct option), and "why" (one short sentence explaining the answer, quoting the text where possible). Vary which index is correct.';
const isMcq = qs => Array.isArray(qs) && qs.length >= 2 && qs.every(q => q && typeof q.q === 'string' && Array.isArray(q.options) && q.options.length >= 3 && Number.isInteger(q.answer) && q.answer >= 0 && q.answer < q.options.length);
const isLines = ls => Array.isArray(ls) && ls.length >= 1 && ls.every(l => l && typeof l.t === 'string' && (l.s === 0 || l.s === 1));

const TASKS = {
  ctw: { section: 'Reading', name: 'Complete the Words', blurb: 'Fill in missing letters in an academic paragraph.', how: 'Each underlined gap is the second half of a word. Type the missing letters. Use the meaning and grammar of the sentence to decide the word.', render: renderCTW,
    gen: 'An academic paragraph of 70-90 words on a general science, history, or social science topic. The first sentence has no brackets. After that, put [square brackets] around exactly 10 words, roughly every second word, choosing ordinary words (articles, prepositions, verbs, nouns). Keep the final sentence unbracketed.',
    ok: it => typeof it.text === 'string' && (it.text.match(/\[[A-Za-z']+\]/g) || []).length >= 6 },
  daily: { section: 'Reading', name: 'Read in Daily Life', blurb: 'Notices, emails, posts and ads with short questions.', how: 'Read the everyday text and answer the questions. Focus on purpose, key details, and what a phrase means in context.', render: renderDaily,
    gen: 'A realistic everyday text of 90-140 words (campus notice, email, flyer, online post, schedule, or menu) and 3 questions about purpose, details, and meaning in context. Use \\n for line breaks in "text". "kind" names the text type. ' + MCQ_SCHEMA_NOTE,
    ok: it => typeof it.text === 'string' && isMcq(it.questions) },
  academic: { section: 'Reading', name: 'Read an Academic Passage', blurb: 'A ~250-word passage with 5 questions.', how: 'Read the passage and answer the questions: vocabulary, detail, negative fact, author purpose, and inference.', render: renderAcademic,
    gen: 'An introductory-textbook style passage of 230-280 words split into 4 paragraphs in "paras", with 5 questions: one vocabulary-in-context, two detail, one author-purpose, one inference. ' + MCQ_SCHEMA_NOTE,
    ok: it => Array.isArray(it.paras) && it.paras.length >= 2 && isMcq(it.questions) },
  respond: { section: 'Listening', name: 'Listen and Choose a Response', blurb: 'Hear one line, pick the best reply.', how: 'Play each sentence, then choose the most natural reply. Watch for replies that repeat words from the question but don\'t answer it.', render: renderRespond,
    gen: 'A set of 5 items. Each item has "say" (one spoken sentence a student or staff member might say on campus), "options" (4 written replies: one natural, three distractors that reuse words or answer the wrong question), "answer" (index of the natural reply), and "why" (one sentence explaining why it is the natural reply). Vary the correct index.',
    ok: it => Array.isArray(it.items) && it.items.length >= 3 && it.items.every(x => typeof x.say === 'string' && Array.isArray(x.options) && x.options.length >= 3 && Number.isInteger(x.answer)) },
  convo: { section: 'Listening', name: 'Listen to a Conversation', blurb: 'Two speakers on campus, then questions.', how: 'Listen to the whole conversation (no reading along). Then answer the questions. The transcript appears after you check.', render: renderListen,
    gen: 'A natural campus conversation of 7-10 turns between two people (student with professor, staff member, or classmate) about a practical problem, as "lines" with "s" (0 or 1 for the speaker), "name" (role), and "t" (what they say). Then 3 questions: main problem, a detail or suggestion, and what happens next. ' + MCQ_SCHEMA_NOTE,
    ok: it => isLines(it.lines) && it.lines.length >= 4 && isMcq(it.questions) },
  announce: { section: 'Listening', name: 'Listen to an Announcement', blurb: 'A short campus or class announcement.', how: 'Listen to the announcement and answer the questions about its purpose and key details.', render: renderListen,
    gen: 'A campus or classroom announcement of 70-100 words spoken by one person, as "lines" with exactly one entry {"s":0,"name":"Speaker","t":"..."}. Then 2 questions: main purpose and a key detail or instruction. ' + MCQ_SCHEMA_NOTE,
    ok: it => isLines(it.lines) && isMcq(it.questions) },
  talk: { section: 'Listening', name: 'Listen to an Academic Talk', blurb: 'A short lecture, then questions.', how: 'Listen to the talk and answer questions about the main idea, details, and why the speaker mentions something.', render: renderListen,
    gen: 'An introductory university lecture of 140-190 words by one professor on a science, social science, or humanities topic, as "lines" with exactly one entry {"s":0,"name":"Professor","t":"..."}. Then 3 questions: main topic, a detail, and why the professor mentions an example. ' + MCQ_SCHEMA_NOTE,
    ok: it => isLines(it.lines) && isMcq(it.questions) },
  build: { section: 'Writing', name: 'Build a Sentence', blurb: 'Put word tiles in order to make a correct reply.', how: 'Tap the words in order to build a grammatical reply. One extra word in each set doesn\'t belong. Tap a placed word to send it back.', render: renderBuild,
    gen: 'A set of 5 items. Each has "context" (a short question someone asks), "answer" (a 6-10 word grammatical reply without final punctuation, testing word order such as embedded questions, tenses, conditionals, or comparatives), "end" (the final punctuation mark), "distractor" (one plausible wrong extra word not in the answer), optional "alts" (other fully correct word orders of exactly the same words), and "why" (one sentence naming the grammar point and why the distractor does not fit).',
    ok: it => Array.isArray(it.items) && it.items.length >= 3 && it.items.every(x => typeof x.context === 'string' && typeof x.answer === 'string' && x.answer.split(' ').length >= 3) },
  email: { section: 'Writing', name: 'Write an Email', blurb: '7 minutes to answer a real-life situation.', how: 'Read the situation and write an email that covers all three points. Aim for about 100–150 words with a clear greeting, purpose, and closing.', render: renderEmail, timed: 7 * 60,
    gen: 'An everyday situation requiring an email to a specific person (teacher, neighbor, manager, company, club leader) in "scenario" (2 sentences ending with "Write an email to ..."), and exactly 3 "points" the email must cover. Also a "model" email of 110-150 words using \\n for line breaks.',
    ok: it => typeof it.scenario === 'string' && Array.isArray(it.points) && it.points.length >= 2 },
  discuss: { section: 'Writing', name: 'Academic Discussion', blurb: '10 minutes to add your view to a class forum.', how: 'Read the professor\'s question and two classmates\' posts. Write a post that gives your opinion with reasons and an example. Aim for at least 100 words.', render: renderDiscuss, timed: 10 * 60,
    gen: 'A class discussion board: "professor" (a name like "Dr. Kim"), "prompt" (60-90 words posing a debatable question), "students" (exactly 2 objects with "name" and "post", 40-60 words each, taking different positions). Also a "model" response of 110-140 words that engages with one classmate.',
    ok: it => typeof it.prompt === 'string' && Array.isArray(it.students) && it.students.length >= 2 },
  repeat: { section: 'Speaking', name: 'Listen and Repeat', blurb: 'Repeat 7 sentences that get longer.', how: 'Play each sentence, then say it back exactly. The microphone starts automatically after the audio. Missed words are underlined.', render: renderRepeat,
    gen: 'A training scenario: "context" (1-2 sentences, e.g. you are learning to give tours of X; listen and repeat), and exactly 7 "sentences" that a trainer says in that setting, growing from 3-4 words to 16-20 words. Write numbers as words.',
    ok: it => typeof it.context === 'string' && Array.isArray(it.sentences) && it.sentences.length >= 5 },
  interview: { section: 'Speaking', name: 'Take an Interview', blurb: 'Answer 4 questions, about 45 seconds each.', how: 'An interviewer asks four questions. Answer each one right away for about 45 seconds. Your speech is transcribed so you can review it.', render: renderInterview,
    gen: 'A research-study interview: "intro" (1-2 sentences: you agreed to take part in a study about X; an interviewer will ask four questions), and exactly 4 "questions" moving from personal experience to opinion to a hypothetical.',
    ok: it => typeof it.intro === 'string' && Array.isArray(it.questions) && it.questions.length >= 3 }
};
Object.assign(TASKS, {
  skim: { section: 'Reading strategies', name: 'Skim for structure', blurb: 'See only topic sentences for a few seconds, then answer.', how: 'You\'ll see the title and the key sentences of each paragraph for a short time. Then the passage disappears and you answer questions about the main idea and where information is.', render: renderSkim,
    gen: 'An introductory-textbook passage of 220-280 words in exactly 4 "paras" with a clear topic sentence starting every paragraph and a thesis as the LAST sentence of paragraph 1. Then 4 questions that can be answered ONLY from the title, the first sentence of each paragraph, and the last sentences of paragraphs 1 and 4: one main idea, two "Which paragraph would you read to find...?" (options "Paragraph 1" to "Paragraph 4"), and one about a paragraph\'s purpose or the organization. Each question also has "why" explaining which skimmed sentence gives the answer. ' + MCQ_SCHEMA_NOTE,
    ok: it => Array.isArray(it.paras) && it.paras.length >= 3 && isMcq(it.questions) },
  trans: { section: 'Reading strategies', name: 'Signal words', blurb: 'Choose transitions and predict what comes next.', how: 'Pick the signal word that fits each gap, then predict where the writer is going next. Signal words show how ideas connect, so you can follow the logic without reading every word slowly.', render: renderTrans,
    gen: 'An academic paragraph of 90-120 words with exactly 4 or 5 gaps written as [[function:Correct|Wrong1|Wrong2|Wrong3]] where function is one of contrast, concession, cause, result, example, addition, time. The correct transition comes FIRST; the 3 wrong ones are from other functions and clearly do not fit grammatically or logically. Also "predict": 2 questions, each quoting a sentence that ends with a transition (e.g. "However, …") and asking what most likely comes next, with 4 options, "answer" index, and "why".',
    ok: it => typeof it.text === 'string' && (it.text.match(/\[\[[a-z ]+:[^\]]+\]\]/g) || []).length >= 3 && isMcq(it.predict) },
  vic: { section: 'Reading strategies', name: 'Vocabulary in context', blurb: 'Work out unfamiliar words from clues around them.', how: 'Each sentence contains a word from your TOEFL word lists (the PrepScholar 327 list and the Academic Word List). Guess its meaning, then name the clue that helped. You\'ll see the clue highlighted after you check.', render: renderVic,
    genBase: 'Each "text" is one or two academic sentences containing the target word (any natural form of it) wrapped in {{double braces}}, and the context clue phrase wrapped in [[double brackets]]. Give 4 meaning "options", "answer" index, "clue" (exactly one of: definition, synonym, contrast, example, general sense; use at least 4 different types across the set), and "why" explaining how the clue reveals the meaning.',
    ok: it => Array.isArray(it.items) && it.items.length >= 3 && it.items.every(x => /\{\{.+?\}\}/.test(x.text) && Array.isArray(x.options) && Number.isInteger(x.answer) && CLUES.includes(x.clue)) }
});
Object.assign(TASKS, {
  guided: { section: 'Listening strategies', name: 'Guided notes', blurb: 'Fill in an outline while the talk plays once.', how: 'You get the outline of the notes with gaps. Read it first, then fill each gap while the talk plays. This shows what good notes look like and trains you to listen for key words.', render: renderGuided,
    gen: 'A spoken mini-lecture of 160-200 words by one professor with a clear stance at the end, as "lines" with exactly one entry {"s":0,"name":"Professor","t":"..."}. Plus "skeleton": partial notes of 7-10 lines (use \\n), starting with "TOPIC:", following the order of the talk, with 9-12 gaps written as [[answer|alternative|alternative]]. Each answer is a single key word or number the listener actually hears; alternatives are acceptable variants (lowercase). Include one gap on a line starting "Speaker\'s view:".',
    ok: it => isLines(it.lines) && typeof it.skeleton === 'string' && (it.skeleton.match(/\[\[[^\]]+\]\]/g) || []).length >= 5 },
  segment: { section: 'Listening strategies', name: 'One note per chunk', blurb: 'Hear a talk in short pieces; note each in 8 words.', how: 'The talk comes in short pieces, each played once. After each piece you write its key idea in 8 words or fewer, then compare with a model note. This trains choosing what to write and what to skip.', render: renderSegment,
    gen: 'One mini-lecture split into exactly 5 "segments". Each segment is {"t": 1-3 spoken sentences by a professor, continuing the same talk, "keys": 2-4 arrays of lowercase keyword alternatives or word stems that a good note must contain, "model": a model note of 8 words or fewer}. Segment 1 introduces the topic, the middle ones give an explanation, a term, and an example, and segment 5 states the professor\'s opinion.',
    ok: it => Array.isArray(it.segments) && it.segments.length >= 3 && it.segments.every(g => typeof g.t === 'string' && Array.isArray(g.keys) && typeof g.model === 'string') },
  notes: { section: 'Listening strategies', name: 'Lecture notes and tone', blurb: 'Hear a full talk once, take free notes, answer from them.', how: 'The talk plays only once. Take notes, then answer from your notes, including questions about the speaker\'s attitude. Synthetic voices can\'t express tone through intonation, so listen for attitude words like "frankly," "I\'m skeptical," or "what I find encouraging." For real tone of voice, use the drill with your own podcast.', render: renderNotes,
    gen: 'A spoken university mini-lecture of 200-250 words by one professor, as "lines" with exactly one entry {"s":0,"name":"Professor","t":"..."}. The professor must take a clear stance (skeptical, enthusiastic, critical, cautiously optimistic, etc.) expressed through wording such as "frankly", "I\'m not convinced", "what\'s remarkable is", plus at least one defined term, one example, and one contrast. Include "attitude": an array of 4-6 exact short phrases copied from the lecture that reveal the stance. Include "model": model notes of 6-10 lines in short plain phrases (no special symbols), with \n line breaks. Then 5 questions: main idea, a detail or definition, two about the professor\'s attitude or tone, and one about why the professor says or mentions something. Each question has "why" explaining which part of the notes answers it. ' + MCQ_SCHEMA_NOTE,
    ok: it => isLines(it.lines) && isMcq(it.questions) && Array.isArray(it.attitude) },
  byo: { section: 'Listening strategies', name: 'Notes on your own podcast', blurb: 'Take notes on any real lecture or podcast, then check them.', how: 'Practice with real speakers and real tone of voice. Listen once to any lecture or podcast, take shorthand notes here, and summarize the main idea and attitude from your notes. With a transcript, Claude can quiz you and review your notes.', render: renderByo, noSets: true }
});
// New vocabulary sets pick 5 words from the word lists that no set has used yet.
Object.defineProperty(TASKS.vic, 'gen', { get() {
  const seen = new Set(pool('vic').flatMap(s => (s.items || []).map(x => ((x.text.match(/\{\{(.+?)\}\}/) || [])[1] || '').toLowerCase())));
  const fresh = shuffle((DATA.vicWords || []).filter(w => !seen.has(w))).slice(0, 5);
  return `A set of 5 items using exactly these target words, one per item: ${fresh.join(', ')}. ` + this.genBase;
} });
TASKS.rtest = { section: 'Reading', name: 'Full Reading test', blurb: 'All three task types in order, about 25 minutes. Estimated band at the end.', test: true };
TASKS.ltest = { section: 'Listening', name: 'Full Listening test', blurb: 'All four task types, each recording plays once. Estimated band at the end.', test: true };
const SECTIONS = [
  { name: 'Reading', meta: 'about 30 min, adaptive', tasks: ['ctw', 'daily', 'academic'] },
  { name: 'Reading strategies', meta: 'skill drills', tasks: ['skim', 'trans', 'vic'] },
  { name: 'Listening', meta: 'about 29 min, adaptive', tasks: ['respond', 'convo', 'announce', 'talk'] },
  { name: 'Listening strategies', meta: 'note-taking drills', tasks: ['guided', 'segment', 'notes', 'byo'] },
  { name: 'Writing', meta: '23 min', tasks: ['build', 'email', 'discuss'] },
  { name: 'Speaking', meta: '8 min', tasks: ['repeat', 'interview'] }
];

// ---------- Navigation: bottom tabs, header, screens ----------
const TABS = [
  { id: 'home', label: 'Home', icon: '⌂' },
  { id: 'reading', label: 'Reading', icon: '📖', groups: [
    { name: 'Practice test', meta: 'full section, timed', tasks: ['rtest'] },
    { name: 'Test tasks', meta: 'about 30 min, adaptive', tasks: ['ctw', 'daily', 'academic'] },
    { name: 'Strategy drills', meta: 'skills practice', tasks: ['skim', 'trans', 'vic'] }] },
  { id: 'listening', label: 'Listening', icon: '🎧', groups: [
    { name: 'Practice test', meta: 'full section, timed', tasks: ['ltest'] },
    { name: 'Test tasks', meta: 'about 29 min, adaptive', tasks: ['respond', 'convo', 'announce', 'talk'] },
    { name: 'Note-taking drills', meta: 'skills practice', tasks: ['guided', 'segment', 'notes', 'byo'] }] },
  { id: 'writing', label: 'Writing', icon: '✍️', groups: [
    { name: 'Test tasks', meta: '23 min', tasks: ['build', 'email', 'discuss'] }] },
  { id: 'speaking', label: 'Speaking', icon: '🎙️', groups: [
    { name: 'Test tasks', meta: '8 min', tasks: ['repeat', 'interview'] }] },
  { id: 'words', label: 'Words', icon: '🗂️' }
];
const SKILL_TABS = TABS.filter(t => t.groups);
const ALL_TASK_IDS = SKILL_TABS.flatMap(t => t.groups.flatMap(g => g.tasks)).filter(id => !TASKS[id].test);
const openAny = id => TASKS[id].test ? openTest(id) : openTask(id);
const tabOf = id => SKILL_TABS.find(t => t.groups.some(g => g.tasks.includes(id)));
let currentTab = 'home', screen = 'tab';

// Korean versions of the task instructions (Settings › Show instructions in Korean)
const KO_HOW = {
  ctw: '밑줄 친 빈칸은 단어의 뒷부분입니다. 빠진 철자를 입력하세요. 문장의 의미와 문법을 이용해 어떤 단어인지 판단하세요.',
  daily: '일상적인 글을 읽고 질문에 답하세요. 글의 목적, 핵심 세부 정보, 문맥 속 표현의 의미에 집중하세요.',
  academic: '지문을 읽고 어휘, 세부 정보, 사실이 아닌 것 찾기, 글쓴이의 의도, 추론 문제에 답하세요.',
  skim: '제목과 각 단락의 핵심 문장을 짧은 시간 동안만 볼 수 있습니다. 지문이 사라진 뒤 중심 내용과 정보가 어디에 있는지에 관한 질문에 답하세요.',
  trans: '각 빈칸에 알맞은 연결어를 고른 뒤, 글쓴이가 다음에 무슨 말을 할지 예측하세요. 연결어는 생각이 어떻게 이어지는지 보여 주므로 모든 단어를 천천히 읽지 않아도 논리를 따라갈 수 있습니다.',
  vic: '각 문장에는 단어 목록(PrepScholar 327 단어와 Academic Word List)에 있는 단어가 하나 있습니다. 뜻을 추측한 다음, 도움이 된 단서의 종류를 고르세요. 확인하면 단서가 표시됩니다.',
  respond: '각 문장을 듣고 가장 자연스러운 대답을 고르세요. 질문의 단어를 반복하지만 실제로는 답이 되지 않는 선택지에 주의하세요.',
  convo: '대화 전체를 (글을 보지 않고) 들은 뒤 질문에 답하세요. 정답을 확인하면 대본이 나타납니다.',
  announce: '안내 방송을 듣고 목적과 핵심 세부 정보에 관한 질문에 답하세요.',
  talk: '강의를 듣고 중심 내용, 세부 정보, 그리고 화자가 어떤 내용을 언급한 이유에 관한 질문에 답하세요.',
  guided: '빈칸이 있는 노트 개요가 주어집니다. 먼저 개요를 읽고, 강의가 한 번 재생되는 동안 빈칸을 채우세요. 좋은 노트의 모습을 익히고 핵심 단어를 듣는 연습이 됩니다.',
  segment: '강의가 짧은 부분으로 나뉘어 각각 한 번만 재생됩니다. 각 부분이 끝나면 핵심 내용을 8단어 이내로 적고 모범 노트와 비교하세요. 무엇을 적고 무엇을 건너뛸지 고르는 연습입니다.',
  notes: '강의는 한 번만 재생됩니다. 노트를 적은 뒤, 화자의 태도에 관한 질문을 포함해 노트만 보고 답하세요. 컴퓨터 음성은 억양으로 어조를 잘 표현하지 못하므로 "frankly", "I\'m skeptical" 같은 태도 표현에 귀 기울이세요. 실제 어조를 연습하려면 나만의 팟캐스트 연습을 이용하세요.',
  byo: '실제 화자의 목소리와 어조로 연습하세요. 강의나 팟캐스트를 한 번만 들으며 여기에 노트를 적고, 노트를 보고 중심 내용과 화자의 태도를 요약하세요. 대본이 있으면 Claude가 퀴즈를 내고 노트를 검토해 줍니다.',
  build: '단어를 순서대로 눌러 문법에 맞는 대답을 만드세요. 각 문제에는 필요 없는 단어가 하나 있습니다. 놓은 단어를 누르면 다시 돌아갑니다.',
  email: '상황을 읽고 세 가지 요점을 모두 포함하는 이메일을 쓰세요. 인사, 목적, 맺음말을 갖추어 약 100~150단어로 쓰세요.',
  discuss: '교수의 질문과 두 학생의 글을 읽으세요. 이유와 예시를 들어 자신의 의견을 쓰세요. 최소 100단어를 목표로 하세요.',
  repeat: '각 문장을 재생한 뒤 들은 그대로 따라 말하세요. 음성이 끝나면 마이크가 자동으로 켜집니다. 놓친 단어에는 밑줄이 표시됩니다.',
  words: '틀린 단어는 더 자주, 아는 단어는 덜 자주 다시 나옵니다. 매일 복습할 단어를 먼저 공부하세요.',
  interview: '면접관이 네 가지 질문을 합니다. 각 질문이 끝나면 바로 약 45초 동안 답하세요. 말한 내용이 글로 바뀌어 나중에 다시 확인할 수 있습니다.'
};

const TEXT_SIZES = [0.9, 1, 1.12, 1.25, 1.4];
function applyTextSize() { document.documentElement.style.setProperty('--rs', String(SETTINGS.textScale || 1)); }
function stepText(dir) {
  const cur = SETTINGS.textScale || 1;
  let i = TEXT_SIZES.findIndex(v => Math.abs(v - cur) < 0.01); if (i < 0) i = 1;
  i = Math.max(0, Math.min(TEXT_SIZES.length - 1, i + dir));
  SETTINGS.textScale = TEXT_SIZES[i]; saveSettings(); applyTextSize();
}
applyTextSize();

function setHeader(title, back) {
  $('#hdrTitle').textContent = title;
  $('#backBtn').hidden = !back;
  document.body.classList.toggle('in-sub', !!back);
}
function paintTabbar() {
  $('#tabbar').innerHTML = `<div class="tabbar-inner" role="tablist">${TABS.map(t =>
    `<button class="tab${t.id === currentTab ? ' active' : ''}" role="tab" aria-selected="${t.id === currentTab}" data-tab="${t.id}"><span class="ic" aria-hidden="true">${t.icon}</span><span>${t.label}</span></button>`).join('')}</div>`;
  $$('#tabbar [data-tab]').forEach(b => b.addEventListener('click', () => go(() => renderTab(b.dataset.tab))));
}
// Screens below the tabs (a task, settings, progress) add one history entry,
// so Android's back button and the header arrow return to the tabs.
function enterSub() {
  screen = 'sub';
  try { if (!(history.state && history.state.toefl)) history.pushState({ toefl: 'sub' }, ''); } catch (e) { }
}
function goBack() {
  try { if (history.state && history.state.toefl) { history.back(); return; } } catch (e) { }
  go(() => renderTab(currentTab));
}
$('#backBtn').addEventListener('click', goBack);
$('#settingsBtn').addEventListener('click', () => go(renderSettings));

function renderTab(tabId) {
  currentTab = TABS.some(t => t.id === tabId) ? tabId : 'home';
  screen = 'tab'; keepAwake(false);
  paintTabbar();
  if (currentTab === 'home') return renderHomeTab();
  if (currentTab === 'words') return renderWordsTab();
  const tab = TABS.find(t => t.id === currentTab);
  setHeader(tab.label, false);
  stage.innerHTML = `<h1>${tab.label}</h1>` + tab.groups.map(g => `
    <section class="sec">
      <div class="sec-head"><h2>${g.name}</h2><span class="sec-meta">${g.meta}</span></div>
      ${g.tasks.map(taskRowHtml).join('')}
    </section>`).join('');
  wireTaskRows();
}
function taskRowHtml(id) {
  return `<button class="task-row" data-task="${id}">
    <span><span class="nm">${TASKS[id].name}</span><br><span class="bl">${TASKS[id].blurb}</span></span>
    ${badgeFor(id)}</button>`;
}
function wireTaskRows() { $$('.task-row[data-task]').forEach(b => b.addEventListener('click', () => go(() => openAny(b.dataset.task)))); }

// ---------- Home tab ----------
function badgeFor(id) {
  const s = STATS[id];
  if (!s || !s.sets) return '<span class="badge">not started</span>';
  if (s.tot) return `<span class="badge on">${s.sets} done, ${Math.round(100 * s.pts / s.tot)}%</span>`;
  return `<span class="badge on">${s.sets} done${s.last != null ? `, last ${s.last}/5` : ''}</span>`;
}
function suggestNext() {
  let worst = null;
  for (const id of ALL_TASK_IDS) {
    const s = STATS[id]; if (!s || !s.tot) continue;
    const p = s.pts / s.tot; if (p < 0.8 && (!worst || p < worst.p)) worst = { id, p };
  }
  if (worst) return { id: worst.id, why: `Your average here is ${Math.round(worst.p * 100)}%, your lowest score.` };
  const fresh = ALL_TASK_IDS.find(id => !STATS[id] || !STATS[id].sets);
  if (fresh) return { id: fresh, why: "You haven't tried this one yet." };
  let low = null;
  for (const id of ALL_TASK_IDS) { const s = STATS[id]; if (s && s.last != null && s.last < 4 && (!low || s.last < low.v)) low = { id, v: s.last }; }
  if (low) return { id: low.id, why: `Your last score was ${low.v}/5.` };
  const id = ALL_TASK_IDS[Math.floor(Math.random() * ALL_TASK_IDS.length)];
  return { id, why: 'Everything looks strong. Keep this skill fresh.' };
}
function skillAverage(tab) {
  let pts = 0, tot = 0, sets = 0;
  tab.groups.forEach(g => g.tasks.forEach(id => { const s = STATS[id]; if (!s) return; sets += s.sets || 0; pts += s.pts || 0; tot += s.tot || 0; }));
  return { pct: tot ? Math.round(100 * pts / tot) : null, sets };
}
const isStandalone = () => (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) || navigator.standalone;
function dailyCardHtml() {
  const st = streak(), due = dueWords(AWL_ALL()).length;
  const live = DAILY && !DAILY.finished, doneToday = DAILY && DAILY.finished;
  return `<button class="home-card primary" id="dailyBtn">
      <span class="hc-kicker">Daily 15${st ? ` · 🔥 ${st}-day streak` : ''}</span>
      <span class="hc-title">${live ? `Continue: step ${DAILY.i + 1} of ${DAILY.steps.length}` : doneToday ? 'Done for today ✓ · Start another mix' : 'Start today\'s 15-minute mix'}</span>
      <span class="hc-sub">Words, mistakes, reading, listening, writing, and speaking, picked from your weakest areas.</span></button>
    ${dueMistakes().length ? `<button class="home-card" id="mistakesDue"><span class="hc-kicker">Mistake review</span><span class="hc-title">${dueMistakes().length} missed question${dueMistakes().length > 1 ? 's' : ''} to review</span><span class="hc-sub">Questions you got wrong come back after 1, 3, and 7 days.</span></button>` : ''}
    ${due ? `<button class="home-card" id="wordsDue"><span class="hc-kicker">Words</span><span class="hc-title">${due} word${due > 1 ? 's' : ''} due for review</span><span class="hc-sub">Academic Word List</span></button>` : ''}`;
}
function renderHomeTab() {
  setHeader('TOEFL iBT', false);
  const last = store.get('toefl26-last', null);
  const sug = suggestNext();
  const lastOk = last && TASKS[last.id];
  stage.innerHTML = `
    ${IS_ANDROID && !isStandalone() && !store.get('toefl26-android-tip', 0) ? `<div class="notice info" id="androidTip" style="margin:0 0 18px; display:flex; gap:10px; align-items:flex-start;"><span><b>Install it as an app:</b> in Chrome, tap ⋮, then <b>Install app</b>. It then works offline.</span><button class="icon-btn" id="androidTipX" style="color:var(--pine); border-color:var(--pine); flex-shrink:0;" aria-label="Dismiss tip">✕</button></div>` : ''}
    <h1>TOEFL iBT practice</h1>
    <p class="sub">Every task type on the current test (the format in use since January 21, 2026), plus strategy drills.</p>
    ${dailyCardHtml()}
    ${lastOk ? `<button class="home-card" id="contBtn">
      <span class="hc-kicker">Continue</span>
      <span class="hc-title">${esc(TASKS[last.id].name)}</span>
      <span class="hc-sub">${esc(tabOf(last.id).label)}, set ${(last.idx || 0) + 1}</span></button>` : ''}
    <button class="home-card" id="sugBtn">
      <span class="hc-kicker">Suggested next</span>
      <span class="hc-title">${esc(TASKS[sug.id].name)}</span>
      <span class="hc-sub">${esc(sug.why)}</span></button>
    <section class="sec">
      <div class="sec-head"><h2>Your skills</h2><button class="btn ghost small" id="progBtn">📈 Progress</button></div>
      ${SKILL_TABS.map(t => { const a = skillAverage(t); return `
        <button class="skill-row" data-goto="${t.id}">
          <span class="sk-name">${t.icon} ${t.label}</span>
          <span class="sk-bar" aria-hidden="true"><i style="width:${a.pct ?? 0}%"></i></span>
          <span class="sk-val">${a.pct != null ? a.pct + '%' : (a.sets ? a.sets + ' done' : '—')}</span>
        </button>`; }).join('')}
    </section>`;
  if (lastOk) $('#contBtn').addEventListener('click', () => go(() => openTask(last.id, last.idx)));
  $('#dailyBtn').addEventListener('click', () => go(() => (DAILY && !DAILY.finished) ? runDailyStep() : startDaily()));
  const wb = $('#wordsDue'); if (wb) wb.addEventListener('click', () => go(() => renderTab('words')));
  const mb = $('#mistakesDue'); if (mb) mb.addEventListener('click', () => go(() => runMistakes(shuffle(dueMistakes()).slice(0, 10))));
  $('#sugBtn').addEventListener('click', () => go(() => openTask(sug.id)));
  $('#progBtn').addEventListener('click', () => go(renderProgress));
  $$('[data-goto]').forEach(b => b.addEventListener('click', () => go(() => renderTab(b.dataset.goto))));
  const tipX = $('#androidTipX'); if (tipX) tipX.addEventListener('click', () => { store.set('toefl26-android-tip', 1); $('#androidTip').remove(); });
}

// ---------- Progress screen ----------
function sparkline(vals) {
  if (!vals.length) return '';
  const w = 120, h = 32, n = vals.length;
  const pts = vals.map((v, i) => [n === 1 ? w / 2 : (i * (w - 6)) / (n - 1) + 3, h - 3 - v * (h - 6)]);
  const d = pts.map(p => p.map(x => x.toFixed(1)).join(',')).join(' ');
  const [lx, ly] = pts[pts.length - 1];
  return `<svg class="spark" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" aria-hidden="true"><line x1="0" y1="${(h - 3 - 0.8 * (h - 6)).toFixed(1)}" x2="${w}" y2="${(h - 3 - 0.8 * (h - 6)).toFixed(1)}" class="spark-goal"/><polyline points="${d}" class="spark-line"/><circle cx="${lx.toFixed(1)}" cy="${ly.toFixed(1)}" r="3" class="spark-dot"/></svg>`;
}
function renderProgress() {
  enterSub(); setHeader('Progress', true);
  const now = Date.now(), week = 7 * 864e5;
  const all = Object.values(HIST).flat();
  const thisWeek = all.filter(e => now - e.t < week).length;
  const days = new Set(all.filter(e => now - e.t < 30 * 864e5).map(e => new Date(e.t).toDateString())).size;
  stage.innerHTML = `
    <h1>Your progress</h1>
    <div class="stat-row">
      <div class="stat"><b>${thisWeek}</b><span>sets this week</span></div>
      <div class="stat"><b>${days}</b><span>days practiced in the last 30</span></div>
    </div>
    ${(() => { const all = Object.keys(MISTAKES).length, d = dueMistakes().length; return all ? `<div class="notice info" style="margin:0 0 12px; display:flex; justify-content:space-between; align-items:center; gap:10px;"><span>${all} question${all > 1 ? 's' : ''} in mistake review${d ? `, ${d} due now` : ''}.</span>${d ? '<button class="btn small" id="progMist">Review</button>' : ''}</div>` : ''; })()}
    ${(() => { const lb = store.get('toefl26-lastbackup', null); const studied = store.get('toefl26-days', []).length; return studied >= 3 && (!lb || (Date.now() - new Date(lb).getTime()) > 30 * 864e5) ? '<p class="hint">💾 Tip: save a backup of your progress in Settings.</p>' : ''; })()}
    <p class="hint">Each line shows your last 12 scores for a task. The dotted line marks 80%.</p>
    ${SKILL_TABS.map(t => `
      <section class="sec"><div class="sec-head"><h2>${t.label}</h2></div>
      ${t.groups.flatMap(g => g.tasks).map(id => {
        const h = (HIST[id] || []).slice(-12);
        const vals = h.map(e => e.v);
        const lastV = vals.length ? Math.round(vals[vals.length - 1] * 100) : null;
        const trend = vals.length >= 2 ? vals[vals.length - 1] - vals[0] : 0;
        return `<button class="prog-row" data-task="${id}">
          <span class="pr-name">${TASKS[id].name}<br><span class="hint">${vals.length ? `${vals.length} recent score${vals.length > 1 ? 's' : ''}` : 'No scores yet'}</span></span>
          ${vals.length ? sparkline(vals) : '<span class="spark-empty"></span>'}
          <span class="pr-val">${lastV != null ? lastV + '%' : '—'}${vals.length >= 2 ? `<span class="${trend >= 0 ? 'up' : 'down'}">${trend >= 0.005 ? ' ↑' : trend <= -0.005 ? ' ↓' : ''}</span>` : ''}</span>
        </button>`;
      }).join('')}</section>`).join('')}`;
  $$('.prog-row[data-task]').forEach(b => b.addEventListener('click', () => go(() => openAny(b.dataset.task))));
  const pm = $('#progMist'); if (pm) pm.addEventListener('click', () => go(() => runMistakes(shuffle(dueMistakes()).slice(0, 10))));
}

// ---------- Settings screen ----------
function renderSettings() {
  enterSub(); setHeader('Settings', true);
  stage.innerHTML = `
    <h1>Settings</h1>
    <div class="set-grid">
      <div><span class="lbl">Text size for passages and questions</span>
        <div class="seg" id="sizeSeg">${TEXT_SIZES.map((v, i) => `<button data-size="${v}" class="${Math.abs((SETTINGS.textScale || 1) - v) < 0.01 ? 'active' : ''}" style="font-size:${12 + i * 1.5}px">A</button>`).join('')}</div></div>
      <label class="check"><input type="checkbox" id="koBox" ${SETTINGS.koInstr ? 'checked' : ''}><span>Show task instructions in Korean too (과제 설명을 한국어로도 보기)</span></label>
      <div><span class="lbl">Speaking speed of the audio</span>
        <div class="seg" id="rateSeg">
          ${[[0.75, 'Slower'], [0.9, 'Natural'], [1.05, 'Test pace']].map(([v, l]) => `<button data-rate="${v}" class="${SETTINGS.rate == v ? 'active' : ''}">${l}</button>`).join('')}
        </div></div>
      <div><span class="lbl">Recorded voices</span>
        <label class="check"><input type="checkbox" id="studioBox" ${SETTINGS.studio !== false ? 'checked' : ''}><span>Use recorded studio voices when available. New sets from Claude use your phone's voices.</span></label>
        <p class="hint" id="studioStatus" style="margin:6px 0 0;">${studioStatus()}</p>
        <div class="row" style="margin-top:8px;"><button class="btn ghost small" id="saveAudioBtn">Save all audio for offline use</button></div>
        <p class="hint" id="saveAudioOut" style="margin:6px 0 0;"></p>
      </div>
      <div><span class="lbl">Phone voices (used when there's no recording)</span>
        <div class="voice-grid">
          <span>Speaker 1</span><select id="vA" aria-label="Voice for speaker 1"></select><button class="btn ghost small" data-prev="0" aria-label="Preview speaker 1">▶</button>
          <span>Speaker 2</span><select id="vB" aria-label="Voice for speaker 2"></select><button class="btn ghost small" data-prev="1" aria-label="Preview speaker 2">▶</button>
        </div>
        <p class="hint" id="voiceTip" style="margin:8px 0 0;"></p>
        <div class="row" style="margin-top:8px;"><button class="btn ghost small" id="voiceTest">🔊 Hear a sample conversation</button></div>
      </div>
      <label class="check"><input type="checkbox" id="examBox" ${SETTINGS.exam ? 'checked' : ''}><span>Exam mode: each listening audio plays only once, like the real test.</span></label>
      <label class="check"><input type="checkbox" id="hapBox" ${SETTINGS.haptics !== false ? 'checked' : ''}><span>Vibrate briefly when answers are checked.</span></label>
      <div><span class="lbl">Claude features (optional)</span>
        <p class="hint" style="margin:0 0 8px;">New sets and scoring for writing, speaking, and notes need your own Anthropic API key (from console.anthropic.com). It's saved only on this device and sent only to Anthropic. Usage is billed to your Anthropic account. Leave it empty to turn these features off.</p>
        <input id="apiKeyIn" class="field-in" type="password" autocomplete="off" spellcheck="false" placeholder="sk-ant-…" value="${esc(SETTINGS.apiKey || '')}">
        <div class="row" style="margin-top:8px;"><input id="modelIn" class="field-in" style="flex:1; min-width:0;" autocomplete="off" spellcheck="false" value="${esc(SETTINGS.model || DEFAULT_MODEL)}" aria-label="Claude model name"><button class="btn small" id="saveKeyBtn">Save</button></div>
        <p class="hint" id="keyOut" style="margin:6px 0 0;">${sample ? 'Claude features are on.' : 'Claude features are off.'}</p>
        <label class="check" style="margin-top:8px;"><input type="checkbox" id="korBox" ${SETTINGS.korean ? 'checked' : ''}><span>Add short Korean notes to Claude's feedback.</span></label>
      </div>
      <div><span class="lbl">Backup and restore</span>
        <p class="hint" style="margin:0 0 8px;">Your progress is stored only on this device. Save a backup file before changing phones or clearing browser data. Your API key is never included. Last backup: ${store.get('toefl26-lastbackup', null) || 'never'}.</p>
        <div class="row"><button class="btn small" id="exportBtn">⬇ Save backup</button><button class="btn ghost small" id="importBtn">⬆ Restore from file</button><input type="file" id="importFile" accept="application/json,.json" hidden></div>
        <p class="hint" id="backupOut" style="margin:6px 0 0;"></p>
      </div>
      <div class="row"><button class="btn ghost small" id="welcomeBtn">Show the welcome guide</button><button class="btn ghost small" id="resetBtn">Clear my progress</button></div>
      <p class="hint" style="margin:0;">Speech-to-text in the speaking tasks needs an internet connection and works best in Chrome. Your progress is saved on this device.</p>
    </div>`;
  $('#sizeSeg').addEventListener('click', e => { const b = e.target.closest('button'); if (!b) return; SETTINGS.textScale = +b.dataset.size; saveSettings(); applyTextSize(); $$('#sizeSeg button').forEach(x => x.classList.toggle('active', x === b)); });
  $('#koBox').addEventListener('change', e => { SETTINGS.koInstr = e.target.checked; saveSettings(); });
  $('#rateSeg').addEventListener('click', e => { const b = e.target.closest('button'); if (!b) return; SETTINGS.rate = +b.dataset.rate; saveSettings(); $$('#rateSeg button').forEach(x => x.classList.toggle('active', x === b)); });
  $('#examBox').addEventListener('change', e => { SETTINGS.exam = e.target.checked; saveSettings(); });
  $('#korBox').addEventListener('change', e => { SETTINGS.korean = e.target.checked; saveSettings(); });
  $('#hapBox').addEventListener('change', e => { SETTINGS.haptics = e.target.checked; saveSettings(); });
  $('#studioBox').addEventListener('change', e => { SETTINGS.studio = e.target.checked; saveSettings(); });
  $('#saveAudioBtn').addEventListener('click', e => saveAllAudio(e.target, $('#saveAudioOut')));
  $('#saveKeyBtn').addEventListener('click', () => {
    SETTINGS.apiKey = $('#apiKeyIn').value.trim(); SETTINGS.model = $('#modelIn').value.trim() || DEFAULT_MODEL; saveSettings(); refreshAI();
    $('#keyOut').textContent = sample ? 'Saved. Claude features are on.' : 'Key removed. Claude features are off.';
  });
  fillVoiceSelects();
  [['vA', 'voiceA'], ['vB', 'voiceB']].forEach(([el, key]) => $('#' + el).addEventListener('change', e => { SETTINGS[key] = e.target.value; saveSettings(); }));
  $$('[data-prev]').forEach(b => b.addEventListener('click', () => {
    const s = +b.dataset.prev;
    speakTTS([{ s, t: s === 0 ? "Hi, thanks for coming in. What can I help you with today?" : "Well, I wanted to ask about the reading for next week, if you have a minute." }]);
  }));
  $('#voiceTest').addEventListener('click', () => speakTTS([
    { s: 1, t: "Hi Professor, do you have a minute? I had a question about the assignment." },
    { s: 0, t: "Sure, come on in. What's on your mind?" },
    { s: 1, t: "I wasn't sure whether the summary should include my own opinion." },
    { s: 0, t: "Good question. Keep the summary neutral, then add your opinion in a separate paragraph at the end." }]));
  $('#welcomeBtn').addEventListener('click', () => showWelcome());
  $('#exportBtn').addEventListener('click', () => exportBackup($('#backupOut')));
  $('#importBtn').addEventListener('click', () => $('#importFile').click());
  $('#importFile').addEventListener('change', e => { const f = e.target.files[0]; if (f) importBackup(f, $('#backupOut')); e.target.value = ''; });
  $('#resetBtn').addEventListener('click', e => {
    if (!e.target.dataset.armed) { e.target.dataset.armed = '1'; e.target.textContent = 'Tap again to clear all scores'; return; }
    STATS = {}; CURSOR = {}; HIST = {}; MISTAKES = {}; saveMistakes(); TEST_USED = {}; store.set('toefl26-testused', {}); SRS = {}; DAILY = null; saveSRS(); saveDaily(); store.set('toefl26-days', []);
    store.set('toefl26-stats', STATS); store.set('toefl26-cursor', CURSOR); store.set('toefl26-hist', HIST); store.set('toefl26-last', null);
    e.target.textContent = 'Progress cleared'; e.target.disabled = true;
  });
}

// ---------- Welcome guide (first launch) ----------
function showWelcome() {
  let step = 0;
  const ua = navigator.userAgent;
  const installText = isStandalone()
    ? "You're already using the installed app. Nice."
    : /iPhone|iPad|iPod/.test(ua)
      ? 'In Safari, tap the Share button, then <b>Add to Home Screen</b>.'
      : 'In Chrome, tap <b>⋮</b> in the top corner, then <b>Install app</b> (or <b>Add to Home screen</b>). The app then opens like any other app and works offline.';
  const slides = [
    { title: 'Practice the whole TOEFL', body: `<p>Use the tabs at the bottom: <b>Reading</b>, <b>Listening</b>, <b>Writing</b>, and <b>Speaking</b>. Each has the real test tasks, and Reading and Listening also have strategy drills. <b>Words</b> has the Academic Word List with spaced review.</p><p>Short on time? Tap <b>Daily 15</b> on Home for a 15-minute mix of everything.</p>
      <label class="check"><input type="checkbox" id="wKo" ${SETTINGS.koInstr ? 'checked' : ''}><span>Show task instructions in Korean too<br><span lang="ko">과제 설명을 한국어로도 보기</span></span></label>` },
    { title: 'Install it on your phone', body: `<p>${installText}</p>` },
    { title: 'Save the audio for offline use', body: `<p>Listening tasks use recorded voices. Save them once on Wi-Fi (about 5 to 10 MB) so they play without internet.</p>
      <div class="row"><button class="btn ghost" id="wSave">Save audio now</button></div><p class="hint" id="wSaveOut"></p>
      <p class="hint">You can do this later in Settings (⚙️).</p>` }
  ];
  const ov = document.createElement('div'); ov.className = 'welcome'; ov.setAttribute('role', 'dialog'); ov.setAttribute('aria-modal', 'true'); ov.setAttribute('aria-label', 'Welcome guide');
  document.body.appendChild(ov); document.body.classList.add('sheet-open');
  const close = () => { store.set('toefl26-welcomed', 1); ov.remove(); document.body.classList.remove('sheet-open'); if (screen === 'tab') renderTab(currentTab); };
  const paint = () => {
    const s = slides[step], lastStep = step === slides.length - 1;
    ov.innerHTML = `<div class="welcome-card">
      <div class="w-top"><span class="w-dots">${slides.map((_, i) => `<i class="${i === step ? 'on' : ''}"></i>`).join('')}</span><button class="btn ghost small" data-w="skip">Skip</button></div>
      <h2 class="w-title">${s.title}</h2>
      <div class="w-body">${s.body}</div>
      <div class="w-nav">${step ? '<button class="btn ghost" data-w="prev">Back</button>' : '<span></span>'}<button class="btn" data-w="next">${lastStep ? 'Start practicing' : 'Next'}</button></div>
    </div>`;
    $('[data-w=skip]', ov).addEventListener('click', close);
    $('[data-w=next]', ov).addEventListener('click', () => { if (lastStep) close(); else { step++; paint(); } });
    const pv = $('[data-w=prev]', ov); if (pv) pv.addEventListener('click', () => { step--; paint(); });
    const ko = $('#wKo', ov); if (ko) ko.addEventListener('change', e => { SETTINGS.koInstr = e.target.checked; saveSettings(); });
    const ws = $('#wSave', ov); if (ws) ws.addEventListener('click', e => saveAllAudio(e.target, $('#wSaveOut', ov)));
    $('[data-w=next]', ov).focus();
  };
  paint();
}

// ---------- Task shell ----------
let current = { id: null, idx: 0 };
function openTask(id, idx, opts = {}) {
  enterSub();
  const list = pool(id);
  if (idx == null) idx = (CURSOR[id] || 0) % list.length;
  idx = Math.min(idx, list.length - 1);
  const daily = !!(opts.daily && DAILY);
  current = { id, idx, daily };
  CURSOR[id] = idx; store.set('toefl26-cursor', CURSOR);
  store.set('toefl26-last', { id, idx });
  const t = TASKS[id], tab = tabOf(id);
  if (tab) { currentTab = tab.id; paintTabbar(); }
  if (/Listening|Speaking/.test(t.section)) keepAwake(true);
  setHeader(daily ? dailyTitle() : t.name, true);
  const audioTask = t.section === 'Listening' || t.section === 'Speaking' || t.section === 'Listening strategies' || id === 'build';
  stage.innerHTML = `
    <div class="task-head">
      <span class="sec-meta">${esc(tab ? tab.label : t.section)}</span>
      <span class="row" style="gap:6px;">
        <button class="btn ghost small" data-act="smaller" aria-label="Smaller text">A−</button>
        <button class="btn ghost small" data-act="bigger" aria-label="Larger text">A+</button>
        ${audioTask ? '<button class="btn ghost small" data-act="voices" aria-label="Audio settings">🔊</button>' : ''}
      </span>
    </div>
    <h1>${t.name}</h1>
    <p class="task-how">${t.how}</p>
    ${SETTINGS.koInstr && KO_HOW[id] ? `<p class="task-how ko" lang="ko">${KO_HOW[id]}</p>` : ''}
    ${daily ? `<div class="set-bar"><span class="ttl"><span>Daily 15 · ${esc(DAILY.steps[DAILY.i].label)}</span>${esc(list[idx].title || '')}</span></div>` : t.noSets ? '' : `<div class="set-bar">
      <span class="ttl"><span>Set ${idx + 1} of ${list.length}</span>${esc(list[idx].title || '')}</span>
      <span class="row" style="gap:6px;">
        <button class="btn ghost small" data-act="prev" ${idx === 0 ? 'disabled' : ''} aria-label="Previous set">◀ Previous</button>
        <button class="btn ghost small" data-act="next">Next set ▶</button>
        <button class="btn ghost small ai-only" data-act="gen">✨ New set from Claude</button>
      </span>
    </div>`}
    <div id="genNote"></div>
    <div id="body"></div>`;
  $('[data-act=smaller]').addEventListener('click', () => stepText(-1));
  $('[data-act=bigger]').addEventListener('click', () => stepText(1));
  const vb = $('[data-act=voices]'); if (vb) vb.addEventListener('click', () => go(renderSettings));
  if (!t.noSets && !daily) {
    $('[data-act=next]').addEventListener('click', () => go(() => openTask(id, (idx + 1) % pool(id).length)));
    $('[data-act=prev]').addEventListener('click', () => { if (idx > 0) go(() => openTask(id, idx - 1)); });
    $('[data-act=gen]').addEventListener('click', () => generateSet(id));
  }
  t.render(list[idx], $('#body'), id);
}

async function generateSet(id) {
  const t = TASKS[id], note = $('#genNote'), btn = $('[data-act=gen]');
  if (!sample) return;
  const example = DATA[id][0];
  const exampleClean = Object.assign({}, example); delete exampleClean.model;
  const used = pool(id).map(x => x.title).filter(Boolean).join('; ');
  const wantsModel = 'model' in example;
  const prompt = `Create ONE new, original practice item for the TOEFL iBT (2026 format) task "${t.name}".
Requirements: ${t.gen}
Include a short "title" naming the topic.${wantsModel ? ' Include the "model" field as described.' : ''}
Use natural, accurate English at a TOEFL level (CEFR B2 to C1). Make sure every answer key is unambiguously correct.
Match the JSON structure of this example exactly (same keys and value types), but with a completely different topic and new wording:
${JSON.stringify(exampleClean)}
Do not reuse these topics: ${used}.
Reply with only the JSON object.`;
  btn.disabled = true;
  note.innerHTML = '<p class="thinking">Claude is writing a new set. This can take up to a minute…</p>';
  const ctl = new AbortController(); onLeave(() => ctl.abort());
  try {
    const item = await sample.json(prompt, { signal: ctl.signal, cache: false });
    if (!item || typeof item !== 'object' || !t.ok(item)) throw { code: 'invalid_json' };
    if (!item.title) item.title = 'New set';
    (EXTRA[id] = EXTRA[id] || []).push(item); store.set('toefl26-extra', EXTRA);
    go(() => openTask(id, pool(id).length - 1));
  } catch (e) {
    btn.disabled = false;
    const msg = aiErrorText(e);
    note.innerHTML = msg ? `<div class="notice err">${esc(msg)}</div>` : '';
  }
}

// ---------- Shared MCQ ----------
function mcqHtml(qs, pfx, startNum = 1) {
  return qs.map((q, i) => `
    <fieldset class="q" data-qi="${i}">
      <legend>${startNum + i}. ${esc(q.q)}</legend>
      ${q.options.map((o, j) => `<label class="opt"><input type="radio" name="${pfx}-${i}" value="${j}"><span>${esc(o)}</span></label>`).join('')}
    </fieldset>`).join('');
}
// track (optional): { task, item, qi(i) } records results for mistake review
// and adds an "Ask Claude why" button to missed questions.
function gradeMcq(qs, pfx, root, track) {
  let right = 0;
  qs.forEach((q, i) => {
    const chosen = $(`input[name="${pfx}-${i}"]:checked`, root);
    const labels = $$(`input[name="${pfx}-${i}"]`, root).map(x => x.closest('label'));
    labels.forEach((l, j) => { $('input', l).disabled = true; if (j === q.answer) l.classList.add('right'); });
    let ok = false;
    if (chosen) { const v = +chosen.value; if (v === q.answer) { right++; ok = true; } else labels[v].classList.add('wrong'); }
    const fs = labels.length ? labels[0].closest('fieldset') : null;
    if (q.why && fs && !fs.querySelector('.why')) fs.insertAdjacentHTML('beforeend', `<div class="why">${esc(q.why)}</div>`);
    if (track) {
      const qi = track.qi ? track.qi(i) : i;
      noteResult(track.task, track.item, qi, ok);
      if (!ok && fs && !fs.querySelector('[data-ask]')) {
        const extra = track.task === 'respond' ? track.item.items[qi].say : track.task === 'vic' ? track.item.items[qi].text.replace(/\{\{|\}\}|\[\[|\]\]/g, '') : '';
        const rq = reviewQuestion(track.task, track.item, qi) || q;
        fs.insertAdjacentHTML('beforeend', `<div class="row ask-row">${askBtnHtml(explainPrompt(track.task, track.item, rq, chosen ? q.options[+chosen.value] : '', extra), 'Ask Claude why ↗', 'btn ghost small')}</div>`);
      }
    }
  });
  return right;
}
function stampHtml(right, total) {
  const p = total ? right / total : 0;
  const cls = p >= 0.8 ? 'good' : p >= 0.5 ? 'mid' : 'low';
  return `<div class="stamp ${cls}">${right} / ${total}</div>`;
}
// The Check button stays pinned to the bottom of the screen on phones, so
// you never have to scroll hunting for it after the last question.
function checkRow(label = 'Check answers', extra = '') {
  return `<div class="check-bar"><span class="answered" data-answered></span>${extra}<button class="btn" data-check>${label}</button></div><div class="result" data-result></div>`;
}
document.addEventListener('change', e => {
  if (!e.target.matches('input[type=radio]')) return;
  const body = e.target.closest('#body'); if (!body) return;
  const out = $('[data-answered]', body); if (!out) return;
  const groups = new Set($$('fieldset.q input[type=radio]', body).map(x => x.name));
  const done = [...groups].filter(n => $(`input[name="${n}"]:checked`, body)).length;
  out.textContent = groups.size ? `${done}/${groups.size} done` : '';
});
function openSheet(title, html) {
  closeSheet();
  const sh = document.createElement('div'); sh.className = 'sheet'; sh.setAttribute('role', 'dialog'); sh.setAttribute('aria-modal', 'true'); sh.setAttribute('aria-label', title);
  sh.innerHTML = `<div class="sheet-head"><b>${esc(title)}</b><button class="btn small" data-sheet-close>Close</button></div><div class="sheet-body">${html}</div>`;
  document.body.appendChild(sh); document.body.classList.add('sheet-open');
  $('[data-sheet-close]', sh).addEventListener('click', closeSheet);
  $('[data-sheet-close]', sh).focus();
}
function closeSheet() { const sh = $('.sheet'); if (!sh) return false; sh.remove(); document.body.classList.remove('sheet-open'); return true; }
function afterCheck(body, id, extraHtml = '') {
  const res = $('[data-result]', body);
  if (current.daily && DAILY && DAILY.steps[DAILY.i] && DAILY.steps[DAILY.i].id === id) {
    if (!DAILY.results[DAILY.i]) dailyResult(0, 0);
    res.insertAdjacentHTML('beforeend', `${extraHtml}<div class="row" style="justify-content:center; margin-top:16px;"><button class="btn" data-nextset>${dailyNextLabel()}</button></div>`);
    $('[data-nextset]', body).addEventListener('click', dailyNext);
    return;
  }
  res.insertAdjacentHTML('beforeend', `${extraHtml}<div class="row" style="justify-content:center; margin-top:16px;"><button class="btn" data-nextset>Next set ▶</button></div>`);
  $('[data-nextset]', body).addEventListener('click', () => go(() => openTask(id, (current.idx + 1) % pool(id).length)));
}

// ---------- Reading ----------
// One box per missing letter, like the real test. Each box holds exactly
// one letter, so phone keyboards can't type past the word's length.
function mountCtw(item, host) {
  const blanks = [];
  host.innerHTML = esc(item.text).replace(/\[([A-Za-z']+)\]/g, (m, w) => {
    const k = Math.max(1, Math.floor(w.length / 2));
    const shown = w.slice(0, k), miss = w.slice(k);
    const i = blanks.length; blanks.push(miss);
    const boxes = [...miss].map((_, j) => `<input class="ctw-box" data-w="${i}" data-j="${j}" maxlength="1" inputmode="text" autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false" aria-label="Word ${i + 1}, letter ${k + j + 1}">`).join('');
    return `<span class="ctw-word" data-word="${i}">${shown}<span class="ctw-boxes">${boxes}</span></span>`;
  });
  const boxes = $$('.ctw-box', host);
  const letters = v => (v || '').replace(/[^A-Za-z']/g, '');
  boxes.forEach((bx, n) => {
    bx.addEventListener('input', () => {
      const v = letters(bx.value);
      // Android keyboards can deliver several letters at once: spread them
      // across the following boxes of the same word instead of overflowing.
      bx.value = v.slice(0, 1);
      let k = n;
      for (const ch of v.slice(1)) { if (!boxes[k + 1] || boxes[k + 1].dataset.w !== bx.dataset.w) break; k++; boxes[k].value = ch; }
      if (v && boxes[k + 1]) boxes[k + 1].focus(); else if (v) bx.blur();
    });
    bx.addEventListener('keydown', e => {
      if (e.key === 'Backspace' && !bx.value && boxes[n - 1]) { e.preventDefault(); boxes[n - 1].value = ''; boxes[n - 1].focus(); }
      else if (e.key === 'ArrowLeft' && boxes[n - 1]) { e.preventDefault(); boxes[n - 1].focus(); }
      else if ((e.key === 'ArrowRight' || e.key === 'Enter') && boxes[n + 1]) { e.preventDefault(); boxes[n + 1].focus(); }
    });
    bx.addEventListener('focus', () => { try { bx.select(); } catch (e) { } });
  });
  const word = i => $$(`.ctw-box[data-w="${i}"]`, host);
  return { blanks, boxes, word, values: () => blanks.map((_, i) => word(i).map(b => b.value).join('')) };
}
function renderCTW(item, body, id) {
  body.innerHTML = `<div class="ctw" id="ctwHost"></div>${checkRow()}`;
  const ctl = mountCtw(item, $('#ctwHost', body)), blanks = ctl.blanks;
  const ins = blanks.map((_, i) => ({ get value() { return ctl.word(i).map(b => b.value).join(''); } }));
  $('[data-check]', body).addEventListener('click', e => {
    e.target.disabled = true; let right = 0;
    ins.forEach((inp, i) => {
      const ok = inp.value.toLowerCase() === blanks[i].toLowerCase(); if (ok) right++;
      $$(`.ctw-box[data-w="${i}"]`, body).forEach(b => { b.disabled = true; b.classList.add(ok ? 'ok' : 'bad'); });
      if (!ok) $(`.ctw-word[data-word="${i}"]`, body).insertAdjacentHTML('beforeend', `<span class="fix">${esc(blanks[i])}</span>`);
    });
    record(id, right, blanks.length);
    $('[data-result]', body).innerHTML = stampHtml(right, blanks.length);
    const full = esc(item.text).replace(/\[([A-Za-z']+)\]/g, (m, w) => `<b class="target">${w}</b>`);
    afterCheck(body, id, `<div style="text-align:left; margin-top:18px;"><div class="lbl">The complete paragraph</div><div class="transcript" style="margin-top:0;">${full}</div>
      <p class="hint">Tip: decide each word's part of speech first (noun, verb, article, preposition), then check that it fits the grammar around it.</p></div>`);
  });
}
function renderDaily(item, body, id) {
  useWide(true);
  body.innerHTML = `<div class="split"><div class="split-left"><div class="doc" tabindex="0"><span class="kind">${esc(item.kind || 'Text')}</span>${esc(item.text)}</div></div>
    <div class="split-right">${mcqHtml(item.questions, 'd')}${checkRow()}</div></div>`;
  $('[data-check]', body).addEventListener('click', e => {
    e.target.disabled = true; const r = gradeMcq(item.questions, 'd', body, { task: id, item });
    record(id, r, item.questions.length); $('[data-result]', body).innerHTML = stampHtml(r, item.questions.length); afterCheck(body, id);
  });
}
function renderAcademic(item, body, id) {
  const passageHtml = `<h3>${esc(item.title)}</h3>${item.paras.map((p, i) => `<p><span class="pnum">¶${i + 1}</span>${esc(p)}</p>`).join('')}`;
  useWide(true);
  body.innerHTML = `<div class="split"><div class="split-left"><div class="passage" tabindex="0" aria-label="Reading passage">${passageHtml}</div></div>
    <div class="split-right">${mcqHtml(item.questions, 'a')}${checkRow('Check answers', '<button class="btn ghost" data-sheet>📄 Passage</button>')}</div></div>`;
  $('[data-sheet]', body).addEventListener('click', () => openSheet(item.title, passageHtml));
  $('[data-check]', body).addEventListener('click', e => {
    e.target.disabled = true; const r = gradeMcq(item.questions, 'a', body, { task: id, item });
    record(id, r, item.questions.length); $('[data-result]', body).innerHTML = stampHtml(r, item.questions.length); afterCheck(body, id);
  });
}


// ---------- Reading strategies ----------
const SIGNALS = /\b(however|therefore|for example|for instance|such as|in addition|moreover|furthermore|as a result|consequently|although|even though|because|in contrast|on the other hand|nevertheless|similarly|likewise|thus|in fact|instead|whereas|in turn|finally|over time|before this|one reason)\b/gi;
const markSignals = html => html.replace(SIGNALS, m => `<span class="tw">${m}</span>`);
// Which sentences a skimmer reads: every paragraph's first sentence, plus the
// last sentence of the introduction and of the conclusion.
function skimVisible(paras) {
  return paras.map((p, i) => {
    const ss = splitSentences(p), vis = new Set([0]);
    if ((i === 0 || i === paras.length - 1) && ss.length > 1) vis.add(ss.length - 1);
    return { ss, vis };
  });
}
function renderSkim(item, body, id) {
  const sk = skimVisible(item.paras);
  const secs = 10 * item.paras.length + 5;
  body.innerHTML = `
    <div class="strat-tip"><b>How to skim:</b> read the title, the first sentence of each paragraph, and the last sentence of the introduction and conclusion. Ask: what is each paragraph's job?</div>
    <div class="write-bar"><span>You have ${secs} seconds</span><span class="timer" id="tm"></span></div>
    <div class="skim-box" id="skimBox">
      <h3>${esc(item.title)}</h3>
      ${sk.map(({ ss, vis }, i) => `<div class="skim-para"><span class="pnum">¶${i + 1}</span>${ss.map((s, k) => vis.has(k) ? `<span class="ts">${esc(s)}</span> ` : `<span class="bar" style="width:${Math.max(25, Math.min(100, s.length / 1.4))}%" aria-hidden="true"></span>`).join('')}</div>`).join('')}
    </div>
    <div class="row" style="margin-top:12px;"><button class="btn" id="doneSkim">Done skimming</button></div>
    <div id="qzone"></div>`;
  const toQuestions = () => {
    timer.stop();
    $('#skimBox', body).remove(); $('#doneSkim', body).remove();
    $('.write-bar', body).remove(); $('.strat-tip', body).remove();
    const q = $('#qzone', body);
    q.innerHTML = `<div class="notice info" style="margin:0 0 18px;">The passage is hidden now. Answer from your skim. Knowing where information is, without reading every word, is the skill you're building.</div>${mcqHtml(item.questions, 'sk')}${checkRow()}`;
    $('[data-check]', body).addEventListener('click', e => {
      e.target.disabled = true; const r = gradeMcq(item.questions, 'sk', body, { task: id, item });
      record(id, r, item.questions.length); $('[data-result]', body).innerHTML = stampHtml(r, item.questions.length);
      afterCheck(body, id, `<h3 style="text-align:left; margin:22px 0 6px;">The full passage</h3>
        <p class="hint" style="text-align:left; margin:0 0 8px;"><mark class="ts">Highlighted</mark> sentences are what you skimmed. <span class="tw">Underlined</span> words are signal words.</p>
        <div class="passage" style="text-align:left;">${sk.map(({ ss, vis }, i) => `<p><span class="pnum">¶${i + 1}</span>${ss.map((s, k) => vis.has(k) ? `<mark class="ts">${markSignals(esc(s))}</mark>` : markSignals(esc(s))).join(' ')}</p>`).join('')}</div>`);
    });
  };
  const timer = makeTimer($('#tm', body), secs, toQuestions);
  timer.start();
  $('#doneSkim', body).addEventListener('click', toQuestions);
}

const SIGNAL_GUIDE = [
  ['contrast', 'however, but, on the other hand, in contrast', 'The next idea goes against the last one. The writer\'s main point often follows.'],
  ['concession', 'although, even though, while', 'The writer admits one point, then makes a stronger one after the comma.'],
  ['cause', 'because, since, one reason is that', 'An explanation is coming. Useful for "why" questions.'],
  ['result', 'therefore, as a result, consequently, thus', 'An effect or conclusion is coming. Useful for inference questions.'],
  ['example', 'for example, for instance, such as', 'A specific case of the idea just stated. If you understood the idea, you can read examples quickly.'],
  ['addition', 'in addition, moreover, furthermore, also', 'More of the same kind of point.'],
  ['time', 'before this, then, over time, finally', 'Steps or history in order.']
];
function renderTrans(item, body, id) {
  const parts = item.text.split(/\[\[([a-z ]+):([^\]]+)\]\]/);
  const blanks = []; let html = '';
  for (let k = 0; k < parts.length; k++) {
    if (k % 3 === 0) { html += esc(parts[k]); continue; }
    const func = parts[k], opts = parts[k + 1].split('|').map(s => s.trim()); k++;
    const order = shuffle(opts.map((_, i) => i));
    const bi = blanks.length; blanks.push({ func, correct: opts[0], order });
    html += `<select class="tsel" data-b="${bi}" aria-label="Blank ${bi + 1}"><option value="">(${bi + 1}) choose…</option>${order.map(o => `<option value="${o}">${esc(opts[o])}</option>`).join('')}</select><span class="func" data-f="${bi}" hidden></span>`;
  }
  body.innerHTML = `
    <details class="guide"><summary>Signal word guide</summary>
      <table>${SIGNAL_GUIDE.map(([f, w, m]) => `<tr><td><b>${f}</b><br><span class="hint">${w}</span></td><td>${m}</td></tr>`).join('')}</table>
    </details>
    <h3 style="margin:18px 0 6px;">Part 1. Choose the signal word that fits</h3>
    <div class="trans-text">${html}</div>
    <h3 style="margin:24px 0 6px;">Part 2. Predict what comes next</h3>
    <p class="hint" style="margin-top:0;">Strong readers guess the next idea from the signal word before they read it.</p>
    ${mcqHtml(item.predict, 'pr')}
    ${checkRow()}`;
  $('[data-check]', body).addEventListener('click', e => {
    e.target.disabled = true; let r = 0;
    blanks.forEach((b, i) => {
      const sel = $(`[data-b="${i}"]`, body); sel.disabled = true;
      const ok = sel.value === '0'; if (ok) r++;
      sel.classList.add(ok ? 'ok' : 'bad');
      const f = $(`[data-f="${i}"]`, body); f.hidden = false;
      f.textContent = ok ? ` ${b.func}` : ` → ${b.correct} (${b.func})`;
    });
    r += gradeMcq(item.predict, 'pr', body, { task: id, item });
    const tot = blanks.length + item.predict.length;
    record(id, r, tot); $('[data-result]', body).innerHTML = stampHtml(r, tot); afterCheck(body, id);
  });
}

const CLUES = ['definition', 'synonym', 'contrast', 'example', 'general sense'];
function renderVic(item, body, id) {
  body.innerHTML = `
    <div class="strat-tip"><b>Don't stop at an unknown word.</b> Look around it for a clue: a definition (<i>meaning, that is</i>), a synonym (<i>or</i>), a contrast (<i>unlike, although, rather than</i>), examples (<i>such as, for example</i>), or the general sense of the sentence.</div>
    ${item.items.map((it, i) => {
      const t = esc(it.text).replace(/\{\{(.+?)\}\}/, '<b class="target">$1</b>').replace(/\[\[(.+?)\]\]/, '<span class="clue">$1</span>');
      return `<div class="vic-item" data-vi="${i}">
        <p class="vic-text">${i + 1}. ${t}</p>
        ${mcqHtml([{ q: 'What does the bold word most likely mean?', options: it.options, answer: it.answer }], 'vm' + i, i + 1).replace(/<legend>\d+\. /, '<legend>')}
        <div class="lbl">Which kind of clue helped?</div>
        <div class="chips" role="radiogroup">${CLUES.map(c => `<label class="chip"><input type="radio" name="vc${i}" value="${c}"><span>${c}</span></label>`).join('')}</div>
        <div class="why" hidden>${esc(it.why)}</div>
      </div>`;
    }).join('')}
    ${checkRow()}`;
  $('[data-check]', body).addEventListener('click', e => {
    e.target.disabled = true; let r = 0;
    item.items.forEach((it, i) => {
      const wrap = $(`[data-vi="${i}"]`, body);
      r += gradeMcq([{ q: '', options: it.options, answer: it.answer }], 'vm' + i, wrap, { task: id, item, qi: () => i });
      const chosen = $(`input[name="vc${i}"]:checked`, wrap);
      $$(`input[name="vc${i}"]`, wrap).forEach(x => {
        x.disabled = true; const l = x.closest('label');
        if (x.value === it.clue) l.classList.add('right'); else if (x.checked) l.classList.add('wrong');
      });
      if (chosen && chosen.value === it.clue) r++;
      wrap.classList.add('checked'); $('.why', wrap).hidden = false;
    });
    const tot = item.items.length * 2;
    record(id, r, tot); $('[data-result]', body).innerHTML = stampHtml(r, tot); afterCheck(body, id);
  });
}


// ---------- Listening strategies: note-taking ----------
function notepadHtml(ph = 'Take notes here while you listen…') {
  return `<div class="pad">
    <textarea class="pad-ta" spellcheck="false" autocapitalize="off" placeholder="${esc(ph)}"></textarea>
    <div class="pad-foot"><span>Short phrases, not full sentences</span><button type="button" class="btn ghost small" data-tpl>Insert template</button></div>
  </div>`;
}
function wireNotepad(root) {
  const ta = $('.pad-ta', root);
  $('[data-tpl]', root).addEventListener('click', () => { if (!ta.value.trim()) { ta.value = 'TOPIC:\nSPEAKER VIEW:\n• \n• \n• \nEXAMPLES:\nCONCLUSION:\n'; ta.focus(); ta.setSelectionRange(7, 7); } });
  return ta;
}
function markAttitude(text, phrases) {
  let h = esc(text);
  (phrases || []).forEach(p => { const e = esc(p); if (e && h.includes(e)) h = h.replace(e, `<mark class="att">${e}</mark>`); });
  return markSignals(h);
}

function notesFeedbackHtml(fb) {
  const list = a => Array.isArray(a) && a.length ? `<ul>${a.map(x => `<li>${esc(x)}</li>`).join('')}</ul>` : '<p class="hint">None noted.</p>';
  const yn = v => v ? '<span style="color:var(--green)">✓ yes</span>' : '<span style="color:var(--red)">✗ not clearly</span>';
  return `<div class="row" style="justify-content:space-between;"><span class="score">${esc(fb.coverage ?? '?')}</span><span class="hint">key points captured</span></div>
    <p style="margin:6px 0 0;">Main idea in your notes: ${yn(fb.main_idea_captured)}. Speaker's attitude in your notes: ${yn(fb.attitude_captured)}.</p>
    ${fb.summary ? `<p style="margin:6px 0 0;">${esc(fb.summary)}</p>` : ''}
    <h4>What your notes did well</h4>${list(fb.strengths)}
    <h4>Important points you missed</h4>${list(fb.missed)}
    ${Array.isArray(fb.shorter) && fb.shorter.length ? `<h4>Write it shorter</h4>${fb.shorter.map(c => `<div class="corr"><span class="o">${esc(c.original)}</span> → <span class="n">${esc(c.better)}</span></div>`).join('')}` : ''}`;
}
async function reviewNotes(out, btn, transcript, notes, extra = '') {
  const ctl = new AbortController(); onLeave(() => ctl.abort());
  btn.disabled = true;
  const box = document.createElement('div'); box.className = 'fb'; box.innerHTML = '<p class="thinking">Claude is comparing your notes with the talk…</p>'; out.prepend(box);
  const prompt = `You are a TOEFL listening coach. A student listened ONCE to the talk below and took the notes shown. Evaluate the notes as a tool for answering TOEFL questions: did they capture the main idea, the speaker's attitude or stance, the key supporting points and examples, and the logical links (cause, contrast, conclusion)? Also judge how efficiently they wrote: short phrases and key words rather than full sentences. Notes are supposed to be fragmentary, so never criticize grammar or spelling.

TALK TRANSCRIPT
"""${transcript.slice(0, 30000)}"""

STUDENT NOTES
"""${notes.slice(0, 6000)}"""
${extra}
Reply with only JSON:
{"coverage": "3/5", "main_idea_captured": true, "attitude_captured": false, "summary": "one or two encouraging sentences", "strengths": ["..."], "missed": ["important points or attitude cues missing from the notes"], "shorter": [{"original": "a long phrase from the notes", "better": "a shorter plain-word version keeping only the key words"}]}
"coverage" counts how many of the talk's 4-6 most important points appear in the notes. Give 2-3 strengths, up to 4 missed points, and up to 4 "shorter" rewrites (only if the notes contain long phrases).${koreanNote()}`;
  try {
    const fb = await sample.json(prompt, { signal: ctl.signal, cache: false });
    box.innerHTML = notesFeedbackHtml(fb);
  } catch (err) { const m = aiErrorText(err); box.innerHTML = m ? `<div class="notice err" style="margin:0;">${esc(m)}</div>` : ''; btn.disabled = false; }
}

function renderNotes(item, body, id) {
  const transcript = item.lines.map(l => l.t).join(' ');
  body.innerHTML = `
    <div class="strat-tip"><b>Listen once.</b> Write the topic, the speaker's view, the main points, and any example or term the speaker stresses. Use short phrases, not full sentences.</div>
    <div class="player" id="pl"></div>
    ${notepadHtml()}
    <div id="qzone"></div>`;
  const ta = wireNotepad(body);
  const showQs = () => {
    if ($('#qs', body)) return;
    $('#qzone', body).innerHTML = `<div id="qs"><h3 style="margin:22px 0 4px;">Answer using only your notes</h3><p class="hint" style="margin-top:0;">The talk won't play again, just like the real test.</p>${mcqHtml(item.questions, 'nt')}${checkRow()}</div>`;
    $('[data-check]', body).addEventListener('click', e => {
      e.target.disabled = true; const r = gradeMcq(item.questions, 'nt', body, { task: id, item });
      record(id, r, item.questions.length); $('[data-result]', body).innerHTML = stampHtml(r, item.questions.length);
      afterCheck(body, id, `
        <div style="text-align:left;">
          <div class="row" style="margin-top:20px;"><button class="btn ai-only" id="revBtn">Review my notes with Claude</button></div>
          <div id="revOut"></div>
          ${item.model ? `<div class="lbl" style="margin-top:18px;">Model notes</div><div class="model notes-font">${esc(item.model)}</div>` : ''}
          ${retellHtml()}
          <div class="lbl" style="margin-top:18px;">Transcript</div>
          <p class="hint" style="margin:0 0 6px;"><mark class="att">Highlighted</mark> words show the speaker's attitude. <span class="tw">Underlined</span> words are signal words.</p>
          <div class="transcript" style="margin-top:0;">${markAttitude(transcript, item.attitude)}</div>
        </div>`);
      wireRetell(body, transcript, ta.value);
      const rb = $('#revBtn', body);
      if (rb) rb.addEventListener('click', () => {
        if (wordCount(ta.value) < 3) { $('#revOut', body).innerHTML = '<div class="notice err">Your notes are empty. Take notes on the next set and try this again.</div>'; return; }
        reviewNotes($('#revOut', body), rb, transcript, ta.value);
      });
    });
  };
  mountPlayer($('#pl', body), item.lines, { label: '▶ Start the talk (plays once)', once: true, onFirstEnd: showQs });
}

function renderByo(item, body, id) {
  let secs = 0, h = null;
  body.innerHTML = `
    <div class="strat-tip"><b>Use real speakers.</b> Real voices carry tone (sarcasm, doubt, excitement) that synthetic voices can't. Open a 3 to 8 minute lecture or podcast in another tab or on another device. Good sources include TED-Ed, university lecture channels, and science podcasts. Press start, listen <b>once</b> without pausing, and take notes here.</div>
    <label class="lbl" for="src">What are you listening to? (optional)</label>
    <input id="src" class="field-in" placeholder="e.g. TED-Ed: How do vaccines work?">
    <div class="write-bar" style="margin-top:14px;"><button class="btn" id="startBtn">Start listening</button><span class="timer" id="clock">0:00</span></div>
    ${notepadHtml('Your notes…')}
    <div class="row" style="margin-top:10px;"><button class="btn" id="doneBtn" disabled>I've finished listening</button></div>
    <div id="after"></div>`;
  const ta = wireNotepad(body), clock = $('#clock', body);
  const stopClock = () => { clearInterval(h); h = null; };
  onLeave(stopClock);
  $('#startBtn', body).addEventListener('click', e => {
    e.target.disabled = true; $('#doneBtn', body).disabled = false; ta.focus();
    h = setInterval(() => { secs++; clock.textContent = `${Math.floor(secs / 60)}:${String(secs % 60).padStart(2, '0')}`; }, 1000);
  });
  $('#doneBtn', body).addEventListener('click', e => {
    e.target.disabled = true; stopClock();
    const after = $('#after', body);
    after.innerHTML = `
      <h3 style="margin:24px 0 6px;">From your notes alone</h3>
      <label class="lbl" for="sum">In one or two sentences, what was the main idea?</label>
      <textarea id="sum" class="write" style="min-height:70px;"></textarea>
      <label class="lbl" for="att" style="margin-top:12px;">What was the speaker's attitude or tone? What made you think so?</label>
      <textarea id="att" class="write" style="min-height:70px;"></textarea>
      <div class="ai-only" style="margin-top:22px;">
        <h3 style="margin:0 0 6px;">Check yourself with Claude</h3>
        <p class="hint" style="margin-top:0;">Paste the transcript. On YouTube, open the description and choose "Show transcript"; many podcasts publish transcripts too. Claude will quiz you from your notes and then review them.</p>
        <textarea id="tx" class="write" style="min-height:120px;" placeholder="Paste the transcript here…"></textarea>
        <div class="row" style="margin-top:10px;"><button class="btn" id="quizBtn">Quiz me on my notes</button></div>
      </div>
      <div id="selfCheck" class="${sample ? 'hidden-self' : ''}">
        <p class="hint" style="margin-top:18px;">Self-check: listen a second time and compare. Did your notes catch the main idea, every example, and the moment the speaker's tone changed? Mark each missed point with a different color so you can see your pattern.</p>
      </div>
      <div id="qz"></div>`;
    if (sample) $('#selfCheck', body).hidden = true;
    const qb = $('#quizBtn', body);
    if (qb) qb.addEventListener('click', async () => {
      const tx = $('#tx', body).value.trim(), qz = $('#qz', body);
      if (wordCount(tx) < 80) { qz.innerHTML = '<div class="notice err">Paste the full transcript (at least a paragraph) so Claude can write questions.</div>'; return; }
      qb.disabled = true; qz.innerHTML = '<p class="thinking">Claude is writing questions about the talk…</p>';
      const ctl = new AbortController(); onLeave(() => ctl.abort());
      try {
        const data = await sample.json(`You write TOEFL iBT listening questions. From the transcript below, write exactly 5 multiple-choice questions in TOEFL style: 1 main idea, 2 detail, 1 about the speaker's attitude or tone, and 1 about why the speaker mentions something or what they imply. Each has 4 options and one clearly correct answer. Also identify the main idea and the speaker's attitude.

TRANSCRIPT
"""${tx.slice(0, 30000)}"""

Reply with only JSON:
{"main_idea": "one sentence", "attitude": "one sentence describing the speaker's attitude and the words or cues that show it", "questions": [{"q": "...", "options": ["...", "...", "...", "..."], "answer": 0, "why": "short explanation"}]}
Vary which option index is correct.`, { signal: ctl.signal, cache: false });
        if (!isMcq(data.questions)) throw { code: 'invalid_json' };
        qz.innerHTML = `<h3 style="margin:22px 0 4px;">Answer from your notes</h3><p class="hint" style="margin-top:0;">Don't look at the transcript.</p>${mcqHtml(data.questions, 'by')}${checkRow()}`;
        $('#tx', body).closest('.ai-only').querySelector('textarea').style.display = 'none';
        $('[data-check]', qz).addEventListener('click', ev => {
          ev.target.disabled = true; const r = gradeMcq(data.questions, 'by', qz);
          record(id, r, data.questions.length);
          $('[data-result]', qz).innerHTML = stampHtml(r, data.questions.length) + `
            <div style="text-align:left; margin-top:18px;">
              <div class="prompt-box"><b>Main idea:</b> ${esc(data.main_idea)}<br><span class="hint">You wrote: ${esc($('#sum', body).value || '(nothing)')}</span></div>
              <div class="prompt-box"><b>Speaker's attitude:</b> ${esc(data.attitude)}<br><span class="hint">You wrote: ${esc($('#att', body).value || '(nothing)')}</span></div>
              <div class="row"><button class="btn" id="revBtn2">Review my notes with Claude</button></div>
              <div id="revOut2"></div>
            </div>`;
          const rb = $('#revBtn2', qz);
          rb.addEventListener('click', () => reviewNotes($('#revOut2', qz), rb, tx, ta.value, `\nThe student's own summary: ${$('#sum', body).value}\nThe student's description of the attitude: ${$('#att', body).value}\nComment briefly on whether these match the talk.`));
        });
      } catch (err) { const m = aiErrorText(err); qz.innerHTML = m ? `<div class="notice err">${esc(m)}</div>` : ''; qb.disabled = false; }
    });
  });
}


// ---------- Note-taking: guided notes, segment notes, retelling ----------
const normNote = s => s.toLowerCase().replace(/[’']/g, "'").replace(/\s+/g, ' ').trim();
function gapOk(input, alts) {
  const v = normNote(input).replace(/[.,;:!]+$/, '');
  if (!v) return false;
  return alts.some(a => { a = normNote(a); return v === a || v.includes(a) || (v.length >= 3 && a.includes(v)); });
}
function renderGuided(item, body, id) {
  const gaps = [];
  // Parse the raw outline (not the escaped one) so answers like "n't" stay intact
  const skel = item.skeleton.split(/\[\[([^\]]+)\]\]/).map((part, k) => {
    if (k % 2 === 0) return esc(part);
    const alts = part.split('|'); const i = gaps.length; gaps.push(alts);
    return `<input class="gap-in" data-g="${i}" style="width:calc(${Math.max(9, alts[0].length + 3)}ch)" autocomplete="off" autocapitalize="off" spellcheck="false" aria-label="Gap ${i + 1}">`;
  }).join('');
  body.innerHTML = `
    <div class="strat-tip"><b>Guided notes.</b> Read the outline first, so you know what to listen for. Then start the talk and fill each gap as you hear it. One or two words is enough. The talk plays once.</div>
    <div class="player" id="pl"></div>
    <div class="skeleton">${skel}</div>
    <div class="row" style="margin-top:12px;"><button class="btn" data-check disabled>Check my notes</button><span class="hint" id="ckHint">You can check after the talk ends.</span></div>
    <div class="result" data-result></div>`;
  const ins = $$('.gap-in', body);
  ins.forEach((inp, i) => inp.addEventListener('keydown', e => { if (e.key === 'Enter' && ins[i + 1]) { e.preventDefault(); ins[i + 1].focus(); } }));
  mountPlayer($('#pl', body), item.lines, { label: '▶ Start the talk (plays once)', once: true, onFirstEnd: () => { $('[data-check]', body).disabled = false; $('#ckHint', body).textContent = ''; } });
  $('[data-check]', body).addEventListener('click', e => {
    e.target.disabled = true; let r = 0;
    ins.forEach((inp, i) => {
      inp.disabled = true; const ok = gapOk(inp.value, gaps[i]);
      inp.classList.add(ok ? 'ok' : 'bad'); if (ok) r++;
      if (!ok) inp.insertAdjacentHTML('afterend', `<span class="fix">${esc(gaps[i][0])}</span>`);
    });
    record(id, r, gaps.length);
    $('[data-result]', body).innerHTML = stampHtml(r, gaps.length);
    const transcript = item.lines.map(l => l.t).join(' ');
    afterCheck(body, id, `<div style="text-align:left;">${retellHtml()}<div class="lbl" style="margin-top:18px;">Transcript</div><div class="transcript" style="margin-top:0;">${markSignals(esc(transcript))}</div></div>`);
    wireRetell(body, transcript, '');
  });
}

function renderSegment(item, body, id) {
  const notes = [], scores = [];
  let i = 0;
  const intro = () => {
    body.innerHTML = `
      <div class="strat-tip"><b>One note per chunk.</b> You'll hear the talk in ${item.segments.length} short pieces, each played once. After each piece, write its key idea in <b>8 words or fewer</b>. This trains you to choose what matters and skip the rest.</div>
      <div class="row"><button class="btn" id="go">Start</button></div>`;
    $('#go', body).addEventListener('click', step);
  };
  const step = () => {
    if (i >= item.segments.length) return finish();
    const seg = item.segments[i];
    body.innerHTML = `<div class="big-step">Part ${i + 1} of ${item.segments.length}</div>
      <div class="player" id="pl"></div>
      <div id="zone"><p class="hint">Listen first. The note box opens when this part ends.</p></div>`;
    const zone = $('#zone', body);
    const write = () => {
      zone.innerHTML = `<label class="lbl" for="nt">Your note for part ${i + 1}</label>
        <input id="nt" class="field-in notes-font" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="Key idea, 8 words or fewer">
        <div class="write-bar"><span id="wc">0 / 8 words</span><span class="timer" id="tm"></span></div>
        <div class="row"><button class="btn" id="save">Save note</button></div>`;
      const nt = $('#nt', body), wc = $('#wc', body);
      nt.focus();
      const timer = makeTimer($('#tm', body), 20, () => { $('#tm', body).textContent = "time's up"; });
      timer.start();
      nt.addEventListener('input', () => { const n = wordCount(nt.value); wc.textContent = `${n} / 8 words`; wc.style.color = n > 8 ? 'var(--red)' : ''; });
      nt.addEventListener('keydown', e => { if (e.key === 'Enter') $('#save', body).click(); });
      $('#save', body).addEventListener('click', () => {
        timer.stop();
        const v = nt.value.trim(); notes[i] = v;
        const hits = seg.keys.map(alts => alts.some(a => normNote(v).includes(a)));
        const got = hits.filter(Boolean).length; scores[i] = got / seg.keys.length;
        const over = wordCount(v) > 8;
        zone.innerHTML = `
          <div class="prompt-box notes-font" style="margin-bottom:8px;"><span class="hint" style="font-family:var(--serif);">Your note</span><br>${esc(v || '(empty)')}</div>
          <div class="prompt-box notes-font"><span class="hint" style="font-family:var(--serif);">Model note</span><br>${esc(seg.model)}</div>
          <p class="hint">Key ideas caught: ${got} of ${seg.keys.length}${over ? '. Your note ran over 8 words, so try cutting small words like "the" and "is."' : ''}</p>
          <details class="transcript"><summary>What was said</summary><p>${markSignals(esc(seg.t))}</p></details>
          <div class="row" style="margin-top:12px;"><button class="btn" id="nx">${i + 1 < item.segments.length ? 'Next part' : 'See all my notes'}</button></div>`;
        $('#nx', body).addEventListener('click', () => { i++; step(); });
      });
    };
    mountPlayer($('#pl', body), [{ s: 0, t: seg.t }], { label: `▶ Play part ${i + 1} (once)`, once: true, onFirstEnd: write });
  };
  const finish = () => {
    const avg = scores.reduce((a, b) => a + b, 0) / (scores.length || 1);
    record(id, Math.round(avg * item.segments.length * 10) / 10, item.segments.length);
    const transcript = item.segments.map(s => s.t).join(' ');
    body.innerHTML = `<div class="result">${stampHtml(Math.round(avg * 100), 100).replace(' / 100', '%')}</div>
      <p class="hint" style="text-align:center;">of key ideas captured</p>
      <div class="two-col">
        <div><div class="lbl">Your notes</div><div class="model notes-font">${notes.map((n, k) => `${k + 1}. ${esc(n || '—')}`).join('\n')}</div></div>
        <div><div class="lbl">Model notes</div><div class="model notes-font">${item.segments.map((s, k) => `${k + 1}. ${esc(s.model)}`).join('\n')}</div></div>
      </div>
      ${retellHtml()}
      <div class="result" data-result></div>`;
    wireRetell(body, transcript, notes.join('\n'));
    afterCheck(body, id);
  };
  intro();
}

// Retell the talk from notes: spoken (with speech-to-text) or typed, then scored by Claude
function retellHtml() {
  return `<div class="retell">
    <h3 style="margin:24px 0 4px;">Retell it from your notes</h3>
    <p class="hint" style="margin-top:0;">Looking only at your notes, explain the talk in about 60 seconds: the topic, the main points, an example, and the speaker's view. If you can retell it, your notes worked. It's also good practice for TOEFL Speaking.</p>
    ${templateHtml('retell')}
    <div class="write-bar"><button class="btn" data-rt-start>${SR ? '🎙 Start speaking' : 'Start the 60-second timer'}</button><span class="timer" data-rt-tm></span></div>
    <textarea class="write" data-rt-ta style="min-height:110px;" placeholder="${SR ? 'Your words appear here as you speak. You can also type.' : 'Say it out loud, or type your retelling here.'}"></textarea>
    <div class="row" style="margin-top:8px;"><button class="btn ai-only" data-rt-fb>Score my retelling with Claude</button><button class="btn ghost" data-rt-ask>Score in Claude ↗</button></div>
    <div data-rt-out></div>
  </div>`;
}
function wireRetell(root, transcript, notesText) {
  const ta = $('[data-rt-ta]', root), start = $('[data-rt-start]', root), out = $('[data-rt-out]', root);
  if (!ta) return;
  let rec = null;
  const stopRec = () => { if (rec) { rec.stop(); rec = null; } };
  onLeave(stopRec);
  const timer = makeTimer($('[data-rt-tm]', root), 60, stopRec);
  start.addEventListener('click', () => {
    start.disabled = true; timer.start();
    if (srAvailable()) rec = listen({ onText: t => { ta.value = t; }, onEnd: () => { }, onBlocked: () => { ta.placeholder = 'The microphone is blocked here. Type your retelling instead.'; ta.focus(); } });
    else ta.focus();
  });
  $('[data-rt-ask]', root).addEventListener('click', e => {
    stopRec(); timer.stop();
    const text = ta.value.trim();
    if (wordCount(text) < 15) { out.innerHTML = '<div class="notice err">Retell the talk first, with at least a few sentences.</div>'; return; }
    askClaude(`You are a TOEFL coach. I listened ONCE to a short talk, took notes, and then retold it from my notes in about 60 seconds. My retelling may come from speech-to-text, so ignore recognition glitches. Score it 0 to 5 (half points allowed) on accuracy and completeness (topic, main points, a key example, the speaker's view), organization, and clarity.

TALK TRANSCRIPT
${transcript.slice(0, 8000)}
${notesText ? `\nMY NOTES\n${notesText.slice(0, 2000)}\n` : ''}
MY RETELLING
${text}

Please give me my score, what I did well, what I missed or got wrong (and how better notes would have helped), and a model 90 to 110 word retelling.${koAsk()}`, e.target);
  });
  $('[data-rt-fb]', root).addEventListener('click', async e => {
    stopRec(); timer.stop();
    const text = ta.value.trim();
    if (wordCount(text) < 15) { out.innerHTML = '<div class="notice err">Retell the talk first, with at least a few sentences.</div>'; return; }
    const btn = e.target; btn.disabled = true;
    out.innerHTML = '<div class="fb"><p class="thinking">Claude is comparing your retelling with the talk…</p></div>';
    const ctl = new AbortController(); onLeave(() => ctl.abort());
    const prompt = `You are a TOEFL coach. A student listened ONCE to a short talk, took notes, and then retold the talk from their notes in about 60 seconds. The retelling may come from speech-to-text, so ignore recognition glitches and missing punctuation. Score it 0-5 (half points allowed) on: accuracy and completeness (topic, main points, a key example, the speaker's view or attitude), organization, and clarity of language.

TALK TRANSCRIPT
"""${transcript.slice(0, 20000)}"""
${notesText ? `\nSTUDENT NOTES\n"""${notesText.slice(0, 4000)}"""\n` : ''}
STUDENT RETELLING
"""${text.slice(0, 5000)}"""

Reply with only JSON:
{"score": 3.5, "summary": "one or two sentences", "strengths": ["..."], "improvements": ["specific advice, including what was missing or inaccurate and how better notes would have helped"], "corrections": [{"original": "phrase they used", "better": "clearer or more accurate phrasing", "why": "short reason"}], "sample": "a model 90-110 word spoken retelling"}
Give 2-3 strengths, 2-3 improvements, and up to 5 corrections.${koreanNote()}`;
    try {
      const fb = await sample.json(prompt, { signal: ctl.signal, cache: false });
      out.innerHTML = `<div class="fb">${feedbackHtml(fb)}</div>`;
    } catch (err) { const m = aiErrorText(err); out.innerHTML = m ? `<div class="notice err">${esc(m)}</div>` : ''; btn.disabled = false; }
  });
}

// ---------- Listening ----------
function transcriptHtml(lines) {
  return `<details class="transcript"><summary>Show transcript</summary>${lines.map(l => `<p>${lines.length > 1 ? `<b>${esc(l.name || 'Speaker')}:</b> ` : ''}${esc(l.t)}</p>`).join('')}</details>`;
}
function renderListen(item, body, id) {
  body.innerHTML = `<div class="player" id="pl"></div>
    <div id="qs" ${SETTINGS.exam ? 'hidden' : ''}>${SETTINGS.exam ? '' : '<p class="hint" style="margin-top:0;">Tip: try answering before you read the transcript.</p>'}${mcqHtml(item.questions, 'l')}${checkRow()}</div>
    <p class="hint" id="qwait" ${SETTINGS.exam ? '' : 'hidden'}>Questions appear after the audio ends. <button class="btn ghost small" id="showQ">Show questions now</button></p>`;
  const reveal = () => { $('#qs', body).hidden = false; $('#qwait', body).hidden = true; };
  mountPlayer($('#pl', body), item.lines, { onFirstEnd: reveal });
  $('#showQ', body).addEventListener('click', reveal);
  $('[data-check]', body).addEventListener('click', e => {
    e.target.disabled = true; const r = gradeMcq(item.questions, 'l', body, { task: id, item });
    record(id, r, item.questions.length); $('[data-result]', body).innerHTML = stampHtml(r, item.questions.length);
    afterCheck(body, id, transcriptHtml(item.lines));
  });
}
function renderRespond(item, body, id) {
  body.innerHTML = item.items.map((it, i) => `
    <div class="resp-item" data-ri="${i}">
      <div class="player" style="margin-bottom:12px; padding:10px;" id="rp${i}"></div>
      ${mcqHtml([{ q: 'Choose the best response.', options: it.options, answer: it.answer }], 'r' + i, i + 1)}
      <div class="said">Heard: "${esc(it.say)}"</div>
    </div>`).join('') + checkRow();
  item.items.forEach((it, i) => mountPlayer($('#rp' + i, body), [{ s: i % 2, t: it.say }], { label: `▶ Play ${i + 1}` }));
  $('[data-check]', body).addEventListener('click', e => {
    e.target.disabled = true; let r = 0;
    item.items.forEach((it, i) => { r += gradeMcq([{ q: '', options: it.options, answer: it.answer, why: it.why }], 'r' + i, body, { task: id, item, qi: () => i }); $(`[data-ri="${i}"]`, body).classList.add('done'); });
    record(id, r, item.items.length); $('[data-result]', body).innerHTML = stampHtml(r, item.items.length); afterCheck(body, id);
  });
}

// ---------- Writing: Build a Sentence ----------
function renderBuild(item, body, id) {
  const states = item.items.map(it => {
    const words = it.answer.split(/\s+/);
    const tiles = shuffle(words.concat(it.distractor ? [it.distractor] : []));
    return { it, tiles, placed: [] };
  });
  body.innerHTML = states.map((st, i) => `
    <div class="build-item" data-bi="${i}">
      <div><span class="bubble">${i + 1}. ${esc(st.it.context)}</span> <button class="btn ghost small" data-say="${i}" aria-label="Hear the question">🔊</button></div>
      <div class="answer-line" aria-label="Your sentence"></div>
      <div class="tile-pool"></div>
      <div class="correct-ans" hidden></div>
    </div>`).join('') + checkRow();
  let locked = false;
  const paint = i => {
    const st = states[i], wrap = $(`[data-bi="${i}"]`, body);
    const line = $('.answer-line', wrap), poolEl = $('.tile-pool', wrap);
    line.innerHTML = st.placed.length
      ? st.placed.map((ti, k) => `<button class="tile placed" data-k="${k}" ${locked ? 'disabled' : ''}>${esc(st.tiles[ti])}</button>`).join('') + `<span>${esc(st.it.end || '.')}</span>`
      : '<span class="ph">Tap words below to build the reply</span>';
    poolEl.innerHTML = st.tiles.map((w, ti) => st.placed.includes(ti) ? '' : `<button class="tile" data-ti="${ti}" ${locked ? 'disabled' : ''}>${esc(w)}</button>`).join('');
    $$('[data-k]', line).forEach(b => b.addEventListener('click', () => { st.placed.splice(+b.dataset.k, 1); paint(i); }));
    $$('[data-ti]', poolEl).forEach(b => b.addEventListener('click', () => { st.placed.push(+b.dataset.ti); paint(i); }));
  };
  states.forEach((_, i) => paint(i));
  $$('[data-say]', body).forEach(b => b.addEventListener('click', () => speak([{ s: 0, t: states[+b.dataset.say].it.context }])));
  $('[data-check]', body).addEventListener('click', e => {
    e.target.disabled = true; locked = true; let r = 0;
    const norm = s => s.toLowerCase().replace(/[^a-z0-9' ]/g, '').replace(/\s+/g, ' ').trim();
    states.forEach((st, i) => {
      const built = norm(st.placed.map(ti => st.tiles[ti]).join(' '));
      const ok = [st.it.answer].concat(st.it.alts || []).some(a => norm(a) === built);
      if (ok) r++;
      paint(i);
      const wrap = $(`[data-bi="${i}"]`, body);
      $('.answer-line', wrap).classList.add(ok ? 'ok' : 'bad');
      const c = $('.correct-ans', wrap); c.hidden = false;
      c.innerHTML = `${ok ? '' : `Correct: <b>${esc(st.it.answer + (st.it.end || '.'))}</b>`}${st.it.why ? `<div class="why">${esc(st.it.why)}</div>` : ''}`;
    });
    record(id, r, states.length); $('[data-result]', body).innerHTML = stampHtml(r, states.length); afterCheck(body, id);
  });
}

// ---------- Writing: Email & Discussion ----------
function makeTimer(el, seconds, onEnd) {
  let left = seconds, h = null;
  const fmt = s => `${Math.floor(Math.abs(s) / 60)}:${String(Math.abs(s) % 60).padStart(2, '0')}`;
  const paint = () => { el.textContent = left >= 0 ? fmt(left) : '0:00'; el.classList.toggle('out', left <= 0); };
  paint();
  const t = {
    start() { if (h) return; h = setInterval(() => { left--; paint(); if (left === 0) { onEnd && onEnd(); } if (left <= 0) t.stop(); }, 1000); },
    stop() { clearInterval(h); h = null; },
    get running() { return !!h; }
  };
  onLeave(() => t.stop());
  return t;
}
function writingTask(body, id, item, promptHtml, taskDesc, minWords) {
  const draftKey = `toefl26-draft-${id}-${item.title}`;
  body.innerHTML = `
    <div class="prompt-box">${promptHtml}</div>
    <div class="write-bar"><span>Timer starts when you begin typing</span><span class="timer" id="tm"></span></div>
    <textarea class="write" id="ta" placeholder="Write your response here…" spellcheck="false"></textarea>
    <div class="write-bar"><span id="wc">0 words</span><span>Target: ${minWords}+ words</span></div>
    <div class="row">
      <button class="btn ai-only" id="fbBtn">Score my writing with Claude</button>
      <button class="btn ghost" id="askBtn">Score in Claude ↗</button>
      ${item.model ? '<button class="btn ghost" id="modelBtn">Show model answer</button>' : ''}
      <button class="btn ghost small" id="clearBtn">Clear</button>
    </div>
    <div id="out"></div>`;
  const ta = $('#ta', body), wc = $('#wc', body), out = $('#out', body);
  let counted = false; const countOnce = () => { if (!counted && wordCount(ta.value) >= 20) { counted = true; recordAI(id, null); } };
  const timer = makeTimer($('#tm', body), TASKS[id].timed, () => toast("Time's up! On the real test your response is submitted now."));
  ta.value = store.get(draftKey, '');
  const upd = () => { wc.textContent = `${wordCount(ta.value)} words`; store.set(draftKey, ta.value); };
  upd();
  ta.addEventListener('input', () => { if (!timer.running) timer.start(); upd(); });
  $('#clearBtn', body).addEventListener('click', () => { ta.value = ''; upd(); });
  $('#askBtn', body).addEventListener('click', e => {
    const text = ta.value.trim();
    if (wordCount(text) < 20) { out.innerHTML = '<div class="notice err">Write at least a few sentences first so Claude has something to score.</div>'; return; }
    timer.stop(); countOnce();
    askClaude(writingPrompt(TASKS[id].name, taskDesc, text), e.target);
  });
  if (item.model) $('#modelBtn', body).addEventListener('click', e => {
    e.target.disabled = true; countOnce();
    out.insertAdjacentHTML('beforeend', `<div class="lbl" style="margin-top:16px;">Model answer (${wordCount(item.model)} words)</div><div class="model">${esc(item.model)}</div>`);
  });
  if (!sample) out.innerHTML = `<p class="hint" style="margin-top:14px;">Self-check: did you cover every point, use a clear opening and closing, connect your ideas with transitions, and proofread for verb tense and articles?</p>`;
  $('#fbBtn', body).addEventListener('click', async e => {
    const text = ta.value.trim();
    if (wordCount(text) < 20) { out.innerHTML = '<div class="notice err">Write at least a few sentences first so Claude has something to score.</div>'; return; }
    timer.stop();
    const btn = e.target; btn.disabled = true;
    const box = document.createElement('div'); box.className = 'fb'; box.innerHTML = '<p class="thinking">Claude is reading your response…</p>';
    out.prepend(box);
    const ctl = new AbortController(); onLeave(() => ctl.abort());
    const prompt = `You are an experienced, fair TOEFL iBT writing rater. Score the response below for the TOEFL iBT 2026 "${TASKS[id].name}" task on the official 0-5 rubric (half points allowed). Consider task completion, development, organization, vocabulary range, and grammatical accuracy. Be encouraging but honest.

TASK
${taskDesc}

RESPONSE (${wordCount(text)} words)
"""${text.slice(0, 6000)}"""

Reply with only JSON in this shape:
{"score": 3.5, "summary": "one or two sentences on overall level", "strengths": ["..."], "improvements": ["specific, actionable advice"], "corrections": [{"original": "exact phrase from the response", "better": "corrected phrase", "why": "short reason"}], "revised": "a revised version of the response that keeps the writer's ideas but fixes errors and improves flow"}
Give 2-3 strengths, 2-3 improvements, and up to 6 corrections of real errors only.${koreanNote()}`;
    try {
      const fb = await sample.json(prompt, { signal: ctl.signal, cache: false });
      countOnce(); setLast(id, typeof fb.score === 'number' ? fb.score : null);
      box.innerHTML = feedbackHtml(fb);
    } catch (err) { const m = aiErrorText(err); box.innerHTML = m ? `<div class="notice err" style="margin:0;">${esc(m)}</div>` : ''; }
    btn.disabled = false;
  });
}
function feedbackHtml(fb) {
  const list = a => Array.isArray(a) && a.length ? `<ul>${a.map(x => `<li>${esc(x)}</li>`).join('')}</ul>` : '<p class="hint">None noted.</p>';
  return `
    <div class="row" style="justify-content:space-between;"><span class="score">${esc(fb.score ?? '?')} / 5</span><span class="hint">Estimated by Claude, not an official score</span></div>
    ${fb.summary ? `<p style="margin:6px 0 0;">${esc(fb.summary)}</p>` : ''}
    <h4>What worked</h4>${list(fb.strengths)}
    <h4>What to improve</h4>${list(fb.improvements)}
    ${Array.isArray(fb.corrections) && fb.corrections.length ? `<h4>Corrections</h4>${fb.corrections.map(c => `<div class="corr"><span class="o">${esc(c.original)}</span> → <span class="n">${esc(c.better)}</span><div class="w">${esc(c.why)}</div></div>`).join('')}` : ''}
    ${fb.revised ? `<h4>Revised version</h4><div class="model" style="margin-top:4px;">${esc(fb.revised)}</div>` : ''}
    ${fb.sample ? `<h4>A stronger sample answer</h4><div class="model" style="margin-top:4px;">${esc(fb.sample)}</div>` : ''}`;
}
function renderEmail(item, body, id) {
  const promptHtml = `<p style="margin:0;">${esc(item.scenario)}</p><p style="margin:10px 0 0;"><b>In your email, do the following:</b></p><ul>${item.points.map(p => `<li>${esc(p)}</li>`).join('')}</ul>`;
  writingTask(body, id, item, promptHtml, `${item.scenario}\nThe email must: ${item.points.join('; ')}.`, 100);
  body.insertAdjacentHTML('afterbegin', templateHtml('email'));
}
function renderDiscuss(item, body, id) {
  const promptHtml = `<div class="post" style="border-color:var(--gold); margin-top:0;"><b>${esc(item.professor)}</b><br>${esc(item.prompt)}</div>${item.students.map(s => `<div class="post"><b>${esc(s.name)}</b><br>${esc(s.post)}</div>`).join('')}`;
  writingTask(body, id, item, promptHtml, `Professor ${item.professor}: ${item.prompt}\n${item.students.map(s => `${s.name}: ${s.post}`).join('\n')}\nThe student must write a post contributing their own opinion to the discussion.`, 100);
  body.insertAdjacentHTML('afterbegin', templateHtml('discuss'));
}

// ---------- Speaking: Listen and Repeat ----------
function renderRepeat(item, body, id) {
  let i = 0; const results = [];
  let rec = null; onLeave(() => rec && rec.stop());
  const intro = () => {
    body.innerHTML = `<div class="prompt-box">${esc(item.context)}</div>
      ${SR ? '' : '<div class="notice info">This browser can\'t turn speech into text, so you\'ll check yourself after each sentence. For automatic scoring, open this page in Chrome or Edge.</div>'}
      <div class="row" style="margin-top:14px;"><button class="btn" id="go">Start</button></div>`;
    $('#go', body).addEventListener('click', step);
  };
  const step = () => {
    if (i >= item.sentences.length) return finish();
    const target = item.sentences[i];
    body.innerHTML = `<div class="big-step">Sentence ${i + 1} of ${item.sentences.length}</div>
      <div class="player" id="pl"></div>
      <div id="zone"><p class="hint">Listen, then repeat exactly what you heard.</p></div>`;
    const zone = $('#zone', body);
    const afterAudio = () => setTimeout(afterAudioNow, IS_ANDROID ? 400 : 150);
    const afterAudioNow = () => {
      if (srAvailable()) {
        const secs = Math.round(4 + tokens(target).length * 0.6);
        zone.innerHTML = `<div class="row"><span class="mic"><span class="dot"></span>Listening… speak now</span><button class="btn ghost small" id="done">I'm done</button></div><div class="live" id="live"></div>`;
        let finished = false, auto = null;
        const end = said => { if (finished) return; finished = true; clearTimeout(auto); score(said); };
        rec = listen({
          onText: t => { const l = $('#live', body); if (l) l.textContent = t; },
          onEnd: said => end(said),
          onBlocked: () => { finished = true; clearTimeout(auto); zone.innerHTML = '<div class="notice err">The microphone is blocked here, so you\'ll check yourself instead.</div>'; selfCheck(); }
        });
        if (!finished) auto = setTimeout(() => rec && rec.stop(), secs * 1000);
        $('#done', body).addEventListener('click', () => rec && rec.stop());
      } else selfCheck();
    };
    const selfCheck = () => {
      zone.insertAdjacentHTML('beforeend', `<p>Say the sentence out loud now.</p><button class="btn ghost" id="rev">Reveal sentence</button>`);
      $('#rev', body).addEventListener('click', () => {
        zone.innerHTML = `<div class="diff">${esc(target)}</div><div class="row"><button class="btn" data-g="1">I said it all</button><button class="btn ghost" data-g="0.5">I missed a few words</button><button class="btn ghost" data-g="0">I missed a lot</button></div>`;
        $$('[data-g]', zone).forEach(b => b.addEventListener('click', () => { results.push(+b.dataset.g); i++; step(); }));
      });
    };
    const score = said => {
      const { hit, n, matched } = alignWords(target, said);
      const words = target.split(/\s+/);
      // map displayed words to token hits (tokens may split hyphens; approximate by index)
      let ti = 0;
      const shown = words.map(w => { const tk = tokens(w); const ok = tk.every((_, k) => hit[ti + k]); ti += tk.length; return `<span class="${ok ? 'hit' : 'miss'}">${esc(w)}</span>`; }).join(' ');
      const pct = n ? matched / n : 0; results.push(pct);
      zone.innerHTML = `<div class="diff">${shown}</div><p class="heard">We heard: "${esc(said || '(nothing)')}"</p>
        <div class="row"><span class="stamp ${pct >= 0.9 ? 'good' : pct >= 0.6 ? 'mid' : 'low'}" style="font-size:16px;">${Math.round(pct * 100)}%</span>
        <button class="btn ghost" id="again">Try again</button><button class="btn" id="nx">${i + 1 < item.sentences.length ? 'Next sentence' : 'See results'}</button></div>`;
      $('#again', body).addEventListener('click', () => { results.pop(); step(); });
      $('#nx', body).addEventListener('click', () => { i++; step(); });
    };
    mountPlayer($('#pl', body), [{ s: 0, t: target }], { label: '▶ Play sentence', onFirstEnd: afterAudio });
  };
  const finish = () => {
    const avg = results.reduce((a, b) => a + b, 0) / (results.length || 1);
    record(id, Math.round(avg * item.sentences.length * 10) / 10, item.sentences.length);
    body.innerHTML = `<div class="result">${stampHtml(Math.round(avg * 100), 100).replace(' / 100', '%')}</div>
      <div class="score-list" style="margin-top:18px;">${item.sentences.map((s, k) => `<div><span>${k + 1}. ${esc(s.length > 50 ? s.slice(0, 48) + '…' : s)}</span><span>${Math.round((results[k] || 0) * 100)}%</span></div>`).join('')}</div>
      <p class="hint">Longer sentences are harder to hold in memory. Try grouping words into meaningful chunks as you listen.</p>
      <div class="result" data-result></div>`;
    afterCheck(body, id);
  };
  intro();
}

// ---------- Speaking: Take an Interview ----------
function renderInterview(item, body, id) {
  const answers = item.questions.map(() => '');
  let q = 0, rec = null; onLeave(() => rec && rec.stop());
  const intro = () => {
    body.innerHTML = `<div class="prompt-box">${esc(item.intro)}</div>
      ${SR ? '' : '<div class="notice info">This browser can\'t turn speech into text. You can still answer out loud for practice, and type key points if you want Claude\'s feedback. Chrome or Edge gives automatic transcripts.</div>'}
      <p class="hint">Answer each question as soon as it ends. You have about 45 seconds per answer.</p>
      ${templateHtml('interview', true)}
      <div class="row"><button class="btn" id="go">Start interview</button></div>`;
    $('#go', body).addEventListener('click', ask);
  };
  const ask = () => {
    if (q >= item.questions.length) return review();
    body.innerHTML = `<div class="big-step">Question ${q + 1} of ${item.questions.length}</div>
      <div class="player" id="pl"></div>
      <details class="transcript" style="margin:0 0 14px;"><summary>Show question text</summary><p>${esc(item.questions[q])}</p></details>
      <div id="zone"></div>`;
    const zone = $('#zone', body);
    const answer = () => {
      zone.innerHTML = `<div class="row" style="justify-content:space-between;">
          <span class="mic" id="micLbl">${srAvailable() ? '<span class="dot"></span>Recording your answer' : 'Answer out loud now'}</span>
          <span class="timer" id="tm"></span></div>
        <textarea class="write" id="ta" style="min-height:120px; margin-top:10px;" placeholder="${srAvailable() ? 'Your words appear here. You can fix transcription errors.' : 'Optional: type what you said or your key points.'}"></textarea>
        <div class="row" style="margin-top:10px;"><button class="btn" id="nx">${q + 1 < item.questions.length ? 'Next question' : 'Finish'}</button></div>`;
      const ta = $('#ta', body);
      const timer = makeTimer($('#tm', body), 45, () => { rec && rec.stop(); $('#micLbl', body).textContent = 'Time is up'; });
      timer.start();
      if (srAvailable()) {
        rec = listen({
          onText: t => { ta.value = t; },
          onEnd: () => { },
          onBlocked: () => { $('#micLbl', body).textContent = 'Microphone blocked: answer out loud, and type key points if you like'; }
        });
      }
      $('#nx', body).addEventListener('click', () => { timer.stop(); rec && rec.stop(); rec = null; answers[q] = ta.value.trim(); q++; setTimeout(ask, 300); });
    };
    mountPlayer($('#pl', body), [{ s: 1, t: item.questions[q] }], { label: '▶ Hear the question', onFirstEnd: answer });
  };
  const review = () => {
    const any = answers.some(a => a);
    body.innerHTML = `<h2 style="margin-bottom:10px;">Your answers</h2>
      ${item.questions.map((qq, k) => `<div class="prompt-box"><b>${k + 1}. ${esc(qq)}</b><p style="margin:8px 0 0;">${answers[k] ? esc(answers[k]) : '<span class="hint">(no transcript)</span>'}</p>${answers[k] ? `<p class="hint" style="margin:6px 0 0;">${wordCount(answers[k])} words</p>` : ''}</div>`).join('')}
      <p class="hint">Strong answers usually run 80–120 words in 45 seconds, give a clear opinion, and add a reason or example.</p>
      <div class="row"><button class="btn ai-only" id="fbBtn" ${any ? '' : 'disabled'}>Score my answers with Claude</button>${any ? askBtnHtml(`You are an experienced, fair TOEFL iBT speaking rater. Below are my answers to the TOEFL iBT (2026 format) "Take an Interview" task. Each answer was spoken for about 45 seconds and turned into text by speech recognition, so ignore obvious transcription glitches and missing punctuation. Score me on the 0 to 5 scale (half points allowed).

Context: ${item.intro}

${item.questions.map((qq, k) => `Q${k + 1}: ${qq}\nMy answer (${wordCount(answers[k])} words): ${answers[k] || '(no answer)'}`).join('\n\n')}

Please give me:
1. My score and a one-sentence summary
2. Two or three strengths
3. Two or three specific improvements (say which question)
4. More natural phrasing for awkward parts (what I said → better)
5. A strong 90 to 110 word sample answer to the question where I was weakest${koAsk()}`) : ''}<button class="btn ghost" id="redo">Do it again</button></div>
      <div id="out"></div>`;
    $('#redo', body).addEventListener('click', () => go(() => openTask(id, current.idx)));
    recordAI(id, null);
    $('#fbBtn', body).addEventListener('click', async e => {
      e.target.disabled = true;
      const out = $('#out', body); out.innerHTML = '<div class="fb"><p class="thinking">Claude is listening back through your answers…</p></div>';
      const ctl = new AbortController(); onLeave(() => ctl.abort());
      const prompt = `You are an experienced, fair TOEFL iBT speaking rater. Below are a test taker's answers to the TOEFL iBT 2026 "Take an Interview" task. Each answer was spoken for about 45 seconds and converted to text by automatic speech recognition, so ignore obvious transcription glitches and missing punctuation; judge content, development, vocabulary, and grammar that are clearly the speaker's. Score on a 0-5 scale (half points allowed).

Context: ${item.intro}
${item.questions.map((qq, k) => `Q${k + 1}: ${qq}\nA${k + 1} (${wordCount(answers[k])} words): ${answers[k] || '(no answer)'}`).join('\n\n')}

Reply with only JSON in this shape:
{"score": 3.5, "summary": "one or two sentences", "strengths": ["..."], "improvements": ["specific, actionable advice, mention which question"], "corrections": [{"original": "phrase they said", "better": "more natural phrasing", "why": "short reason"}], "sample": "a strong 90-110 word spoken-style answer to the question where they were weakest, starting with that question's number"}
Give 2-3 strengths, 2-3 improvements, and up to 6 corrections.${koreanNote()}`;
      try {
        const fb = await sample.json(prompt, { signal: ctl.signal, cache: false });
        setLast(id, typeof fb.score === 'number' ? fb.score : null);
        out.innerHTML = `<div class="fb">${feedbackHtml(fb)}</div>`;
      } catch (err) { const m = aiErrorText(err); out.innerHTML = m ? `<div class="notice err">${esc(m)}</div>` : ''; e.target.disabled = false; }
    });
  };
  intro();
}

// ---------- Words tab: AWL flashcards with spaced review ----------
// Leitner boxes: a correct answer moves a word up one box, a miss sends it
// back to box 1. Each box waits longer before the word is due again.
const BOX_DAYS = { 1: 1, 2: 2, 3: 4, 4: 7, 5: 14 };
let SRS = store.get('toefl26-awl-srs', {});
const saveSRS = () => store.set('toefl26-awl-srs', SRS);
const dayStr = (d = new Date()) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
const addDays = (n) => { const d = new Date(); d.setDate(d.getDate() + n); return dayStr(d); };
const AWL_ALL = () => (DATA.awl || []).flatMap(s => s.words.map(w => Object.assign({ sub: s.n }, w)));
const wkey = w => w.t.toLowerCase();
const boxOf = w => (SRS[wkey(w)] || {}).box || 0; // 0 = never studied
const isDue = w => { const r = SRS[wkey(w)]; return !r || r.due <= dayStr(); };
function srsAnswer(w, ok) {
  const r = SRS[wkey(w)] || { box: 0 };
  r.box = ok ? Math.min(5, Math.max(1, r.box + 1)) : 1;
  r.due = addDays(BOX_DAYS[r.box]); SRS[wkey(w)] = r; saveSRS();
}
// Due today: words studied before whose review date has come (new words aren't "due").
const dueWords = list => list.filter(w => SRS[wkey(w)] && isDue(w));

const WORD_MODES = [
  { id: 'def', label: 'Meaning → type the word' },
  { id: 'cloze', label: 'Sentence → type the missing word' },
  { id: 'listen', label: '🔊 Hear it → type the word' },
  { id: 'mean', label: 'Word → recall the meaning' }
];
function renderWordsTab() {
  setHeader('Words', false);
  const all = AWL_ALL();
  const due = dueWords(all);
  const known = all.filter(w => boxOf(w) >= 5).length;
  const mode = SETTINGS.wordMode || 'def';
  stage.innerHTML = `
    <h1>Academic Word List</h1>
    <p class="sub">${all.length} words in 10 sublists, with Korean meanings and example sentences. Words you miss come back sooner; words you know come back less often.</p>
    <button class="home-card primary" id="dueBtn" ${due.length ? '' : 'disabled'}>
      <span class="hc-kicker">Review</span>
      <span class="hc-title">${due.length ? `${due.length} word${due.length > 1 ? 's' : ''} due today` : 'Nothing due today'}</span>
      <span class="hc-sub">${due.length ? 'Spaced review across all sublists' : 'Study a sublist below to add words to your review.'} · ${known} known</span></button>
    <div><span class="lbl">How to practice</span>
      <div class="seg" id="modeSeg">${WORD_MODES.map(m => `<button data-mode="${m.id}" class="${mode === m.id ? 'active' : ''}">${m.label}</button>`).join('')}</div></div>
    <section class="sec" style="margin-top:14px;">
      <div class="sec-head"><h2>Sublists</h2><span class="sec-meta">known / total</span></div>
      ${(DATA.awl || []).map(s => {
        const k = s.words.filter(w => boxOf(w) >= 5).length, d = dueWords(s.words).length, seen = s.words.filter(w => boxOf(w) > 0).length;
        return `<div class="deck">
          <div class="deck-top"><b>Sublist ${s.n}</b><span class="badge ${k ? 'on' : ''}">${k}/${s.words.length} known</span></div>
          <div class="deck-sub">${esc(s.words.slice(0, 4).map(w => w.t).join(', '))}…${seen ? ` · ${seen} studied${d ? `, ${d} due` : ''}` : ''}</div>
          <div class="sk-bar" aria-hidden="true"><i style="width:${Math.round(100 * k / s.words.length)}%"></i></div>
          <div class="row" style="margin-top:10px; gap:8px;">
            <button class="btn small" data-study="${s.n}">▶ Study</button>
            <button class="btn ghost small" data-preview="${s.n}">👀 Preview</button>
          </div></div>`;
      }).join('')}
    </section>`;
  $('#modeSeg').addEventListener('click', e => { const b = e.target.closest('button'); if (!b) return; SETTINGS.wordMode = b.dataset.mode; saveSettings(); $$('#modeSeg button').forEach(x => x.classList.toggle('active', x === b)); });
  $('#dueBtn').addEventListener('click', () => { if (due.length) go(() => runWords(shuffle(due).slice(0, 30), { title: 'Review due words' })); });
  $$('[data-study]').forEach(b => b.addEventListener('click', () => {
    const n = +b.dataset.study, s = { words: AWL_ALL().filter(w => w.sub === n) };
    // Due words first, then new ones, then the rest: about 15 cards per round.
    const d = shuffle(dueWords(s.words)), fresh = s.words.filter(w => !boxOf(w)), rest = shuffle(s.words.filter(w => boxOf(w) && !isDue(w)));
    const cards = [...d, ...fresh, ...rest].slice(0, 15);
    go(() => runWords(cards, { title: `Sublist ${n}` }));
  }));
  $$('[data-preview]').forEach(b => b.addEventListener('click', () => go(() => previewWords(DATA.awl.find(x => x.n === +b.dataset.preview)))));
}

function previewWords(sub) {
  enterSub(); setHeader(`Sublist ${sub.n} preview`, true);
  let i = 0;
  const paint = () => {
    const w = sub.words[i];
    stage.innerHTML = `<div class="wcard">
      <div class="w-eyebrow">Preview ${i + 1} of ${sub.words.length}${w.p ? ` · ${esc(w.p)}` : ''}</div>
      <div class="w-term">${esc(w.t)} <button class="btn ghost small" data-say aria-label="Hear the word">🔊</button></div>
      <div class="w-ko">${esc(w.k)}</div>
      <p class="w-def">${esc(w.d)}</p>
      ${w.x.map(x => `<p class="w-ex">${fillEx(x, w.t)}</p>`).join('')}
      <div class="row" style="justify-content:space-between; margin-top:20px;">
        <button class="btn ghost" id="pv" ${i ? '' : 'disabled'}>◀ Previous</button>
        <button class="btn" id="nx">${i + 1 < sub.words.length ? 'Next ▶' : 'Done'}</button></div></div>`;
    $('[data-say]').addEventListener('click', () => speak([{ s: 0, t: w.t }]));
    $('#pv').addEventListener('click', () => { i--; paint(); });
    $('#nx').addEventListener('click', () => { if (i + 1 < sub.words.length) { i++; paint(); } else goBack(); });
  };
  paint();
}
const fillEx = (x, t) => esc(x).replace(/_+/, `<b>${esc(t)}</b>`);
const blankEx = (x, t) => esc(x).replace(/_+/, '_'.repeat(Math.max(3, t.replace(/\s+/g, '').length)));

// Typo-tolerant grading: one slip (extra, missing, wrong or swapped letter)
// on a word of 6+ letters counts as correct, flagged "Close".
function editDist(a, b) {
  const m = a.length, n = b.length, d = Array.from({ length: m + 1 }, (_, i) => [i, ...Array(n).fill(0)]);
  for (let j = 0; j <= n; j++) d[0][j] = j;
  for (let i = 1; i <= m; i++) for (let j = 1; j <= n; j++) {
    d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) d[i][j] = Math.min(d[i][j], d[i - 2][j - 2] + 1);
  }
  return d[m][n];
}
function gradeWord(typed, term) {
  const a = typed.trim().toLowerCase().replace(/[.,!?;:'"]+$/, ''), b = term.toLowerCase();
  if (a === b) return { ok: true, close: false };
  if (b.length >= 6 && editDist(a, b) === 1) return { ok: true, close: true };
  return { ok: false, close: false };
}

// Runs a round of word cards. opts: { title, mode, onDone(right, total) }
function runWords(cards, opts = {}) {
  if (!opts.daily) enterSub();
  const mode = opts.mode || SETTINGS.wordMode || 'def';
  let i = 0, right = 0; const missed = [];
  if (!cards.length) { stage.innerHTML = '<p class="sub">No words to study right now.</p>'; return; }
  keepAwake(mode === 'listen');
  const card = () => {
    const w = cards[i];
    const m = mode === 'cloze' && !w.x.length ? 'def' : mode;
    setHeader(opts.daily ? dailyTitle() : `${opts.title || 'Words'} · ${i + 1}/${cards.length}`, true);
    const ex = w.x.length ? w.x[Math.floor(Math.random() * w.x.length)] : '';
    const prompt = m === 'def' ? `<p class="w-prompt">${esc(w.d)}</p><div class="w-ko">${esc(w.k)}</div>`
      : m === 'cloze' ? `<p class="w-prompt">${blankEx(ex, w.t)}</p>`
      : m === 'listen' ? `<div class="row" style="justify-content:center; margin:12px 0;"><button class="btn" data-say>🔊 Play the word</button></div>`
      : `<div class="w-term">${esc(w.t)} <button class="btn ghost small" data-say aria-label="Hear the word">🔊</button></div>`;
    stage.innerHTML = `<div class="wcard">
      <div class="pbar static" aria-hidden="true"><i style="width:${Math.round(100 * i / cards.length)}%"></i></div>
      <div class="w-eyebrow">${{ def: 'Meaning', cloze: 'Complete the sentence', listen: 'Listen and spell', mean: 'What does it mean?' }[m]}${w.p ? ` · ${esc(w.p)}` : ''} · Sublist ${w.sub || ''}</div>
      ${prompt}
      ${m === 'mean'
        ? `<div class="row" style="justify-content:center; margin-top:16px;"><button class="btn" id="reveal">Show the meaning</button></div>`
        : `<div class="w-answer"><input id="ans" class="field-in" autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false" placeholder="Type the word…" aria-label="Your answer"><button class="btn" id="sub">Check</button></div>`}
      <div id="fb"></div></div>`;
    const sayBtn = $('[data-say]'); if (sayBtn) sayBtn.addEventListener('click', () => speak([{ s: 0, t: w.t }]));
    if (m === 'listen') speak([{ s: 0, t: w.t }]);
    const after = (ok, close, given) => {
      if (ok) right++; else missed.push({ w, given });
      srsAnswer(w, ok); buzz(ok ? 20 : [25, 70, 25]);
      const r = SRS[wkey(w)];
      $('#fb').innerHTML = `<div class="w-feedback">
        ${m !== 'mean' ? `<div class="stamp ${ok ? (close ? 'mid' : 'good') : 'low'}" style="font-size:17px;">${ok ? (close ? 'Close!' : 'Correct') : 'Not quite'}</div>` : ''}
        <div class="w-term" style="margin-top:12px;">${esc(w.t)} <button class="btn ghost small" data-say2 aria-label="Hear the word">🔊</button></div>
        ${close ? `<p class="hint">One letter off. It's spelled <b>${esc(w.t)}</b>.</p>` : ''}
        ${!ok && given ? `<p class="hint">You wrote: ${esc(given)}</p>` : ''}
        <div class="w-ko">${esc(w.k)}</div><p class="w-def">${esc(w.d)}</p>
        ${ex || w.x[0] ? `<p class="w-ex">${fillEx(ex || w.x[0], w.t)}</p>` : ''}
        <p class="hint">${ok ? `Level ${r.box} of 5 · next review in ${BOX_DAYS[r.box]} day${BOX_DAYS[r.box] > 1 ? 's' : ''}` : 'Back to level 1 · you\'ll see it again tomorrow'}</p>
        <div class="row" style="justify-content:center; margin-top:10px;"><button class="btn" id="nx">${i + 1 < cards.length ? 'Next word ▶' : 'See results'}</button></div></div>`;
      $('[data-say2]').addEventListener('click', () => speak([{ s: 0, t: w.t }]));
      const nx = $('#nx'); nx.addEventListener('click', () => { i++; i < cards.length ? card() : done(); }); nx.focus();
    };
    if (m === 'mean') {
      $('#reveal').addEventListener('click', () => {
        $('#reveal').parentElement.remove();
        $('#fb').innerHTML = `<div class="w-feedback"><div class="w-ko">${esc(w.k)}</div><p class="w-def">${esc(w.d)}</p>${w.x[0] ? `<p class="w-ex">${fillEx(w.x[0], w.t)}</p>` : ''}
          <p class="hint">Did you know it?</p><div class="row" style="justify-content:center;"><button class="btn" data-g="1">I knew it</button><button class="btn ghost" data-g="0">I didn't</button></div></div>`;
        $$('[data-g]').forEach(b => b.addEventListener('click', () => after(b.dataset.g === '1', false, '')));
      });
    } else {
      const ans = $('#ans'), sub = $('#sub');
      const check = () => { if (!ans.value.trim()) { ans.focus(); return; } ans.disabled = sub.disabled = true; const g = gradeWord(ans.value, w.t); after(g.ok, g.close, ans.value.trim()); };
      sub.addEventListener('click', check);
      ans.addEventListener('keydown', e => { if (e.key === 'Enter') check(); });
      if (m !== 'listen') ans.focus();
    }
  };
  const done = () => {
    keepAwake(false);
    if (opts.onDone) return opts.onDone(right, cards.length);
    record('words', right, cards.length);
    setHeader(opts.title || 'Words', true);
    stage.innerHTML = `<div class="result">${stampHtml(right, cards.length)}</div>
      ${missed.length ? `<h3>To review</h3>${missed.map(({ w, given }) => `<div class="corr"><b>${esc(w.t)}</b> (${esc(w.k)}): ${esc(w.d)}${given ? `<div class="w">You wrote: ${esc(given)}</div>` : ''}</div>`).join('')}` : '<p class="sub" style="text-align:center;">Every word correct.</p>'}
      <div class="row" style="justify-content:center; margin-top:18px;">
        ${missed.length ? '<button class="btn ghost" id="retry">Retry missed words</button>' : ''}
        <button class="btn" id="back">Back to Words</button></div>`;
    const rt = $('#retry'); if (rt) rt.addEventListener('click', () => runWords(shuffle(missed.map(m => m.w)), Object.assign({}, opts, { title: 'Missed words' })));
    $('#back').addEventListener('click', goBack);
  };
  card();
}

// ---------- Daily 15: a short mixed session ----------
// Five steps in about 15 minutes: word review, then one reading, listening,
// writing, and speaking task. Mixing skills in one session builds stronger
// recall than repeating one task type. Picks your weakest or untried tasks.
const DAILY_SLOTS = [
  { label: 'Words', kind: 'words' },
  { label: 'Reading', pick: ['ctw', 'daily', 'vic', 'trans'] },
  { label: 'Listening', pick: ['respond', 'announce', 'talk', 'convo'] },
  { label: 'Writing', pick: ['build'] },
  { label: 'Speaking', pick: ['repeat'] }
];
let DAILY = store.get('toefl26-daily', null);
if (DAILY && DAILY.date !== dayStr()) DAILY = null; // yesterday's unfinished session expires
const saveDaily = () => store.set('toefl26-daily', DAILY);
const dailyTitle = () => `Daily 15 · ${DAILY.i + 1} of ${DAILY.steps.length}`;
function pickTask(ids) {
  const score = id => { const s = STATS[id]; if (!s || !s.sets) return -1; return s.tot ? s.pts / s.tot : 0.7; };
  return ids.map(id => ({ id, v: score(id) + Math.random() * 0.1 })).sort((a, b) => a.v - b.v)[0].id;
}
function startDaily() {
  const md = dueMistakes().length;
  const slots = md ? [DAILY_SLOTS[0], { label: 'Mistakes', kind: 'mistakes' }, ...DAILY_SLOTS.slice(1)] : DAILY_SLOTS;
  const steps = slots.map(sl => {
    if (sl.kind === 'mistakes') return { label: sl.label, kind: 'mistakes' };
    if (sl.kind === 'words') return { label: sl.label, kind: 'words' };
    const id = pickTask(sl.pick), n = pool(id).length;
    return { label: sl.label, kind: 'task', id, idx: ((CURSOR[id] || 0) + (STATS[id] && STATS[id].sets ? 1 : 0)) % n };
  });
  DAILY = { date: dayStr(), steps, i: 0, results: [] }; saveDaily();
  runDailyStep();
}
function dailyWordCards() {
  const all = AWL_ALL(), due = shuffle(dueWords(all));
  const fresh = all.filter(w => !boxOf(w)); // next unseen words, in sublist order
  return [...due, ...fresh].slice(0, 10);
}
function runDailyStep() {
  enterSub();
  const st = DAILY.steps[DAILY.i];
  if (!st) return finishDaily();
  if (st.kind === 'mistakes') {
    setHeader(dailyTitle(), true);
    runMistakes(shuffle(dueMistakes()).slice(0, 5), { daily: true, onDone: (r, t) => { dailyResult(r, t); dailyContinueScreen(); } });
  } else if (st.kind === 'words') {
    setHeader(dailyTitle(), true);
    runWords(dailyWordCards(), { daily: true, mode: 'def', onDone: (r, t) => { dailyResult(r, t); dailyContinueScreen(); } });
  } else openTask(st.id, st.idx, { daily: true });
}
function dailyResult(pts, tot) {
  if (!DAILY) return;
  DAILY.results[DAILY.i] = { pts, tot }; saveDaily();
}
function dailyNext() { DAILY.i++; saveDaily(); go(() => runDailyStep()); }
function dailyNextLabel() {
  const nx = DAILY.steps[DAILY.i + 1];
  return nx ? `Next: ${nx.label} ▶` : 'Finish Daily 15 ▶';
}
function dailyContinueScreen() {
  const r = DAILY.results[DAILY.i];
  stage.innerHTML = `<div class="result">${r ? stampHtml(r.pts, r.tot) : ''}<p class="sub">Step ${DAILY.i + 1} of ${DAILY.steps.length} done.</p>
    <button class="btn" id="dn">${dailyNextLabel()}</button></div>`;
  $('#dn').addEventListener('click', dailyNext);
}
function markStudyDay() {
  const days = store.get('toefl26-days', []);
  const t = dayStr(); if (!days.includes(t)) { days.push(t); store.set('toefl26-days', days.slice(-400)); }
}
function streak() {
  const days = new Set(store.get('toefl26-days', []));
  let n = 0; const d = new Date();
  if (!days.has(dayStr(d))) d.setDate(d.getDate() - 1); // today not done yet: count up to yesterday
  while (days.has(dayStr(d))) { n++; d.setDate(d.getDate() - 1); }
  return n;
}
function finishDaily() {
  markStudyDay();
  const res = DAILY.steps.map((s, k) => ({ s, r: DAILY.results[k] }));
  DAILY.finished = true; saveDaily();
  setHeader('Daily 15 done', true);
  stage.innerHTML = `<h1>Daily 15 complete 🎉</h1>
    <p class="sub">${streak()}-day streak. Come back tomorrow for a new mix; your missed words will be waiting.</p>
    <div class="score-list">${res.map(({ s, r }) => `<div><span>${s.label}${s.id ? `: ${esc(TASKS[s.id].name)}` : ''}</span><span>${r ? `${Math.round(100 * r.pts / (r.tot || 1))}%` : '—'}</span></div>`).join('')}</div>
    <div class="row" style="justify-content:center; margin-top:20px;"><button class="btn" id="home">Back to Home</button></div>`;
  $('#home').addEventListener('click', () => go(() => renderTab('home')));
}

// ---------- Answer templates ----------
const TEMPLATES = {
  email: {
    ko: '인사 → 목적 → 요점 1·2·3 → 마무리 요청·감사 → 서명',
    steps: [
      ['Greeting', 'Dear Ms. Rivera, / Dear Customer Service Team, / Hi Alex,'],
      ['Purpose (1 to 2 sentences)', 'I\'m writing to ask about… / I hope you\'re doing well. I\'m writing about…'],
      ['Point 1, point 2, point 3', 'One short paragraph each, in the order given, with a detail or reason for each.'],
      ['Closing request or thanks', 'I would really appreciate it if… / Please let me know if… / Thank you for your time.'],
      ['Sign-off', 'Best regards, / Sincerely, / Thanks, + your name']
    ],
    phrases: [
      ['Explaining', 'The reason I\'m writing is that… / Unfortunately, … / As a result, …'],
      ['Asking', 'Would it be possible to…? / Could you please…? / I was wondering if…'],
      ['Suggesting', 'One option might be to… / It might help to… / Perhaps we could…'],
      ['Apologizing', 'I\'m sorry for any inconvenience. / I apologize for the late reply.']
    ],
    tips: ['Cover all three points in order: missing one costs the most.', 'Match the tone to the reader: formal for a professor or a company, friendly for a classmate.', 'Aim for 100 to 150 words and keep the last minute to proofread.']
  },
  discuss: {
    ko: '입장 → 친구 의견 언급 → 이유 → 예시 → 결론',
    steps: [
      ['Your position (1 sentence)', 'In my view, … is the better approach. / I believe that…'],
      ['Respond to a classmate', 'I agree with Claire that…, but… / Although Andrew makes a good point about…, I think…'],
      ['Main reason + explanation', 'The main reason is that… This matters because…'],
      ['A specific example', 'For example, when I… / Take, for instance, …'],
      ['Concession or second reason (optional)', 'Admittedly, … However, … / In addition, …'],
      ['Concluding sentence', 'For these reasons, … / That\'s why I think…']
    ],
    phrases: [
      ['Agreeing', 'I share Hana\'s view that… / Leo is right to point out that…'],
      ['Disagreeing politely', 'I see why Marcus thinks so, but… / I\'m not fully convinced that…'],
      ['Adding a new idea', 'One point nobody has mentioned yet is… / Another factor to consider is…']
    ],
    tips: ['Add an idea your classmates didn\'t mention; repeating them adds little.', 'One clear, specific example beats several vague ones.', 'Aim for 100 to 140 words.']
  },
  interview: {
    ko: '답 → 이유 → 예시 → 정리 (약 45초)',
    steps: [
      ['Direct answer', 'Honestly, I\'d say… / I definitely prefer…'],
      ['Reason', 'The main reason is that…'],
      ['Example or detail', 'For example, last semester I… / In my case, …'],
      ['Wrap-up', 'So overall, … / That\'s why I think…']
    ],
    phrases: [
      ['Buying a second to think', 'That\'s an interesting question. I haven\'t thought about it much, but…'],
      ['Hypothetical questions', 'If I could…, I would… because…'],
      ['Partial agreement', 'I partly agree. On the one hand, … On the other hand, …']
    ],
    tips: ['Start speaking within two or three seconds.', 'Don\'t memorize whole answers; use the structure and speak naturally.', 'About 80 to 110 words fills 45 seconds. If you make a mistake, keep going.']
  },
  retell: {
    ko: '주제 → 핵심 내용 → 예시 → 화자의 견해',
    steps: [
      ['Topic', 'The talk was about…'],
      ['Main points', 'First, the speaker explained that… Then…'],
      ['Example', 'For example, …'],
      ['Speaker\'s view', 'Overall, the speaker thinks… / The speaker seems skeptical about…']
    ],
    phrases: [], tips: []
  }
};
function templateHtml(kind, open = false) {
  const t = TEMPLATES[kind]; if (!t) return '';
  return `<details class="tmpl"${open ? ' open' : ''}><summary>📝 Answer template</summary>
    ${SETTINGS.koInstr ? `<p class="hint" lang="ko" style="margin:8px 0 0;">${t.ko}</p>` : ''}
    <ol class="tmpl-steps">${t.steps.map(([h, ex]) => `<li><b>${esc(h)}</b><br><span>${esc(ex)}</span></li>`).join('')}</ol>
    ${t.phrases.length ? `<div class="lbl">Useful phrases</div><div class="tmpl-phrases">${t.phrases.map(([h, ex]) => `<div><b>${esc(h)}:</b> ${esc(ex)}</div>`).join('')}</div>` : ''}
    ${t.tips.length ? `<div class="lbl" style="margin-top:10px;">Tips</div><ul class="tmpl-tips">${t.tips.map(x => `<li>${esc(x)}</li>`).join('')}</ul>` : ''}
  </details>`;
}

// ---------- Practice tests: full timed Reading and Listening sections ----------
// Parts follow the real test's order. Answers aren't shown until the end;
// you can't go back to earlier parts. The real test is adaptive (its second
// half gets easier or harder); this one uses a fixed mix.
const TEST_PLANS = {
  rtest: { section: 'Reading', tab: 'reading', parts: ['ctw', 'daily', 'academic', 'ctw', 'daily', 'daily', 'academic'] },
  ltest: { section: 'Listening', tab: 'listening', parts: ['respond', 'convo', 'announce', 'talk', 'respond', 'convo', 'talk'] }
};
let TEST = null;
let TEST_USED = store.get('toefl26-testused', {});
// Score bands: rough practice estimates on the 1-6 scale (not ETS's formula).
function bandFromPct(p) {
  const cuts = [[0.95, 6], [0.9, 5.5], [0.83, 5], [0.75, 4.5], [0.66, 4], [0.56, 3.5], [0.46, 3], [0.36, 2.5], [0.26, 2], [0.16, 1.5]];
  for (const [c, b] of cuts) if (p >= c) return b;
  return 1;
}
const cefrOf = b => ['A1', 'A1', 'A2', 'B1', 'B2', 'C1', 'C2'][Math.floor(b)];
const ctwWords = text => (text.match(/\[([A-Za-z']+)\]/g) || []).map(m => { const w = m.slice(1, -1), k = Math.max(1, Math.floor(w.length / 2)); return { full: w, shown: w.slice(0, k), miss: w.slice(k) }; });
const ctwBlanks = text => ctwWords(text).map(w => w.miss);
function partItems(p) {
  const it = p.item;
  if (p.task === 'ctw') return ctwBlanks(it.text).length;
  if (p.task === 'respond') return it.items.length;
  return it.questions.length;
}
function audioSecs(p) {
  const words = p.task === 'respond' ? p.item.items.reduce((n, x) => n + wordCount(x.say), 0) : p.item.lines.reduce((n, l) => n + wordCount(l.t), 0);
  return words / 2.5 * (0.9 / (SETTINGS.rate || 0.9)) + (p.task === 'respond' ? p.item.items.length * 2 : 3);
}
function pickTestSets(planId) {
  const plan = TEST_PLANS[planId], taken = {};
  return plan.parts.map(task => {
    const n = pool(task).length, used = TEST_USED[task] || {}, mine = taken[task] = taken[task] || new Set();
    let cands = [...Array(n).keys()].filter(i => !mine.has(i));
    if (!cands.length) cands = [...Array(n).keys()];
    const minUse = Math.min(...cands.map(i => used[i] || 0));
    const choice = shuffle(cands.filter(i => (used[i] || 0) === minUse))[0];
    mine.add(choice);
    return { task, idx: choice, item: pool(task)[choice] };
  });
}
function testSecs(planId, parts) {
  if (planId === 'rtest') return Math.round(parts.reduce((n, p) => n + partItems(p), 0) * 36);
  return Math.round(parts.reduce((n, p) => n + partItems(p) * 20 + audioSecs(p), 0));
}
const fmtMin = s => `${Math.floor(s / 60)}:${String(Math.round(s) % 60).padStart(2, '0')}`;

function openTest(planId) {
  enterSub();
  const plan = TEST_PLANS[planId];
  currentTab = plan.tab; paintTabbar();
  setHeader(`${plan.section} practice test`, true);
  const parts = pickTestSets(planId);
  const q = parts.reduce((n, p) => n + partItems(p), 0), secs = testSecs(planId, parts);
  const hist = (HIST[planId] || []);
  const last = hist[hist.length - 1];
  stage.innerHTML = `<h1>${plan.section} practice test</h1>
    <p class="task-how">A full ${plan.section} section in test order, under a time limit. ${planId === 'ltest' ? 'Each recording plays <b>once</b>, and questions appear after it ends. ' : ''}You can't go back to earlier parts. Your score, an estimated band, and explanations for every question come at the end.</p>
    <div class="stat-row"><div class="stat"><b>${q}</b><span>questions in ${parts.length} parts</span></div><div class="stat"><b>${Math.ceil(secs / 60)}</b><span>minutes</span></div></div>
    <div class="score-list">${parts.map((p, i) => `<div><span>${i + 1}. ${esc(TASKS[p.task].name)}</span><span>${partItems(p)} q</span></div>`).join('')}</div>
    <p class="hint">The real test is adaptive: its second half gets easier or harder depending on the first. This practice test uses a fixed mix, so treat the band as a rough estimate.${last ? ` Your last result: band ${bandFromPct(last.v)} (${Math.round(last.v * 100)}%) on ${new Date(last.t).toLocaleDateString()}.` : ''}</p>
    ${planId === 'ltest' ? '<p class="hint">Use headphones, and keep the screen on. Note-taking on paper is allowed, like the real test.</p>' : ''}
    <div class="row" style="justify-content:center; margin-top:12px;"><button class="btn" id="startTest">Start the test</button></div>`;
  $('#startTest').addEventListener('click', () => startTest(planId, parts, secs));
}

function startTest(planId, parts, secs) {
  const plan = TEST_PLANS[planId];
  TEST = { planId, plan, parts, i: 0, answers: [], left: Math.round(secs), total: Math.round(secs), running: true, timer: null };
  document.body.classList.add('in-test');
  if (planId === 'ltest') keepAwake(true);
  TEST.timer = setInterval(() => {
    if (!TEST || !TEST.running) return;
    TEST.left--;
    const tm = $('#testClock'); if (tm) { tm.textContent = fmtMin(Math.max(0, TEST.left)); tm.classList.toggle('out', TEST.left <= 60); }
    if (TEST.left <= 0) { toast("Time's up. Your test has been submitted."); finishTest(); }
  }, 1000);
  onLeave(() => endTestState());
  renderTestPart();
}
function endTestState() {
  if (!TEST) return;
  clearInterval(TEST.timer); TEST.running = false;
  document.body.classList.remove('in-test');
}
function testUnanswered() {
  const p = TEST.parts[TEST.i], box = $('#testPart'); if (!box) return 0;
  if (p.task === 'ctw') return $$('.ctw-word', box).filter(w => $$('.ctw-box', w).some(b => !b.value)).length;
  const groups = new Set($$('input[type=radio]', box).map(x => x.name));
  return [...groups].filter(n => !$(`input[name="${n}"]:checked`, box)).length;
}
function paintTestBar() {
  const left = $('#testLeft'); if (!left) return;
  const u = testUnanswered();
  left.textContent = u ? `${u} unanswered` : 'All answered';
}
function renderTestPart() {
  const p = TEST.parts[TEST.i], t = TASKS[p.task], last = TEST.i === TEST.parts.length - 1;
  setHeader(`${TEST.plan.section} test · Part ${TEST.i + 1} of ${TEST.parts.length}`, true);
  const hdr = $('.sticky-header'); if (hdr) document.documentElement.style.setProperty('--hdr-h', hdr.offsetHeight + 'px');
  useWide(p.task === 'academic' || p.task === 'daily');
  stage.innerHTML = `
    <div class="test-bar"><span><b>${esc(t.name)}</b> · <span id="testLeft"></span></span><span class="timer" id="testClock">${fmtMin(TEST.left)}</span></div>
    <div id="testPart"></div>
    <div class="check-bar"><span class="answered">Part ${TEST.i + 1} of ${TEST.parts.length}</span><button class="btn" id="testNext">${last ? 'Finish test' : 'Next part ▶'}</button></div>`;
  const box = $('#testPart');
  const mcq = (qs, pfx) => mcqHtml(qs.map(q => ({ q: q.q, options: q.options })), pfx);
  if (p.task === 'ctw') {
    box.innerHTML = `<p class="hint" style="margin-top:0;">Fill in the missing letters.</p><div class="ctw" id="ctwHost"></div>`;
    p.ctl = mountCtw(p.item, $('#ctwHost'));
  } else if (p.task === 'daily') {
    box.innerHTML = `<div class="split"><div class="split-left"><div class="doc" tabindex="0"><span class="kind">${esc(p.item.kind || 'Text')}</span>${esc(p.item.text)}</div></div><div class="split-right">${mcq(p.item.questions, 'tq')}</div></div>`;
  } else if (p.task === 'academic') {
    box.innerHTML = `<div class="split"><div class="split-left"><div class="passage" tabindex="0"><h3>${esc(p.item.title)}</h3>${p.item.paras.map((x, i) => `<p><span class="pnum">¶${i + 1}</span>${esc(x)}</p>`).join('')}</div></div><div class="split-right">${mcq(p.item.questions, 'tq')}</div></div>`;
  } else if (p.task === 'respond') {
    box.innerHTML = p.item.items.map((x, i) => `<div class="resp-item"><div class="player" style="margin-bottom:12px; padding:10px;" id="tp${i}"></div><div id="tr${i}" hidden>${mcqHtml([{ q: 'Choose the best response.', options: x.options }], 'tr' + i, i + 1)}</div></div>`).join('');
    p.item.items.forEach((x, i) => mountPlayer($('#tp' + i), [{ s: i % 2, t: x.say }], { label: `▶ Play ${i + 1} (once)`, once: true, onFirstEnd: () => { $('#tr' + i).hidden = false; paintTestBar(); } }));
  } else {
    box.innerHTML = `<div class="player" id="tp"></div><p class="hint" id="tw">Questions appear after the recording ends.</p><div id="tqs" hidden>${mcq(p.item.questions, 'tq')}</div>`;
    mountPlayer($('#tp'), p.item.lines, { label: '▶ Play the recording (once)', once: true, onFirstEnd: () => { $('#tqs').hidden = false; $('#tw').hidden = true; paintTestBar(); } });
  }
  box.addEventListener('change', paintTestBar); box.addEventListener('input', paintTestBar);
  paintTestBar();
  $('#testNext').addEventListener('click', () => {
    const u = testUnanswered();
    const go2 = () => { collectTestPart(); if (last) finishTest(); else { stopSpeech(); TEST.i++; renderTestPart(); window.scrollTo(0, 0); } };
    if (u) showConfirm(`${u} question${u > 1 ? 's' : ''} unanswered`, "You can't come back to this part. Continue anyway?", last ? 'Finish test' : 'Next part', go2);
    else go2();
  });
}
function collectTestPart() {
  const p = TEST.parts[TEST.i], box = $('#testPart');
  if (!box || TEST.answers[TEST.i]) return;
  if (p.task === 'ctw') TEST.answers[TEST.i] = p.ctl.values();
  else if (p.task === 'respond') TEST.answers[TEST.i] = p.item.items.map((_, i) => { const c = $(`input[name="tr${i}-0"]:checked`, box); return c ? +c.value : null; });
  else TEST.answers[TEST.i] = p.item.questions.map((_, i) => { const c = $(`input[name="tq-${i}"]:checked`, box); return c ? +c.value : null; });
}
function gradeTestPart(p, ans) {
  ans = ans || [];
  if (p.task === 'ctw') {
    return ctwWords(p.item.text).map((w, i) => ({ yours: w.shown + (ans[i] || '_'), right: w.full, ok: (ans[i] || '').toLowerCase() === w.miss.toLowerCase(), ctw: true }));
  }
  const qs = p.task === 'respond' ? p.item.items.map(x => ({ q: `"${x.say}"`, options: x.options, answer: x.answer, why: x.why })) : p.item.questions;
  return qs.map((q, i) => ({ q: q.q, yours: ans[i] != null ? q.options[ans[i]] : '', right: q.options[q.answer], ok: ans[i] === q.answer, why: q.why }));
}
function finishTest() {
  if (!TEST || !TEST.running) return;
  collectTestPart(); stopSpeech();
  const { planId, plan, parts } = TEST;
  const used = TEST.total - Math.max(0, TEST.left);
  endTestState(); keepAwake(false); useWide(false);
  const graded = parts.map((p, i) => ({ p, rows: gradeTestPart(p, TEST.answers[i]) }));
  const right = graded.reduce((n, g) => n + g.rows.filter(r => r.ok).length, 0);
  const total = graded.reduce((n, g) => n + g.rows.length, 0);
  const pct = total ? right / total : 0, band = bandFromPct(pct);
  // Save: overall test result, each part toward its task's stats, sets used.
  graded.forEach(({ p, rows }) => {
    recordQuiet(p.task, rows.filter(r => r.ok).length, rows.length);
    if (p.task !== 'ctw') rows.forEach((r, i) => noteResult(p.task, p.item, i, r.ok));
    const u = TEST_USED[p.task] = TEST_USED[p.task] || {}; u[p.idx] = (u[p.idx] || 0) + 1;
  });
  store.set('toefl26-testused', TEST_USED);
  recordQuiet(planId, right, total);
  if (typeof markStudyDay === 'function') markStudyDay();
  buzz(pct >= 0.8 ? 25 : [25, 70, 25]);
  // Per task type breakdown
  const byTask = {};
  graded.forEach(({ p, rows }) => { const b = byTask[p.task] = byTask[p.task] || { r: 0, t: 0 }; b.r += rows.filter(r => r.ok).length; b.t += rows.length; });
  setHeader(`${plan.section} test results`, true);
  stage.innerHTML = `<h1>${plan.section} test results</h1>
    <div class="result">${stampHtml(right, total)}</div>
    <div class="stat-row" style="margin-top:14px;">
      <div class="stat"><b>${band.toFixed(1)}</b><span>estimated band (about ${cefrOf(band)})</span></div>
      <div class="stat"><b>${fmtMin(used)}</b><span>time used of ${fmtMin(TEST.total)}</span></div></div>
    <p class="hint">A rough practice estimate on the 1 to 6 scale, not an official score. Real bands come from ETS's adaptive test.</p>
    <h3>By task type</h3>
    <div class="score-list">${Object.entries(byTask).map(([k, v]) => `<div><span>${esc(TASKS[k].name)}</span><span>${v.r}/${v.t} (${Math.round(100 * v.r / v.t)}%)</span></div>`).join('')}</div>
    <h3 style="margin-top:22px;">Review every question</h3>
    ${graded.map(({ p, rows }, i) => {
      const r = rows.filter(x => x.ok).length;
      return `<details class="test-review"${r < rows.length ? ' open' : ''}><summary><b>Part ${i + 1}. ${esc(TASKS[p.task].name)}</b> · ${esc(p.item.title || '')} <span class="badge ${r === rows.length ? 'on' : ''}">${r}/${rows.length}</span></summary>
        ${p.task === 'ctw' ? `<div class="transcript">${esc(p.item.text).replace(/\[([A-Za-z']+)\]/g, (m, w) => `<b class="target">${w}</b>`)}</div>` : ''}
        ${p.item.lines ? `<details class="transcript"><summary>Transcript</summary>${p.item.lines.map(l => `<p>${p.item.lines.length > 1 ? `<b>${esc(l.name || 'Speaker')}:</b> ` : ''}${esc(l.t)}</p>`).join('')}</details>` : ''}
        ${p.task === 'ctw' ? `<div class="ctw-chips">${rows.map(x => x.ok ? `<span class="chip right">${esc(x.right)} ✓</span>` : `<span class="chip wrong"><s>${esc(x.yours)}</s> → <b>${esc(x.right)}</b></span>`).join('')}</div>` : ''}
        ${rows.filter(x => !x.ctw).map(x => `<div class="corr">
          <div>${esc(x.q)}</div>
          ${x.ok ? `<span class="n">✓ ${esc(x.right)}</span>` : `<span class="o">${x.yours ? esc(x.yours) : '(no answer)'}</span> → <span class="n">${esc(x.right)}</span>`}
          ${x.why ? `<div class="w">${esc(x.why)}</div>` : ''}
          ${x.ok ? '' : `<div class="ask-row">${askBtnHtml(explainPrompt(p.task, p.item, reviewQuestion(p.task, p.item, rows.indexOf(x)) || { q: x.q, right: x.right }, x.yours, p.task === 'respond' ? p.item.items[rows.indexOf(x)].say : ''), 'Ask Claude why ↗', 'btn ghost small')}</div>`}</div>`).join('')}
      </details>`;
    }).join('')}
    <div class="row" style="justify-content:center; margin-top:20px;"><button class="btn ghost" id="again">Take another test</button><button class="btn" id="back">Back to ${plan.section}</button></div>`;
  $('#again').addEventListener('click', () => go(() => openTest(planId)));
  $('#back').addEventListener('click', goBack);
  TEST = null;
  window.scrollTo(0, 0);
}
function recordQuiet(id, pts, tot) {
  const s = STATS[id] || { sets: 0, pts: 0, tot: 0 };
  s.sets++; s.pts += pts; s.tot += tot; STATS[id] = s; store.set('toefl26-stats', STATS);
  if (tot) pushHist(id, pts / tot);
}
function showConfirm(title, body, okLabel, onOk, cancelLabel = 'Stay') {
  const ov = document.createElement('div'); ov.className = 'welcome'; ov.setAttribute('role', 'dialog'); ov.setAttribute('aria-modal', 'true');
  ov.innerHTML = `<div class="welcome-card"><h2 class="w-title">${esc(title)}</h2><div class="w-body"><p>${esc(body)}</p></div>
    <div class="w-nav"><button class="btn ghost" data-c="no">${esc(cancelLabel)}</button><button class="btn" data-c="ok">${esc(okLabel)}</button></div></div>`;
  document.body.appendChild(ov);
  const close = () => ov.remove();
  $('[data-c=no]', ov).addEventListener('click', close);
  $('[data-c=ok]', ov).addEventListener('click', () => { close(); onOk(); });
  $('[data-c=no]', ov).focus();
}

// ---------- Ask Claude on claude.ai (no API key needed) ----------
// Copies a ready-made prompt and opens claude.ai, prefilled where supported.
// Uses the learner's own claude.ai subscription.
const ASK = {}; let askSeq = 0;
const koAsk = () => SETTINGS.korean ? '\nAdd short Korean explanations in parentheses where they help me understand.' : '';
function askBtnHtml(prompt, label = 'Score in Claude ↗', cls = 'btn ghost') {
  const k = 'a' + (++askSeq); ASK[k] = prompt;
  return `<button class="${cls}" data-ask="${k}">${esc(label)}</button>`;
}
function askClaude(prompt, btn) {
  let copied = null;
  try { copied = navigator.clipboard && navigator.clipboard.writeText(prompt); } catch (e) { copied = null; }
  const url = 'https://claude.ai/new' + (prompt.length < 6000 ? '?q=' + encodeURIComponent(prompt) : '');
  try { window.open(url, '_blank', 'noopener'); } catch (e) { }
  const host = btn.closest('.row') || btn.parentElement;
  const note = document.createElement('div'); note.className = 'notice info ask-note';
  const showFallback = () => {
    note.innerHTML = `Copy this prompt, then paste it into a new chat on <b>claude.ai</b>:<textarea class="write" readonly style="min-height:120px; margin-top:8px; font-size:13px;"></textarea>`;
    const ta = $('textarea', note); ta.value = prompt; ta.addEventListener('focus', () => ta.select());
  };
  $$('.ask-note', host.parentElement).forEach(n => n.remove());
  host.insertAdjacentElement('afterend', note);
  if (copied && copied.then) {
    note.innerHTML = '<b>Copied.</b> claude.ai is opening. If the message box is empty, paste the prompt (long-press → Paste) and send.';
    copied.catch(showFallback);
  } else showFallback();
}
document.addEventListener('click', e => {
  const b = e.target.closest('[data-ask]'); if (!b || !ASK[b.dataset.ask]) return;
  askClaude(ASK[b.dataset.ask], b);
});
function writingPrompt(taskName, taskDesc, text) {
  return `You are an experienced, fair TOEFL iBT writing rater. Score my response for the TOEFL iBT (2026 format) "${taskName}" task on the 0 to 5 rubric (half points allowed). Consider task completion, development, organization, vocabulary range, and grammatical accuracy. Be encouraging but honest.

TASK
${taskDesc}

MY RESPONSE (${wordCount(text)} words)
${text}

Please give me:
1. My score and a one-sentence summary
2. Two or three strengths
3. Two or three specific improvements
4. Corrections of real errors (original → better, with a short reason)
5. A revised version that keeps my ideas but fixes errors and improves flow${koAsk()}`;
}
function itemContext(task, item) {
  if (!item) return '';
  if (item.text && task !== 'trans' && task !== 'ctw') return item.text;
  if (item.paras) return `${item.title}\n\n${item.paras.join('\n\n')}`;
  if (item.lines) return item.lines.map(l => (item.lines.length > 1 ? `${l.name || 'Speaker'}: ` : '') + l.t).join('\n');
  return '';
}
function explainPrompt(task, item, q, mine, extra = '') {
  const ctx = (extra || itemContext(task, item)).slice(0, 5000);
  const L = 'ABCD';
  const opts = q.options ? q.options.map((o, i) => `${L[i]}. ${o}`).join('\n') : '';
  return `I'm practicing for the TOEFL iBT (2026 format), task "${TASKS[task] ? TASKS[task].name : task}". I got this question wrong. Please explain in simple English why the correct answer is right and why my answer is wrong, then give me one tip for questions like this.${koAsk()}
${ctx ? `\n${task === 'convo' || task === 'announce' || task === 'talk' || task === 'notes' || task === 'respond' ? 'TRANSCRIPT' : 'TEXT'}\n${ctx}\n` : ''}
QUESTION
${q.q || 'Choose the best answer.'}
${opts ? `\nOPTIONS\n${opts}\n` : ''}
MY ANSWER: ${mine || '(no answer)'}
CORRECT ANSWER: ${q.options ? q.options[q.answer] : q.right}`;
}

// ---------- Mistake review ----------
// Every missed question returns after 1 day, then 3, then 7. Each correct
// review moves it to the next step; a miss starts it over. After three
// correct reviews it's cleared.
const MISTAKE_DAYS = { 1: 1, 2: 3, 3: 7 };
let MISTAKES = store.get('toefl26-mistakes', {});
const saveMistakes = () => store.set('toefl26-mistakes', MISTAKES);
const REVIEWABLE = ['daily', 'academic', 'skim', 'trans', 'vic', 'respond', 'convo', 'announce', 'talk', 'notes'];
function noteResult(task, item, qi, ok) {
  if (!REVIEWABLE.includes(task) || !item || !item.title) return;
  const key = `${task}|${item.title}|${qi}`, m = MISTAKES[key];
  if (!ok) MISTAKES[key] = { task, title: item.title, qi, box: 1, due: addDays(1), n: (m ? m.n : 0) + 1 };
  else if (m && m.due <= dayStr()) advanceMistake(key);
  saveMistakes();
}
function advanceMistake(key) {
  const m = MISTAKES[key]; if (!m) return;
  m.box++;
  if (m.box > 3) delete MISTAKES[key]; else m.due = addDays(MISTAKE_DAYS[m.box]);
}
function findMistake(m) {
  const item = (pool(m.task) || []).find(x => x.title === m.title);
  if (!item) return null;
  const q = reviewQuestion(m.task, item, m.qi);
  return q ? { item, q } : null;
}
function reviewQuestion(task, item, qi) {
  if (task === 'respond') { const x = item.items[qi]; return x && { q: 'Choose the best response.', options: x.options, answer: x.answer, why: x.why }; }
  if (task === 'vic') { const x = item.items[qi]; return x && { q: 'What does the bold word most likely mean?', options: x.options, answer: x.answer, why: x.why }; }
  if (task === 'trans') return item.predict && item.predict[qi];
  return item.questions && item.questions[qi];
}
function dueMistakes() {
  const t = dayStr();
  Object.keys(MISTAKES).forEach(k => { if (!findMistake(MISTAKES[k])) delete MISTAKES[k]; });
  return Object.entries(MISTAKES).filter(([, m]) => m.due <= t).map(([key, m]) => Object.assign({ key }, m));
}
function runMistakes(list, opts = {}) {
  if (!opts.daily) enterSub();
  let i = 0, right = 0; const missed = [];
  if (!list.length) { setHeader('Mistake review', true); stage.innerHTML = '<p class="sub">No mistakes are due for review. Nice work.</p>'; return; }
  const card = () => {
    const m = list[i], f = findMistake(m);
    if (!f) { i++; return i < list.length ? card() : done(); }
    const { item, q } = f, t = m.task;
    setHeader(opts.daily ? dailyTitle() : `Mistake review · ${i + 1}/${list.length}`, true);
    let ctx = '';
    if (t === 'daily') ctx = `<div class="doc"><span class="kind">${esc(item.kind || 'Text')}</span>${esc(item.text)}</div>`;
    else if (t === 'academic' || t === 'skim') ctx = `<details class="guide" open><summary>📄 ${esc(item.title)}</summary><div class="passage" style="margin:10px 0 0;">${item.paras.map((x, k) => `<p><span class="pnum">¶${k + 1}</span>${esc(x)}</p>`).join('')}</div></details>`;
    else if (t === 'vic') { const x = item.items[m.qi]; ctx = `<p class="vic-text">${esc(x.text).replace(/\{\{(.+?)\}\}/, '<b class="target">$1</b>').replace(/\[\[(.+?)\]\]/, '$1')}</p>`; }
    else if (t === 'respond' || item.lines) ctx = `<div class="player" id="mp"></div>`;
    stage.innerHTML = `<div class="pbar static" aria-hidden="true"><i style="width:${Math.round(100 * i / list.length)}%"></i></div>
      <div class="w-eyebrow">${esc(TASKS[t].name)} · ${esc(item.title)}${m.n > 1 ? ` · missed ${m.n} times` : ''}</div>
      ${ctx}
      <div id="mq">${mcqHtml([q], 'mr')}</div>
      <div class="row" style="justify-content:center;"><button class="btn" id="mchk">Check</button></div>
      <div id="mfb"></div>`;
    if (t === 'respond') mountPlayer($('#mp'), [{ s: m.qi % 2, t: item.items[m.qi].say }], { label: '▶ Play' });
    else if (item.lines) mountPlayer($('#mp'), item.lines, { label: '▶ Play the recording' });
    $('#mchk').addEventListener('click', () => {
      const chosen = $('input[name="mr-0"]:checked');
      if (!chosen) { toast('Choose an answer first.'); return; }
      $('#mchk').remove();
      const ok = gradeMcq([q], 'mr', $('#mq')) === 1;
      if (ok) { right++; advanceMistake(m.key); }
      else { missed.push(m); MISTAKES[m.key] = Object.assign(MISTAKES[m.key] || m, { box: 1, due: addDays(1), n: (m.n || 1) + 1 }); }
      saveMistakes(); buzz(ok ? 20 : [25, 70, 25]);
      const after = MISTAKES[m.key];
      $('#mfb').innerHTML = `<div class="w-feedback">
        <div class="stamp ${ok ? 'good' : 'low'}" style="font-size:17px;">${ok ? 'Correct' : 'Not yet'}</div>
        <p class="hint">${ok ? (after ? `Next review in ${MISTAKE_DAYS[after.box]} days.` : 'Cleared from your review list. 🎉') : 'It will come back tomorrow.'}</p>
        ${item.lines ? `<details class="transcript" style="text-align:left;"><summary>Transcript</summary>${item.lines.map(l => `<p>${item.lines.length > 1 ? `<b>${esc(l.name || 'Speaker')}:</b> ` : ''}${esc(l.t)}</p>`).join('')}</details>` : ''}
        <div class="row" style="justify-content:center; margin-top:10px;">
          ${ok ? '' : askBtnHtml(explainPrompt(t, item, q, q.options[+chosen.value], t === 'respond' ? item.items[m.qi].say : t === 'vic' ? item.items[m.qi].text.replace(/\{\{|\}\}|\[\[|\]\]/g, '') : ''), 'Ask Claude why ↗', 'btn ghost')}
          <button class="btn" id="mnx">${i + 1 < list.length ? 'Next ▶' : 'See results'}</button></div></div>`;
      $('#mnx').addEventListener('click', () => { stopSpeech(); i++; i < list.length ? card() : done(); window.scrollTo(0, 0); });
    });
  };
  const done = () => {
    if (opts.onDone) return opts.onDone(right, list.length);
    markStudyDay();
    setHeader('Mistake review', true);
    const left = dueMistakes().length;
    stage.innerHTML = `<div class="result">${stampHtml(right, list.length)}</div>
      <p class="sub" style="text-align:center;">${missed.length ? `${missed.length} will come back tomorrow.` : 'All correct.'} ${left ? `${left} more due today.` : ''}</p>
      <div class="row" style="justify-content:center; margin-top:16px;">${left ? '<button class="btn ghost" id="more">Review more</button>' : ''}<button class="btn" id="back">Done</button></div>`;
    const mo = $('#more'); if (mo) mo.addEventListener('click', () => go(() => runMistakes(shuffle(dueMistakes()).slice(0, 10))));
    $('#back').addEventListener('click', goBack);
  };
  card();
}

// ---------- Backup and restore ----------
const BACKUP_PREFIX = 'toefl26-';
function backupData() {
  const data = {};
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && k.startsWith(BACKUP_PREFIX)) data[k] = localStorage.getItem(k);
    }
  } catch (e) { }
  // Never put the API key in a backup file.
  if (data['toefl26-settings']) { try { const s = JSON.parse(data['toefl26-settings']); delete s.apiKey; data['toefl26-settings'] = JSON.stringify(s); } catch (e) { } }
  return { app: 'toefl-practice', version: 1, created: new Date().toISOString(), data };
}
function exportBackup(out) {
  const b = backupData();
  const blob = new Blob([JSON.stringify(b)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob); a.download = `toefl-progress-${dayStr()}.json`;
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 5000);
  store.set('toefl26-lastbackup', dayStr());
  out.textContent = `Saved toefl-progress-${dayStr()}.json to your Downloads. Keep it somewhere safe, like Google Drive.`;
}
function importBackup(file, out) {
  const r = new FileReader();
  r.onload = () => {
    let b;
    try { b = JSON.parse(r.result); } catch (e) { out.textContent = "That file isn't a backup from this app."; return; }
    if (!b || b.app !== 'toefl-practice' || !b.data) { out.textContent = "That file isn't a backup from this app."; return; }
    const when = b.created ? new Date(b.created).toLocaleDateString() : 'an unknown date';
    showConfirm('Restore this backup?', `It's from ${when}. It replaces all progress on this device.`, 'Restore', () => {
      const keep = { apiKey: SETTINGS.apiKey, model: SETTINGS.model };
      try {
        Object.keys(localStorage).filter(k => k.startsWith(BACKUP_PREFIX)).forEach(k => localStorage.removeItem(k));
        Object.entries(b.data).forEach(([k, v]) => { if (k.startsWith(BACKUP_PREFIX) && typeof v === 'string') localStorage.setItem(k, v); });
        const s = JSON.parse(localStorage.getItem('toefl26-settings') || '{}');
        if (keep.apiKey) s.apiKey = keep.apiKey; if (keep.model) s.model = keep.model;
        localStorage.setItem('toefl26-settings', JSON.stringify(s));
      } catch (e) { out.textContent = "Couldn't restore on this device: storage isn't available."; return; }
      location.reload();
    }, 'Cancel');
  };
  r.readAsText(file);
}

window.addEventListener('popstate', () => {
  if (closeSheet()) { try { history.pushState({ toefl: 'sub' }, ''); } catch (e) { } return; } // back closes the passage sheet first
  if (TEST && TEST.running) { // leaving mid-test: confirm first
    try { history.pushState({ toefl: 'sub' }, ''); } catch (e) { }
    showConfirm('Leave the test?', 'Your answers will be lost, and the test won\'t be scored.', 'Leave test', () => { endTestState(); TEST = null; go(() => renderTab(currentTab)); });
    return;
  }
  if (screen === 'sub') go(() => renderTab(currentTab));
});
// When the keyboard opens on a phone, keep the focused field in view
stage.addEventListener('focusin', e => {
  if (!COARSE || !e.target.matches('input[type=text], input:not([type]), textarea, select')) return;
  setTimeout(() => { try { e.target.scrollIntoView({ block: 'center', behavior: 'smooth' }); } catch (x) { } }, 350);
});
renderTab('home');
if (!store.get('toefl26-welcomed', 0)) showWelcome();

// ---------- Offline support ----------
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => { navigator.serviceWorker.register('sw.js').catch(() => { }); });
}
