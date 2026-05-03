"use client";

import { useState } from "react";
import { User, CreateUserInput, UpdateUserInput } from "../lib/api";

interface UserFormProps {
  user?: User;
  onSubmit: (data: CreateUserInput | UpdateUserInput) => Promise<void>;
  loading: boolean;
  error: string | null;
}

export function UserForm({ user, onSubmit, loading, error }: UserFormProps) {
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [role, setRole] = useState(user?.role || "");
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  function validate(): boolean {
    const errors: Record<string, string> = {};
    if (!name.trim()) errors.name = "Name is required";
    if (!email.trim()) errors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = "Invalid email format";
    if (!role.trim()) errors.role = "Role is required";
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    await onSubmit({ name, email, role });
  }

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: "400px" }}>
      {error && (
        <div style={{ padding: "0.5rem", marginBottom: "1rem", backgroundColor: "#fee", color: "red" }}>
          {error}
        </div>
      )}

      <div style={{ marginBottom: "1rem" }}>
        <label htmlFor="name" style={{ display: "block", marginBottom: "0.25rem" }}>
          Name
        </label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ width: "100%", padding: "0.5rem", border: validationErrors.name ? "1px solid red" : "1px solid #ccc" }}
        />
        {validationErrors.name && (
          <div style={{ color: "red", fontSize: "0.875rem", marginTop: "0.25rem" }}>{validationErrors.name}</div>
        )}
      </div>

      <div style={{ marginBottom: "1rem" }}>
        <label htmlFor="email" style={{ display: "block", marginBottom: "0.25rem" }}>
          Email
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ width: "100%", padding: "0.5rem", border: validationErrors.email ? "1px solid red" : "1px solid #ccc" }}
        />
        {validationErrors.email && (
          <div style={{ color: "red", fontSize: "0.875rem", marginTop: "0.25rem" }}>{validationErrors.email}</div>
        )}
      </div>

      <div style={{ marginBottom: "1rem" }}>
        <label htmlFor="role" style={{ display: "block", marginBottom: "0.25rem" }}>
          Role
        </label>
        <input
          id="role"
          type="text"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          style={{ width: "100%", padding: "0.5rem", border: validationErrors.role ? "1px solid red" : "1px solid #ccc" }}
        />
        {validationErrors.role && (
          <div style={{ color: "red", fontSize: "0.875rem", marginTop: "0.25rem" }}>{validationErrors.role}</div>
        )}
      </div>

      <button
        type="submit"
        disabled={loading}
        style={{
          padding: "0.5rem 1rem",
          backgroundColor: "#0070f3",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: loading ? "not-allowed" : "pointer",
          opacity: loading ? 0.5 : 1,
        }}
      >
        {loading ? "Saving..." : "Save"}
      </button>
    </form>
  );
}
