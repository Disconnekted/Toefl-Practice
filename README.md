# TOEFL iBT Practice

An installable, offline-capable app for practicing every TOEFL iBT task type
(2026 format), plus reading and listening strategy drills. Listening audio is
recorded with natural-sounding voices that GitHub creates for free.

## Set it up (about 30 minutes, mostly waiting)

You need a computer for the upload steps. Afterwards you use the app on your phone.

### 1. Create the repository
1. Go to https://github.com/new
2. Repository name: `toefl-practice`
3. Choose **Public** (free GitHub Pages hosting needs a public repository).
4. Leave "Add a README" unticked. Click **Create repository**.

### 2. Turn on publishing and permissions (before uploading)
1. In the repository, open **Settings → Pages**.
   Under **Build and deployment → Source**, choose **GitHub Actions**.
2. Open **Settings → Actions → General**.
   Under **Workflow permissions**, choose **Read and write permissions**, then **Save**.
   (This lets GitHub save the audio it creates.)

### 3. Upload the files
1. Unzip `toefl-practice.zip` on your computer.
2. Open the repository's **Code** tab and click **uploading an existing file**.
3. Open the unzipped `toefl-practice` folder and drag **everything inside it**
   (not the folder itself) into the upload area.
4. Click **Commit changes**.

**Important: the `.github` folder.** It starts with a dot, so it may be hidden:
- Mac: in Finder, press **Cmd + Shift + .** to show hidden files.
- Windows: it's usually visible already.

After uploading, check that the repository contains
`.github/workflows/build-and-deploy.yml`. If it's missing:
**Add file → Create new file**, type the name
`.github/workflows/build-and-deploy.yml`, paste in the contents of that file
from the zip, and click **Commit changes**.

### 4. Wait for the first build
Open the **Actions** tab. A run called **Build audio and publish** starts automatically.
- The first run takes roughly 10–25 minutes. It installs the free Kokoro voice
  model and records about 90 audio clips.
- A green check means it worked. Later runs take about a minute unless you
  change the content.
- If the run didn't start or failed at the last step, click
  **Build audio and publish → Run workflow**.

### 5. Open the app
Your address is:

`https://YOUR-GITHUB-USERNAME.github.io/toefl-practice/`

(It's also shown under **Settings → Pages**.)

### 6. Install it on Android
1. Open the address in **Chrome**.
2. Tap **⋮ → Install app** (or **Add to Home screen**).
3. Open the app. A short welcome guide appears the first time. On its last
   page, tap **Save audio now** (about 5–10 MB, use Wi-Fi). You can also do
   this later in **Settings (⚙️) → Save all audio for offline use**.

Now listening, reading, and writing practice work with no internet.

## Optional: Claude features
New practice sets and scoring for writing, speaking, and notes use Claude.
To turn them on:
1. Create an API key at https://console.anthropic.com
2. In the app: **Settings (⚙️) → Claude features → paste the key → Save**.

The key is stored only on your phone and sent only to Anthropic. Usage is
billed to your Anthropic account. **Never put your key in this repository.**
If the model name ever stops working, update it in the same settings section.

## What needs internet
- Claude features
- Speech-to-text in the speaking tasks (Chrome sends speech to Google)
- New practice sets created by Claude use your phone's voices, not the
  recorded ones

## Using the app
- **Tabs at the bottom:** Home, Reading, Listening, Writing, Speaking.
  Reading and Listening also contain strategy and note-taking drills.
- **Home:** continue your last task, try the suggested next task (your weakest
  or untried one), and see each skill's average.
- **Practice tests:** at the top of the Reading and Listening tabs. A full
  timed section in test order, with an estimated band and explanations at the end.
- **Answer templates (📝):** above the email, discussion, and interview tasks.
- **Progress (📈 on Home):** recent scores for every task, plus how often you
  practiced this week.
- **Settings (⚙️ in the header):** text size, Korean instructions, audio
  speed, voices, offline audio, exam mode, and Claude features.
- **In a task:** ← (or Android's back button) returns to the tabs, A−/A+
  changes the text size, and 🔊 opens audio settings.

## Changing content
Edit `data/content.js` on GitHub (click the file, then the pencil icon) and
commit. GitHub automatically records audio for any new or changed lines and
republishes the app.

**Safety check:** before publishing, GitHub checks `data/content.js`. If you
made a typo (for example, a missing comma) or a question's answer number is
wrong, the run stops with a red ✗ and a message saying what to fix. The last
working version of the app stays online until you fix it.

## Troubleshooting
- **Page not found (404):** wait a few minutes after the first green run, then
  check **Settings → Pages** for the exact address.
- **A run failed at "Safety check":** open the failed run in the **Actions**
  tab and click that step. The message names the set and question to fix.
- **A run failed somewhere else:** open the failed run, click the red step,
  copy the error lines, and ask Claude for help with them.
- **Old version still showing:** close the app completely and open it again
  while online.

## Credits
Voices: Kokoro-82M by hexgrad, Apache 2.0 license.
