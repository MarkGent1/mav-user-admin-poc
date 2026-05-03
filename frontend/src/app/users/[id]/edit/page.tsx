"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { getUser, updateUser, User } from "../../../../lib/api";
import { UserForm } from "../../../../components/UserForm";
import { LoadingIndicator } from "../../../../components/LoadingIndicator";
import { ErrorMessage } from "../../../../components/ErrorMessage";

interface EditUserPageProps {
  params: Promise<{ id: string }>;
}

export default function EditUserPage({ params }: EditUserPageProps) {
  const { id } = use(params);
  const userId = parseInt(id, 10);

  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchUser() {
      try {
        setLoading(true);
        setError(null);
        const data = await getUser(userId);
        setUser(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch user");
      } finally {
        setLoading(false);
      }
    }
    if (!isNaN(userId)) {
      fetchUser();
    } else {
      setError("Invalid user ID");
      setLoading(false);
    }
  }, [userId]);

  async function handleSubmit(data: { name: string; email: string; role: string }) {
    try {
      setSaving(true);
      setError(null);
      await updateUser(userId, data);
      router.push("/users");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update user");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <LoadingIndicator />;
  if (error && !user) return <ErrorMessage message={error} />;
  if (!user) return <ErrorMessage message="User not found" />;

  return (
    <div>
      <h1>Edit User</h1>
      <UserForm user={user} onSubmit={handleSubmit} loading={saving} error={error} />
    </div>
  );
}
