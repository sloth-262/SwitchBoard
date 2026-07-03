const ROOM_LABELS = {
  drawing: "Drawing Room",
  work1: "Work Room 1",
  work2: "Work Room 2",
};

function calcRoomWatts(devices) {
  return devices
    .filter((d) => d.status)
    .reduce((sum, d) => sum + d.power_watt, 0);
}

function RoomBar({ roomKey, watts, maxWatts }) {
  const pct = maxWatts === 0 ? 0 : (watts / maxWatts) * 100;
  return (
    <div className="mb-3">
      <div className="flex justify-between text-sm mb-1">
        <span className="text-slate-300">{ROOM_LABELS[roomKey]}</span>
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

export default function PowerMeter({ rooms }) {
  const roomWatts = Object.fromEntries(
    Object.entries(rooms).map(([key, devices]) => [key, calcRoomWatts(devices)])
  );
  const totalWatts = Object.values(roomWatts).reduce((a, b) => a + b, 0);
  const maxWatts = Math.max(...Object.values(roomWatts), 1);

  return (
    <div className="bg-slate-900 rounded-xl p-4 border border-slate-800">
      <h2 className="text-lg font-bold text-white mb-1">Power Consumption</h2>
      <p className="text-3xl font-bold text-teal-400 mb-4">{totalWatts}W</p>

      {Object.entries(roomWatts).map(([roomKey, watts]) => (
        <RoomBar key={roomKey} roomKey={roomKey} watts={watts} maxWatts={maxWatts} />
      ))}
    </div>
  );
}