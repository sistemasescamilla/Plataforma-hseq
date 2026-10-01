import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Dashboard() {
  const [estaLogueado, setEstaLogueado] = useState(false);
  const [nombreUsuario, setNombreUsuario] = useState('');
  const navigate = useNavigate();

  // Lista OFICIAL de 10 módulos del Astillero (Orden secuencial)
  const modulos = [
    { id: 1, titulo: "Inducción SST", descripcion: "Seguridad y Salud en el Trabajo para todo el personal. Incluye 11 módulos con evaluaciones.", icono: "🛡️", estado: "disponible" },
    { id: 2, titulo: "Espacios Confinados", descripcion: "Protocolos de seguridad para ingreso a espacios con acceso limitado. Identificación de riesgos y rescate.", icono: "🚧", estado: "bloqueado" },
    { id: 3, titulo: "Trabajo en Caliente", descripcion: "Soldadura, oxicorte y actividades con llama. Prevención de incendios y uso de EPP especial.", icono: "🔥", estado: "bloqueado" },
    { id: 4, titulo: "Trabajo en Alturas", descripcion: "Capacitación para trabajos a más de 2 metros. Uso de arneses, líneas de vida y rescate en altura.", icono: "🪜", estado: "bloqueado" },
    { id: 5, titulo: "Izaje de Cargas", descripcion: "Procedimientos seguros para levantar y mover cargas con grúas, polipastos y eslingas.", icono: "🏗️", estado: "bloqueado" },
    { id: 6, titulo: "Levantamiento de Cargas", descripcion: "Manejo manual de cargas, posturas correctas y prevención de lesiones musculoesqueléticas.", icono: "📦", estado: "bloqueado" },
    { id: 7, titulo: "Ergonomía y Pausas Activas", descripcion: "Orientado al trabajo de oficina. Posturas, ejercicios y pausas para prevenir molestias osteomusculares.", icono: "🧘", estado: "bloqueado" },
    { id: 8, titulo: "Plan de Emergencias", descripcion: "Conocimiento del plan de respuesta ante incendios, sismos, derrames y evacuación. Simulacros y roles.", icono: "🚨", estado: "bloqueado" },
    { id: 9, titulo: "Primeros Auxilios", descripcion: "RCP, manejo de heridas, fracturas, quemaduras y atención inicial hasta la llegada de profesionales.", icono: "⛑️", estado: "bloqueado" },
    { id: 10, titulo: "Brigadista Integral", descripcion: "Formación completa para brigadistas: incendios, primeros auxilios, rescate y coordinación de emergencias.", icono: "🚒", estado: "bloqueado" },
  ];

  useEffect(() => {
    const token = localStorage.getItem('token_hseq');
    const nombre = localStorage.getItem('nombre_hseq');
    if (token) {
      setEstaLogueado(true);
      if (nombre) setNombreUsuario(nombre);
    }
  }, []);

  const cerrarSesion = () => {
    localStorage.removeItem('token_hseq');
    localStorage.removeItem('nombre_hseq');
    setEstaLogueado(false);
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white w-full py-4 px-8 shadow-sm flex items-center justify-between border-b">
        <div>
          <div className="text-blue-600 font-bold text-xl flex items-center gap-2">
            <span className="text-2xl">⚓</span> Astilleros Escamilla
          </div>
          <span className="text-gray-400 text-sm">Plataforma de Capacitación HSEQ</span>
        </div>
        
        {estaLogueado ? (
          <div className="flex items-center gap-4">
            <span className="text-blue-800 font-bold text-sm hidden sm:block bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
              👋 Hola, {nombreUsuario}
            </span>
            <button onClick={cerrarSesion} className="border border-red-200 text-red-500 font-semibold px-4 py-2 rounded-md hover:bg-red-50 transition text-sm">
              Cerrar Sesión
            </button>
          </div>
        ) : (
          <Link to="/login" className="border border-gray-200 text-gray-600 font-semibold px-6 py-2 rounded-md hover:bg-gray-100 transition">
            Iniciar Sesión
          </Link>
        )}
      </header>

      <main className="flex-grow p-8 max-w-7xl mx-auto w-full mt-2">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Ruta de Aprendizaje</h1>
          <p className="text-gray-500">Completa los módulos en orden. Debes aprobar la evaluación de cada uno para desbloquear el siguiente.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {modulos.map((modulo, index) => (
            <div key={modulo.id} className={`p-6 rounded-xl border flex flex-col h-full ${modulo.estado === 'disponible' ? 'bg-white shadow-md border-blue-200' : 'bg-gray-100 border-gray-200 opacity-75'}`}>
              <div className="flex justify-between items-start mb-4">
                <div className={`w-12 h-12 flex flex-shrink-0 items-center justify-center rounded-lg text-2xl ${modulo.estado === 'disponible' ? 'bg-blue-100 text-blue-600' : 'bg-gray-200 text-gray-400'}`}>
                  {modulo.icono}
                </div>
                {modulo.estado === 'bloqueado' && (
                  <span className="text-gray-400 ml-2" title="Debes completar el módulo anterior">🔒</span>
                )}
              </div>
              
              <h3 className={`text-lg font-bold mb-2 leading-tight ${modulo.estado === 'disponible' ? 'text-gray-900' : 'text-gray-500'}`}>
                {index + 1}. {modulo.titulo}
              </h3>
              
              {/* flex-grow empuja el botón hacia abajo para que todos queden alineados */}
              <p className="text-gray-500 text-sm mb-6 flex-grow">
                {modulo.descripcion}
              </p>
              
              <button 
                onClick={() => navigate('/modulo/' + modulo.id)}
                disabled={modulo.estado === 'bloqueado'}
                className={`w-full font-bold px-4 py-3 rounded-md transition mt-auto ${
                  modulo.estado === 'disponible' 
                  ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm' 
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                {modulo.estado === 'disponible' ? 'Ver Video y Test ▶️' : 'Módulo Bloqueado'}
              </button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default Dashboard;