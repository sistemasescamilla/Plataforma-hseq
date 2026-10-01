const { Pool } = require('pg');
const bcrypt = require('bcrypt');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

const forzarAdmin = async () => {
  try {
    // 1. Encriptamos tu contraseña maestra
    const salt = await bcrypt.genSalt(10);
    const passwordEncriptada = await bcrypt.hash('092103JJSs', salt);

    // 2. Limpiamos cualquier usuario de prueba viejo para evitar choques
    await pool.query('DELETE FROM usuarios');

    // 3. Insertamos tu usuario administrador definitivo
    const query = `
      INSERT INTO usuarios (cedula, nombre, password, rol, estado) 
      VALUES ($1, $2, $3, 'ADMIN', 'ACTIVO')
    `;
    await pool.query(query, ['1047387433', 'Juan Sebastián Lopez Hurtado', passwordEncriptada]);

    console.log('✅ USUARIO MAESTRO CREADO DEFINITIVAMENTE.');
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    pool.end();
  }
};

forzarAdmin();