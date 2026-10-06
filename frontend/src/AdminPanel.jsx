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
      setTrabajadores(datos);
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
      const respuesta = await fetch(`http://localhost:3000/api/admin/matriculas/${trabajadorSeleccionado.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          modulos: modulosAsignados, 
          fecha_limite: fechaLimite || null
        })
      });

      const datos = await respuesta.json();
      if (!respuesta.ok) throw new Error(datos.error || 'Error al guardar');

      alert("Matrícula corporativa guardada con éxito.");
      setTrabajadorSeleccionado(null); 
    } catch (error) {
      alert("Error: " + error.message);
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
      alert("Error en base de datos");
    }
  };

  const confirmarEliminacion = async () => {
    try {
      await fetch(`http://localhost:3000/api/admin/usuarios/${trabajadorSeleccionado.id}`, { method: 'DELETE' });
      await cargarTrabajadores();
      setModalActivo(null);
      setTrabajadorSeleccionado(null);
    } catch (error) {
      alert("Error al eliminar");
    }
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
        <div className="flex gap-4">
          <Link className="text-gray-300 font-semibold hover:text-white transition uppercase tracking-wide text-sm border-b-2 border-transparent hover:border-emerald-500 pb-1" to="/">
            Volver al Dashboard
          </Link>
        </div>
      </header>

      <main className="flex-grow p-8 max-w-7xl mx-auto w-full mt-2 flex gap-8">
        <div className="w-2/3 bg-white p-6 rounded-xl shadow border border-gray-200 flex flex-col">
          <div className="flex justify-between items-center mb-6 border-b pb-4">
            <h2 className="text-2xl font-bold text-[#111828] uppercase tracking-wide text-sm">Directorio HSEQ</h2>
            <button onClick={abrirModalCrear} className="bg-emerald-600 text-white font-bold py-2.5 px-5 rounded text-sm hover:bg-emerald-700 transition shadow uppercase tracking-wide flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
              Nuevo Trabajador
            </button>
          </div>
          
          <div className="overflow-x-auto flex-grow">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-700 text-xs uppercase tracking-wider">
                  <th className="p-4 font-bold rounded-tl">Identificación</th>
                  <th className="p-4 font-bold">Colaborador / Cargo</th>
                  <th className="p-4 font-bold text-center rounded-tr">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {trabajadores.map((t) => (
                  <tr key={t.id} className="border-b border-gray-100 hover:bg-slate-50 transition">
                    <td className="p-4 font-mono text-sm text-gray-600">{t.cedula}</td>
                    <td className="p-4">
                      <div className="font-bold text-[#111828]">{t.nombre}</div>
                      <div className="text-xs text-emerald-700 font-semibold uppercase tracking-wide">{t.cargo}</div>
                    </td>
                    <td className="p-4 flex justify-center gap-3">
                      <button onClick={() => seleccionarParaMatricula(t)} title="Matricular" className="text-slate-400 hover:text-[#111828] transition bg-slate-100 hover:bg-slate-200 p-2 rounded">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5" /></svg>
                      </button>
                      <button onClick={() => abrirModalEditar(t)} title="Editar" className="text-slate-400 hover:text-amber-600 transition bg-slate-100 hover:bg-amber-50 p-2 rounded">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" /></svg>
                      </button>
                      <button onClick={() => abrirModalEliminar(t)} title="Dar de Baja" className="text-slate-400 hover:text-red-600 transition bg-slate-100 hover:bg-red-50 p-2 rounded">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" /></svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="w-1/3 bg-white p-6 rounded-xl shadow border border-gray-200">
          {trabajadorSeleccionado && modalActivo === null ? (
            <>
              <h2 className="text-lg font-bold text-[#111828] mb-2 uppercase tracking-wide">Asignación HSEQ</h2>
              <div className="mb-6 pb-4 border-b">
                <p className="text-xs text-gray-500 uppercase tracking-wide">Matriculando a:</p>
                <p className="font-bold text-emerald-700 text-lg">{trabajadorSeleccionado.nombre}</p>
              </div>
              
              <div className="flex flex-col gap-2 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {modulosDB.map((mod) => (
                  <label key={mod.id} className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-slate-50 transition border-gray-100">
                    <input 
                      type="checkbox" 
                      className="mr-3 w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500 border-gray-300" 
                      checked={modulosAsignados.includes(mod.id)}
                      onChange={() => toggleModulo(mod.id)}
                    />
                    <span className="text-sm font-semibold text-gray-700">{mod.titulo}</span>
                  </label>
                ))}
              </div>

              <div className="mt-6 p-4 bg-slate-50 border border-slate-200 rounded-lg">
                <label className="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-wide">Fecha Límite (Opcional)</label>
                <input 
                  type="date" 
                  className="w-full px-4 py-2 bg-white border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-700 text-sm"
                  value={fechaLimite}
                  onChange={(e) => setFechaLimite(e.target.value)}
                  min={new Date().toISOString().split('T')[0]} 
                />
              </div>
              
              <button 
                onClick={guardarMatricula}
                className="w-full mt-6 bg-[#111828] text-white font-bold px-4 py-3.5 rounded hover:bg-emerald-600 transition shadow uppercase tracking-wider text-sm"
              >
                Confirmar Matrícula
              </button>
            </>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-slate-300 text-center p-6">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-20 h-20 mb-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5" />
              </svg>
              <p className="text-sm font-semibold tracking-wide">SELECCIONE UN COLABORADOR PARA GESTIONAR SUS MÓDULOS</p>
            </div>
          )}
        </div>
      </main>

      {(modalActivo === 'crear' || modalActivo === 'editar') && (
        <div className="fixed inset-0 bg-[#111828]/80 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-white p-8 rounded-xl w-full max-w-md shadow-2xl border-t-4 border-emerald-600">
            <h2 className="text-xl font-bold text-[#111828] mb-6 uppercase tracking-wide border-b pb-3">
              {modalActivo === 'crear' ? 'Registrar Colaborador' : 'Actualizar Datos'}
            </h2>
            <form onSubmit={guardarTrabajador} className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wide">Identificación</label>
                <input type="text" required value={formulario.cedula} onChange={e => setFormulario({...formulario, cedula: e.target.value.replace(/\D/g, '')})} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono text-sm" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wide">Nombre Completo</label>
                <input type="text" required value={formulario.nombre} onChange={e => setFormulario({...formulario, nombre: e.target.value})} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wide">Cargo Asignado</label>
                <input type="text" required value={formulario.cargo} onChange={e => setFormulario({...formulario, cargo: e.target.value})} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm" />
              </div>
              <div className="mt-2">
                <label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wide">{modalActivo === 'crear' ? 'Contraseña Inicial' : 'Nueva Contraseña (Opcional)'}</label>
                <input type="password" required={modalActivo === 'crear'} minLength={8} value={formulario.password} onChange={e => setFormulario({...formulario, password: e.target.value})} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm tracking-widest" placeholder="••••••••" />
              </div>
              <div className="flex gap-4 mt-6">
                <button type="button" onClick={() => setModalActivo(null)} className="w-1/2 bg-slate-100 text-slate-600 font-bold py-3 rounded hover:bg-slate-200 transition text-sm uppercase tracking-wide">Cancelar</button>
                <button type="submit" className="w-1/2 bg-emerald-600 text-white font-bold py-3 rounded hover:bg-emerald-700 transition text-sm uppercase tracking-wide shadow-md">Guardar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {modalActivo === 'eliminar' && (
        <div className="fixed inset-0 bg-[#111828]/80 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-white p-8 rounded-xl w-full max-w-sm shadow-2xl text-center border-t-4 border-red-600">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16 mx-auto text-red-500 mb-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3Z" />
            </svg>
            <h2 className="text-lg font-bold text-[#111828] mb-2 uppercase tracking-wide">¿Dar de baja?</h2>
            <p className="text-gray-600 mb-8 text-sm">Eliminar a <strong className="text-[#111828]">{trabajadorSeleccionado?.nombre}</strong> es irreversible.</p>
            <div className="flex gap-4">
              <button onClick={() => setModalActivo(null)} className="w-1/2 bg-slate-100 text-slate-600 font-bold py-3 rounded hover:bg-slate-200 transition text-sm uppercase tracking-wide">Cancelar</button>
              <button onClick={confirmarEliminacion} className="w-1/2 bg-red-600 text-white font-bold py-3 rounded hover:bg-red-700 transition shadow-md text-sm uppercase tracking-wide">Eliminar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminPanel;