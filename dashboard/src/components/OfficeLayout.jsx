function FanIcon({ isOn }) {
  return (
    <div
      className={`w-8 h-8 flex items-center justify-center rounded-full border-2 ${
        isOn ? "border-teal-400" : "border-slate-600"
      }`}
    >
      <svg
        viewBox="0 0 24 24"
        className={`w-5 h-5 ${isOn ? "text-teal-400 animate-spin" : "text-slate-600"}`}
        style={isOn ? { animationDuration: "1.2s" } : {}}
        fill="currentColor"
      >
        <path d="M12 2c-1.5 0-2.5 1.5-2.5 3 0 1.2.6 2.2 1.5 2.8V12h-4.3c-.6-.9-1.6-1.5-2.8-1.5C2.5 10.5 1 11.5 1 13s1.5 2.5 3 2.5c1.2 0 2.2-.6 2.8-1.5H11v4.3c-.9.6-1.5 1.6-1.5 2.8 0 1.5 1.5 3 3 3s3-1.5 3-3c0-1.2-.6-2.2-1.5-2.8V14h4.3c.6.9 1.6 1.5 2.8 1.5 1.5 0 3-1 3-2.5s-1.5-2.5-3-2.5c-1.2 0-2.2.6-2.8 1.5H13V7.8c.9-.6 1.5-1.6 1.5-2.8 0-1.5-1-3-2.5-3z" />
      </svg>
    </div>
  );
}

function LightIcon({ isOn }) {
  return (
    <div
      className={`w-6 h-6 rounded-full transition-all duration-300 ${
        isOn
          ? "bg-amber-300 shadow-[0_0_16px_6px_rgba(252,211,77,0.6)]"
          : "bg-slate-700"
      }`}
    />
  );
}

function RoomBox({ room }) {
  const fans = room.devices.filter((d) => d.type === "fan");
  const lights = room.devices.filter((d) => d.type === "light");

  return (
    <div className="flex-1 border border-slate-700 rounded-lg bg-slate-900 p-4 min-h-[220px] flex flex-col">
      <h3 className="text-sm font-semibold text-slate-300 mb-4">{room.name}</h3>
      <div className="flex justify-around mb-6">
        {fans.map((f) => (
          <FanIcon key={f.id} isOn={f.status} />
        ))}
      </div>
      <div className="flex justify-around mt-auto">
        {lights.map((l) => (
          <LightIcon key={l.id} isOn={l.status} />
        ))}
      </div>
    </div>
  );
}

export default function OfficeLayout({ rooms }) {
  return (
    <div className="bg-slate-950 rounded-xl p-4 border border-slate-800">
      <h2 className="text-lg font-bold text-white mb-4">Office Layout</h2>
      <div className="flex flex-col sm:flex-row gap-4">
        {rooms.map((room) => (
          <RoomBox key={room.id} room={room} />
        ))}
      </div>
    </div>
  );
}