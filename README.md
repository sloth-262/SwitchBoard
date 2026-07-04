# SwitchBoard

**Lights, Fans, Discord** — an office IoT monitoring system built for Techathon Nationals (IUT Robotics Society).

Simulates 15 smart office devices (fans & lights) across 3 rooms with a single Laravel API as the source of truth, consumed live by a React dashboard and a Discord bot — so both interfaces always reflect the same reality.

---

## Table of Contents

- [Architecture](#architecture)
- [Docs](#docs)
- [Domain](#domain)
- [Quick Start](#quick-start)
- [Backend Setup](#backend-setup)
- [Frontend Setup (React Dashboard)](#frontend-setup-react-dashboard)
- [Discord Bot Setup](#discord-bot-setup)
- [Device Simulator](#device-simulator)
- [API Endpoints](#api-endpoints)
- [Database Schema](#database-schema)
- [Troubleshooting](#troubleshooting)
- [Project Structure](#project-structure)

---

## Architecture

```
                  ┌─────────────────────────┐
                  │   Device Simulator       │
                  │ (php artisan devices:    │
                  │       simulate)          │
                  └───────────┬─────────────┘
                              │ writes state
                              ▼
                  ┌─────────────────────────┐
                  │   Laravel API (:8000)   │
                  │   SQLite — single       │
                  │   source of truth       │
                  └──────┬───────────┬──────┘
                         │           │
             REST API    │           │   REST API
                         ▼           ▼
          ┌───────────────────┐   ┌──────────────────┐
          │  React Dashboard   │   │   Discord Bot     │
          │  (dashboard/ :5173)│   │  (discord-bot/)   │
          └───────────────────┘   └──────────────────┘
```

Both the dashboard and the Discord bot are read-only consumers of the same Laravel API — neither talks to the other directly, and neither has its own copy of device state.

## Docs

- [System diagram](docs/system-diagram.png)
- [Hardware schematic](docs/hardware-schematic.png)
- [Screenshots](docs/screenshots/)

## Domain

- **3 Rooms:** Drawing Room, Work Room 1, Work Room 2
- **15 Devices total:** 2 fans (60W each) + 3 lights (15W each) per room
- **Database:** SQLite
- **Office hours:** 9 AM – 5 PM (used for after-hours alert detection)

## Quick Start

You'll need **4 terminals** running simultaneously:

| Terminal | Command | Purpose |
|---|---|---|
| 1 | `php artisan serve` | Laravel API on port 8000 |
| 2 | `php artisan devices:simulate` | Keeps device data "live" and generates alerts |
| 3 | `cd dashboard && npm run dev` | React dashboard on port 5173 |
| 4 | `cd discord-bot && npm start` | Discord bot |

Full setup instructions for each below.

---

## Backend Setup

```bash
composer install
cp .env.example .env
php artisan key:generate
```

**Create the SQLite database file** (Laravel does not create this automatically):
```bash
# macOS/Linux
touch database/database.sqlite

# Windows PowerShell
New-Item -ItemType File -Path database\database.sqlite -Force
```

**Run migrations and seed initial data:**
```bash
php artisan migrate:fresh --seed
```

**Start the server:**
```bash
php artisan serve
```

**Verify it's working:**
```
http://127.0.0.1:8000/api/v1/status
```
This should return JSON with all 3 rooms and their devices.

---

## Frontend Setup (React Dashboard)

Built with React + Vite + Tailwind CSS v4. Polls the Laravel API every 4 seconds for live updates — no page refresh required.

```bash
cd dashboard
npm install
```

**Create `dashboard/.env`:**
```
VITE_API_BASE_URL=http://127.0.0.1:8000/api/v1
```

**Run the dev server** (with the backend already running on port 8000):
```bash
npm run dev
```
Open the printed URL — usually `http://localhost:5173`.

### Dashboard Features

- **Live Device Status Panel** — all 15 devices grouped by room, with real-time on/off indicators and live wattage
- **Live Power Consumption Meter** — total office wattage plus a per-room breakdown, sourced directly from the API's computed total
- **Active Alerts Panel** — real, backend-generated alerts (devices left on after office hours, rooms with all devices on for 2+ continuous hours), each with room name and timestamp
- **Office Layout View** — animated top-view of all 3 rooms; fans spin and lights glow when devices are ON
- **Live connection indicator** — pulsing status dot in the header confirms an active connection
- **Responsive layout** — tested down to mobile widths; office layout stacks vertically on small screens
- **Loading & error states** — graceful handling if the backend is unreachable or still starting up

### Frontend Structure

```
dashboard/src/
├── api/
│   └── client.js            # centralized fetch calls to the Laravel API
├── hooks/
│   └── useDeviceData.js     # polling hook (status + alerts, 4s interval)
├── components/
│   ├── Header.jsx
│   ├── deviceStatusPanel.jsx
│   ├── PowerMeter.jsx
│   ├── AlertsPanel.jsx
│   └── OfficeLayout.jsx
└── App.jsx
```

---

## Discord Bot Setup

```bash
cd discord-bot
cp .env.example .env
```

**Fill in `discord-bot/.env`:**
```
DISCORD_TOKEN=your_bot_token_here
BACKEND_URL=http://127.0.0.1:8000/api/v1
USE_MOCK_DATA=false
```

> `USE_MOCK_DATA` must be `false` for the bot to reflect real, live data from the shared backend. Leaving it `true` will make the bot answer with fake data that won't match the dashboard.

**Discord Developer Portal setup** (required once per bot application):
1. Go to https://discord.com/developers/applications
2. Select your application → **Bot** tab
3. Under **Privileged Gateway Intents**, enable **Message Content Intent** (required for the bot to read `!status`-style commands)
4. Save changes

**Install and run:**
```bash
npm install
npm start
```

**Commands:**
| Command | Description |
|---|---|
| `!status` | Full office status, room by room |
| `!room <name>` | Status of a specific room (e.g. `!room work1`) |
| `!usage` | Current total wattage + today's estimated kWh |

---

## Device Simulator

Runs continuously, ticking every 10 seconds:
- Randomly flips device on/off states
- Accumulates `kwh_today` for devices that are ON
- Detects and writes alerts directly into the `alerts` table:
  - **After-hours**: any device ON outside 9 AM–5 PM
  - **Continuous**: a room where all devices have been ON for 2+ hours straight
- Auto-resolves after-hours alerts once the relevant device turns back off

```bash
php artisan devices:simulate
```
Leave this running in its own terminal — both the dashboard and Discord bot depend on it for data to actually change over time.

---

## API Endpoints

All endpoints are public (no auth required for this demo).

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Health check |
| `GET` | `/api/v1/status` | Full status of all devices, grouped by room |
| `GET` | `/api/v1/rooms/{id}` | Status of a single room and its devices |
| `GET` | `/api/v1/usage` | Current total wattage + today's kWh estimate |
| `GET` | `/api/v1/alerts` | All active (unresolved) alerts |

---

## Database Schema

| Table | Key Columns |
|---|---|
| `rooms` | `id`, `name` |
| `devices` | `id`, `room_id`, `name`, `type`, `status`, `power_watts`, `kwh_today`, `last_changed` |
| `state_logs` | `id`, `device_id`, `old_status`, `new_status`, `changed_at` |
| `alerts` | `id`, `type`, `message`, `room_id`, `triggered_at`, `resolved` |

---

## Troubleshooting

Issues encountered and fixed during our own fresh-clone testing — documented here so nobody hits them twice.

**`could not find driver` on `php artisan migrate`**
PHP's SQLite extension isn't enabled. Find your `php.ini` with `php --ini`, uncomment `extension=pdo_sqlite` and `extension=sqlite3`, restart your terminal.

**`Database file at path [database/database.sqlite] does not exist`**
The SQLite file needs to be created manually before first run (see [Backend Setup](#backend-setup)). If it still fails after creating the file, run `php artisan config:clear` — Laravel may have cached a config from before the file existed.

**Discord bot: `Error: Used disallowed intents`**
The bot's application needs **Message Content Intent** enabled in the Discord Developer Portal (Bot tab → Privileged Gateway Intents). See [Discord Bot Setup](#discord-bot-setup).

**Dashboard shows empty rooms / all devices off**
Run `php artisan devices:simulate` in its own terminal and leave it running — device states only change while the simulator is active.

**Alerts panel always empty**
Confirm `php artisan devices:simulate` is running. Alerts are only generated on simulator ticks, and only for devices currently ON (during after-hours) or rooms fully ON for 2+ hours.

---

## Project Structure

```
SwitchBoard/
├── app/
│   ├── Console/Commands/SimulateDevices.php
│   ├── Http/Controllers/Api/
│   ├── Models/ (Room, Device, StateLog, Alert)
│   └── Services/
├── database/
│   ├── migrations/
│   └── seeders/
├── routes/api.php
├── dashboard/          # React + Vite + Tailwind frontend
├── discord-bot/        # Node.js Discord bot
├── docs/               # Diagrams, hardware schematic, and screenshots
└── README.md
```
