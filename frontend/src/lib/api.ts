const API_BASE_URL = "http://localhost:5000/api";

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

export async function getUsers(): Promise<User[]> {
  const response = await fetch(`${API_BASE_URL}/users`);
  return response.json();
}

export async function getUser(id: string): Promise<User> {
  const response = await fetch(`${API_BASE_URL}/users/${id}`);
  return response.json();
}

export async function createUser(data: Omit<User, "id">): Promise<User> {
  const response = await fetch(`${API_BASE_URL}/users`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return response.json();
}

export async function updateUser(id: string, data: Partial<User>): Promise<User> {
  const response = await fetch(`${API_BASE_URL}/users/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return response.json();
}

export async function deleteUser(id: string): Promise<void> {
  await fetch(`${API_BASE_URL}/users/${id}`, {
    method: "DELETE",
  });
}