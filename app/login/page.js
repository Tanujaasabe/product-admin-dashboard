"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "../../lib/products";
import { saveAuth } from "../../lib/auth";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("emilys");
  const [password, setPassword] = useState("emilyspass");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e) {
    e.preventDefault();
    if (loading) return;
    setError("");
    setLoading(true);
    try {
      const data = await login(username, password);
      saveAuth(data);
      router.replace("/products");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid username or password.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center p-4">
      <form onSubmit={submit} className="w-full max-w-md rounded bg-white p-6 shadow">
        <h1 className="mb-6 text-2xl font-bold">Login</h1>
        {error && <p className="mb-4 rounded bg-red-50 p-3 text-red-700">{error}</p>}
        <input className="mb-3 w-full rounded border p-3" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" />
        <input className="mb-4 w-full rounded border p-3" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
        <button disabled={loading} className="w-full rounded bg-blue-600 p-3 text-white">
          {loading ? "Logging in..." : "Login"}
        </button>
        <p className="mt-4 text-sm text-slate-600">Demo: emilys / emilyspass</p>
      </form>
    </main>
  );
}
