const BASE_URL = "http://localhost:3001/auth";

function getCookie(name) {
  return document.cookie
    .split("; ")
    .find(row => row.startsWith(name + "="))
    ?.split("=")[1];
}

export async function loginUser(identifier, password) {
  const res = await fetch("http://localhost:3001/auth/login", {
    method: "POST",
    credentials: "include",   // ✅ OBLIGATORIO
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ identifier, password })
  });

  if (!res.ok) throw new Error("Login failed");
  return res.json();
}

export async function registerUser(email, password, username) {
  const response = await fetch(`${BASE_URL}/register`, {
    method: "POST",
    credentials: "include",   // ✅ OBLIGATORIO
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, username }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || "Failed to register");
  }

  return response.json();
};

export async function logoutUser() {
  const csrfToken = getCookie("XSRF-TOKEN");

  const response = await fetch("http://localhost:3001/auth/logout", {
    method: "POST",
    credentials: "include",
    headers: {
      "x-csrf-token": csrfToken, // ✅ necesario ahora
    },
  });

  if (!response.ok) throw new Error("Logout failed");
  return await response.json();
}

export async function refreshToken() {
  const res = await fetch("http://localhost:3001/auth/refresh", {
    method: "POST",
    credentials: "include",
  });

  if (!res.ok) throw new Error("Failed to refresh");
  return res.json();
};