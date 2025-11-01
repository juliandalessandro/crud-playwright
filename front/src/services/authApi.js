const BASE_URL = "http://localhost:3001/auth";

export async function loginUser(email, password) {
  const res = await fetch(`http://localhost:3001/auth/login`, {
    method: "POST",
    credentials: "include",     // <-- necesario para cookies
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) throw new Error("Login failed");
  return res.json();
}

export async function registerUser(email, password) {
  const response = await fetch(`${BASE_URL}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || "Failed to register");
  }

  return response.json();
};

export async function logoutUser() {
  await fetch("http://localhost:3001/auth/logout", {
    method: "POST",
    credentials: "include",
  });
};

export async function refreshToken() {
  const res = await fetch("http://localhost:3001/auth/refresh", {
    method: "POST",
    credentials: "include",
  });

  if (!res.ok) throw new Error("Failed to refresh");
  return res.json();
};