"use client";

import { useRouter } from "next/navigation";
import { logout } from "../lib/auth";

export default function Header() {
  const router = useRouter();

  function handleLogout() {
    logout();
    router.replace("/login");
  }

  return (
    <header className="flex items-center justify-between border-b bg-white px-4 py-4">
      <h1 className="text-xl font-bold">Product Admin Dashboard</h1>
      <button onClick={handleLogout} className="rounded bg-red-600 px-4 py-2 text-white">
        Logout
      </button>
    </header>
  );
}
