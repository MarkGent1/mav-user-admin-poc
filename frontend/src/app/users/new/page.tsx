"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createUser } from "../../../lib/api";
import { UserForm } from "../../../components/UserForm";

export default function NewUserPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(data: { name: string; email: string; role: string }) {
    try {
      setLoading(true);
      setError(null);
      await createUser(data);
      router.push("/users");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create user");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h1>Create User</h1>
      <UserForm onSubmit={handleSubmit} loading={loading} error={error} />
    </div>
  );
}
