const API_URL = "http://localhost:5000/api/tasks";

async function readResponse(response) {
  if (response.status === 204) {
    return null;
  }

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "The request failed.");
  }

  return data;
}

export async function getTasks(page = 1, limit = 5) {
  const response = await fetch(`${API_URL}?page=${page}&limit=${limit}`);

  return readResponse(response);
}

export async function createTask(title) {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ title }),
  });

  return readResponse(response);
}

export async function updateTask(id, completed) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ completed }),
  });

  return readResponse(response);
}

export async function deleteTask(id) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });

  return readResponse(response);
}
