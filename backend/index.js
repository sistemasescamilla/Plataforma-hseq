const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// ==========================================
// 1. LOGIN
// ==========================================
app.post('/api/auth/login', async (req, res) => {
  const cedulaRecibida = req.body.cedula || req.body.identificacion;
  const passwordRecibida = req.body.password;

  try {
    const result = await pool.query('SELECT * FROM usuarios WHERE cedula = $1', [cedulaRecibida]);
    
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Cédula o contraseña incorrecta' });
    }
    
    const usuario = result.rows[0];
    const passwordValida = await bcrypt.compare(passwordRecibida, usuario.password);
    
    if (!passwordValida) {
      return res.status(401).json({ error: 'Cédula o contraseña incorrecta' });
    }
    
    res.json({
      mensaje: 'Login exitoso',
      usuario: { id: usuario.id, nombre: usuario.nombre, rol: usuario.rol },
      token: 'token_seguro_123'
    });
  } catch (error) {
    console.error("Error login:", error);
    res.status(500).json({ error: error.message });
  }
});

// ==========================================
// 2. PANEL ADMINISTRATIVO (CRUD USUARIOS)
// ==========================================
app.get('/api/admin/usuarios', async (req, res) => {
  try {
    const result = await pool.query("SELECT id, cedula, nombre, rol as cargo FROM usuarios WHERE rol != 'ADMIN' ORDER BY id DESC");
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/admin/usuarios', async (req, res) => {
  try {
    const { cedula, nombre, cargo, password } = req.body;
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    
    await pool.query(
      "INSERT INTO usuarios (cedula, nombre, password, rol, estado) VALUES ($1, $2, $3, $4, 'ACTIVO')",
      [cedula, nombre, passwordHash, cargo]
    );
    res.json({ mensaje: "Trabajador creado exitosamente" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/admin/usuarios/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { cedula, nombre, cargo, password } = req.body;
    
    if (password) {
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(password, salt);
      await pool.query(
        "UPDATE usuarios SET cedula = $1, nombre = $2, rol = $3, password = $4 WHERE id = $5",
        [cedula, nombre, cargo, passwordHash, id]
      );
    } else {
      await pool.query(
        "UPDATE usuarios SET cedula = $1, nombre = $2, rol = $3 WHERE id = $4",
        [cedula, nombre, cargo, id]
      );
    }
    res.json({ mensaje: "Trabajador actualizado" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/admin/usuarios/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM usuarios WHERE id = $1", [id]);
    res.json({ mensaje: "Trabajador eliminado" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==========================================
// 3. MATRÍCULAS CON FECHAS INDIVIDUALES
// ==========================================
app.get('/api/admin/matriculas/:usuario_id', async (req, res) => {
  try {
    const { usuario_id } = req.params;
    const result = await pool.query(
      "SELECT modulo_id, fecha_limite FROM progresos WHERE usuario_id = $1", 
      [usuario_id]
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/admin/matriculas/:usuario_id', async (req, res) => {
  try {
    const { usuario_id } = req.params;
    const items = req.body.matriculas || [];
    
    // Normalizar a lista de { modulo_id, fecha_limite }
    const listaNormalizada = items.map(item => ({
      modulo_id: parseInt(item.modulo_id),
      fecha_limite: item.fecha_limite || null
    })).filter(item => !isNaN(item.modulo_id));

    const nuevosIds = listaNormalizada.map(x => x.modulo_id);

    await pool.query('BEGIN');
    
    // 1. Eliminar de raíz los módulos que el admin desmarcó
    if (nuevosIds.length === 0) {
      await pool.query("DELETE FROM progresos WHERE usuario_id = $1", [usuario_id]);
    } else {
      await pool.query(
        "DELETE FROM progresos WHERE usuario_id = $1 AND NOT (modulo_id = ANY($2::int[]))",
        [usuario_id, nuevosIds]
      );
    }

    // 2. Insertar nuevos o actualizar fechas de los que quedan
    for (const item of listaNormalizada) {
      const existe = await pool.query(
        "SELECT id FROM progresos WHERE usuario_id = $1 AND modulo_id = $2",
        [usuario_id, item.modulo_id]
      );

      if (existe.rows.length > 0) {
        await pool.query(
          "UPDATE progresos SET fecha_limite = $1 WHERE usuario_id = $2 AND modulo_id = $3",
          [item.fecha_limite, usuario_id, item.modulo_id]
        );
      } else {
        await pool.query(
          "INSERT INTO progresos (usuario_id, modulo_id, estado, fecha_limite, intentos, calificacion) VALUES ($1, $2, 'EN_CURSO', $3, 0, 0)",
          [usuario_id, item.modulo_id, item.fecha_limite]
        );
      }
    }

    await pool.query('COMMIT');
    res.json({ mensaje: "Matrícula actualizada exitosamente" });
  } catch (error) {
    await pool.query('ROLLBACK');
    console.error("Error guardando matrícula:", error);
    res.status(500).json({ error: error.message });
  }
});

// ==========================================
// 4. RUTAS DEL TRABAJADOR (DASHBOARD)
// ==========================================
app.get('/api/usuario/:id/modulos', async (req, res) => {
  try {
    const { id } = req.params;
    const query = `
      SELECT m.id, m.titulo, m.descripcion, p.estado, p.calificacion, p.fecha_limite 
      FROM progresos p
      JOIN modulos m ON p.modulo_id = m.id
      WHERE p.usuario_id = $1
      ORDER BY m.id ASC
    `;
    const result = await pool.query(query, [id]);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==========================================
// 5. EVALUACIONES
// ==========================================
app.post('/api/usuario/:usuario_id/modulo/:modulo_id/evaluar', async (req, res) => {
  try {
    const { usuario_id, modulo_id } = req.params;
    const { calificacion } = req.body;
    const estadoNuevo = calificacion >= 80 ? 'APROBADO' : 'EN_CURSO';
    
    const query = `
      UPDATE progresos 
      SET calificacion = $1, 
          estado = $2, 
          intentos = COALESCE(intentos, 0) + 1,
          fecha_aprobacion = CASE WHEN $2 = 'APROBADO' THEN CURRENT_TIMESTAMP ELSE fecha_aprobacion END
      WHERE usuario_id = $3 AND modulo_id = $4
    `;
    
    await pool.query(query, [calificacion, estadoNuevo, usuario_id, modulo_id]);
    res.json({ mensaje: 'Evaluación registrada', estado: estadoNuevo, calificacion });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});