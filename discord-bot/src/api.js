const axios = require("axios");

// BACKEND_URL should already include the API version prefix, e.g.
//   http://127.0.0.1:8000/api/v1
// All request paths below are relative to it (/status, /usage, /rooms/{id}).
// Trailing slashes are stripped so `${BASE_URL}${path}` never doubles up.
const BASE_URL = (process.env.BACKEND_URL || "http://127.0.0.1:8000/api/v1").replace(/\/+$/, "");
const USE_MOCK_DATA = process.env.USE_MOCK_DATA !== "false";

// Friendly room aliases -> backend room IDs (see database seeder).
// Numeric IDs (!room 1) are always accepted directly; these are extras.
const ROOM_ALIASES = {
  boss: 1,
  meeting: 2,
  lobby: 3
};

// Reverse mapping so mock mode also answers numeric IDs (!room 1 -> boss).
const MOCK_KEY_BY_ID = {
  "1": "boss",
  "2": "meeting",
  "3": "lobby"
};

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

// Resolve a user-supplied room reference to a backend numeric ID.
// Accepts numeric IDs (1, 2, 3) directly, plus the friendly aliases.
// Returns null when it cannot be resolved.
function resolveRoomId(input) {
  const key = String(input).trim().toLowerCase();

  if (/^\d+$/.test(key)) {
    return key;
  }

  if (ROOM_ALIASES[key]) {
    return String(ROOM_ALIASES[key]);
  }

  return null;
}

// Resolve a room reference to a mock key. Numeric IDs map through
// MOCK_KEY_BY_ID; otherwise the lowered name (boss/meeting/lobby) is used.
function resolveMockKey(input) {
  const key = String(input).trim().toLowerCase();
  return MOCK_KEY_BY_ID[key] || key;
}

function roomNotFound() {
  const error = new Error("Room not found");
  error.code = "ROOM_NOT_FOUND";
  return error;
}

async function getRoom(roomName) {
  if (USE_MOCK_DATA) {
    const key = resolveMockKey(roomName);

    if (!mockRooms[key]) {
      throw roomNotFound();
    }

    return mockRooms[key];
  }

  const roomId = resolveRoomId(roomName);

  if (roomId === null) {
    throw roomNotFound();
  }

  return request(`/rooms/${encodeURIComponent(roomId)}`);
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