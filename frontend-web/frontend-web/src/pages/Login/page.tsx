/* login page */
"use client";

import { login } from "../../services/auth.service";
import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <main className="flex min-h-screen items-center justify-center">
      <form
        className="w-80 space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          login(email, password);
        }}
      >
        <h1 className="text-xl font-bold">Login</h1>

        <input
          className="w-full border p-2"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="w-full border p-2"
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="w-full bg-black p-2 text-white">Entrar</button>
      </form>
    </main>
  );
}
