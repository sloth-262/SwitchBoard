const axios = require("axios");

const BASE_URL = process.env.BACKEND_URL || "http://localhost:8000/api";
const USE_MOCK_DATA = process.env.USE_MOCK_DATA !== "false";

console.log("BACKEND_URL:", BASE_URL);
console.log("USE_MOCK_DATA raw:", process.env.USE_MOCK_DATA);
console.log("USE_MOCK_DATA resolved:", USE_MOCK_DATA);

const mockRooms = {
  boss: {
    room_name: "Boss Room",
    current_watts: 90,
    devices: [
      { name: "Light 1", type: "light", state: "on", wattage: 15 },
      { name: "Light 2", type: "light", state: "on", wattage: 15 },
      { name: "Light 3", type: "light", state: "off", wattage: 0 },
      { name: "Fan 1", type: "fan", state: "on", wattage: 60 },
      { name: "Fan 2", type: "fan", state: "off", wattage: 0 }
    ],
    alerts: [
      {
        id: 1,
        device: "Fan 1",
        reason: "Running for more than 2 hours"
      }
    ]
  },

  meeting: {
    room_name: "Meeting Room",
    current_watts: 75,
    devices: [
      { name: "Light 1", type: "light", state: "on", wattage: 15 },
      { name: "Light 2", type: "light", state: "off", wattage: 0 },
      { name: "Light 3", type: "light", state: "off", wattage: 0 },
      { name: "Fan 1", type: "fan", state: "on", wattage: 60 },
      { name: "Fan 2", type: "fan", state: "off", wattage: 0 }
    ],
    alerts: []
  },

  lobby: {
    room_name: "Lobby",
    current_watts: 45,
    devices: [
      { name: "Light 1", type: "light", state: "on", wattage: 15 },
      { name: "Light 2", type: "light", state: "on", wattage: 15 },
      { name: "Light 3", type: "light", state: "on", wattage: 15 },
      { name: "Fan 1", type: "fan", state: "off", wattage: 0 },
      { name: "Fan 2", type: "fan", state: "off", wattage: 0 }
    ],
    alerts: []
  }
};

async function request(path) {
  try {
    const response = await axios.get(`${BASE_URL}${path}`, {
      timeout: 5000,
      headers: {
        Accept: "application/json"
      }
    });

    return response.data;
  } catch (error) {
    const message =
      error.response?.data?.message ||
      error.message ||
      "Unknown backend error";

    throw new Error(`Backend request failed for ${path}: ${message}`);
  }
}

async function getStatus() {
  console.log("getStatus called. USE_MOCK_DATA =", USE_MOCK_DATA);
  if (USE_MOCK_DATA) {
    return {
      total_devices: 15,
      on_devices: 6,
      off_devices: 9,
      current_watts: 210,
      active_alerts: [
        {
          id: 1,
          room: "Boss Room",
          device: "Fan 1",
          reason: "Running for more than 2 hours",
          severity: "warning"
        }
      ]
    };
  }

  return request("/status");
}

async function getRoom(roomName) {
  if (USE_MOCK_DATA) {
    const key = roomName.toLowerCase();

    if (!mockRooms[key]) {
      const error = new Error("Room not found");
      error.code = "ROOM_NOT_FOUND";
      throw error;
    }

    return mockRooms[key];
  }

  return request(`/rooms/${encodeURIComponent(roomName)}`);
}

async function getUsage() {
  if (USE_MOCK_DATA) {
    return {
      today_kwh: 1.42,
      current_watts: 210,
      peak_watts: 330,
      estimated_cost: 12.6
    };
  }

  return request("/usage");
}

async function getAlerts() {
  if (USE_MOCK_DATA) {
    return {
      alerts: [
        {
          id: 1,
          room: "Boss Room",
          device: "Fan 1",
          reason: "Running for more than 2 hours",
          severity: "warning",
          created_at: new Date().toISOString()
        }
      ]
    };
  }

  return request("/alerts");
}

module.exports = {
  getStatus,
  getRoom,
  getUsage,
  getAlerts
};