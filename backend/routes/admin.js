const express = require('express');
const pool = require('../database');
const router = express.Router();

// Ruta para que HSEQ apruebe a un trabajador
router.put('/aprobar/:id', async (req, res) => {
    try {
        const { id } = req.params;
        
        // Actualizamos el estado en la base de datos
        const result = await pool.query(
            "UPDATE Usuarios SET estado = 'aprobado' WHERE id = $1 RETURNING id, nombre, estado",
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        res.json({ 
            mensaje: 'Usuario aprobado con éxito', 
            usuario: result.rows[0] 
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

module.exports = router;