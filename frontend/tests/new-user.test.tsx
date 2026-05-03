import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import NewUserPage from "../src/app/users/new/page";
import { createUser } from "../src/lib/api";
import { useRouter } from "next/navigation";

vi.mock("../src/lib/api");
vi.mock("next/navigation", () => ({
  useRouter: vi.fn(() => ({
    push: vi.fn(),
  })),
}));

const mockCreateUser = vi.mocked(createUser);
const mockRouter = { push: vi.fn() };

beforeEach(() => {
  vi.clearAllMocks();
  (useRouter as any).mockReturnValue(mockRouter);
});

describe("NewUserPage", () => {
  it("renders the create user form", () => {
    render(<NewUserPage />);
    expect(screen.getByText("Create User")).toBeTruthy();
    expect(screen.getByLabelText("Name")).toBeTruthy();
    expect(screen.getByLabelText("Email")).toBeTruthy();
    expect(screen.getByLabelText("Role")).toBeTruthy();
    expect(screen.getByRole("button", { name: "Save" })).toBeTruthy();
  });

  it("shows validation errors when submitting empty form", async () => {
    render(<NewUserPage />);
    fireEvent.click(screen.getByRole("button", { name: "Save" }));

    expect(await screen.findByText("Name is required")).toBeTruthy();
    expect(screen.getByText("Email is required")).toBeTruthy();
    expect(screen.getByText("Role is required")).toBeTruthy();
    expect(mockCreateUser).not.toHaveBeenCalled();
  });

  it("shows validation error for invalid email", async () => {
    render(<NewUserPage />);
    fireEvent.change(screen.getByLabelText("Name"), { target: { value: "John" } });
    fireEvent.change(screen.getByLabelText("Email"), { target: { value: "invalid" } });
    fireEvent.change(screen.getByLabelText("Role"), { target: { value: "Admin" } });
    fireEvent.click(screen.getByRole("button", { name: "Save" }));

    expect(await screen.findByText("Invalid email format")).toBeTruthy();
    expect(mockCreateUser).not.toHaveBeenCalled();
  });

  it("submits form with valid data", async () => {
    mockCreateUser.mockResolvedValueOnce({
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      role: "Admin",
    });

    render(<NewUserPage />);
    fireEvent.change(screen.getByLabelText("Name"), { target: { value: "John Doe" } });
    fireEvent.change(screen.getByLabelText("Email"), { target: { value: "john@example.com" } });
    fireEvent.change(screen.getByLabelText("Role"), { target: { value: "Admin" } });
    fireEvent.click(screen.getByRole("button", { name: "Save" }));

    await waitFor(() => {
      expect(mockCreateUser).toHaveBeenCalledWith({
        name: "John Doe",
        email: "john@example.com",
        role: "Admin",
      });
    });
    expect(mockRouter.push).toHaveBeenCalledWith("/users");
  });

  it("shows loading state while submitting", async () => {
    mockCreateUser.mockImplementationOnce(
      () => new Promise((resolve) => setTimeout(() => resolve({} as any), 100))
    );

    render(<NewUserPage />);
    fireEvent.change(screen.getByLabelText("Name"), { target: { value: "John Doe" } });
    fireEvent.change(screen.getByLabelText("Email"), { target: { value: "john@example.com" } });
    fireEvent.change(screen.getByLabelText("Role"), { target: { value: "Admin" } });
    fireEvent.click(screen.getByRole("button", { name: "Save" }));

    expect(screen.getByRole("button", { name: "Saving..." })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Saving..." })).toBeDisabled();
  });

  it("shows error message on submit failure", async () => {
    mockCreateUser.mockRejectedValueOnce(new Error("Email already exists"));

    render(<NewUserPage />);
    fireEvent.change(screen.getByLabelText("Name"), { target: { value: "John Doe" } });
    fireEvent.change(screen.getByLabelText("Email"), { target: { value: "john@example.com" } });
    fireEvent.change(screen.getByLabelText("Role"), { target: { value: "Admin" } });
    fireEvent.click(screen.getByRole("button", { name: "Save" }));

    expect(await screen.findByText("Email already exists")).toBeTruthy();
  });
});
