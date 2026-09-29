export const API_URL = "/api";

export const apiFetch = async (endpoint: string, options: RequestInit = {}) => {
  const config: RequestInit = {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  };

  const response = await fetch(`${API_URL}${endpoint}`, config);

  if (response.status === 401 || response.status === 403) {
    if (typeof window !== "undefined") {
      localStorage.removeItem("gascontrol_user");
      localStorage.removeItem("gascontrol_rol");
      window.location.href = "/";
    }
    throw new Error("Sesión expirada o acceso denegado.");
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.mensaje || errorData.error || `Error HTTP ${response.status}`);
  }

  if (response.status === 204) return null;

  const text = await response.text();
  return text ? JSON.parse(text) : null;
};