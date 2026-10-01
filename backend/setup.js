const pool = require('./database');

const createTables = async () => {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS Usuarios (
                id SERIAL PRIMARY KEY,
                nombre VARCHAR(100) NOT NULL,
                identificacion VARCHAR(50) UNIQUE NOT NULL,
                password_hash VARCHAR(255) NOT NULL,
                rol VARCHAR(20) DEFAULT 'trabajador',
                estado VARCHAR(20) DEFAULT 'pendiente',
                fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS Modulos_SST (
                id SERIAL PRIMARY KEY,
                titulo VARCHAR(150) NOT NULL,
                descripcion TEXT,
                orden INTEGER
            );

            CREATE TABLE IF NOT EXISTS Progreso (
                id SERIAL PRIMARY KEY,
                usuario_id INTEGER REFERENCES Usuarios(id),
                modulo_id INTEGER REFERENCES Modulos_SST(id),
                estado VARCHAR(20) DEFAULT 'no_iniciado',
                calificacion DECIMAL(5,2),
                fecha_aprobacion TIMESTAMP,
                UNIQUE(usuario_id, modulo_id)
            );
        `);

        console.log('✅ Tablas maestras creadas con éxito.');

        const { rows } = await pool.query('SELECT COUNT(*) FROM Modulos_SST');
        if (rows[0].count == 0) {
            await pool.query(`
                INSERT INTO Modulos_SST (titulo, descripcion, orden) VALUES
                ('Inducción SST', 'Seguridad y Salud en el Trabajo para todo el personal.', 1),
                ('Espacios Confinados', 'Protocolos de seguridad para ingreso a espacios con acceso limitado.', 2),
                ('Trabajo en Caliente', 'Soldadura, oxicorte y actividades con llama.', 3),
                ('Trabajo en Alturas', 'Capacitación para trabajos a más de 2 metros.', 4),
                ('Izaje de Cargas', 'Procedimientos seguros para levantar y mover cargas.', 5),
                ('Levantamiento de Cargas', 'Manejo manual de cargas y posturas correctas.', 6),
                ('Ergonomía y Pausas Activas', 'Prevención de molestias osteomusculares en oficina.', 7),
                ('Plan de Emergencias', 'Respuesta ante incendios, sismos, derrames y evacuación.', 8),
                ('Primeros Auxilios', 'RCP, manejo de heridas, fracturas y quemaduras.', 9),
                ('Brigadista Integral', 'Formación completa para brigadistas.', 10)
            `);
            console.log('✅ Módulos SST iniciales insertados en la base de datos.');
        }

        process.exit(0);
    } catch (error) {
        console.error('❌ Error configurando la base de datos:', error);
        process.exit(1);
    }
};

createTables();