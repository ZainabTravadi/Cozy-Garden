const defaultApiUrl = import.meta.env.PROD
  ? "https://cozy-garden-backend-41e83e1826bf.herokuapp.com/api"
  : "http://localhost:5000/api";
const API_BASE_URL = (import.meta.env.VITE_API_URL || defaultApiUrl).replace(/\/+$/, "");

export async function apiRequest(path, options = {}) {
  let response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
      ...options,
    });
  } catch {
    throw new Error("Unable to reach Cozy Garden right now. Check your connection and try again.");
  }
  let body = null;
  if (response.status !== 204) {
    try { body = await response.json(); }
    catch { throw new Error("The server returned an unreadable response. Please try again later."); }
  }
  if (!response.ok) {
    throw new Error(body?.message || "Something went wrong.");
  }
  return body;
}
