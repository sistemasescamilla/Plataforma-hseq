import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';

function Modulo() {
  const { id } = useParams(); // Atrapa el ID del módulo de la URL
  const navigate = useNavigate();
  
  const [fase, setFase] = useState('video'); // fases: 'video', 'examen', 'resultado'
  const [respuestas, setRespuestas] = useState({});
  const [notaFinal, setNotaFinal] = useState(0);
  const [aprobado, setAprobado] = useState(false);

  // Preguntas comodín para la prueba
  const preguntas = [
    { id: 1, texto: "¿Cuál es el objetivo principal de las normativas HSEQ?", opciones: ["Ahorrar dinero a la empresa", "Prevenir accidentes y enfermedades", "Trabajar más rápido", "Cumplir un requisito de papel"], correcta: 1 },
    { id: 2, texto: "¿Qué debes hacer si detectas un riesgo inminente en el astillero?", opciones: ["Ignorarlo si no es mi área", "Esperar al final del turno", "Reportarlo inmediatamente al supervisor", "Intentar arreglarlo sin herramientas"], correcta: 2 },
    { id: 3, texto: "El uso de los Elementos de Protección Personal (EPP) es:", opciones: ["Opcional según el clima", "Obligatorio en todo momento", "Solo para visitantes", "Solo cuando el jefe está mirando"], correcta: 1 }
  ];

  const manejarSeleccion = (preguntaId, indexOpcion) => {
    setRespuestas({ ...respuestas, [preguntaId]: indexOpcion });
  };

  const calificarExamen = async () => {
    let correctas = 0;
    preguntas.forEach((p) => {
      if (respuestas[p.id] === p.correcta) correctas++;
    });
    
    // Calculamos sobre 100%
    const calificacion = Math.round((correctas / preguntas.length) * 100);
    setNotaFinal(calificacion);
    setAprobado(calificacion >= 80);
    setFase('resultado');

    // Enviamos la nota al Backend
    const usuarioId = localStorage.getItem('id_hseq');
    try {
      await fetch(`http://localhost:3000/api/usuario/${usuarioId}/modulo/${id}/evaluar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ calificacion })
      });
    } catch (error) {
      console.error("Error guardando calificación", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col">
      <header className="bg-gray-800 p-4 flex justify-between items-center shadow-lg border-b border-gray-700">
        <div className="font-bold text-lg">⚓ Sala de Capacitación HSEQ</div>
        <Link to="/" className="text-gray-300 hover:text-white bg-gray-700 px-4 py-2 rounded transition">
          ❌ Salir del Módulo
        </Link>
      </header>

      <main className="flex-grow flex items-center justify-center p-6">
        <div className="bg-gray-800 p-8 rounded-xl shadow-2xl w-full max-w-4xl border border-gray-700">
          
          {/* FASE 1: VIDEO */}
          {fase === 'video' && (
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2 text-blue-400">Paso 1: Material Audiovisual</h2>
              <p className="text-gray-400 mb-6">Presta mucha atención al siguiente video. La evaluación se basará en este contenido.</p>
              
              <div className="aspect-video w-full bg-black rounded-lg overflow-hidden border border-gray-600 mb-8">
                {/* Video genérico de seguridad en el trabajo */}
                <iframe className="w-full h-full" src="https://www.youtube.com/embed/5K1DXXW2YdI" title="Video de Inducción" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
              </div>
              
              <button 
                onClick={() => setFase('examen')}
                className="bg-blue-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-blue-500 transition text-lg"
              >
                Ya vi el video, Iniciar Evaluación 📝
              </button>
            </div>
          )}

          {/* FASE 2: EXAMEN */}
          {fase === 'examen' && (
            <div>
              <h2 className="text-2xl font-bold mb-2 text-blue-400">Paso 2: Evaluación de Conocimientos</h2>
              <p className="text-gray-400 mb-6">Para aprobar este módulo, necesitas una calificación mínima del 80%.</p>
              
              <div className="flex flex-col gap-8">
                {preguntas.map((p, idx) => (
                  <div key={p.id} className="bg-gray-700 p-6 rounded-lg border border-gray-600">
                    <h3 className="font-bold text-lg mb-4">{idx + 1}. {p.texto}</h3>
                    <div className="flex flex-col gap-2">
                      {p.opciones.map((opcion, indexOpcion) => (
                        <label key={indexOpcion} className={`p-3 rounded-lg border cursor-pointer transition flex items-center gap-3 ${respuestas[p.id] === indexOpcion ? 'bg-blue-900 border-blue-400' : 'bg-gray-800 border-gray-600 hover:bg-gray-600'}`}>
                          <input 
                            type="radio" 
                            name={`pregunta_${p.id}`} 
                            className="w-5 h-5 text-blue-500 bg-gray-900 border-gray-600"
                            checked={respuestas[p.id] === indexOpcion}
                            onChange={() => manejarSeleccion(p.id, indexOpcion)}
                          />
                          <span>{opcion}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 flex justify-end">
                <button 
                  onClick={calificarExamen}
                  disabled={Object.keys(respuestas).length < preguntas.length}
                  className="bg-green-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-green-500 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Finalizar Examen y Calificar ✅
                </button>
              </div>
            </div>
          )}

          {/* FASE 3: RESULTADOS */}
          {fase === 'resultado' && (
            <div className="text-center py-10">
              <div className="text-8xl mb-6">{aprobado ? '🏆' : '⚠️'}</div>
              <h2 className={`text-4xl font-bold mb-2 ${aprobado ? 'text-green-400' : 'text-red-400'}`}>
                {aprobado ? '¡Módulo Aprobado!' : 'No alcanzaste el mínimo'}
              </h2>
              <p className="text-gray-300 text-xl mb-8">
                Tu calificación final es: <span className="font-bold text-white text-2xl">{notaFinal}%</span>
              </p>
              
              {aprobado ? (
                <button onClick={() => navigate('/')} className="bg-blue-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-blue-500">
                  Volver a mi Ruta de Aprendizaje
                </button>
              ) : (
                <div className="flex justify-center gap-4">
                  <button onClick={() => navigate('/')} className="bg-gray-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-gray-500">
                    Salir
                  </button>
                  <button onClick={() => { setFase('video'); setRespuestas({}); }} className="bg-yellow-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-yellow-500">
                    Repasar e intentar de nuevo 🔄
                  </button>
                </div>
              )}
            </div>
          )}

        </div>
      </main>
    </div>
  );
}

export default Modulo;