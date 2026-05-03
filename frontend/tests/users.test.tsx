import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { UserList } from "../src/components/UserList";
import { getUsers, deleteUser } from "../src/lib/api";

vi.mock("../src/lib/api");

const mockGetUsers = vi.mocked(getUsers);
const mockDeleteUser = vi.mocked(deleteUser);

const mockUsers = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    role: "Admin",
  },
  {
    id: 2,
    name: "Jane Smith",
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

  it("calls deleteUser when delete button is clicked and confirmed", async () => {
    mockGetUsers.mockResolvedValueOnce(mockUsers);
    mockDeleteUser.mockResolvedValueOnce(undefined);
    const confirmSpy = vi.spyOn(window, "confirm").mockReturnValue(true);

    render(<UserList />);
    const deleteButtons = await screen.findAllByText("Delete");
    deleteButtons[0].click();

    expect(confirmSpy).toHaveBeenCalledOnce();
    expect(mockDeleteUser).toHaveBeenCalledWith(1);

    confirmSpy.mockRestore();
  });

  it("does not call deleteUser when delete is cancelled", async () => {
    mockGetUsers.mockResolvedValueOnce(mockUsers);
    const confirmSpy = vi.spyOn(window, "confirm").mockReturnValue(false);

    render(<UserList />);
    const deleteButtons = await screen.findAllByText("Delete");
    deleteButtons[0].click();

    expect(confirmSpy).toHaveBeenCalledOnce();
    expect(mockDeleteUser).not.toHaveBeenCalled();

    confirmSpy.mockRestore();
  });

  it("shows delete error when delete fails", async () => {
    mockGetUsers.mockResolvedValueOnce(mockUsers);
    mockDeleteUser.mockRejectedValueOnce(new Error("Delete failed"));
    const confirmSpy = vi.spyOn(window, "confirm").mockReturnValue(true);

    render(<UserList />);
    const deleteButtons = await screen.findAllByText("Delete");
    deleteButtons[0].click();

    expect(await screen.findByText("Delete failed")).toBeTruthy();

    confirmSpy.mockRestore();
  });

  it("shows deleting state while deleting", async () => {
    mockGetUsers.mockResolvedValueOnce(mockUsers);
    mockDeleteUser.mockImplementationOnce(
      () => new Promise((resolve) => setTimeout(resolve, 100))
    );
    const confirmSpy = vi.spyOn(window, "confirm").mockReturnValue(true);

    render(<UserList />);
    const deleteButtons = await screen.findAllByText("Delete");
    deleteButtons[0].click();

    expect(await screen.findByText("Deleting...")).toBeTruthy();

    confirmSpy.mockRestore();
  });
});
