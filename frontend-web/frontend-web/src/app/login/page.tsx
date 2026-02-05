/* login ieproes */
import Link from "next/link";

export default function LoginPage() {
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

        {/* formulario login */}
        <form className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Correo Institucional
            </label>
            <input
              type="email"
              id="email"
              className="input-ieproes"
              placeholder="usuario@ieproes.edu"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Contraseña
            </label>
            <input
              type="password"
              id="password"
              className="input-ieproes"
              placeholder="••••••••"
            />
          </div>

          {/* opciones adicionales */}
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember"
                type="checkbox"
                className="h-4 w-4 text-blue-400 focus:ring-blue-400 border-gray-300 rounded"
              />
              <label htmlFor="remember" className="ml-2 block text-sm text-gray-700">
                Recordarme
              </label>
            </div>
            <a href="#" className="text-sm text-blue-600 hover:text-blue-400">
              ¿Olvidaste contraseña?
            </a>
          </div>

          {/* boton login */}
          <Link href="/dashboard">
            <button type="button" className="btn-ieproes w-full">
              Iniciar Sesión
            </button>
          </Link>
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
            <p className="font-medium mb-3">Roles del Sistema:</p>
            <div className="grid grid-cols-1 gap-2">
              <span className="badge-info">
                Estudiante - Consultar notas
              </span>
              <span className="badge-success">
                Catedrático - Gestionar materias
              </span>
              <span className="badge-warning">
                Administrador - Control total
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}