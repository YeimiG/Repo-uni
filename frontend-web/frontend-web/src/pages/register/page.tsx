/* register page */
"use client";

import { register } from "../../services/auth.service";

export default function RegisterPage() {
  return (
    <main className="flex min-h-screen items-center justify-center">
      <button
        className="bg-black p-2 text-white"
        onClick={() => register("test@test.com", "123456")}
      >
        Registrar
      </button>
    </main>
  );
}
