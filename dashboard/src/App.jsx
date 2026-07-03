import DeviceStatusPanel from "./components/deviceStatusPanel";
import PowerMeter from "./components/PowerMeter";
import AlertsPanel from "./components/AlertsPanel";
import OfficeLayout from "./components/OfficeLayout";
import Header from "./components/Header";
import { useDeviceData } from "./hooks/useDeviceData";

function App() {
  const { status, alerts, error } = useDeviceData();

  if (error) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-6">
        <div className="text-center">
          <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/40 flex items-center justify-center mx-auto mb-4">
            <span className="text-red-400 text-xl">!</span>
          </div>
          <p className="text-red-400 font-medium mb-1">Connection failed</p>
          <p className="text-slate-500 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  if (!status) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 border-2 border-slate-700 border-t-teal-400 rounded-full animate-spin" />
          <span className="text-slate-400">Connecting to office...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white p-4 sm:p-6 max-w-7xl mx-auto">
      <Header isConnected={!error} />

      <div className="mb-6">
        <OfficeLayout rooms={status.rooms} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DeviceStatusPanel rooms={status.rooms} />
        <PowerMeter rooms={status.rooms} totalWattage={status.total_wattage} />
        <div className="lg:col-span-2">
          <AlertsPanel alerts={alerts} />
        </div>
      </div>
    </div>
  );
}

export default App;