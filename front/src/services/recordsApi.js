const BASE_URL = "http://localhost:3001/records";

function getToken() {
  return localStorage.getItem("token");
}

// GET all records
export const getRecords = async () => {
  try {
    const response = await fetch("http://localhost:3001/records", {
      method: "GET",
      credentials: "include", // 👈 IMPORTANTE
    });

    if (!response.ok) throw new Error("Failed to fetch records");

    return await response.json();
  } catch (error) {
    console.error("Error fetching records:", error);
    throw error;
  }
};

// UPLOAD record
export async function createRecord(data) {
  const response = await fetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include", // 👈 necesario para enviar la cookie
    body: JSON.stringify(data),
  });

  if (!response.ok) throw new Error("Failed to create record");
  return response.json();
};

// UPDATE record
export const updateRecord = async (id, updatedRecord) => {
  try {
    const response = await fetch(`http://localhost:3001/records/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include", // 👈 MUY IMPORTANTE
      body: JSON.stringify(updatedRecord)
    });

    if (!response.ok) throw new Error("Failed to update record");

    return await response.json();
  } catch (error) {
    console.error("Error updating record:", error);
    throw error;
  }
};

// DELETE record
export async function deleteRecord(id) {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
    credentials: "include", // 👈 importante también aquí
  });

  if (!response.ok) throw new Error("Failed to delete record");

  try {
    return await response.json();
  } catch {
    return true; // delete ok sin body
  }
};