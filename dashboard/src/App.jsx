import DeviceStatusPanel from "./components/deviceStatusPanel";
import PowerMeter from "./components/PowerMeter";
import AlertsPanel from "./components/AlertsPanel";
import OfficeLayout from "./components/OfficeLayout";
import { useDeviceData } from "./hooks/useDeviceData";

function App() {
  const { status, alerts, error } = useDeviceData();

  if (error) return <div className="text-red-400 p-6">Failed to load: {error}</div>;
  if (!status) return <div className="text-slate-400 p-6">Loading...</div>;

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">
      <h1 className="text-2xl font-bold mb-6">Office Dashboard</h1>

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