import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import EditUserPage from "../src/app/users/[id]/edit/page";
import { getUser, updateUser } from "../src/lib/api";
import { useRouter } from "next/navigation";

vi.mock("../src/lib/api");
vi.mock("next/navigation", () => ({
  useRouter: vi.fn(() => ({
    push: vi.fn(),
  })),
}));

const mockGetUser = vi.mocked(getUser);
const mockUpdateUser = vi.mocked(updateUser);
const mockRouter = { push: vi.fn() };

const mockUser = {
  id: 1,
  name: "John Doe",
  email: "john@example.com",
  role: "Admin",
};

beforeEach(() => {
  vi.clearAllMocks();
  (useRouter as any).mockReturnValue(mockRouter);
});

function renderEditPage(params = { id: "1" }) {
  return render(<EditUserPage params={params} />);
}

describe("EditUserPage", () => {
  it("shows loading state while fetching user", () => {
    mockGetUser.mockImplementationOnce(
      () => new Promise((resolve) => setTimeout(() => resolve(mockUser), 100))
    );
    renderEditPage();
    expect(screen.getByText("Loading...")).toBeTruthy();
  });

  it("loads and pre-fills user data", async () => {
    mockGetUser.mockResolvedValueOnce(mockUser);
    renderEditPage();

    expect(await screen.findByText("Edit User")).toBeTruthy();
    expect((screen.getByLabelText("Name") as HTMLInputElement).value).toBe("John Doe");
    expect((screen.getByLabelText("Email") as HTMLInputElement).value).toBe("john@example.com");
    expect((screen.getByLabelText("Role") as HTMLInputElement).value).toBe("Admin");
  });

  it("shows error state on fetch failure", async () => {
    mockGetUser.mockRejectedValueOnce(new Error("User not found"));
    renderEditPage();

    expect(await screen.findByText("Error: User not found")).toBeTruthy();
  });

  it("shows user not found error", async () => {
    mockGetUser.mockRejectedValueOnce(new Error("User not found"));
    renderEditPage();

    expect(await screen.findByText("Error: User not found")).toBeTruthy();
  });

  it("submits form with updated data", async () => {
    mockGetUser.mockResolvedValueOnce(mockUser);
    mockUpdateUser.mockResolvedValueOnce({
      ...mockUser,
      name: "Jane Doe",
      email: "jane@example.com",
    });

    renderEditPage();
    await screen.findByText("Edit User");

    fireEvent.change(screen.getByLabelText("Name"), { target: { value: "Jane Doe" } });
    fireEvent.change(screen.getByLabelText("Email"), { target: { value: "jane@example.com" } });
    fireEvent.click(screen.getByRole("button", { name: "Save" }));

    await waitFor(() => {
      expect(mockUpdateUser).toHaveBeenCalledWith(1, {
        name: "Jane Doe",
        email: "jane@example.com",
        role: "Admin",
      });
    });
    expect(mockRouter.push).toHaveBeenCalledWith("/users");
  });

  it("shows loading state while saving", async () => {
    mockGetUser.mockResolvedValueOnce(mockUser);
    mockUpdateUser.mockImplementationOnce(
      () => new Promise((resolve) => setTimeout(() => resolve({} as any), 100))
    );

    renderEditPage();
    await screen.findByText("Edit User");

    fireEvent.click(screen.getByRole("button", { name: "Save" }));

    const savingButton = screen.getByRole("button", { name: "Saving..." }) as HTMLButtonElement;
    expect(savingButton).toBeTruthy();
    expect(savingButton.disabled).toBe(true);
  });

  it("shows error message on update failure", async () => {
    mockGetUser.mockResolvedValueOnce(mockUser);
    mockUpdateUser.mockRejectedValueOnce(new Error("Update failed"));

    renderEditPage();
    await screen.findByText("Edit User");

    fireEvent.click(screen.getByRole("button", { name: "Save" }));

    expect(await screen.findByText("Update failed")).toBeTruthy();
  });

  it("shows error for invalid user ID", async () => {
    renderEditPage({ id: "invalid" });
    expect(await screen.findByText("Error: Invalid user ID")).toBeTruthy();
  });
});
