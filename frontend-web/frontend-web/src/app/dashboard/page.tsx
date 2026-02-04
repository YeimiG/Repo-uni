/* dashboard page */
"use client";

import { useAuth } from "@/hooks/useAuth";

export default function DashboardPage() {
  const { isAuth } = useAuth();

  if (!isAuth) {
    return <p>No autorizado</p>;
  }

  return <h1>Dashboard</h1>;
}
