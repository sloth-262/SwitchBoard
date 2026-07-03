async function getStatus() {
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
  
  async function getRoom(roomName) {
    const rooms = {
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
  
    const key = roomName.toLowerCase();
  
    if (!rooms[key]) {
      const error = new Error("Room not found");
      error.code = "ROOM_NOT_FOUND";
      throw error;
    }
  
    return rooms[key];
  }
  
  async function getUsage() {
    return {
      today_kwh: 1.42,
      current_watts: 210,
      peak_watts: 330,
      estimated_cost: 12.6
    };
  }
  
  module.exports = {
    getStatus,
    getRoom,
    getUsage
  };