import { useState } from 'react';
import { Link } from 'react-router-dom';

function AdminPanel() {
  // Estado visual de los trabajadores (luego lo conectaremos a PostgreSQL)
  const [trabajadores, setTrabajadores] = useState([
    { id: 1, cedula: "1047387433", nombre: "Juan Sebastián Lopez", cargo: "Administrador HSEQ", progreso: "100%" },
    { id: 2, cedula: "1045678912", nombre: "Carlos Perez", cargo: "Operario de Grúa", progreso: "20%" },
    { id: 3, cedula: "1098765432", nombre: "Ana Gómez", cargo: "Soldador", progreso: "0%" },
  ]);

  const [trabajadorSeleccionado, setTrabajadorSeleccionado] = useState(null);
  
  // Controladores de Ventanas Flotantes (Modales)
  const [modalActivo, setModalActivo] = useState(null); // 'crear', 'editar', 'eliminar', o null
  const [formulario, setFormulario] = useState({ cedula: '', nombre: '', cargo: '', password: '' });

  const modulos = [
    "Inducción SST", "Espacios Confinados", "Trabajo en Caliente", 
    "Trabajo en Alturas", "Izaje de Cargas", "Levantamiento de Cargas", 
    "Ergonomía", "Plan de Emergencias", "Primeros Auxilios", "Brigadista"
  ];

  // --- FUNCIONES VISUALES (Simulación antes de conectar a BD) ---
  const abrirModalCrear = () => {
    setFormulario({ cedula: '', nombre: '', cargo: '', password: '' });
    setModalActivo('crear');
  };

  const abrirModalEditar = (t) => {
    setFormulario({ cedula: t.cedula, nombre: t.nombre, cargo: t.cargo, password: '' }); // Password vacío para que solo se cambie si escriben algo
    setTrabajadorSeleccionado(t);
    setModalActivo('editar');
  };

  const abrirModalEliminar = (t) => {
    setTrabajadorSeleccionado(t);
    setModalActivo('eliminar');
  };

  const guardarTrabajador = (e) => {
    e.preventDefault();
    if (modalActivo === 'crear') {
      const nuevo = { ...formulario, id: Date.now(), progreso: "0%" };
      setTrabajadores([...trabajadores, nuevo]);
    } else if (modalActivo === 'editar') {
      setTrabajadores(trabajadores.map(t => t.id === trabajadorSeleccionado.id ? { ...t, ...formulario } : t));
    }
    setModalActivo(null);
  };

  const confirmarEliminacion = () => {
    setTrabajadores(trabajadores.filter(t => t.id !== trabajadorSeleccionado.id));
    setModalActivo(null);
    setTrabajadorSeleccionado(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col relative">
      {/* Barra superior modo ADMIN */}
      <header className="bg-gray-900 text-white w-full py-4 px-8 shadow-md flex items-center justify-between z-10">
        <div>
          <div className="font-bold text-xl flex items-center gap-2">
            <span className="text-2xl">⚙️</span> Panel Administrativo HSEQ
          </div>
          <span className="text-gray-400 text-sm">Astilleros Escamilla - Gestión de Personal y Capacitaciones</span>
        </div>
        <div className="flex gap-4">
          <Link to="/" className="border border-gray-600 text-gray-300 font-semibold px-4 py-2 rounded-md hover:bg-gray-800 transition text-sm">
            Ver Vista de Trabajador
          </Link>
        </div>
      </header>

      <main className="flex-grow p-8 max-w-7xl mx-auto w-full mt-2 flex gap-8">
        
        {/* COLUMNA IZQUIERDA: Tabla de Trabajadores */}
        <div className="w-2/3 bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Directorio de Personal</h2>
            <button 
              onClick={abrirModalCrear}
              className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition shadow-sm flex items-center gap-2"
            >
              <span>➕</span> Nuevo Trabajador
            </button>
          </div>
          
          <div className="overflow-x-auto flex-grow">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-100 text-gray-700 text-sm uppercase">
                  <th className="p-4 rounded-tl-lg">Cédula</th>
                  <th className="p-4">Nombre / Cargo</th>
                  <th className="p-4 text-center">Gestión</th>
                </tr>
              </thead>
              <tbody>
                {trabajadores.map((t) => (
                  <tr key={t.id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                    <td className="p-4 font-mono text-sm text-gray-600">{t.cedula}</td>
                    <td className="p-4">
                      <div className="font-bold text-gray-800">{t.nombre}</div>
                      <div className="text-xs text-gray-500">{t.cargo}</div>
                    </td>
                    <td className="p-4 flex justify-center gap-2">
                      {/* Botón Asignar Cursos */}
                      <button 
                        onClick={() => setTrabajadorSeleccionado(t)}
                        title="Asignar Módulos"
                        className="bg-blue-100 text-blue-700 p-2 rounded hover:bg-blue-200 transition"
                      >
                        📘
                      </button>
                      {/* Botón Editar / Contraseña */}
                      <button 
                        onClick={() => abrirModalEditar(t)}
                        title="Editar o Cambiar Contraseña"
                        className="bg-yellow-100 text-yellow-700 p-2 rounded hover:bg-yellow-200 transition"
                      >
                        ✏️
                      </button>
                      {/* Botón Eliminar */}
                      <button 
                        onClick={() => abrirModalEliminar(t)}
                        title="Dar de Baja"
                        className="bg-red-100 text-red-700 p-2 rounded hover:bg-red-200 transition"
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* COLUMNA DERECHA: Panel de Asignación de Cursos */}
        <div className="w-1/3 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          {trabajadorSeleccionado && modalActivo === null ? (
            <>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Asignar Módulos</h2>
              <p className="text-sm text-gray-500 mb-6 pb-4 border-b">
                Matriculando a: <br/><span className="font-bold text-blue-600 text-base">{trabajadorSeleccionado.nombre}</span>
              </p>
              
              <div className="flex flex-col gap-3 max-h-[400px] overflow-y-auto pr-2">
                {modulos.map((mod, i) => (
                  <label key={i} className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-blue-50 transition">
                    <input type="checkbox" className="mr-3 w-5 h-5 text-blue-600 rounded" defaultChecked={i === 0} />
                    <span className="text-sm font-semibold text-gray-700">{mod}</span>
                  </label>
                ))}
              </div>
              
              <button className="w-full mt-6 bg-green-600 text-white font-bold px-4 py-3 rounded-lg hover:bg-green-700 transition shadow-md">
                Guardar Matrícula
              </button>
            </>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-gray-400 text-center">
              <span className="text-5xl mb-4">⚙️</span>
              <p>Selecciona el ícono del libro (📘) en la tabla para asignarle cursos a un trabajador.</p>
            </div>
          )}
        </div>

      </main>

      {/* --- VENTANAS FLOTANTES (MODALES) --- */}
      
      {/* Modal Crear / Editar */}
      {(modalActivo === 'crear' || modalActivo === 'editar') && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-xl w-full max-w-md shadow-2xl">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              {modalActivo === 'crear' ? 'Registrar Nuevo Trabajador' : 'Editar Datos / Contraseña'}
            </h2>
            <form onSubmit={guardarTrabajador} className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Cédula</label>
                <input type="text" required value={formulario.cedula} onChange={e => setFormulario({...formulario, cedula: e.target.value})} className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-blue-600" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Nombre Completo</label>
                <input type="text" required value={formulario.nombre} onChange={e => setFormulario({...formulario, nombre: e.target.value})} className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-blue-600" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Cargo (Ej: Soldador, Supervisor)</label>
                <input type="text" required value={formulario.cargo} onChange={e => setFormulario({...formulario, cargo: e.target.value})} className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-blue-600" />
              </div>
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <label className="block text-sm font-bold text-gray-700 mb-1">
                  {modalActivo === 'crear' ? 'Contraseña Inicial' : 'Nueva Contraseña (Dejar vacío para no cambiar)'}
                </label>
                <input type="password" required={modalActivo === 'crear'} value={formulario.password} onChange={e => setFormulario({...formulario, password: e.target.value})} className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-yellow-600" placeholder="••••••••" />
              </div>
              <div className="flex gap-4 mt-4">
                <button type="button" onClick={() => setModalActivo(null)} className="w-1/2 bg-gray-200 text-gray-800 font-bold py-2 rounded hover:bg-gray-300">Cancelar</button>
                <button type="submit" className="w-1/2 bg-blue-600 text-white font-bold py-2 rounded hover:bg-blue-700">Guardar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Eliminar */}
      {modalActivo === 'eliminar' && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-xl w-full max-w-sm shadow-2xl text-center">
            <div className="text-5xl mb-4">⚠️</div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">¿Dar de baja al trabajador?</h2>
            <p className="text-gray-600 mb-6 text-sm">
              Estás a punto de eliminar a <span className="font-bold">{trabajadorSeleccionado?.nombre}</span> del sistema. Perderá el acceso y su progreso en los módulos. Esta acción no se puede deshacer.
            </p>
            <div className="flex gap-4">
              <button onClick={() => setModalActivo(null)} className="w-1/2 bg-gray-200 text-gray-800 font-bold py-2 rounded hover:bg-gray-300">Cancelar</button>
              <button onClick={confirmarEliminacion} className="w-1/2 bg-red-600 text-white font-bold py-2 rounded hover:bg-red-700">Sí, Eliminar</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default AdminPanel;