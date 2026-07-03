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
DISCORD_TOKEN=          # your bot token
COMMAND_PREFIX=!        # command prefix
BACKEND_URL=http://127.0.0.1:8000/api/v1
USE_MOCK_DATA=true      # "false" to call the real backend
GROQ_API_KEY=           # optional; enables LLM-rewritten replies
GROQ_MODEL=             # optional; e.g. a Groq-hosted model id
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
