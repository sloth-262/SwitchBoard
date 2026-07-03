import DeviceStatusPanel from "./components/DeviceStatusPanel";
import PowerMeter from "./components/PowerMeter";
import AlertsPanel from "./components/AlertsPanel";
import OfficeLayout from "./components/OfficeLayout";
import { mockDevices } from "./data/mockDevices";

function App() {
  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">
      <h1 className="text-2xl font-bold mb-6">Office Dashboard</h1>

      <div className="mb-6">
        <OfficeLayout rooms={mockDevices.rooms} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DeviceStatusPanel rooms={mockDevices.rooms} />
        <PowerMeter rooms={mockDevices.rooms} />
        <div className="lg:col-span-2">
          <AlertsPanel rooms={mockDevices.rooms} />
        </div>
      </div>
    </div>
  );
}

export default App;