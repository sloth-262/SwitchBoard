const ROOM_LABELS = {
  drawing: "Drawing Room",
  work1: "Work Room 1",
  work2: "Work Room 2",
};

const OFFICE_START_HOUR = 9;
const OFFICE_END_HOUR = 17;

function isAfterHours(date) {
  const hour = date.getHours();
  return hour < OFFICE_START_HOUR || hour >= OFFICE_END_HOUR;
}

function hoursSince(dateStr, now) {
  const then = new Date(dateStr);
  return (now - then) / (1000 * 60 * 60);
}

function detectAlerts(rooms, now = new Date()) {
  const alerts = [];

  Object.entries(rooms).forEach(([roomKey, devices]) => {
    // Check 1: individual devices on after hours
    devices.forEach((d) => {
      if (d.status && isAfterHours(now)) {
        alerts.push({
          id: `afterhours-${d.id}`,
          type: "after-hours",
          message: `${d.name} in ${ROOM_LABELS[roomKey]} is ON after office hours`,
          timestamp: now.toISOString(),
        });
      }
    });

    // Check 2: entire room on continuously for 2+ hours
    const allOn = devices.every((d) => d.status);
    if (allOn) {
      const oldestChange = Math.max(
        ...devices.map((d) => hoursSince(d.last_changed, now))
      );
      if (oldestChange >= 2) {
        alerts.push({
          id: `continuous-${roomKey}`,
          type: "continuous",
          message: `${ROOM_LABELS[roomKey]} has had all devices ON for ${oldestChange.toFixed(1)}h+`,
          timestamp: now.toISOString(),
        });
      }
    }
  });

  return alerts;
}

function AlertItem({ alert }) {
  const isAfterHoursType = alert.type === "after-hours";
  return (
    <div
      className={`rounded-lg p-3 border mb-2 ${
        isAfterHoursType
          ? "bg-red-500/10 border-red-500/40"
          : "bg-orange-500/10 border-orange-500/40"
      }`}
    >
      <p className="text-sm text-white">{alert.message}</p>
      <p className="text-xs text-slate-400 mt-1">
        {new Date(alert.timestamp).toLocaleTimeString()}
      </p>
    </div>
  );
}

export default function AlertsPanel({ rooms }) {
  const alerts = detectAlerts(rooms);

  return (
    <div className="bg-slate-900 rounded-xl p-4 border border-slate-800">
      <h2 className="text-lg font-bold text-white mb-4">
        Active Alerts {alerts.length > 0 && (
          <span className="text-sm font-normal text-red-400">({alerts.length})</span>
        )}
      </h2>
      {alerts.length === 0 ? (
        <p className="text-sm text-slate-500">No active alerts.</p>
      ) : (
        alerts.map((a) => <AlertItem key={a.id} alert={a} />)
      )}
    </div>
  );
}