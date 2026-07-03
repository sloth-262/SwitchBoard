import { useState, useEffect } from "react";

export default function Header({ isConnected }) {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h1 className="text-2xl font-bold">SwitchBoard</h1>
        <p className="text-sm text-slate-400">Office Device Monitor</p>
      </div>
      <div className="flex items-center gap-4">
        <span className="text-sm text-slate-400 font-mono">
          {now.toLocaleTimeString()}
        </span>
        <div className="flex items-center gap-2">
          <span
            className={`w-2 h-2 rounded-full ${
              isConnected ? "bg-emerald-400 animate-pulse" : "bg-red-500"
            }`}
          />
          <span className="text-xs text-slate-400">
            {isConnected ? "Live" : "Disconnected"}
          </span>
        </div>
      </div>
    </div>
  );
}