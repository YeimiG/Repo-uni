export default function Home() {
  return (
    <div className="min-h-screen medical-bg flex items-center justify-center">
      <div className="text-center p-8 medical-card max-w-md relative z-10">
        {/* Logo salud */}
        <div className="mb-6">
          <h1 className="text-4xl font-bold text-medical mb-2"> IEPROES</h1>
          <p className="text-gray-600">Sistema de Gestión en Salud</p>
        </div>

        {/* Mensaje bienvenida */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-medical-dark mb-4">
            ¡Bienvenido!
          </h2>
          <p className="text-gray-600">
            Panel para profesionales de enfermería y administradores
          </p>
        </div>

        {/* Botones acceso */}
        <div className="space-y-3">
          <button className="w-full btn-medical">Iniciar Sesión</button>
          <button className="w-full btn-medical-outline">Ver Demo</button>
        </div>

        {/* Icono médico */}
        <div className="mt-6 text-2xl text-medical"></div>
      </div>
    </div>
  );
}
