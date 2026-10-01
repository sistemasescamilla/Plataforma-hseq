const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken'); // La librería para crear el "carnet" digital
const pool = require('../database');
const router = express.Router();

// ==========================================
// RUTA 1: REGISTRAR UN TRABAJADOR NUEVO
// ==========================================
router.post('/registro', async (req, res) => {
    const { cedula, nombre, password } = req.body;

    try {
        const usuarioExistente = await pool.query('SELECT * FROM usuarios WHERE cedula = $1', [cedula]);
        if (usuarioExistente.rows.length > 0) {
            return res.status(400).json({ error: 'Este número de identificación ya está registrado en el sistema.' });
        }

        const salt = await bcrypt.genSalt(10);
        const passwordEncriptada = await bcrypt.hash(password, salt);

        const nuevoUsuario = await pool.query(
            'INSERT INTO usuarios (cedula, nombre, password) VALUES ($1, $2, $3) RETURNING id, cedula, nombre, rol, estado',
            [cedula, nombre, passwordEncriptada]
        );

        res.json({ 
            mensaje: 'Trabajador registrado exitosamente', 
            usuario: nuevoUsuario.rows[0] 
        });

    } catch (error) {
        console.error('Error en registro:', error);
        res.status(500).json({ error: 'Hubo un error al registrar el usuario.' });
    }
});

// ==========================================
// RUTA 2: INICIAR SESIÓN (LOGIN)
// ==========================================
router.post('/login', async (req, res) => {
    const { cedula, password } = req.body;

    try {
        // 1. Buscar si la cédula existe en la base de datos
        const resultado = await pool.query('SELECT * FROM usuarios WHERE cedula = $1', [cedula]);
        if (resultado.rows.length === 0) {
            return res.status(401).json({ error: 'Cédula o contraseña incorrecta.' });
        }

        const usuario = resultado.rows[0];

        // 2. Comparar la contraseña ingresada con la encriptada
        const passwordValida = await bcrypt.compare(password, usuario.password);
        if (!passwordValida) {
            return res.status(401).json({ error: 'Cédula o contraseña incorrecta.' });
        }

        // 3. Generar el Token de acceso usando tu JWT_SECRET
        const token = jwt.sign(
            { id: usuario.id, rol: usuario.rol, estado: usuario.estado },
            process.env.JWT_SECRET,
            { expiresIn: '8h' } // El acceso expira en 8 horas (una jornada laboral)
        );

        res.json({
            mensaje: 'Inicio de sesión exitoso',
            token: token,
            usuario: { id: usuario.id, nombre: usuario.nombre, rol: usuario.rol }
        });

    } catch (error) {
        console.error('Error en login:', error);
        res.status(500).json({ error: 'Error del servidor al intentar iniciar sesión.' });
    }
});

module.exports = router;