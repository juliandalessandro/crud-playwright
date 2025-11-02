const BASE_URL = "http://localhost:3001/records";

// ✅ Helper para leer cookie CSRF
function getCookie(name) {
  return document.cookie
    .split("; ")
    .find(row => row.startsWith(name + "="))
    ?.split("=")[1];
}

// ✅ GET all records
export const getRecords = async () => {
  const response = await fetch("http://localhost:3001/records", {
    method: "GET",
    credentials: "include",
  });

  if (response.status === 401) {
    // No hay sesión --> mandar al login
    window.location = "/login";
    return;
  }

  if (!response.ok) {
    throw new Error("Failed to fetch records");
  }

  return await response.json();
};

// ✅ CREATE
export async function createRecord(data) {
  const csrfToken = getCookie("XSRF-TOKEN");

  const response = await fetch(BASE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-csrf-token": csrfToken,  // ✅ enviar token
    },
    credentials: "include",
    body: JSON.stringify(data),
  });

  if (!response.ok) throw new Error("Failed to create record");
  return response.json();
}

// ✅ UPDATE
export async function updateRecord(id, updatedRecord) {
  try {
    const csrfToken = getCookie("XSRF-TOKEN");

    const response = await fetch(`${BASE_URL}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "x-csrf-token": csrfToken, // ✅ enviar token
      },
      credentials: "include",
      body: JSON.stringify(updatedRecord),
    });

    if (!response.ok) throw new Error("Failed to update record");
    return await response.json();
  } catch (error) {
    console.error("Error updating record:", error);
    throw error;
  }
}

// ✅ DELETE
export async function deleteRecord(id) {
  const csrfToken = getCookie("XSRF-TOKEN");

  const response = await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
    credentials: "include",
    headers: {
      "x-csrf-token": csrfToken, // ✅ enviar token
    },
  });

  if (!response.ok) throw new Error("Failed to delete record");

  try {
    return await response.json();
  } catch {
    return true; // delete ok sin body
  }
}
