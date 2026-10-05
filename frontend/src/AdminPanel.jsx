import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function AdminPanel() {
  const [trabajadores, setTrabajadores] = useState([]);
  const [trabajadorSeleccionado, setTrabajadorSeleccionado] = useState(null);
  const [modalActivo, setModalActivo] = useState(null);
  const [formulario, setFormulario] = useState({ cedula: '', nombre: '', cargo: '', password: '' });
  
  const [modulosAsignados, setModulosAsignados] = useState([]);
  const [fechaLimite, setFechaLimite] = useState('');

  const modulosDB = [
    { id: 1, titulo: "Inducción SST" },
    { id: 2, titulo: "Espacios Confinados" },
    { id: 3, titulo: "Trabajo en Caliente" },
    { id: 4, titulo: "Trabajo en Alturas" },
    { id: 5, titulo: "Izaje de Cargas" },
    { id: 6, titulo: "Levantamiento de Cargas" },
    { id: 7, titulo: "Ergonomía y Pausas Activas" },
    { id: 8, titulo: "Plan de Emergencias" },
    { id: 9, titulo: "Primeros Auxilios" },
    { id: 10, titulo: "Brigadista Integral" }
  ];

  const cargarTrabajadores = async () => {
    try {
      const respuesta = await fetch('http://localhost:3000/api/admin/usuarios');
      const datos = await respuesta.json();
      const datosConProgreso = datos.map(t => ({ ...t, progreso: "0%" }));
      setTrabajadores(datosConProgreso);
    } catch (error) {
      console.error("Error cargando personal:", error);
    }
  };

  useEffect(() => {
    cargarTrabajadores();
  }, []);

  const seleccionarParaMatricula = async (t) => {
    setTrabajadorSeleccionado(t);
    setModalActivo(null); 
    setFechaLimite(''); 
    try {
      const respuesta = await fetch(`http://localhost:3000/api/admin/matriculas/${t.id}`);
      const asignados = await respuesta.json();
      setModulosAsignados(asignados); 
    } catch (error) {
      console.error("Error cargando matrícula:", error);
    }
  };

  const toggleModulo = (moduloId) => {
    if (modulosAsignados.includes(moduloId)) {
      setModulosAsignados(modulosAsignados.filter(id => id !== moduloId)); 
    } else {
      setModulosAsignados([...modulosAsignados, moduloId]); 
    }
  };

  const guardarMatricula = async () => {
    try {
      await fetch(`http://localhost:3000/api/admin/matriculas/${trabajadorSeleccionado.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ modulos: modulosAsignados, fecha_limite: fechaLimite }) 
      });
      alert("✅ ¡Matrícula guardada exitosamente en la base de datos!");
    } catch (error) {
      alert("❌ Error al guardar matrícula");
    }
  };

  const abrirModalCrear = () => {
    setFormulario({ cedula: '', nombre: '', cargo: '', password: '' });
    setModalActivo('crear');
  };

  const abrirModalEditar = (t) => {
    setFormulario({ cedula: t.cedula, nombre: t.nombre, cargo: t.cargo, password: '' });
    setTrabajadorSeleccionado(t);
    setModalActivo('editar');
  };

  const abrirModalEliminar = (t) => {
    setTrabajadorSeleccionado(t);
    setModalActivo('eliminar');
  };

  const guardarTrabajador = async (e) => {
    e.preventDefault();
    try {
      if (modalActivo === 'crear') {
        await fetch('http://localhost:3000/api/admin/usuarios', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formulario)
        });
      } else if (modalActivo === 'editar') {
        await fetch(`http://localhost:3000/api/admin/usuarios/${trabajadorSeleccionado.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formulario)
        });
      }
      await cargarTrabajadores(); 
      setModalActivo(null);
    } catch (error) {
      alert("Error al guardar en la base de datos");
    }
  };

  const confirmarEliminacion = async () => {
    try {
      await fetch(`http://localhost:3000/api/admin/usuarios/${trabajadorSeleccionado.id}`, { method: 'DELETE' });
      await cargarTrabajadores();
      setModalActivo(null);
      setTrabajadorSeleccionado(null);
    } catch (error) {
      alert("Error al eliminar de la base de datos");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col relative">
      <header className="bg-gray-900 text-white w-full py-4 px-8 shadow-md flex items-center justify-between z-10">
        <div>
          <div className="font-bold text-xl flex items-center gap-2">
            <span className="text-2xl">⚙️️</span> Panel Administrativo HSEQ
          </div>
          <span className="text-gray-400 text-sm">Astilleros Escamilla - Gestión de Personal y Capacitaciones</span>
        </div>
        <div className="flex gap-4">
          <Link className="border border-gray-600 text-gray-300 font-semibold px-4 py-2 rounded-md hover:bg-gray-800 transition text-sm" to="/">
            Ver Vista de Trabajador
          </Link>
        </div>
      </header>

      <main className="flex-grow p-8 max-w-7xl mx-auto w-full mt-2 flex gap-8">
        <div className="w-2/3 bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Directorio de Personal</h2>
            <button onClick={abrirModalCrear} className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition shadow-sm flex items-center gap-2">
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
                {trabajadores.length === 0 ? (
                  <tr><td colSpan="3" className="text-center p-6 text-gray-500">No hay trabajadores registrados. Usa el botón azul para agregar uno.</td></tr>
                ) : (
                  trabajadores.map((t) => (
                    <tr key={t.id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                      <td className="p-4 font-mono text-sm text-gray-600">{t.cedula}</td>
                      <td className="p-4">
                        <div className="font-bold text-gray-800">{t.nombre}</div>
                        <div className="text-xs text-gray-500">{t.cargo}</div>
                      </td>
                      <td className="p-4 flex justify-center gap-2">
                        <button onClick={() => seleccionarParaMatricula(t)} title="Asignar Módulos" className="bg-blue-100 text-blue-700 p-2 rounded hover:bg-blue-200 transition">📘</button>
                        <button onClick={() => abrirModalEditar(t)} title="Editar o Cambiar Contraseña" className="bg-yellow-100 text-yellow-700 p-2 rounded hover:bg-yellow-200 transition">✏️</button>
                        <button onClick={() => abrirModalEliminar(t)} title="Dar de Baja" className="bg-red-100 text-red-700 p-2 rounded hover:bg-red-200 transition">🗑️</button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="w-1/3 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          {trabajadorSeleccionado && modalActivo === null ? (
            <>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Asignar Módulos</h2>
              <p className="text-sm text-gray-500 mb-6 pb-4 border-b">
                Matriculando a: <br/><span className="font-bold text-blue-600 text-base">{trabajadorSeleccionado.nombre}</span>
              </p>
              
              <div className="flex flex-col gap-3 max-h-[400px] overflow-y-auto pr-2">
                {modulosDB.map((mod) => (
                  <label key={mod.id} className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-blue-50 transition">
                    <input 
                      type="checkbox" 
                      className="mr-3 w-5 h-5 text-blue-600 rounded" 
                      checked={modulosAsignados.includes(mod.id)}
                      onChange={() => toggleModulo(mod.id)}
                    />
                    <span className="text-sm font-semibold text-gray-700">{mod.titulo}</span>
                  </label>
                ))}
              </div>

              <div className="mt-4 p-4 bg-gray-50 border rounded-lg">
                <label className="block text-sm font-bold text-gray-700 mb-2">📅 Fecha Límite de Finalización</label>
                <input 
                  type="date" 
                  className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-blue-600 text-gray-700"
                  value={fechaLimite}
                  onChange={(e) => setFechaLimite(e.target.value)}
                />
                <p className="text-xs text-gray-500 mt-1">Opcional. Deja vacío si no hay límite de tiempo.</p>
              </div>
              
              <button 
                onClick={guardarMatricula}
                className="w-full mt-6 bg-green-600 text-white font-bold px-4 py-3 rounded-lg hover:bg-green-700 transition shadow-md"
              >
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

      {(modalActivo === 'crear' || modalActivo === 'editar') && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-xl w-full max-w-md shadow-2xl">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              {modalActivo === 'crear' ? 'Registrar Nuevo Trabajador' : 'Editar Datos / Contraseña'}
            </h2>
            <form onSubmit={guardarTrabajador} className="flex flex-col gap-4">
              <div><label className="block text-sm font-bold text-gray-700 mb-1">Cédula</label><input type="text" required value={formulario.cedula} onChange={e => setFormulario({...formulario, cedula: e.target.value})} className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-blue-600" /></div>
              <div><label className="block text-sm font-bold text-gray-700 mb-1">Nombre Completo</label><input type="text" required value={formulario.nombre} onChange={e => setFormulario({...formulario, nombre: e.target.value})} className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-blue-600" /></div>
              <div><label className="block text-sm font-bold text-gray-700 mb-1">Cargo</label><input type="text" required value={formulario.cargo} onChange={e => setFormulario({...formulario, cargo: e.target.value})} className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-blue-600" /></div>
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <label className="block text-sm font-bold text-gray-700 mb-1">{modalActivo === 'crear' ? 'Contraseña Inicial' : 'Nueva Contraseña (Dejar vacío para no cambiar)'}</label>
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

      {modalActivo === 'eliminar' && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-xl w-full max-w-sm shadow-2xl text-center">
            <div className="text-5xl mb-4">⚠️</div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">¿Dar de baja al trabajador?</h2>
            <p className="text-gray-600 mb-6 text-sm">Estás a punto de eliminar a <span className="font-bold">{trabajadorSeleccionado?.nombre}</span> del sistema. Esta acción no se puede deshacer.</p>
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