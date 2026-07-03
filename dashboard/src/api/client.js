const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api/v1";

async function get(path) {
  const res = await fetch(`${BASE_URL}${path}`);
  if (!res.ok) throw new Error(`API error: ${res.status} on ${path}`);
  return res.json();
}

export const api = {
  getStatus: () => get("/status"),
  getRoom: (id) => get(`/rooms/${id}`),
  getUsage: () => get("/usage"),
  getAlerts: () => get("/alerts"),
};