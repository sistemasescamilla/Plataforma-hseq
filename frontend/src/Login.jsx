import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

function Login() {
  const [cedula, setCedula] = useState('');
  const [password, setPassword] = useState('');
  const [alerta, setAlerta] = useState(null);
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [cargando, setCargando] = useState(false); // ESTADO DE CARGA INTEGRADO
  const navigate = useNavigate();

  const iniciarSesion = async (e) => {
    e.preventDefault();
    setAlerta(null);
    setCargando(true); // Encendemos el loader de pantalla completa
    
    try {
      const respuesta = await fetch('https://plataforma-hseq.onrender.com/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cedula, password })
      });
      
      const datos = await respuesta.json();
      
      if (respuesta.ok) {
        setAlerta({ tipo: 'exito', texto: `¡Bienvenido ${datos.usuario.nombre}! Identificando perfil...` });
        
        sessionStorage.setItem('token_hseq', datos.token);
        sessionStorage.setItem('nombre_hseq', datos.usuario.nombre);
        sessionStorage.setItem('id_hseq', datos.usuario.id); 
        
        const rolUsuario = datos.usuario.rol || 'TRABAJADOR';
        sessionStorage.setItem('rol_hseq', rolUsuario);
        
        // Dejamos el loader encendido mientras redirige para una transición fluida
        setTimeout(() => {
          if (rolUsuario === 'ADMIN') {
            navigate('/admin');
          } else {
            navigate('/');
          }
        }, 1500);

      } else {
        setAlerta({ tipo: 'error', texto: datos.error });
        setCargando(false); // Apagamos el loader si hay error de credenciales
      }
    } catch (error) {
      setAlerta({ tipo: 'error', texto: 'No se pudo conectar con el servidor.' });
      setCargando(false); // Apagamos el loader si se cae el servidor
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-100 font-sans text-gray-900 relative">
      
      {/* COMPONENTE DE CARGA (LOADER FLOTANTE) */}
      {cargando && (
        <div className="fixed inset-0 bg-[#111828]/70 flex flex-col items-center justify-center z-[100] backdrop-blur-sm transition-all">
          <div className="w-16 h-16 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-teal-400 mt-4 font-bold tracking-[0.3em] text-sm uppercase">Autenticando</p>
        </div>
      )}

      {/* HEADER CORPORATIVO */}
      <header className="bg-[#111828] w-full py-4 px-8 shadow-lg flex items-center justify-between border-b-4 border-teal-800">
        <div className="flex items-center gap-3">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-9 h-9 text-white">
            <path fillRule="evenodd" d="M11.47 2.47a.75.75 0 0 1 1.06 0l4.5 4.5a.75.75 0 0 1-1.06 1.06l-3.22-3.22V16.5a.75.75 0 0 1-1.5 0V4.81L8.03 8.03a.75.75 0 0 1-1.06-1.06l4.5-4.5ZM3 15.75a.75.75 0 0 1 .75.75v2.25a1.5 1.5 0 0 0 1.5 1.5h13.5a1.5 1.5 0 0 0 1.5-1.5V16.5a.75.75 0 0 1 1.5 0v2.25a3 3 0 0 1-3 3H5.25a3 3 0 0 1-3-3V16.5a.75.75 0 0 1 .75-.75Z" clipRule="evenodd" />
          </svg>
          <div className="leading-none">
            <div className="text-white font-bold text-xl tracking-wider">ASTILLEROS</div>
            <div className="text-teal-700 text-[11px] font-bold tracking-[0.2em] mt-1">ESCAMILLA LTDA</div>
          </div>
        </div>
        <Link to="/" className="text-gray-400 hover:text-white text-sm font-semibold transition-colors uppercase tracking-wide">
          Volver al Inicio
        </Link>
      </header>

      <main className="flex-grow flex items-center justify-center p-4">
        <div className="bg-[#111828] p-10 rounded-xl shadow-2xl w-full max-w-md border border-gray-800 border-t-4 border-t-teal-800">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-white tracking-wide uppercase">Acceso HSEQ</h2>
            <p className="text-gray-400 text-sm mt-2 tracking-wide">Ingresa tus credenciales corporativas</p>
          </div>
          
          {/* ALERTA DE ERRORES INTEGRADA */}
          {alerta && (
            <div className={`p-4 mb-6 rounded text-sm font-semibold text-center border ${alerta.tipo === 'exito' ? 'bg-teal-950/40 text-teal-400 border-teal-800' : 'bg-red-900/40 text-red-400 border-red-800'}`}>
              {alerta.texto}
            </div>
          )}

          <form onSubmit={iniciarSesion} className="flex flex-col gap-5">
            <div>
              <label className="block text-xs font-bold text-gray-300 mb-2 text-left uppercase tracking-wide">Identificación</label>
              <input 
                type="text" 
                value={cedula}
                onChange={(e) => setCedula(e.target.value.replace(/\D/g, ''))}
                className="w-full px-4 py-3 bg-gray-50 border-0 rounded focus:outline-none focus:ring-2 focus:ring-teal-700 transition font-mono text-gray-900 shadow-inner text-sm"
                placeholder="Solo números"
                required
              />
            </div>
            
            <div>
              <label className="block text-xs font-bold text-gray-300 mb-2 text-left uppercase tracking-wide">Contraseña</label>
              <div className="relative">
                <input 
                  type={mostrarPassword ? "text" : "password"} 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border-0 rounded focus:outline-none focus:ring-2 focus:ring-teal-700 transition pr-12 text-gray-900 shadow-inner tracking-widest text-sm"
                  placeholder="••••••••"
                  required
                  minLength={8}
                />
                
                <button
                  type="button"
                  onClick={() => setMostrarPassword(!mostrarPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-teal-800 focus:outline-none p-1 transition-colors"
                  title={mostrarPassword ? "Ocultar contraseña" : "Ver contraseña"}
                >
                  {mostrarPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" /></svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /></svg>
                  )}
                </button>
              </div>
            </div>

            <button 
              type="submit" 
              className="w-full bg-teal-800 text-white font-bold px-6 py-3.5 rounded hover:bg-teal-700 transition duration-300 shadow-md mt-4 tracking-wider uppercase text-sm flex justify-center items-center gap-2"
              disabled={cargando}
            >
              Iniciar Sesión
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}

export default Login;