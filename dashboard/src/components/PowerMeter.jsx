function calcRoomWatts(devices) {
  return devices
    .filter((d) => d.status)
    .reduce((sum, d) => sum + d.power_watts, 0);
}

function RoomBar({ name, watts, maxWatts }) {
  const pct = maxWatts === 0 ? 0 : (watts / maxWatts) * 100;
  return (
    <div className="mb-3">
      <div className="flex justify-between text-sm mb-1">
        <span className="text-slate-300">{name}</span>
        <span className="text-slate-400">{watts}W</span>
      </div>
      <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
        <div
          className="h-full bg-teal-400 rounded-full transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

export default function PowerMeter({ rooms, totalWattage }) {
  const roomWatts = rooms.map((r) => ({ name: r.name, watts: calcRoomWatts(r.devices) }));
  const maxWatts = Math.max(...roomWatts.map((r) => r.watts), 1);

  return (
    <div className="bg-slate-900 rounded-xl p-4 border border-slate-800">
      <h2 className="text-lg font-bold text-white mb-1">Power Consumption</h2>
      <p className="text-3xl font-bold text-teal-400 mb-4">{totalWattage}W</p>

      {roomWatts.map((r) => (
        <RoomBar key={r.name} name={r.name} watts={r.watts} maxWatts={maxWatts} />
      ))}
    </div>
  );
}