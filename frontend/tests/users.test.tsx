import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { UserList } from "../src/components/UserList";
import { getUsers } from "../src/lib/api";

vi.mock("../src/lib/api");

const mockGetUsers = vi.mocked(getUsers);

const mockUsers = [
  {
    id: "1",
    firstName: "John",
    lastName: "Doe",
    email: "john@example.com",
    role: "Admin",
  },
  {
    id: "2",
    firstName: "Jane",
    lastName: "Smith",
    email: "jane@example.com",
    role: "User",
  },
];

describe("UserList", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("shows loading state", () => {
    render(<UserList />);
    expect(screen.getByText("Loading...")).toBeTruthy();
  });

  it("renders list of users", async () => {
    mockGetUsers.mockResolvedValueOnce(mockUsers);
    render(<UserList />);
    expect(await screen.findByText("John Doe")).toBeTruthy();
    expect(screen.getByText("Jane Smith")).toBeTruthy();
    expect(screen.getByText("john@example.com")).toBeTruthy();
    expect(screen.getByText("jane@example.com")).toBeTruthy();
    expect(screen.getByText("Admin")).toBeTruthy();
    expect(screen.getByText("User")).toBeTruthy();
  });

  it("shows empty state when no users", async () => {
    mockGetUsers.mockResolvedValueOnce([]);
    render(<UserList />);
    expect(await screen.findByText("No users found")).toBeTruthy();
  });

  it("shows error state on fetch failure", async () => {
    mockGetUsers.mockRejectedValueOnce(new Error("Network error"));
    render(<UserList />);
    expect(await screen.findByText("Error: Network error")).toBeTruthy();
  });

  it("has create user button", async () => {
    mockGetUsers.mockResolvedValueOnce(mockUsers);
    render(<UserList />);
    expect(await screen.findByText("Create User")).toBeTruthy();
  });

  it("has edit links for each user", async () => {
    mockGetUsers.mockResolvedValueOnce(mockUsers);
    render(<UserList />);
    const editLinks = await screen.findAllByText("Edit");
    expect(editLinks.length).toBe(2);
  });

  it("has delete buttons for each user", async () => {
    mockGetUsers.mockResolvedValueOnce(mockUsers);
    render(<UserList />);
    const deleteButtons = await screen.findAllByText("Delete");
    expect(deleteButtons.length).toBe(2);
  });
});
