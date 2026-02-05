/* pagina inicio */
import Link from "next/link";
import Navbar from "../components/Navbar";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* navbar principal */}
      <Navbar />
      
      {/* hero section */}
      <div className="gradient-ieproes min-h-screen flex items-center justify-center">
        <div className="max-w-4xl mx-auto px-4 text-center">
          {/* logo principal */}
          <div className="mb-8">
            <div className="flex items-center justify-center mb-6">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mr-4 shadow-lg">
                <div className="w-10 h-10 bg-ieproes-primary rounded-full"></div>
              </div>
              <h1 className="text-6xl font-bold text-white">IEPROES</h1>
            </div>
            <p className="text-xl text-white/90">Sistema de Gestión Académica</p>
          </div>

          {/* descripcion principal */}
          <div className="mb-12">
            <h2 className="text-3xl font-semibold text-white mb-6">
              Bienvenido al Futuro Educativo
            </h2>
            <p className="text-lg text-white/90 max-w-2xl mx-auto leading-relaxed">
              Plataforma integral para la gestión académica moderna. 
              Conectamos estudiantes, catedráticos y administradores en un solo lugar.
            </p>
          </div>

          {/* botones accion */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link href="/login">
              <button className="btn-ieproes bg-white text-ieproes-primary hover:bg-gray-100 px-8 py-3 text-lg">
                Iniciar Sesión
              </button>
            </Link>
            <Link href="/dashboard">
              <button className="btn-outline border-white text-white hover:bg-white hover:text-ieproes-primary px-8 py-3 text-lg">
                Ver Dashboard
              </button>
            </Link>
          </div>

          {/* caracteristicas principales */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-white">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mb-3 mx-auto">
                <div className="w-6 h-6 bg-white rounded-full"></div>
              </div>
              <h3 className="font-semibold mb-2">Para Estudiantes</h3>
              <p className="text-sm text-white/80">Consulta notas, materias y perfil académico</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-white">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mb-3 mx-auto">
                <div className="w-6 h-6 bg-white rounded-full"></div>
              </div>
              <h3 className="font-semibold mb-2">Para Catedráticos</h3>
              <p className="text-sm text-white/80">Gestiona materias y calificaciones</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-white">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mb-3 mx-auto">
                <div className="w-6 h-6 bg-white rounded-full"></div>
              </div>
              <h3 className="font-semibold mb-2">Para Administradores</h3>
              <p className="text-sm text-white/80">Control total del sistema educativo</p>
            </div>
          </div>
        </div>
      </div>

      {/* footer */}
      <footer className="bg-white py-8 border-t">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-gray-600">
            Sistema de Gestión Académica IEPROES - Desarrollado para la educación
          </p>
        </div>
      </footer>
    </div>
  );
}
