import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

function Login() {
  const [cedula, setCedula] = useState('');
  const [password, setPassword] = useState('');
  const [alerta, setAlerta] = useState(null);
  const navigate = useNavigate();

  const iniciarSesion = async (e) => {
    e.preventDefault();
    setAlerta(null);
    
    try {
      const respuesta = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cedula, password })
      });
      
      const datos = await respuesta.json();
      
      if (respuesta.ok) {
        setAlerta({ tipo: 'exito', texto: `¡Bienvenido ${datos.usuario.nombre}! Identificando perfil...` });
        
        // Guardamos TODA la información vital en la memoria (incluyendo el ID)
        localStorage.setItem('token_hseq', datos.token);
        localStorage.setItem('nombre_hseq', datos.usuario.nombre);
        localStorage.setItem('id_hseq', datos.usuario.id); // <-- ¡LÍNEA AÑADIDA PARA SOLUCIONAR EL ERROR!
        
        // Capturamos el rol (si por alguna razón no viene, asumimos TRABAJADOR)
        const rolUsuario = datos.usuario.rol || 'TRABAJADOR';
        localStorage.setItem('rol_hseq', rolUsuario);
        
        // El semáforo: Si es ADMIN va al panel, si no, va a los cursos
        setTimeout(() => {
          if (rolUsuario === 'ADMIN') {
            navigate('/admin');
          } else {
            navigate('/');
          }
        }, 1500);

      } else {
        setAlerta({ tipo: 'error', texto: datos.error });
      }
    } catch (error) {
      setAlerta({ tipo: 'error', texto: 'No se pudo conectar con el servidor de seguridad.' });
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <header className="bg-white w-full py-4 px-8 shadow-sm flex items-center justify-between border-b">
        <div>
          <div className="text-blue-600 font-bold text-xl flex items-center gap-3">
            <span className="text-2xl">⚓</span> Astilleros Escamilla
          </div>
          <span className="text-gray-400 text-sm">Plataforma de Capacitación HSEQ</span>
        </div>
        <Link to="/" className="text-blue-600 hover:underline text-sm font-semibold">
          Volver al Inicio
        </Link>
      </header>

      <main className="flex-grow flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md border-t-4 border-blue-600">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Acceso al Sistema</h2>
            <p className="text-gray-500 text-sm mt-1">Ingresa tus credenciales para continuar</p>
          </div>
          
          {alerta && (
            <div className={`p-3 mb-4 rounded text-sm font-semibold text-center ${alerta.tipo === 'exito' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {alerta.texto}
            </div>
          )}

          <form onSubmit={iniciarSesion} className="flex flex-col gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 text-left">Número de Identificación</label>
              <input 
                type="text" 
                value={cedula}
                onChange={(e) => setCedula(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-600 transition"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 text-left">Contraseña</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-600 transition"
                required
              />
            </div>
            <button 
              type="submit" 
              className="w-full bg-blue-600 text-white font-bold px-6 py-3 rounded hover:bg-blue-800 transition duration-300 shadow-md"
            >
              Ingresar
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}

export default Login;