const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
require('dotenv').config();

// Inicializamos la aplicación
const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares (Configuraciones de seguridad y formato)
app.use(cors()); // Permite que el Frontend (React) se comunique con este Backend
app.use(express.json()); // Permite que el servidor entienda datos enviados en formato JSON

// Configuración de la Base de Datos usando las variables del archivo .env
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// ¡Ruta de autenticación activada!
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

// Las rutas de admin y modulos las dejamos comentadas por ahora
// const adminRoutes = require('./routes/admin');
// app.use('/api/admin', adminRoutes);

// const modulosRoutes = require('./routes/modulos');
// app.use('/api/modulos', modulosRoutes);

// Ruta de prueba para verificar la conexión a la Base de Datos
app.get('/api/estado', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({ 
      mensaje: '¡Backend y Base de Datos (PostgreSQL) conectados con éxito! 🚀', 
      hora_servidor: result.rows[0].now 
    });
  } catch (error) {
    console.error('Error de conexión:', error);
    res.status(500).json({ error: 'Falló la conexión a la BD. Revisa tu archivo .env' });
  }
});

// Ruta de prueba (Endpoint base)
app.get('/', (req, res) => {
    res.json({ mensaje: 'API de Plataforma HSEQ Astilleros funcionando correctamente 🚀' });
});

// Encendemos el motor
app.listen(PORT, () => {
    console.log(`Servidor de seguridad corriendo en http://localhost:${PORT}`);
});