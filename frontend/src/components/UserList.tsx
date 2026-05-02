"use client";

import { useState, useEffect } from "react";
import { getUsers, User } from "../lib/api";
import { LoadingIndicator } from "./LoadingIndicator";
import { ErrorMessage } from "./ErrorMessage";
import { EmptyState } from "./EmptyState";

export function UserList() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchUsers() {
      try {
        setLoading(true);
        setError(null);
        const data = await getUsers();
        setUsers(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch users");
      } finally {
        setLoading(false);
      }
    }
    fetchUsers();
  }, []);

  if (loading) return <LoadingIndicator />;
  if (error) return <ErrorMessage message={error} />;
  if (users.length === 0) return <EmptyState />;

  return (
    <div>
      <div style={{ marginBottom: "1rem" }}>
        <a
          href="/users/new"
          style={{
            padding: "0.5rem 1rem",
            backgroundColor: "#0070f3",
            color: "white",
            textDecoration: "none",
            borderRadius: "4px",
          }}
        >
          Create User
        </a>
      </div>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={{ borderBottom: "2px solid #ccc", padding: "0.5rem", textAlign: "left" }}>
              Name
            </th>
            <th style={{ borderBottom: "2px solid #ccc", padding: "0.5rem", textAlign: "left" }}>
              Email
            </th>
            <th style={{ borderBottom: "2px solid #ccc", padding: "0.5rem", textAlign: "left" }}>
              Role
            </th>
            <th style={{ borderBottom: "2px solid #ccc", padding: "0.5rem", textAlign: "left" }}>
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td style={{ borderBottom: "1px solid #eee", padding: "0.5rem" }}>
                {user.firstName} {user.lastName}
              </td>
              <td style={{ borderBottom: "1px solid #eee", padding: "0.5rem" }}>
                {user.email}
              </td>
              <td style={{ borderBottom: "1px solid #eee", padding: "0.5rem" }}>
                {user.role}
              </td>
              <td style={{ borderBottom: "1px solid #eee", padding: "0.5rem" }}>
                <a
                  href={`/users/${user.id}/edit`}
                  style={{ marginRight: "0.5rem", color: "#0070f3" }}
                >
                  Edit
                </a>
                <button
                  onClick={() => alert("Delete functionality not implemented yet")}
                  style={{ color: "red", background: "none", border: "none", cursor: "pointer" }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
