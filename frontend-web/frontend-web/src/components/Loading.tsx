/* loading ieproes */
export default function Loading() {
  return (
    <div className="min-h-screen gradient-ieproes flex items-center justify-center">
      {/* spinner ieproes */}
      <div className="text-center">
        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4 mx-auto animate-bounce">
          <div className="w-8 h-8 bg-ieproes-primary rounded-full"></div>
        </div>
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-white border-t-transparent mx-auto mb-4"></div>
        <p className="text-white font-medium">Cargando IEPROES...</p>
      </div>
    </div>
  );
}