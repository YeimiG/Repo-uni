"use client";
import { login } from "@/services/auth.service";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [correo, setCorreo] = useState("");
  const [clave, setClave] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await login(correo, clave);

      // Verificar roles permitidos
      const rolesPermitidos = ["SUPER_ADMIN", "ADMIN_ACADEMICO", "ADMIN_FINANCIERO", "COORDINADOR", "DOCENTE", "SECRETARIA"];
      if (rolesPermitidos.includes(response.usuario.rol)) {
        router.push("/dashboard");
      } else {
        setError("Acceso no autorizado.");
        localStorage.removeItem("user");
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error al iniciar sesión");
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
          <h2 className="text-xl font-semibold text-gray-800">
            Iniciar Sesión
          </h2>
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
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
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
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Contraseña
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={clave}
                onChange={(e) => setClave(e.target.value)}
                className="input-ieproes pr-10"
                placeholder="••••••••"
                required
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                disabled={loading}
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                )}
              </button>
            </div>
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
          <p className="text-center text-xs text-gray-500 font-medium mb-3">Acceso permitido para:</p>
          <div className="grid grid-cols-2 gap-2 text-xs">
            {[
              { rol: "SUPER_ADMIN",      color: "bg-purple-100 text-purple-700" },
              { rol: "ADMIN_ACADÉMICO",  color: "bg-blue-100 text-blue-700" },
              { rol: "ADMIN_FINANCIERO", color: "bg-green-100 text-green-700" },
              { rol: "COORDINADOR",      color: "bg-yellow-100 text-yellow-700" },
              { rol: "DOCENTE",          color: "bg-indigo-100 text-indigo-700" },
              { rol: "SECRETARÍA",       color: "bg-pink-100 text-pink-700" },
            ].map(r => (
              <span key={r.rol} className={`${r.color} px-2 py-1 rounded text-center font-medium`}>{r.rol}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
