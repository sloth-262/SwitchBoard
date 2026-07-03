# SwitchBoard

**Lights, Fans, Discord** — an office IoT monitoring system built for Techathon Nationals (IUT Robotics Society).

Simulates 15 smart office devices (fans & lights) across 3 rooms with a single Laravel API as the source of truth, consumed by a React dashboard and a Discord bot.

## Architecture

```
Laravel API (port 8000)
  ├── React Dashboard  (dashboard/ — port 5173)
  └── Discord Bot      (discord-bot/)
```

## Domain

- **3 Rooms:** Drawing Room, Work Room 1, Work Room 2
- **15 Devices per setup:** 2 fans (60W each) + 3 lights (15W each) per room
- **Database:** SQLite

## Backend Setup

```bash
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate:fresh --seed
php artisan serve
```

## Frontend Setup (React Dashboard)

```bash
cd dashboard
npm install
npm run dev
```

## Discord Bot Setup

```bash
cd discord-bot
cp .env.example .env
# Fill in DISCORD_TOKEN in .env
npm install
npm start
```

## Device Simulator

Randomly flips device states every 10 seconds and accumulates kWh usage in real time:

```bash
php artisan devices:simulate
```

## API Endpoints

All endpoints are public (no auth required for this demo).

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/health` | Health check |
| `GET` | `/api/v1/status` | Full status of all devices, grouped by room |
| `GET` | `/api/v1/rooms/{id}` | Status of a single room and its devices |
| `GET` | `/api/v1/usage` | Current total wattage + today's kWh estimate |
| `GET` | `/api/v1/alerts` | All active (unresolved) alerts |

## Database Schema

| Table | Key Columns |
|-------|-------------|
| `rooms` | `id`, `name` |
| `devices` | `id`, `room_id`, `name`, `type`, `status`, `power_watts`, `kwh_today`, `last_changed` |
| `state_logs` | `id`, `device_id`, `old_status`, `new_status`, `changed_at` |
| `alerts` | `id`, `type`, `message`, `room_id`, `triggered_at`, `resolved` |
