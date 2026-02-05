/* dashboard ieproes */
import Link from "next/link";

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* header dashboard */}
      <header className="bg-white shadow-sm border-b-2 border-ieproes-primary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-ieproes-primary rounded-full flex items-center justify-center mr-3">
                <div className="w-5 h-5 bg-white rounded-full"></div>
              </div>
              <h1 className="text-2xl font-bold text-ieproes-dark">IEPROES Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Bienvenido, Admin</span>
              <button className="btn-secondary text-sm">
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* contenido principal */}
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* tarjetas estadisticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="card-ieproes hover:shadow-xl transition-shadow">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-ieproes-primary rounded-lg flex items-center justify-center mr-4">
                <div className="w-6 h-6 bg-white rounded-full"></div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Estudiantes Activos</p>
                <p className="text-2xl font-bold text-ieproes-dark">1,234</p>
                <p className="text-xs text-success">+12% este mes</p>
              </div>
            </div>
          </div>
          
          <div className="card-ieproes hover:shadow-xl transition-shadow">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-success rounded-lg flex items-center justify-center mr-4">
                <div className="w-6 h-6 bg-white rounded-full"></div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Catedráticos</p>
                <p className="text-2xl font-bold text-ieproes-dark">56</p>
                <p className="text-xs text-info">Sin cambios</p>
              </div>
            </div>
          </div>
          
          <div className="card-ieproes hover:shadow-xl transition-shadow">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-warning rounded-lg flex items-center justify-center mr-4">
                <div className="w-6 h-6 bg-white rounded-full"></div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Materias Ofertadas</p>
                <p className="text-2xl font-bold text-ieproes-dark">89</p>
                <p className="text-xs text-success">+3 nuevas</p>
              </div>
            </div>
          </div>
          
          <div className="card-ieproes hover:shadow-xl transition-shadow">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-error rounded-lg flex items-center justify-center mr-4">
                <div className="w-6 h-6 bg-white rounded-full"></div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Calificaciones</p>
                <p className="text-2xl font-bold text-ieproes-dark">2,456</p>
                <p className="text-xs text-success">+89 hoy</p>
              </div>
            </div>
          </div>
        </div>

        {/* acciones y actividad */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* acciones rapidas */}
          <div className="card-ieproes">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Acciones Rápidas
            </h3>
            <div className="space-y-3">
              <Link href="/users">
                <button className="w-full text-left p-3 rounded-lg border border-ieproes-light hover:bg-ieproes-accent transition-colors">
                  <span className="font-medium">Gestionar Usuarios</span>
                </button>
              </Link>
              <Link href="/subjects">
                <button className="w-full text-left p-3 rounded-lg border border-ieproes-light hover:bg-ieproes-accent transition-colors">
                  <span className="font-medium">Administrar Materias</span>
                </button>
              </Link>
              <button className="w-full text-left p-3 rounded-lg border border-ieproes-light hover:bg-ieproes-accent transition-colors">
                <span className="font-medium">Ver Reportes</span>
              </button>
              <button className="w-full text-left p-3 rounded-lg border border-ieproes-light hover:bg-ieproes-accent transition-colors">
                <span className="font-medium">Configuración Sistema</span>
              </button>
            </div>
          </div>
          
          {/* actividad reciente */}
          <div className="card-ieproes">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Actividad Reciente
            </h3>
            <div className="space-y-3">
              <div className="flex items-center p-3 bg-blue-50 rounded-lg border-l-4 border-info">
                <div className="w-3 h-3 bg-info rounded-full mr-3"></div>
                <div>
                  <p className="text-sm font-medium">Nuevo estudiante registrado</p>
                  <p className="text-xs text-gray-600">Juan Pérez - Hace 2 horas</p>
                </div>
              </div>
              <div className="flex items-center p-3 bg-green-50 rounded-lg border-l-4 border-success">
                <div className="w-3 h-3 bg-success rounded-full mr-3"></div>
                <div>
                  <p className="text-sm font-medium">Calificaciones actualizadas</p>
                  <p className="text-xs text-gray-600">Matemáticas I - Hace 4 horas</p>
                </div>
              </div>
              <div className="flex items-center p-3 bg-yellow-50 rounded-lg border-l-4 border-warning">
                <div className="w-3 h-3 bg-warning rounded-full mr-3"></div>
                <div>
                  <p className="text-sm font-medium">Backup programado</p>
                  <p className="text-xs text-gray-600">Sistema - Hace 1 día</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* footer dashboard */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>Sistema de Gestión Académica IEPROES - v1.0</p>
        </div>
      </main>
    </div>
  );
}
