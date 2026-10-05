"""Creates the missing audio clips listed in scripts/audio_jobs.json using
Kokoro (an open-weight text-to-speech model, Apache 2.0 license).
Runs automatically in GitHub Actions; see README.md to run it yourself."""
import json, os, subprocess, sys, tempfile

import numpy as np
import soundfile as sf
from kokoro import KPipeline

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
AUDIO = os.path.join(ROOT, "audio")
jobs = json.load(open(os.path.join(ROOT, "scripts", "audio_jobs.json"), encoding="utf-8"))
os.makedirs(AUDIO, exist_ok=True)

pipelines = {}
def pipeline(lang):
    if lang not in pipelines:
        pipelines[lang] = KPipeline(lang_code=lang)
    return pipelines[lang]

made = failed = 0
for n, job in enumerate(jobs, 1):
    out = os.path.join(AUDIO, job["key"] + ".mp3")
    if os.path.exists(out):
        continue
    try:
        voice = job["voice"]
        parts = []
        for result in pipeline(voice[0])(job["text"], voice=voice, speed=1.0):
            audio = getattr(result, "audio", None)
            if audio is None and isinstance(result, tuple):
                audio = result[2]
            if audio is not None:
                parts.append(audio.numpy() if hasattr(audio, "numpy") else np.asarray(audio))
        if not parts:
            raise RuntimeError("no audio produced")
        with tempfile.NamedTemporaryFile(suffix=".wav", delete=False) as tmp:
            wav = tmp.name
        sf.write(wav, np.concatenate(parts), 24000)
        subprocess.run(["ffmpeg", "-loglevel", "error", "-y", "-i", wav, "-ac", "1",
                        "-codec:a", "libmp3lame", "-b:a", "56k", out], check=True)
        os.remove(wav)
        made += 1
        print(f"[{n}/{len(jobs)}] {voice}: {job['text'][:70]}", flush=True)
    except Exception as e:  # keep going; a failed clip falls back to phone voices
        failed += 1
        print(f"FAILED {job['key']}: {e}", file=sys.stderr, flush=True)

print(f"Created {made} clips, {failed} failed.")
if jobs and made == 0:
    sys.exit(1)
