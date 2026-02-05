/* sidebar ieproes */
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();

  const menuItems = [
    { href: "/dashboard", label: "Dashboard", icon: "📊" },
    { href: "/users", label: "Usuarios", icon: "👥" },
    { href: "/subjects", label: "Materias", icon: "📚" },
    { href: "/grades", label: "Calificaciones", icon: "📝" },
    { href: "/reports", label: "Reportes", icon: "📈" },
    { href: "/settings", label: "Configuración", icon: "⚙️" },
  ];

  return (
    <aside className="w-64 bg-white shadow-lg border-r border-gray-200">
      {/* logo sidebar */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-ieproes-primary rounded-full flex items-center justify-center mr-3">
            <div className="w-5 h-5 bg-white rounded-full"></div>
          </div>
          <span className="text-xl font-bold text-ieproes-dark">IEPROES</span>
        </div>
      </div>

      {/* menu navegacion */}
      <nav className="p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                  pathname === item.href
                    ? "bg-ieproes-primary text-white"
                    : "text-gray-700 hover:bg-ieproes-accent hover:text-ieproes-dark"
                }`}
              >
                <span className="mr-3 text-lg">{item.icon}</span>
                <span className="font-medium">{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* usuario actual */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-ieproes-primary rounded-full flex items-center justify-center mr-3">
            <div className="w-4 h-4 bg-white rounded-full"></div>
          </div>
          <div>
            <div className="text-sm font-medium text-gray-900">Admin</div>
            <div className="text-xs text-gray-500">Administrador</div>
          </div>
        </div>
      </div>
    </aside>
  );
}