/* error ieproes */
import Link from "next/link";

interface ErrorProps {
  message?: string;
  showRetry?: boolean;
}

export default function ErrorComponent({ 
  message = "Ha ocurrido un error inesperado", 
  showRetry = true 
}: ErrorProps) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      {/* card error */}
      <div className="card-ieproes max-w-md text-center">
        <div className="w-16 h-16 bg-error rounded-full flex items-center justify-center mb-4 mx-auto">
          <div className="w-8 h-8 bg-white rounded-full"></div>
        </div>
        <h2 className="text-2xl font-bold text-error mb-4">Error</h2>
        <p className="text-gray-600 mb-6">{message}</p>
        
        {/* botones accion */}
        <div className="space-y-3">
          {showRetry && (
            <button 
              onClick={() => window.location.reload()} 
              className="btn-ieproes w-full"
            >
              Intentar Nuevamente
            </button>
          )}
          <Link href="/">
            <button className="btn-secondary w-full">
              Volver Inicio
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}