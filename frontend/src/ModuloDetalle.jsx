import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';

function ModuloDetalle() {
  const { id } = useParams(); // Capturamos el número del módulo de la URL
  const navigate = useNavigate();
  const [respuesta, setRespuesta] = useState('');

  const enviarEvaluacion = (e) => {
    e.preventDefault();
    if (!respuesta) {
      alert('Por favor selecciona una respuesta');
      return;
    }
    // Por ahora simulamos que aprueba y lo devolvemos al inicio
    alert('¡Test enviado con éxito! Aprobaste el módulo.');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Barra superior */}
      <header className="bg-white w-full py-4 px-8 shadow-sm flex items-center justify-between border-b">
        <div className="text-blue-600 font-bold text-xl flex items-center gap-2">
          <span className="text-2xl">⚓</span> Astilleros Escamilla
        </div>
        <Link to="/" className="text-gray-500 hover:text-blue-600 font-semibold text-sm transition">
          Volver a la Ruta
        </Link>
      </header>

      <main className="flex-grow p-8 max-w-4xl mx-auto w-full mt-4">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Módulo {id}: Capacitación en Curso</h1>
        
        {/* Sección del Video */}
        <div className="bg-black w-full aspect-video rounded-xl shadow-lg flex items-center justify-center mb-8 relative overflow-hidden border-4 border-gray-800">
          <div className="text-white text-center z-10">
            <span className="text-5xl block mb-4">▶️</span>
            <p className="font-semibold text-lg">Video de Inducción Corporativa</p>
            <p className="text-gray-400 text-sm mt-2">Duración: 15:00 min</p>
          </div>
          {/* Fondo simulando el video */}
          <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=1000&auto=format&fit=crop')] bg-cover bg-center"></div>
        </div>

        {/* Sección de la Evaluación */}
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <span>📝</span> Evaluación de Conocimientos
          </h2>
          <p className="text-gray-600 mb-6 pb-4 border-b border-gray-100">
            Responde la siguiente pregunta de control para aprobar este módulo y desbloquear el siguiente.
          </p>

          <form onSubmit={enviarEvaluacion}>
            <div className="mb-6">
              <p className="font-semibold text-gray-800 mb-4">1. ¿Cuál es el principal objetivo de la Seguridad y Salud en el Trabajo (SST) en el astillero?</p>
              
              <div className="flex flex-col gap-3">
                <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-blue-50 transition">
                  <input type="radio" name="pregunta1" value="a" onChange={() => setRespuesta('a')} className="mr-3 w-5 h-5 text-blue-600" />
                  Prevenir accidentes y enfermedades laborales en nuestras instalaciones.
                </label>
                <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-blue-50 transition">
                  <input type="radio" name="pregunta1" value="b" onChange={() => setRespuesta('b')} className="mr-3 w-5 h-5 text-blue-600" />
                  Acelerar los tiempos de entrega de los buques.
                </label>
                <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-blue-50 transition">
                  <input type="radio" name="pregunta1" value="c" onChange={() => setRespuesta('c')} className="mr-3 w-5 h-5 text-blue-600" />
                  Reducir el costo de los materiales de construcción.
                </label>
              </div>
            </div>

            <button type="submit" className="w-full bg-blue-600 text-white font-bold px-6 py-3 rounded-lg hover:bg-blue-800 transition duration-300 shadow-md">
              Enviar Respuestas y Continuar
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}

export default ModuloDetalle;