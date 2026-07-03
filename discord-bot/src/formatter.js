function formatStatus(data) {
    const alertCount = Array.isArray(data.active_alerts)
      ? data.active_alerts.length
      : 0;
  
    return `Right now, ${data.on_devices} out of ${data.total_devices} office devices are ON, drawing about ${data.current_watts}W. Active alerts: ${alertCount}.`;
  }
  
  function formatRoom(data) {
    const devices = data.devices || [];
  
    const onDevices = devices.filter((device) => device.state === "on");
    const offDevices = devices.filter((device) => device.state === "off");
  
    const lightsOn = onDevices.filter((device) => device.type === "light").length;
    const fansOn = onDevices.filter((device) => device.type === "fan").length;
  
    let reply = `${data.room_name}: ${lightsOn} light(s) and ${fansOn} fan(s) are ON, using about ${data.current_watts}W. ${offDevices.length} device(s) are currently OFF.`;
  
    if (data.alerts && data.alerts.length > 0) {
      const alert = data.alerts[0];
      reply += ` Alert: ${alert.device} — ${alert.reason}.`;
    }
  
    return reply;
  }
  
  function formatUsage(data) {
    return `Today’s estimated usage is ${data.today_kwh} kWh. Current live draw is ${data.current_watts}W, with a peak of ${data.peak_watts}W.`;
  }
  
  function formatError() {
    return "I could not read the monitoring data right now. Please check the backend or bot setup.";
  }
  function formatAlert(alert) {
    const room = alert.room || alert.room_name || "Unknown room";
    const device = alert.device || alert.device_name || "Unknown device";
    const reason = alert.reason || alert.message || "Alert triggered";
  
    return `Alert: ${device} in ${room} — ${reason}.`;
  }
  module.exports = {
    formatStatus,
    formatRoom,
    formatUsage,
    formatAlert,
    formatError
  };