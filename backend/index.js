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
// 1. LOGIN A PRUEBA DE FALLOS CON DIAGNÓSTICO
// ==========================================
app.post('/api/auth/login', async (req, res) => {
  console.log("\n=== NUEVO INTENTO DE LOGIN ===");
  console.log("1. Datos que envió el frontend:", req.body);
  
  const cedulaRecibida = req.body.cedula || req.body.identificacion;
  const passwordRecibida = req.body.password;
  
  console.log("2. Cédula procesada:", cedulaRecibida);

  try {
    const result = await pool.query('SELECT * FROM usuarios WHERE cedula = $1', [cedulaRecibida]);
    console.log("3. Usuarios encontrados en la BD con esa cédula:", result.rows.length);
    
    if (result.rows.length === 0) {
      console.log("❌ FALLO: La cédula no existe en la base de datos.");
      return res.status(401).json({ error: 'Cédula o contraseña incorrecta' });
    }
    
    const usuario = result.rows[0];
    const passwordValida = await bcrypt.compare(passwordRecibida, usuario.password);
    
    if (!passwordValida) {
      console.log("❌ FALLO: La contraseña ingresada no coincide con la encriptada.");
      return res.status(401).json({ error: 'Cédula o contraseña incorrecta' });
    }
    
    console.log("✅ ÉXITO: Login aprobado para", usuario.nombre);
    res.json({
      mensaje: 'Login exitoso',
      usuario: { id: usuario.id, nombre: usuario.nombre, rol: usuario.rol },
      token: 'token_seguro_123'
    });
  } catch (error) {
    console.error("❌ ERROR DEL SERVIDOR:", error);
    res.status(500).json({ error: error.message });
  }
});

// ==========================================
// 2. RUTAS DEL PANEL ADMINISTRATIVO (CRUD)
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
// 3. RUTAS DE MATRÍCULAS
// ==========================================
app.get('/api/admin/matriculas/:usuario_id', async (req, res) => {
  try {
    const { usuario_id } = req.params;
    const result = await pool.query("SELECT modulo_id FROM progresos WHERE usuario_id = $1", [usuario_id]);
    const modulosAsignados = result.rows.map(row => row.modulo_id);
    res.json(modulosAsignados);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/admin/matriculas/:usuario_id', async (req, res) => {
  try {
    const { usuario_id } = req.params;
    const { modulos, fecha_limite } = req.body; 
    
    await pool.query('BEGIN');
    await pool.query("DELETE FROM progresos WHERE usuario_id = $1", [usuario_id]);
    
    for (let modulo_id of modulos) {
      await pool.query(
        "INSERT INTO progresos (usuario_id, modulo_id, estado, fecha_limite) VALUES ($1, $2, 'EN_CURSO', $3)",
        [usuario_id, modulo_id, fecha_limite || null] 
      );
    }
    
    await pool.query('COMMIT');
    res.json({ mensaje: "Matrícula actualizada" });
  } catch (error) {
    await pool.query('ROLLBACK');
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
// INICIO DEL SERVIDOR (SIEMPRE AL FINAL)
// ==========================================
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
// ==========================================
// 5. RUTAS DEL AULA VIRTUAL (EVALUACIONES)
// ==========================================
app.post('/api/usuario/:usuario_id/modulo/:modulo_id/evaluar', async (req, res) => {
  try {
    const { usuario_id, modulo_id } = req.params;
    const { calificacion } = req.body;

    // Si saca 80 o más, aprueba. Si no, sigue EN_CURSO pero suma un intento.
    const estadoNuevo = calificacion >= 80 ? 'APROBADO' : 'EN_CURSO';
    
    // Si aprueba, guardamos la fecha exacta
    const query = `
      UPDATE progresos 
      SET calificacion = $1, 
          estado = $2, 
          intentos = intentos + 1,
          fecha_aprobacion = CASE WHEN $2 = 'APROBADO' THEN CURRENT_TIMESTAMP ELSE fecha_aprobacion END
      WHERE usuario_id = $3 AND modulo_id = $4
    `;
    
    await pool.query(query, [calificacion, estadoNuevo, usuario_id, modulo_id]);
    res.json({ mensaje: 'Evaluación registrada', estado: estadoNuevo, calificacion });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});