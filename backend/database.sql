-- Tabla de Usuarios (Trabajadores y Administradores)
CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    cedula VARCHAR(20) UNIQUE NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    password VARCHAR(255) NOT NULL,
    rol VARCHAR(20) DEFAULT 'TRABAJADOR', -- Puede ser 'TRABAJADOR' o 'ADMIN'
    estado VARCHAR(20) DEFAULT 'PENDIENTE', -- El admin debe aprobarlos
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Módulos (Los cursos de inducción)
CREATE TABLE modulos (
    id SERIAL PRIMARY KEY,
    titulo VARCHAR(100) NOT NULL,
    descripcion TEXT,
    estado VARCHAR(20) DEFAULT 'ACTIVO'
);

-- Tabla de Progresos (La bitácora HSEQ para seguimiento)
CREATE TABLE progresos (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER REFERENCES usuarios(id),
    modulo_id INTEGER REFERENCES modulos(id),
    estado VARCHAR(20) DEFAULT 'EN_CURSO', -- 'EN_CURSO', 'APROBADO', 'REPROBADO'
    calificacion DECIMAL(5,2),
    intentos INTEGER DEFAULT 0,
    fecha_aprobacion TIMESTAMP,
    UNIQUE(usuario_id, modulo_id)
);
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

module.exports = pool;