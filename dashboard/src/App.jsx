import DeviceStatusPanel from "./components/DeviceStatusPanel";
import PowerMeter from "./components/PowerMeter";
import { mockDevices } from "./data/mockDevices";

function App() {
  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">
      <h1 className="text-2xl font-bold mb-6">Office Dashboard</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DeviceStatusPanel rooms={mockDevices.rooms} />
        <PowerMeter rooms={mockDevices.rooms} />
      </div>
    </div>
  );
}

export default App;