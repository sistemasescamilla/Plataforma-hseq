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

async function crearAdmin() {
  try {
    const salt = await bcrypt.genSalt(10);
    // Encriptamos tu clave exacta
    const passwordHash = await bcrypt.hash('092103JJSs', salt);
    
    // Inyectamos tu usuario maestro
    await pool.query(
      "INSERT INTO usuarios (cedula, nombre, password, rol, estado) VALUES ('1047387433', 'Juan Sebastián Lopez', $1, 'ADMIN', 'ACTIVO') ON CONFLICT (cedula) DO UPDATE SET password = EXCLUDED.password",
      [passwordHash]
    );
    
    console.log('✅ USUARIO MAESTRO CREADO CON ÉXITO');
    process.exit(0);
  } catch (e) {
    console.error('❌ ERROR:', e);
    process.exit(1);
  }
}

crearAdmin();