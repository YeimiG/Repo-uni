"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { login } from "@/services/auth.service";

export default function LoginPage() {
  const router = useRouter();
  const [correo, setCorreo] = useState("");
  const [clave, setClave] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await login(correo, clave);
      
      // Verificar que sea Administrador o Catedrático
      if (response.usuario.rol === "Administrador" || response.usuario.rol === "Catedrático") {
        router.push("/dashboard");
      } else {
        setError("Acceso no autorizado. Solo administradores y catedráticos.");
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Error al iniciar sesión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen gradient-ieproes flex items-center justify-center p-4">
      {/* contenedor principal */}
      <div className="card-ieproes w-full max-w-md">
        {/* header ieproes */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 bg-blue-400 rounded-full flex items-center justify-center mr-3 shadow-lg">
              <div className="w-6 h-6 bg-white rounded-full"></div>
            </div>
            <h1 className="text-3xl font-bold text-blue-600">IEPROES</h1>
          </div>
          <h2 className="text-xl font-semibold text-gray-800">Iniciar Sesión</h2>
          <p className="text-gray-600 mt-2">Panel Administrativo</p>
        </div>

        {/* error message */}
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        {/* formulario login */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Correo Institucional
            </label>
            <input
              type="email"
              id="email"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              className="input-ieproes"
              placeholder="usuario@ieproes.edu"
              required
              disabled={loading}
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Contraseña
            </label>
            <input
              type="password"
              id="password"
              value={clave}
              onChange={(e) => setClave(e.target.value)}
              className="input-ieproes"
              placeholder="••••••••"
              required
              disabled={loading}
            />
          </div>

          {/* boton login */}
          <button 
            type="submit" 
            className="btn-ieproes w-full"
            disabled={loading}
          >
            {loading ? "Iniciando..." : "Iniciar Sesión"}
          </button>
        </form>

        {/* navegacion */}
        <div className="mt-6 text-center">
          <Link href="/" className="text-sm text-blue-600 hover:text-blue-400">
            ← Volver inicio
          </Link>
        </div>

        {/* roles disponibles */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="text-center text-sm text-gray-600">
            <p className="font-medium mb-3">Acceso permitido:</p>
            <div className="grid grid-cols-1 gap-2">
              <span className="badge-success">
                ✓ Catedrático - Gestionar materias
              </span>
              <span className="badge-warning">
                ✓ Administrador - Control total
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}