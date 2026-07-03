// Matches the proposed API contract — swap this for a real fetch() later
// without touching any component code.

export const mockDevices = {
  rooms: {
    drawing: [
      { id: 1, name: "Fan 1", type: "fan", status: true, power_watt: 60, last_changed: "2026-07-03T13:10:00Z" },
      { id: 2, name: "Fan 2", type: "fan", status: false, power_watt: 60, last_changed: "2026-07-03T09:00:00Z" },
      { id: 3, name: "Light 1", type: "light", status: true, power_watt: 15, last_changed: "2026-07-03T13:15:00Z" },
      { id: 4, name: "Light 2", type: "light", status: true, power_watt: 15, last_changed: "2026-07-03T13:15:00Z" },
      { id: 5, name: "Light 3", type: "light", status: false, power_watt: 15, last_changed: "2026-07-03T08:00:00Z" },
    ],
    work1: [
      { id: 6, name: "Fan 1", type: "fan", status: true, power_watt: 60, last_changed: "2026-07-03T09:05:00Z" },
      { id: 7, name: "Fan 2", type: "fan", status: true, power_watt: 60, last_changed: "2026-07-03T09:05:00Z" },
      { id: 8, name: "Light 1", type: "light", status: true, power_watt: 15, last_changed: "2026-07-03T09:00:00Z" },
      { id: 9, name: "Light 2", type: "light", status: false, power_watt: 15, last_changed: "2026-07-02T18:00:00Z" },
      { id: 10, name: "Light 3", type: "light", status: true, power_watt: 15, last_changed: "2026-07-03T09:00:00Z" },
    ],
    work2: [
      { id: 11, name: "Fan 1", type: "fan", status: false, power_watt: 60, last_changed: "2026-07-02T17:30:00Z" },
      { id: 12, name: "Fan 2", type: "fan", status: false, power_watt: 60, last_changed: "2026-07-02T17:30:00Z" },
      { id: 13, name: "Light 1", type: "light", status: true, power_watt: 15, last_changed: "2026-07-03T20:00:00Z" },
      { id: 14, name: "Light 2", type: "light", status: true, power_watt: 15, last_changed: "2026-07-03T20:00:00Z" },
      { id: 15, name: "Light 3", type: "light", status: true, power_watt: 15, last_changed: "2026-07-03T20:00:00Z" },
    ],
  },
};