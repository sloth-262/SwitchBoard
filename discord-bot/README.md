# SwitchBoard Discord Bot

A Discord bot that reports on the SwitchBoard office IoT monitoring system. It
can run against **mock data** (no backend needed) or the **real Laravel
backend**, and optionally rewrites replies through an LLM (Groq).

## Commands

| Command | Description |
| --- | --- |
| `!status` | Overall office status (devices ON, live draw, active alerts). Calls `GET /status`. |
| `!usage` | Today's energy usage. Calls `GET /usage`. |
| `!room <id\|name>` | Room-specific status. Calls `GET /rooms/{id}`. |
| `!help` | Lists the available commands. |

### Rooms

`!room` accepts a numeric backend ID first, e.g. `!room 1`, `!room 2`,
`!room 3`. Friendly aliases also map to those IDs:

| Alias | Backend ID |
| --- | --- |
| `!room boss` | 1 |
| `!room meeting` | 2 |
| `!room lobby` | 3 |

## Configuration

Copy `.env.example` to `.env` and fill in the values. **`.env` is gitignored —
never commit it.**

```env
DISCORD_TOKEN=              # your bot token
COMMAND_PREFIX=!            # command prefix
BACKEND_URL=http://127.0.0.1:8000/api/v1
USE_MOCK_DATA=true          # "false" to call the real backend
GROQ_API_KEY=               # optional; enables LLM-rewritten replies
GROQ_MODEL=                 # optional; e.g. a Groq-hosted model id
DISCORD_CHANNEL_ID=         # optional; channel for proactive alert posts
ALERT_POLL_MS=20000         # optional; how often to poll /alerts (ms)
ALERT_ANNOUNCE_EXISTING=false  # optional; "true" posts pre-existing alerts on boot
```

### `BACKEND_URL`

`BACKEND_URL` **must include the `/api/v1` prefix**, e.g.
`http://127.0.0.1:8000/api/v1`. All requests are made relative to it:

- `!status` → `GET {BACKEND_URL}/status`
- `!usage`  → `GET {BACKEND_URL}/usage`
- `!room 1` → `GET {BACKEND_URL}/rooms/1`

Trailing slashes on `BACKEND_URL` are stripped automatically.

### Mock vs. real backend

- `USE_MOCK_DATA=true` (or unset): the bot serves built-in mock data and never
  touches the network. Useful for local development.
- `USE_MOCK_DATA=false`: the bot calls the Laravel backend at `BACKEND_URL`.

The response formatters tolerate both the mock JSON shape and the backend JSON
shape (e.g. device `state`/`status`, `wattage`/`power_watts`,
`room_name`/`name`, `today_kwh`/`kwh_today`). If the backend is unreachable, the
bot replies with a friendly fallback error instead of crashing.

## Proactive Alerts

When `DISCORD_CHANNEL_ID` is set, the bot polls `GET /alerts` every
`ALERT_POLL_MS` (default 20s) and posts any **new** alert into that channel,
phrased through the same LLM humanizer (with plain-text fallback) used by the
commands.

- **Deduplication:** each alert is tracked by its backend `id` (or a
  room/device/reason composite when no id is present), so the same alert is
  never posted twice within a process lifetime.
- **Boot behavior:** on the first poll the bot silently records existing alerts
  so the channel isn't flooded with backlog. Set `ALERT_ANNOUNCE_EXISTING=true`
  to post the current alerts on startup instead.
- **Safe by default:** if `DISCORD_CHANNEL_ID` is unset, the channel can't be
  fetched, or a poll fails, the watcher logs a warning and the rest of the bot
  keeps working — proactive alerts simply stay off.

This is implemented bot-side (polling) rather than via a backend webhook, so it
needs no backend changes and reuses the existing `/alerts` route.

## Running

```bash
cd discord-bot
npm install
npm start
```

Make sure the Laravel backend is running when `USE_MOCK_DATA=false`:

```bash
# from the repository root
php artisan migrate --seed
php artisan serve   # serves http://127.0.0.1:8000
```

## LLM Prompt Design

The bot never lets the LLM invent data. Raw backend JSON is fetched first, then
a single reusable humanizer (`src/llm.js` → `humanize(intent, data, extra)`)
turns it into a friendly Discord sentence. The same function powers both
on-demand commands and proactive alerts.

Design decisions:

- **Grounding over creativity.** The prompt hard-instructs the model to use only
  the supplied JSON and to never invent device states, rooms, wattage, usage, or
  alerts. `temperature` is kept low (0.2) to minimize drift.
- **Tone.** It's told to sound like a helpful office colleague, stay under three
  sentences, avoid JSON in the output, and never mention that it's an AI.
- **Determinism of facts.** Because the numbers come from the backend and the
  model only rephrases them, the bot and the dashboard always report the same
  figures off the same source of truth.
- **Fallback first.** If `GROQ_API_KEY`/`GROQ_MODEL` are missing, the Groq call
  errors, or it returns empty text, `humanize` falls back to the plain-text
  formatters in `src/formatter.js`. The demo works with or without a live LLM
  key — a bad key can't sink it.

The provider is **Groq** (free tier, OpenAI-compatible endpoint); keys are read
only from environment variables and never hardcoded.
