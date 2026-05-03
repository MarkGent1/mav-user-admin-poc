const API_BASE_URL = "http://localhost:5000/api";

export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

export interface CreateUserInput {
  name: string;
  email: string;
  role: string;
}

export interface UpdateUserInput {
  name: string;
  email: string;
  role: string;
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    if (response.status === 404) {
      throw new Error("User not found");
    }
    const errorText = await response.text();
    throw new Error(errorText || `HTTP error: ${response.status}`);
  }
  return response.json();
}

export async function getUsers(): Promise<User[]> {
  const response = await fetch(`${API_BASE_URL}/users`);
  return handleResponse<User[]>(response);
}

export async function getUser(id: number): Promise<User> {
  const response = await fetch(`${API_BASE_URL}/users/${id}`);
  return handleResponse<User>(response);
}

export async function createUser(data: CreateUserInput): Promise<User> {
  const response = await fetch(`${API_BASE_URL}/users`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return handleResponse<User>(response);
}

export async function updateUser(id: number, data: UpdateUserInput): Promise<User> {
  const response = await fetch(`${API_BASE_URL}/users/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return handleResponse<User>(response);
}

export async function deleteUser(id: number): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/users/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || `HTTP error: ${response.status}`);
  }
}