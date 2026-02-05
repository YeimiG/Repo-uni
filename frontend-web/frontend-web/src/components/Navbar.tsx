/* navbar ieproes */
"use client";

import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="bg-white shadow-lg border-b-2 border-ieproes-primary">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* logo ieproes */}
          <div className="flex items-center">
            <div className="w-10 h-10 bg-ieproes-primary rounded-full flex items-center justify-center mr-3">
              <div className="w-5 h-5 bg-white rounded-full"></div>
            </div>
            <span className="text-xl font-bold text-ieproes-dark">IEPROES</span>
          </div>
          
          {/* menu navegacion */}
          <div className="flex space-x-4">
            <Link href="/login" className="nav-link">
              Login
            </Link>
            <Link href="/dashboard" className="btn-ieproes text-sm">
              Dashboard
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
