// Proactive alert watcher.
//
// Polls the backend `GET /alerts` endpoint on an interval and posts any NEW
// alerts to a designated Discord channel, reusing the same LLM humanizer (with
// plain-text fallback) as the on-demand commands. Duplicate alerts are never
// posted twice within a process lifetime.
//
// Config (see .env.example):
//   DISCORD_CHANNEL_ID       channel to post alerts into (required to enable)
//   ALERT_POLL_MS            poll interval in ms (default 20000)
//   ALERT_ANNOUNCE_EXISTING  "true" to also post alerts that already exist at
//                            startup; default silently seeds them so the channel
//                            isn't flooded with backlog on boot.

const { getAlerts } = require("./api");
const { humanize } = require("./llm");

const CHANNEL_ID = process.env.DISCORD_CHANNEL_ID;
const POLL_MS = Number(process.env.ALERT_POLL_MS) || 20000;
const ANNOUNCE_EXISTING = process.env.ALERT_ANNOUNCE_EXISTING === "true";

// Build a stable dedup key for an alert. Prefer the backend id; fall back to a
// composite of room/device/reason for shapes that don't carry an id.
function alertKey(alert) {
  if (alert && alert.id != null) {
    return String(alert.id);
  }

  const room =
    alert?.room?.name ||
    alert?.room_name ||
    (typeof alert?.room === "string" ? alert.room : null) ||
    "unknown-room";
  const device = alert?.device || alert?.device_name || alert?.type || "unknown-device";
  const reason = alert?.reason || alert?.message || "unknown-reason";

  return `${room}|${device}|${reason}`;
}

// Normalize the /alerts payload into a plain array. Tolerates the backend shape
// ({ alerts: [...] }), the mock shape, and a bare array just in case.
function extractAlerts(payload) {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.alerts)) return payload.alerts;
  if (Array.isArray(payload?.active_alerts)) return payload.active_alerts;
  return [];
}

async function startAlertWatcher(client) {
  if (!CHANNEL_ID || CHANNEL_ID === "alert_channel_id") {
    console.warn("[alerts] DISCORD_CHANNEL_ID not set — proactive alerts disabled.");
    return;
  }

  let channel;
  try {
    channel = await client.channels.fetch(CHANNEL_ID);
  } catch (error) {
    console.warn(
      `[alerts] Could not fetch channel ${CHANNEL_ID}: ${error.message}. Proactive alerts disabled.`
    );
    return;
  }

  if (!channel || typeof channel.send !== "function") {
    console.warn(
      `[alerts] Channel ${CHANNEL_ID} is not a sendable text channel. Proactive alerts disabled.`
    );
    return;
  }

  const seen = new Set();
  let seeded = false;

  async function poll() {
    let alerts;
    try {
      alerts = extractAlerts(await getAlerts());
    } catch (error) {
      console.warn(`[alerts] Poll failed: ${error.message}`);
      return;
    }

    // On the first successful poll, record the current alerts without posting
    // them (unless ALERT_ANNOUNCE_EXISTING=true) so the channel isn't flooded
    // with pre-existing backlog when the bot comes online.
    if (!seeded) {
      seeded = true;
      if (!ANNOUNCE_EXISTING) {
        for (const alert of alerts) {
          seen.add(alertKey(alert));
        }
        console.log(
          `[alerts] Seeded ${seen.size} existing alert(s); watching for new ones.`
        );
        return;
      }
    }

    for (const alert of alerts) {
      const key = alertKey(alert);
      if (seen.has(key)) continue;
      seen.add(key);

      try {
        const message = await humanize("alert", alert);
        await channel.send(`🚨 ${message}`);
      } catch (error) {
        console.warn(`[alerts] Failed to post alert ${key}: ${error.message}`);
      }
    }
  }

  console.log(
    `[alerts] Proactive alert watcher started (channel ${CHANNEL_ID}, every ${POLL_MS}ms).`
  );

  await poll();
  setInterval(poll, POLL_MS);
}

module.exports = {
  startAlertWatcher
};
