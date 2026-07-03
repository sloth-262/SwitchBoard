import DeviceStatusPanel from "./components/DeviceStatusPanel";
import { mockDevices } from "./data/mockDevices";

function App() {
  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">
      <h1 className="text-2xl font-bold mb-6">Office Dashboard</h1>
      <DeviceStatusPanel rooms={mockDevices.rooms} />
    </div>
  );
}

export default App;