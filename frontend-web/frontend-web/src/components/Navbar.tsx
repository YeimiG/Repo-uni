/* main nav */
"use client";

import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="flex gap-4 border-b p-4">
      <Link href="/login">Login</Link>
      <Link href="/register">Register</Link>
    </nav>
  );
}
