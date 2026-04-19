/* sidebar ieproes */
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { hasPermission, PERMISSIONS } from "@/utils/permissions";

export default function Sidebar() {
  const pathname = usePathname();
  const { user } = useAuth();

  const menuItems = [
    { href: "/dashboard",     label: "Dashboard",        icon: "📊", permission: null },
    { href: "/usuarios",      label: "Usuarios",          icon: "👥", permission: PERMISSIONS.MANAGE_USERS },
    { href: "/estudiantes",   label: "Estudiantes",       icon: "🎓", permission: PERMISSIONS.MANAGE_USERS },
    { href: "/inscripciones", label: "Inscripciones",     icon: "📋", permission: PERMISSIONS.MANAGE_SUBJECTS },
    { href: "/subjects",      label: "Materias",          icon: "📚", permission: PERMISSIONS.MANAGE_SUBJECTS },
    { href: "/grades",        label: "Calificaciones",    icon: "📝", permission: PERMISSIONS.MANAGE_GRADES },
    { href: "/reports",       label: "Reportes",          icon: "📈", permission: PERMISSIONS.VIEW_REPORTS },
    { href: "/periodos",      label: "Períodos",          icon: "🗓️", permission: PERMISSIONS.SYSTEM_CONFIG },
    { href: "/permisos",      label: "Permisos de Notas", icon: "🔐", permission: PERMISSIONS.SYSTEM_CONFIG },
    { href: "/config",        label: "Configuración",     icon: "⚙️", permission: PERMISSIONS.SYSTEM_CONFIG },
  ];

  const visibleItems = menuItems.filter(item =>
    item.permission === null || hasPermission(user?.rol, item.permission)
  );

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
          {visibleItems.map((item) => (
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
            <div className="text-sm font-medium text-gray-900">{user?.nombre || 'Usuario'}</div>
            <div className="text-xs text-gray-500">{user?.rol || ''}</div>
          </div>
        </div>
      </div>
    </aside>
  );
}