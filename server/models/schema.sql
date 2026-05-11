-- ===============================
-- TABLA: usuarios
-- ===============================
CREATE TABLE IF NOT EXISTS usuarios (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  rol VARCHAR(50) NOT NULL DEFAULT 'atleta', -- 'atleta', 'entrenador', 'psicologo_deportivo', 'admin'
  deporte VARCHAR(100),
  nivel VARCHAR(50), -- 'principiante', 'intermedio', 'avanzado'
  equipo_id INTEGER,
  last_activity TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices en usuarios
CREATE INDEX IF NOT EXISTS idx_usuarios_email ON usuarios(email);
CREATE INDEX IF NOT EXISTS idx_usuarios_equipo_id ON usuarios(equipo_id);
CREATE INDEX IF NOT EXISTS idx_usuarios_rol ON usuarios(rol);


-- ===============================
-- TABLA: equipos
-- ===============================
CREATE TABLE IF NOT EXISTS equipos (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(255) NOT NULL,
  entrenador_id INTEGER NOT NULL,
  codigo_invitacion VARCHAR(50) UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_equipos_entrenador FOREIGN KEY (entrenador_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

-- Índices en equipos
CREATE INDEX IF NOT EXISTS idx_equipos_entrenador_id ON equipos(entrenador_id);
CREATE INDEX IF NOT EXISTS idx_equipos_codigo_invitacion ON equipos(codigo_invitacion);

-- Agregar la FK a usuarios después de crear equipos
ALTER TABLE usuarios ADD CONSTRAINT fk_usuarios_equipo FOREIGN KEY (equipo_id) REFERENCES equipos(id) ON DELETE SET NULL;


-- ===============================
-- TABLA: sesiones_entrenamiento
-- ===============================
CREATE TABLE IF NOT EXISTS sesiones_entrenamiento (
  id SERIAL PRIMARY KEY,
  usuario_id INTEGER NOT NULL,
  esfuerzo_mental INTEGER, -- Escala 1-10
  enfoque INTEGER, -- Escala 1-10
  emocional INTEGER, -- Escala 1-10
  fatiga_carrera INTEGER, -- Escala 1-10
  fatiga_dia_siguiente INTEGER, -- Escala 1-10
  satisfaccion INTEGER, -- Escala 1-10
  notas TEXT,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_sesiones_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_sesiones_usuario_id ON sesiones_entrenamiento(usuario_id);
CREATE INDEX IF NOT EXISTS idx_sesiones_timestamp ON sesiones_entrenamiento(timestamp);


-- ===============================
-- TABLA: wellness_entries
-- ===============================
CREATE TABLE IF NOT EXISTS wellness_entries (
  id SERIAL PRIMARY KEY,
  usuario_id INTEGER NOT NULL,
  fatiga INTEGER, -- Escala 1-10
  sueno INTEGER, -- Escala 1-10 (calidad del sueño)
  dolor INTEGER, -- Escala 1-10
  estres INTEGER, -- Escala 1-10
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_wellness_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_wellness_usuario_id ON wellness_entries(usuario_id);
CREATE INDEX IF NOT EXISTS idx_wellness_timestamp ON wellness_entries(timestamp);


-- ===============================
-- TABLA: test_sessions
-- ===============================
CREATE TABLE IF NOT EXISTS test_sessions (
  id SERIAL PRIMARY KEY,
  usuario_id INTEGER NOT NULL,
  tipo_test VARCHAR(100), -- 'vasalva', 'test_cognitivo', etc.
  precision DECIMAL(5, 2), -- Porcentaje
  tr_medio DECIMAL(7, 2), -- Tiempo de reacción medio (ms)
  tr_min DECIMAL(7, 2), -- Tiempo de reacción mínimo
  tr_max DECIMAL(7, 2), -- Tiempo de reacción máximo
  lapses INTEGER, -- Cantidad de lapsos
  anticipaciones INTEGER, -- Respuestas anticipadas
  duracion INTEGER, -- Duración en segundos
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_test_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_test_usuario_id ON test_sessions(usuario_id);
CREATE INDEX IF NOT EXISTS idx_test_timestamp ON test_sessions(timestamp);
CREATE INDEX IF NOT EXISTS idx_test_tipo ON test_sessions(tipo_test);


-- ===============================
-- TABLA: readiness_scores
-- ===============================
CREATE TABLE IF NOT EXISTS readiness_scores (
  id SERIAL PRIMARY KEY,
  usuario_id INTEGER NOT NULL,
  score DECIMAL(5, 2), -- Score general de readiness (1-100)
  wellness_score DECIMAL(5, 2), -- Score de wellness
  cognitivo_score DECIMAL(5, 2), -- Score cognitivo
  sesion_score DECIMAL(5, 2), -- Score de sesión anterior
  fecha DATE NOT NULL,
  CONSTRAINT fk_readiness_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_readiness_usuario_id ON readiness_scores(usuario_id);
CREATE INDEX IF NOT EXISTS idx_readiness_fecha ON readiness_scores(fecha);
CREATE UNIQUE INDEX IF NOT EXISTS idx_readiness_usuario_fecha ON readiness_scores(usuario_id, fecha);


-- ===============================
-- TABLA: retos
-- ===============================
CREATE TABLE IF NOT EXISTS retos (
  id SERIAL PRIMARY KEY,
  equipo_id INTEGER NOT NULL,
  titulo VARCHAR(255) NOT NULL,
  descripcion TEXT,
  objetivo_sesiones INTEGER, -- Cantidad de sesiones objetivo
  fecha_inicio DATE NOT NULL,
  fecha_fin DATE NOT NULL,
  CONSTRAINT fk_retos_equipo FOREIGN KEY (equipo_id) REFERENCES equipos(id) ON DELETE CASCADE
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_retos_equipo_id ON retos(equipo_id);
CREATE INDEX IF NOT EXISTS idx_retos_fecha_inicio ON retos(fecha_inicio);


-- ===============================
-- TABLA: consignas_comunidad (Foro comunitario)
-- ===============================
CREATE TABLE IF NOT EXISTS consignas_comunidad (
  id SERIAL PRIMARY KEY,
  usuario_id INTEGER NOT NULL,
  contenido TEXT NOT NULL,
  tipo VARCHAR(50) NOT NULL DEFAULT 'post', -- 'consigna' (psicólogo), 'post' (atleta)
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_consignas_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_consignas_usuario_id ON consignas_comunidad(usuario_id);
CREATE INDEX IF NOT EXISTS idx_consignas_tipo ON consignas_comunidad(tipo);
CREATE INDEX IF NOT EXISTS idx_consignas_timestamp ON consignas_comunidad(timestamp);

-- TABLA LEGACY: kudos (mantener por compatibilidad)
CREATE TABLE IF NOT EXISTS kudos (
  id SERIAL PRIMARY KEY,
  de_usuario_id INTEGER NOT NULL,
  a_usuario_id INTEGER NOT NULL,
  mensaje TEXT,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_kudos_de_usuario FOREIGN KEY (de_usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
  CONSTRAINT fk_kudos_a_usuario FOREIGN KEY (a_usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_kudos_de_usuario_id ON kudos(de_usuario_id);
CREATE INDEX IF NOT EXISTS idx_kudos_a_usuario_id ON kudos(a_usuario_id);
CREATE INDEX IF NOT EXISTS idx_kudos_timestamp ON kudos(timestamp);


-- ===============================
-- TABLA: intervenciones
-- ===============================
CREATE TABLE IF NOT EXISTS intervenciones (
  id SERIAL PRIMARY KEY,
  usuario_id INTEGER NOT NULL,
  tipo VARCHAR(50) NOT NULL, -- 'respiracion', 'activacion', 'recuperacion'
  titulo VARCHAR(255) NOT NULL,
  descripcion TEXT,
  duracion_minutos INTEGER,
  completada BOOLEAN DEFAULT FALSE,
  fecha_asignacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  fecha_completada TIMESTAMP,
  nota_entrenador TEXT,
  asignada_por_entrenador BOOLEAN DEFAULT FALSE,
  CONSTRAINT fk_intervenciones_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_intervenciones_usuario_id ON intervenciones(usuario_id);
CREATE INDEX IF NOT EXISTS idx_intervenciones_tipo ON intervenciones(tipo);
CREATE INDEX IF NOT EXISTS idx_intervenciones_fecha_asignacion ON intervenciones(fecha_asignacion);
CREATE INDEX IF NOT EXISTS idx_intervenciones_completada ON intervenciones(completada);
