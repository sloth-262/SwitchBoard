const ROOM_LABELS = {
  drawing: "Drawing Room",
  work1: "Work Room 1",
  work2: "Work Room 2",
};

function DeviceCard({ device }) {
  return (
    <div
      className={`rounded-lg p-3 border ${
        device.status
          ? "bg-amber-500/10 border-amber-400"
          : "bg-slate-800 border-slate-700"
      }`}
    >
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">{device.name}</span>
        <span
          className={`w-2.5 h-2.5 rounded-full ${
            device.status ? "bg-amber-400" : "bg-slate-600"
          }`}
        />
      </div>
      <p className="text-xs text-slate-400 mt-1">
        {device.status ? `${device.power_watt}W` : "off"}
      </p>
    </div>
  );
}

function RoomSection({ roomKey, devices }) {
  return (
    <div className="mb-6">
      <h3 className="text-slate-300 font-semibold mb-2">{ROOM_LABELS[roomKey]}</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {devices.map((d) => (
          <DeviceCard key={d.id} device={d} />
        ))}
      </div>
    </div>
  );
}

export default function DeviceStatusPanel({ rooms }) {
  return (
    <div className="bg-slate-900 rounded-xl p-4 border border-slate-800">
      <h2 className="text-lg font-bold text-white mb-4">Live Device Status</h2>
      {Object.entries(rooms).map(([roomKey, devices]) => (
        <RoomSection key={roomKey} roomKey={roomKey} devices={devices} />
      ))}
    </div>
  );
}
