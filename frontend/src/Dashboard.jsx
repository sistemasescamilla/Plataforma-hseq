import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Dashboard() {
  const [estaLogueado, setEstaLogueado] = useState(false);
  const [nombreUsuario, setNombreUsuario] = useState('');
  const [rolUsuario, setRolUsuario] = useState('');
  const [modulosAsignados, setModulosAsignados] = useState([]);
  const navigate = useNavigate();

  const iconos = { 1: "🛡️", 2: "🚧", 3: "🔥", 4: "🪜", 5: "🏗️", 6: "📦", 7: "🧘", 8: "🚨", 9: "⛑️", 10: "🚒" };

  useEffect(() => {
    const token = localStorage.getItem('token_hseq');
    const nombre = localStorage.getItem('nombre_hseq');
    const rol = localStorage.getItem('rol_hseq');
    const idUsuario = localStorage.getItem('id_hseq');
    
    if (token) {
      setEstaLogueado(true);
      if (nombre) setNombreUsuario(nombre);
      if (rol) setRolUsuario(rol);
      
      if (idUsuario) {
        cargarMisModulos(idUsuario);
      }
    }
  }, []);

  const cargarMisModulos = async (id) => {
    try {
      const respuesta = await fetch(`http://localhost:3000/api/usuario/${id}/modulos`);
      const datos = await respuesta.json();
      setModulosAsignados(datos);
    } catch (error) {
      console.error("Error cargando módulos del trabajador:", error);
    }
  };

  const cerrarSesion = () => {
    localStorage.clear(); 
    setEstaLogueado(false);
    navigate('/login');
  };

  // NUEVO: Función para poner la fecha bonita y corregir zonas horarias
  const formatearFecha = (fechaISO) => {
    if (!fechaISO) return null;
    const fecha = new Date(fechaISO);
    // Ajuste para evitar que la zona horaria le reste un día
    fecha.setMinutes(fecha.getMinutes() + fecha.getTimezoneOffset());
    return fecha.toLocaleDateString('es-CO');
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
            {rolUsuario === 'ADMIN' && (
              <Link to="/admin" className="bg-yellow-500 text-gray-900 font-bold py-1.5 px-4 rounded-md hover:bg-yellow-600 transition flex items-center gap-2 text-sm shadow-sm border border-yellow-600">
                <span>⚙️</span> Ir a Panel Admin
              </Link>
            )}
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Mi Ruta de Aprendizaje</h1>
          <p className="text-gray-500">Aquí verás únicamente los módulos de capacitación que se te han asignado para tu cargo.</p>
        </div>
        
        {modulosAsignados.length === 0 ? (
          <div className="bg-white p-10 rounded-xl border border-gray-200 text-center shadow-sm">
            <span className="text-6xl block mb-4">📭</span>
            <h2 className="text-xl font-bold text-gray-800">No tienes módulos asignados</h2>
            <p className="text-gray-500 mt-2">Comunícate con el administrador HSEQ para que matricule tus cursos de inducción.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {modulosAsignados.map((modulo) => (
              <div key={modulo.id} className="bg-white p-6 rounded-xl border border-blue-200 shadow-md flex flex-col h-full hover:shadow-lg transition relative">
                <div className="flex justify-between items-start mb-4">
                  <div className="w-12 h-12 flex flex-shrink-0 items-center justify-center rounded-lg text-2xl bg-blue-100 text-blue-600">
                    {iconos[modulo.id] || "📘"}
                  </div>
                  {modulo.estado === 'APROBADO' && (
                    <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded border border-green-200">Aprobado</span>
                  )}
                  {modulo.estado === 'EN_CURSO' && (
                    <span className="bg-yellow-100 text-yellow-700 text-xs font-bold px-2 py-1 rounded border border-yellow-200">Pendiente</span>
                  )}
                </div>
                
                <h3 className="text-lg font-bold mb-2 leading-tight text-gray-900">
                  {modulo.titulo}
                </h3>
                
                <p className="text-gray-500 text-sm mb-4 flex-grow">
                  {modulo.descripcion}
                </p>

                {/* NUEVO: Etiqueta de Fecha Límite */}
                {modulo.fecha_limite && modulo.estado !== 'APROBADO' && (
                  <div className="mb-4 bg-red-50 border border-red-200 text-red-700 text-xs font-bold px-3 py-2 rounded flex items-center gap-2">
                    <span>⏳</span> Vence: {formatearFecha(modulo.fecha_limite)}
                  </div>
                )}
                
                <button 
                  onClick={() => navigate('/modulo/' + modulo.id)}
                  className="w-full font-bold px-4 py-3 rounded-md transition mt-auto bg-blue-600 text-white hover:bg-blue-700 shadow-sm flex justify-center items-center gap-2"
                >
                  {modulo.estado === 'APROBADO' ? 'Repasar Módulo 🔄' : 'Ir a Capacitación ▶️'}
                </button>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default Dashboard;