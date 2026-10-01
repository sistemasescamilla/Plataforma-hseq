const express = require('express');
const pool = require('../database');
const router = express.Router();

// 1. Obtener todos los módulos (Para mostrarlos en la pantalla del trabajador)
router.get('/', async (req, res) => {
    try {
        const modulos = await pool.query('SELECT * FROM Modulos_SST ORDER BY id ASC');
        res.json(modulos.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al cargar los módulos' });
    }
});

// 2. Ruta auxiliar para cargar los 11 cursos iniciales rápidamente (Semilla)
router.post('/cargar-cursos', async (req, res) => {
    const cursos = [
        { titulo: 'Inducción SST', desc: 'SST para todo el personal.' },
        { titulo: 'Espacios Confinados', desc: 'Protocolos de ingreso.' },
        { titulo: 'Trabajo en Caliente', desc: 'Soldadura y oxicorte.' },
        { titulo: 'Trabajo en Alturas', desc: 'Trabajos a más de 2 metros.' },
        { titulo: 'Izaje de Cargas', desc: 'Grúas, polipastos y eslingas.' },
        { titulo: 'Levantamiento de Cargas', desc: 'Manejo manual de cargas.' },
        { titulo: 'Ergonomía y Pausas Activas', desc: 'Orientado a oficina.' },
        { titulo: 'Plan de Emergencias', desc: 'Respuesta ante incidentes.' },
        { titulo: 'Primeros Auxilios', desc: 'Atención inicial.' },
        { titulo: 'Brigadista Integral', desc: 'Formación completa.' }
    ];

    try {
        for (let curso of cursos) {
            await pool.query(
                'INSERT INTO Modulos_SST (titulo, descripcion) VALUES ($1, $2)', 
                [curso.titulo, curso.desc]
            );
        }
        res.status(201).json({ mensaje: 'Cursos de Astilleros cargados exitosamente en la base de datos.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al cargar los cursos' });
    }
});

// 3. Registrar la calificación de un trabajador al terminar una evaluación
router.post('/evaluacion', async (req, res) => {
    try {
        const { usuario_id, modulo_id, calificacion } = req.body;
        
        // El área HSEQ define que se aprueba con 80 o más.
        const estado = calificacion >= 80 ? 'completado' : 'en_curso';

        const result = await pool.query(
            `INSERT INTO Progreso (usuario_id, modulo_id, estado, calificacion) 
             VALUES ($1, $2, $3, $4) RETURNING *`,
            [usuario_id, modulo_id, estado, calificacion]
        );

        res.json({ 
            mensaje: estado === 'completado' ? '¡Módulo aprobado!' : 'Módulo reprobado, debes intentarlo de nuevo.', 
            progreso: result.rows[0] 
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al guardar la calificación' });
    }
});

module.exports = router;