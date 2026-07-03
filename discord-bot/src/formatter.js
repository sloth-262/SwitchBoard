// The formatters below accept BOTH the mock JSON shape and the real Laravel
// backend JSON shape. The two differ in several key names:
//
//   device on/off : mock `state: "on"/"off"`   backend `status: true/false`
//   device watts  : mock `wattage`             backend `power_watts`
//   room name     : mock `room_name`           backend `name`
//   room watts    : mock `current_watts`       backend derived from devices
//   status watts  : mock `current_watts`       backend `total_wattage`
//   status counts : mock `on_devices`/...      backend derived from rooms[]
//   usage kwh     : mock `today_kwh`           backend `kwh_today`
//   usage watts   : mock `current_watts`       backend `current_wattage`
//
// The helpers normalise these so either source formats cleanly.

function deviceIsOn(device) {
  if (typeof device.state === "string") {
    return device.state.toLowerCase() === "on";
  }
  return Boolean(device.status);
}

function deviceWattage(device) {
  const watts = device.wattage ?? device.power_watts ?? 0;
  return Number(watts) || 0;
}

function collectDevices(data) {
  if (Array.isArray(data.devices)) {
    return data.devices;
  }

  if (Array.isArray(data.rooms)) {
    return data.rooms.flatMap((room) => room.devices || []);
  }

  return [];
}

function formatStatus(data) {
  if (!data || typeof data !== "object") {
    return "I couldn't read any office status right now — the backend returned no data.";
  }

  const devices = collectDevices(data);

  const totalDevices = data.total_devices ?? devices.length;
  const onDevices = data.on_devices ?? devices.filter(deviceIsOn).length;
  const currentWatts = data.current_watts ?? data.total_wattage ?? 0;

  const alertList = Array.isArray(data.active_alerts)
    ? data.active_alerts
    : Array.isArray(data.alerts)
      ? data.alerts
      : [];

  // Empty system (no devices at all) — most likely the backend isn't seeded.
  if (totalDevices === 0) {
    return "I couldn't find any devices in the system right now — the backend may be empty or still starting up.";
  }

  // Everything is off — call it out positively rather than "0 out of N ON".
  if (onDevices === 0) {
    return `All ${totalDevices} office devices are currently OFF, so live draw is ${currentWatts}W. Active alerts: ${alertList.length}.`;
  }

  return `Right now, ${onDevices} out of ${totalDevices} office devices are ON, drawing about ${currentWatts}W. Active alerts: ${alertList.length}.`;
}

function formatRoom(data) {
  const roomName = (data && (data.room_name || data.name)) || "That room";
  const devices = (data && data.devices) || [];

  // No devices found for the room — usually an unseeded backend or bad id.
  if (devices.length === 0) {
    return `I couldn't find any devices for ${roomName} right now.`;
  }

  const onDevices = devices.filter(deviceIsOn);
  const offDevices = devices.filter((device) => !deviceIsOn(device));

  const lightsOn = onDevices.filter((device) => device.type === "light").length;
  const fansOn = onDevices.filter((device) => device.type === "fan").length;

  // The backend does not send a per-room wattage, so derive it from the
  // devices that are currently ON when `current_watts` is not provided.
  const currentWatts =
    data.current_watts ??
    onDevices.reduce((sum, device) => sum + deviceWattage(device), 0);

  const alerts = data.alerts || [];

  // Everything in the room is off.
  if (onDevices.length === 0) {
    let reply = `${roomName} is all quiet — every device (${devices.length}) is currently OFF, so it's drawing 0W.`;
    if (alerts.length > 0) {
      const alert = alerts[0];
      const device = alert.device || alert.device_name || alert.type || "A device";
      const reason = alert.reason || alert.message || "needs attention";
      reply += ` Alert: ${device} — ${reason}.`;
    }
    return reply;
  }

  let reply = `${roomName}: ${lightsOn} light(s) and ${fansOn} fan(s) are ON, using about ${currentWatts}W. ${offDevices.length} device(s) are currently OFF.`;

  if (alerts.length > 0) {
    const alert = alerts[0];
    const device = alert.device || alert.device_name || alert.type || "A device";
    const reason = alert.reason || alert.message || "needs attention";
    reply += ` Alert: ${device} — ${reason}.`;
  }

  return reply;
}

function formatUsage(data) {
  const todayKwh = data.today_kwh ?? data.kwh_today ?? 0;
  const currentWatts = data.current_watts ?? data.current_wattage ?? 0;
  const peakWatts = data.peak_watts;

  let reply = `Today's estimated usage is ${todayKwh} kWh. Current live draw is ${currentWatts}W`;

  if (peakWatts != null) {
    reply += `, with a peak of ${peakWatts}W.`;
  } else {
    reply += ".";
  }

  return reply;
}

function formatError() {
  return "I could not read the monitoring data right now. Please check the backend or bot setup.";
}

function formatAlert(alert) {
  if (!alert || typeof alert !== "object") {
    return "An alert was triggered, but I couldn't read its details.";
  }

  const room =
    alert.room_name ||
    (alert.room && typeof alert.room === "object" ? alert.room.name : null) ||
    (typeof alert.room === "string" ? alert.room : null) ||
    "Unknown room";

  // Only treat an explicit device name as a device — `type` (e.g. "after_hours",
  // "long_on") is a category, not a device, so it shouldn't read as one.
  const device = alert.device || alert.device_name || null;
  const message = alert.message || alert.reason || null;

  if (device) {
    const reason = alert.reason || alert.message || "needs attention";
    return `Alert: ${device} in ${room} — ${reason}.`;
  }

  if (message) {
    return `Alert in ${room}: ${message}`;
  }

  return `Alert in ${room}: something needs attention.`;
}

module.exports = {
  formatStatus,
  formatRoom,
  formatUsage,
  formatAlert,
  formatError
};
