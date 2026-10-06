import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Dashboard() {
  const [estaLogueado, setEstaLogueado] = useState(false);
  const [nombreUsuario, setNombreUsuario] = useState('');
  const [rolUsuario, setRolUsuario] = useState('');
  const [modulosAsignados, setModulosAsignados] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token_hseq');
    const nombre = localStorage.getItem('nombre_hseq');
    const rol = localStorage.getItem('rol_hseq');
    const idUsuario = localStorage.getItem('id_hseq');
    
    if (token) {
      setEstaLogueado(true);
      if (nombre) setNombreUsuario(nombre);
      if (rol) setRolUsuario(rol);
      if (idUsuario) cargarMisModulos(idUsuario);
    }
  }, []);

  const cargarMisModulos = async (id) => {
    try {
      const respuesta = await fetch(`http://localhost:3000/api/usuario/${id}/modulos`);
      const datos = await respuesta.json();
      setModulosAsignados(Array.isArray(datos) ? datos : []);
    } catch (error) {
      setModulosAsignados([]);
    }
  };

  const cerrarSesion = () => {
    localStorage.clear(); 
    setEstaLogueado(false);
    navigate('/login');
  };

  const formatearFecha = (fechaISO) => {
    if (!fechaISO) return null;
    const fecha = new Date(fechaISO);
    fecha.setMinutes(fecha.getMinutes() + fecha.getTimezoneOffset());
    return fecha.toLocaleDateString('es-CO');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <header className="bg-[#111828] w-full py-4 px-8 shadow-lg flex items-center justify-between border-b-4 border-emerald-600">
        <div className="flex items-center gap-3">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10 text-white">
            <path fillRule="evenodd" d="M11.47 2.47a.75.75 0 0 1 1.06 0l4.5 4.5a.75.75 0 0 1-1.06 1.06l-3.22-3.22V16.5a.75.75 0 0 1-1.5 0V4.81L8.03 8.03a.75.75 0 0 1-1.06-1.06l4.5-4.5ZM3 15.75a.75.75 0 0 1 .75.75v2.25a1.5 1.5 0 0 0 1.5 1.5h13.5a1.5 1.5 0 0 0 1.5-1.5V16.5a.75.75 0 0 1 1.5 0v2.25a3 3 0 0 1-3 3H5.25a3 3 0 0 1-3-3V16.5a.75.75 0 0 1 .75-.75Z" clipRule="evenodd" />
          </svg>
          <div className="leading-none">
            <div className="text-white font-bold text-xl tracking-wider">ASTILLEROS</div>
            <div className="text-emerald-500 text-[11px] font-bold tracking-[0.2em] mt-1">ESCAMILLA LTDA</div>
          </div>
        </div>
        
        {estaLogueado ? (
          <div className="flex items-center gap-6">
            {rolUsuario === 'ADMIN' && (
              <Link to="/admin" className="text-emerald-400 font-bold hover:text-emerald-300 transition text-sm flex items-center gap-2 tracking-wide uppercase">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M10 1a4.5 4.5 0 0 0-4.5 4.5V9H5a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2h-.5V5.5A4.5 4.5 0 0 0 10 1Zm3 8V5.5a3 3 0 1 0-6 0V9h6Z" clipRule="evenodd" /></svg>
                Panel Admin
              </Link>
            )}
            <div className="text-gray-300 text-sm hidden sm:block border-l border-gray-700 pl-6">
              Usuario: <span className="font-bold text-white">{nombreUsuario}</span>
            </div>
            <button onClick={cerrarSesion} className="text-gray-400 font-semibold hover:text-red-400 transition text-sm uppercase tracking-wide">Salir</button>
          </div>
        ) : (
          <Link to="/login" className="text-gray-300 font-semibold hover:text-white transition uppercase tracking-wide text-sm">Iniciar Sesión</Link>
        )}
      </header>

      <main className="flex-grow p-8 max-w-7xl mx-auto w-full mt-2">
        {modulosAsignados.length === 0 ? (
          <div className="bg-white p-10 rounded-xl border border-gray-200 shadow-md animate-fade-in">
            <h1 className="text-2xl font-bold text-[#111828] mb-4 flex items-center gap-3">Bienvenido a Astilleros Escamilla LTDA</h1>
            <p className="text-gray-600 text-sm leading-relaxed mb-6">
              Nos enorgullece que formes parte de nuestro equipo. Somos una empresa especializada en el <strong>diseño, construcción, mantenimiento, reparación, montaje y desguace de embarcaciones y artefactos navales</strong>, así como en estructuras para la industria de hidrocarburos y energéticos. Con más de 35 años de experiencia, operamos con los más altos estándares de calidad y tecnología.
            </p>

            <div className="bg-emerald-50 border-l-4 border-emerald-600 p-5 rounded-r-md mb-8">
              <p className="text-sm text-emerald-900 font-medium">
                En Astilleros Escamilla, <strong>tú eres el activo más importante</strong>. Por eso, tu seguridad, salud y bienestar son nuestra prioridad absoluta.
              </p>
            </div>

            <div className="space-y-6 mb-10">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1 bg-[#111828] p-6 rounded-lg shadow-inner">
                  <h3 className="text-emerald-500 font-bold uppercase tracking-wider text-sm mb-3">Misión</h3>
                  <p className="text-gray-300 text-sm italic">"Prestar servicios de Astillero con calidad, experiencia y oportunidad para solución y desarrollo de proyectos dentro de la industria naval."</p>
                </div>
                <div className="flex-1 bg-emerald-700 p-6 rounded-lg shadow-inner">
                  <h3 className="text-white font-bold uppercase tracking-wider text-sm mb-3">Visión</h3>
                  <p className="text-emerald-50 text-sm italic">"Seremos un astillero con mayor capacidad operativa, evolucionando en nuestros procesos internos, aplicando tecnologías sostenibles y sustentables."</p>
                </div>
              </div>
            </div>

            <div className="mb-10">
              <h3 className="text-lg font-bold text-[#111828] mb-6 uppercase tracking-wide border-b pb-2">Valores Corporativos</h3>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {['Seguridad', 'Calidad', 'Trabajo en Equipo', 'Integridad', 'Innovación'].map((valor, idx) => (
                  <div key={idx} className="border border-gray-200 rounded-lg p-5 text-center hover:shadow-md hover:border-emerald-500 transition-all">
                    <h4 className="font-bold text-[#111828] text-sm mb-2">{valor}</h4>
                    <div className="h-1 w-8 bg-emerald-600 mx-auto rounded"></div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-12 pt-8 border-t border-gray-200 text-center">
              <p className="text-sm font-semibold text-gray-500 bg-gray-100 inline-block px-6 py-3 rounded-md">
                Actualmente no tienes módulos de capacitación asignados. <br />
                Tu supervisor te notificará cuando debas realizar una evaluación HSEQ.
              </p>
            </div>
          </div>
        ) : (
          <>
            <div className="mb-8 border-b pb-4">
              <h1 className="text-3xl font-bold text-[#111828] mb-2">Mi Ruta de Aprendizaje</h1>
              <p className="text-gray-500 text-sm uppercase tracking-wide">Módulos de capacitación asignados para tu cargo</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {modulosAsignados.map((modulo) => (
                <div key={modulo.id} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col h-full hover:shadow-lg hover:border-emerald-500 transition-all relative group">
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-12 h-12 flex flex-shrink-0 items-center justify-center rounded-lg bg-slate-100 text-[#111828] group-hover:bg-[#111828] group-hover:text-emerald-500 transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" /></svg>
                    </div>
                    {modulo.estado === 'APROBADO' && (
                      <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full border border-emerald-200">APROBADO</span>
                    )}
                    {modulo.estado === 'EN_CURSO' && (
                      <span className="bg-slate-100 text-slate-700 text-xs font-bold px-3 py-1 rounded-full border border-slate-300">PENDIENTE</span>
                    )}
                  </div>
                  
                  <h3 className="text-lg font-bold mb-2 leading-tight text-[#111828]">
                    {modulo.titulo}
                  </h3>
                  
                  <p className="text-gray-500 text-sm mb-6 flex-grow line-clamp-2">
                    {modulo.descripcion}
                  </p>

                  {modulo.fecha_limite && modulo.estado !== 'APROBADO' && (
                    <div className="mb-5 border-l-4 border-red-500 bg-red-50 text-red-800 text-xs font-bold px-3 py-2 rounded-r flex items-center gap-2">
                      VENCE: {formatearFecha(modulo.fecha_limite)}
                    </div>
                  )}
                  
                  <button 
                    onClick={() => navigate('/modulo/' + modulo.id)}
                    className="w-full font-bold px-4 py-3 rounded text-sm transition mt-auto bg-[#111828] text-white hover:bg-emerald-600 shadow-md uppercase tracking-wide flex justify-center items-center gap-2"
                  >
                    {modulo.estado === 'APROBADO' ? 'Repasar Módulo' : 'Iniciar Capacitación'}
                  </button>
                </div>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}

export default Dashboard;