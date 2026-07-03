import { useState, useEffect } from "react";
import { api } from "../api/client";

export function useDeviceData(intervalMs = 4000) {
  const [status, setStatus] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchData() {
      try {
        const [statusRes, alertsRes] = await Promise.all([
          api.getStatus(),
          api.getAlerts(),
        ]);
        if (!cancelled) {
          setStatus(statusRes);
          setAlerts(alertsRes.alerts ?? alertsRes);
          setError(null);
        }
      } catch (err) {
        if (!cancelled) setError(err.message);
      }
    }

    fetchData();
    const id = setInterval(fetchData, intervalMs);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, [intervalMs]);

  return { status, alerts, error };
}