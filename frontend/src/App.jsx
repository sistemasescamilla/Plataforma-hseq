function App() {
  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      {/* Barra de Navegación Superior */}
      <header className="bg-astillero-azul text-white shadow-md">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <span>⚓</span> Astilleros Escamilla
            </h1>
            <p className="text-sm text-gray-300">Plataforma de Capacitación HSEQ</p>
          </div>
          <button className="bg-astillero-verde hover:bg-green-600 text-white px-5 py-2 rounded-md font-semibold transition shadow-sm">
            Iniciar Sesión
          </button>
        </div>
      </header>

      {/* Contenido Principal */}
      <main className="max-w-7xl mx-auto px-6 py-10">
        <div className="bg-white rounded-xl shadow-lg p-8 border-t-4 border-astillero-azul">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800">Módulos de Inducción</h2>
            <p className="text-gray-500 mt-1">Selecciona un curso para comenzar tu capacitación.</p>
          </div>
          
          {/* Cuadrícula de Cursos */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Tarjeta Curso 1 */}
            <div className="border border-gray-200 rounded-lg p-6 hover:shadow-xl transition flex flex-col group">
              <div className="bg-blue-50 text-astillero-azul w-14 h-14 flex items-center justify-center rounded-lg mb-4 text-2xl group-hover:bg-astillero-azul group-hover:text-white transition">
                🛡️
              </div>
              <h3 className="text-lg font-bold text-gray-900">Inducción SST</h3>
              <p className="text-gray-600 text-sm mt-2 mb-6 flex-grow">
                Seguridad y Salud en el Trabajo para todo el personal. Incluye 11 módulos con evaluaciones y certificado.
              </p>
              <button className="w-full bg-gray-100 text-astillero-azul py-2 rounded font-semibold hover:bg-astillero-azul hover:text-white transition">
                Ingresar al módulo
              </button>
            </div>
            
            {/* Tarjeta Curso 2 */}
            <div className="border border-gray-200 rounded-lg p-6 hover:shadow-xl transition flex flex-col group">
              <div className="bg-blue-50 text-astillero-azul w-14 h-14 flex items-center justify-center rounded-lg mb-4 text-2xl group-hover:bg-astillero-azul group-hover:text-white transition">
                ⚠️
              </div>
              <h3 className="text-lg font-bold text-gray-900">Trabajo en Alturas</h3>
              <p className="text-gray-600 text-sm mt-2 mb-6 flex-grow">
                Capacitación para trabajos a más de 2 metros. Uso de arneses, líneas de vida y rescate en altura.
              </p>
              <button className="w-full bg-gray-100 text-astillero-azul py-2 rounded font-semibold hover:bg-astillero-azul hover:text-white transition">
                Ingresar al módulo
              </button>
            </div>

            {/* Tarjeta Curso 3 */}
            <div className="border border-gray-200 rounded-lg p-6 hover:shadow-xl transition flex flex-col group">
              <div className="bg-blue-50 text-astillero-azul w-14 h-14 flex items-center justify-center rounded-lg mb-4 text-2xl group-hover:bg-astillero-azul group-hover:text-white transition">
                🔥
              </div>
              <h3 className="text-lg font-bold text-gray-900">Trabajo en Caliente</h3>
              <p className="text-gray-600 text-sm mt-2 mb-6 flex-grow">
                Soldadura, oxicorte y actividades con llama. Prevención de incendios y uso de EPP especial.
              </p>
              <button className="w-full bg-gray-100 text-astillero-azul py-2 rounded font-semibold hover:bg-astillero-azul hover:text-white transition">
                Ingresar al módulo
              </button>
            </div>

          </div>
        </div>
      </main>
    </div>
  )
}

export default App