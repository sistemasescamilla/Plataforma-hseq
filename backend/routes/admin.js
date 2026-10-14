const express = require('express');
const bcrypt = require('bcrypt'); // Necesario para encriptar claves desde el panel
const pool = require('../database');
const router = express.Router();

// ==========================================
// 1. Obtener el Directorio de Trabajadores
// ==========================================
router.get('/usuarios', async (req, res) => {
    try {
        const result = await pool.query('SELECT id, cedula, nombre, cargo, rol, estado FROM usuarios ORDER BY id DESC');
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al cargar el personal' });
    }
});

// ==========================================
// 2. Registrar un Trabajador Nuevo
// ==========================================
router.post('/usuarios', async (req, res) => {
    const { cedula, nombre, cargo, password } = req.body;
    
    try {
        // LÓGICA CLAVE: Separar el nivel de acceso del puesto de trabajo
        let rolFinal = 'TRABAJADOR';
        let cargoFinal = cargo;

        if (cargo === 'ADMIN') {
            rolFinal = 'ADMIN';
            cargoFinal = 'Administrador de Sistema';
        }

        const salt = await bcrypt.genSalt(10);
        const passwordEncriptada = await bcrypt.hash(password, salt);

        // Guardamos explícitamente el cargo y el rol en sus columnas correspondientes
        const result = await pool.query(
            'INSERT INTO usuarios (cedula, nombre, cargo, password, rol) VALUES ($1, $2, $3, $4, $5) RETURNING id, cedula, nombre, cargo, rol',
            [cedula, nombre, cargoFinal, passwordEncriptada, rolFinal]
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al registrar colaborador' });
    }
});

// ==========================================
// 3. Actualizar un Trabajador Existente
// ==========================================
router.put('/usuarios/:id', async (req, res) => {
    const { id } = req.params;
    const { cedula, nombre, cargo, password } = req.body;
    
    try {
        let rolFinal = 'TRABAJADOR';
        let cargoFinal = cargo;

        if (cargo === 'ADMIN') {
            rolFinal = 'ADMIN';
            cargoFinal = 'Administrador de Sistema';
        }

        if (password && password.trim() !== '') {
            // Si el administrador digitó una contraseña nueva, la encripta y la actualiza
            const salt = await bcrypt.genSalt(10);
            const passwordEncriptada = await bcrypt.hash(password, salt);
            await pool.query(
                'UPDATE usuarios SET cedula = $1, nombre = $2, cargo = $3, rol = $4, password = $5 WHERE id = $6',
                [cedula, nombre, cargoFinal, rolFinal, passwordEncriptada, id]
            );
        } else {
            // Si no digitó contraseña, actualiza los datos pero conserva la clave anterior
            await pool.query(
                'UPDATE usuarios SET cedula = $1, nombre = $2, cargo = $3, rol = $4 WHERE id = $5',
                [cedula, nombre, cargoFinal, rolFinal, id]
            );
        }
        res.json({ mensaje: 'Datos actualizados con éxito' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al actualizar colaborador' });
    }
});

// ==========================================
// 4. Dar de Baja a un Trabajador
// ==========================================
router.delete('/usuarios/:id', async (req, res) => {
    try {
        await pool.query('DELETE FROM usuarios WHERE id = $1', [req.params.id]);
        res.json({ mensaje: 'Colaborador dado de baja' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al eliminar colaborador' });
    }
});

// ==========================================
// 5. Ruta Original de Aprobación
// ==========================================
router.put('/aprobar/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query(
            "UPDATE usuarios SET estado = 'aprobado' WHERE id = $1 RETURNING id, nombre, estado",
            [id]
        );
        if (result.rows.length === 0) return res.status(404).json({ error: 'Usuario no encontrado' });
        res.json({ mensaje: 'Usuario aprobado con éxito', usuario: result.rows[0] });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

module.exports = router;