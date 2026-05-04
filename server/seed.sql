-- Insertar entrenador para el equipo
INSERT INTO usuarios (nombre, email, password_hash, rol, deporte, nivel)
VALUES (
  'Pedro',
  'pedro@fila.com',
  '$2a$10$MZ/UgGaYgRjpjkmm7Yl4EeFyaUsROH0MJGgni341W3n54QhJ2JhB.', -- contraseña: running123
  'entrenador',
  'Atletismo',
  'avanzado'
)
ON CONFLICT (email) DO NOTHING;

-- Insertar equipo
INSERT INTO equipos (nombre, entrenador_id, codigo_invitacion) 
SELECT 
  'Fila Running Team',
  id,
  'FILA2024'
FROM usuarios 
WHERE email = 'fernando@fila.com'
ON CONFLICT DO NOTHING;

-- Insertar usuario Melina
INSERT INTO usuarios (nombre, email, password_hash, rol, deporte, nivel, equipo_id)
SELECT 
  'Melina Forgiarini',
  'melina@fila.com',
  '$2a$10$MZ/UgGaYgRjpjkmm7Yl4EeFyaUsROH0MJGgni341W3n54QhJ2JhB.', -- contraseña: running123
  'atleta',
  'Atletismo',
  'avanzado',
  id
FROM equipos 
WHERE nombre = 'Fila Running Team'
ON CONFLICT (email) DO NOTHING;

-- Insertar sesiones de entrenamiento (últimas 3 días)
INSERT INTO sesiones_entrenamiento (usuario_id, esfuerzo_mental, enfoque, emocional, fatiga_carrera, fatiga_dia_siguiente, satisfaccion, notas)
SELECT 
  id,
  8,
  7,
  6,
  4,
  3,
  8,
  'Excelente sesión de velocidad. Completé los 5x1000m con buenas sensaciones.'
FROM usuarios WHERE email = 'melina@fila.com'
ON CONFLICT DO NOTHING;

INSERT INTO sesiones_entrenamiento (usuario_id, esfuerzo_mental, enfoque, emocional, fatiga_carrera, fatiga_dia_siguiente, satisfaccion, notas, timestamp)
SELECT 
  id,
  7,
  6,
  7,
  5,
  4,
  7,
  'Entrenamiento de resistencia. 15km a ritmo constante.',
  NOW() - INTERVAL '1 day'
FROM usuarios WHERE email = 'melina@fila.com'
ON CONFLICT DO NOTHING;

INSERT INTO sesiones_entrenamiento (usuario_id, esfuerzo_mental, enfoque, emocional, fatiga_carrera, fatiga_dia_siguiente, satisfaccion, notas, timestamp)
SELECT 
  id,
  6,
  5,
  8,
  3,
  2,
  8,
  'Sesión de recuperación. 8km fácil por el parque.',
  NOW() - INTERVAL '2 days'
FROM usuarios WHERE email = 'melina@fila.com'
ON CONFLICT DO NOTHING;

-- Insertar wellness entries (últimos 4 días)
INSERT INTO wellness_entries (usuario_id, fatiga, sueno, dolor, estres, timestamp)
SELECT 
  id,
  4,
  4,
  3,
  3,
  NOW()
FROM usuarios WHERE email = 'melina@fila.com'
ON CONFLICT DO NOTHING;

INSERT INTO wellness_entries (usuario_id, fatiga, sueno, dolor, estres, timestamp)
SELECT 
  id,
  3,
  4,
  2,
  2,
  NOW() - INTERVAL '1 day'
FROM usuarios WHERE email = 'melina@fila.com'
ON CONFLICT DO NOTHING;

INSERT INTO wellness_entries (usuario_id, fatiga, sueno, dolor, estres, timestamp)
SELECT 
  id,
  4,
  3,
  3,
  4,
  NOW() - INTERVAL '2 days'
FROM usuarios WHERE email = 'melina@fila.com'
ON CONFLICT DO NOTHING;

INSERT INTO wellness_entries (usuario_id, fatiga, sueno, dolor, estres, timestamp)
SELECT 
  id,
  5,
  5,
  1,
  2,
  NOW() - INTERVAL '3 days'
FROM usuarios WHERE email = 'melina@fila.com'
ON CONFLICT DO NOTHING;

-- Insertar tests cognitivos
INSERT INTO test_sessions (usuario_id, tipo_test, precision, tr_medio, tr_min, tr_max, lapses, anticipaciones, duracion)
SELECT 
  id,
  'stroop',
  92,
  285,
  150,
  450,
  0,
  1,
  60
FROM usuarios WHERE email = 'melina@fila.com'
ON CONFLICT DO NOTHING;

INSERT INTO test_sessions (usuario_id, tipo_test, precision, tr_medio, tr_min, tr_max, lapses, anticipaciones, duracion)
SELECT 
  id,
  'pvt-b',
  NULL,
  268,
  140,
  520,
  1,
  2,
  300
FROM usuarios WHERE email = 'melina@fila.com'
ON CONFLICT DO NOTHING;

INSERT INTO test_sessions (usuario_id, tipo_test, precision, tr_medio, tr_min, tr_max, lapses, anticipaciones, duracion)
SELECT 
  id,
  'msit',
  88,
  312,
  180,
  620,
  0,
  0,
  180
FROM usuarios WHERE email = 'melina@fila.com'
ON CONFLICT DO NOTHING;

INSERT INTO test_sessions (usuario_id, tipo_test, precision, tr_medio, tr_min, tr_max, lapses, anticipaciones, duracion, timestamp)
SELECT 
  id,
  'stroop',
  89,
  298,
  160,
  480,
  1,
  2,
  60,
  NOW() - INTERVAL '1 day'
FROM usuarios WHERE email = 'melina@fila.com'
ON CONFLICT DO NOTHING;

-- Insertar readiness scores
INSERT INTO readiness_scores (usuario_id, score, wellness_score, cognitivo_score, sesion_score, fecha)
SELECT 
  id,
  72,
  69,
  82,
  76,
  CURRENT_DATE
FROM usuarios WHERE email = 'melina@fila.com'
ON CONFLICT (usuario_id, fecha) DO UPDATE SET
  score = 72,
  wellness_score = 69,
  cognitivo_score = 82,
  sesion_score = 76;

INSERT INTO readiness_scores (usuario_id, score, wellness_score, cognitivo_score, sesion_score, fecha)
SELECT 
  id,
  68,
  62,
  75,
  71,
  CURRENT_DATE - INTERVAL '1 day'
FROM usuarios WHERE email = 'melina@fila.com'
ON CONFLICT (usuario_id, fecha) DO UPDATE SET
  score = 68,
  wellness_score = 62,
  cognitivo_score = 75,
  sesion_score = 71;

INSERT INTO readiness_scores (usuario_id, score, wellness_score, cognitivo_score, sesion_score, fecha)
SELECT 
  id,
  65,
  58,
  70,
  68,
  CURRENT_DATE - INTERVAL '2 days'
FROM usuarios WHERE email = 'melina@fila.com'
ON CONFLICT (usuario_id, fecha) DO UPDATE SET
  score = 65,
  wellness_score = 58,
  cognitivo_score = 70,
  sesion_score = 68;

INSERT INTO readiness_scores (usuario_id, score, wellness_score, cognitivo_score, sesion_score, fecha)
SELECT 
  id,
  78,
  85,
  80,
  82,
  CURRENT_DATE - INTERVAL '3 days'
FROM usuarios WHERE email = 'melina@fila.com'
ON CONFLICT (usuario_id, fecha) DO UPDATE SET
  score = 78,
  wellness_score = 85,
  cognitivo_score = 80,
  sesion_score = 82;

INSERT INTO readiness_scores (usuario_id, score, wellness_score, cognitivo_score, sesion_score, fecha)
SELECT 
  id,
  75,
  80,
  78,
  79,
  CURRENT_DATE - INTERVAL '4 days'
FROM usuarios WHERE email = 'melina@fila.com'
ON CONFLICT (usuario_id, fecha) DO UPDATE SET
  score = 75,
  wellness_score = 80,
  cognitivo_score = 78,
  sesion_score = 79;

INSERT INTO readiness_scores (usuario_id, score, wellness_score, cognitivo_score, sesion_score, fecha)
SELECT 
  id,
  70,
  75,
  72,
  74,
  CURRENT_DATE - INTERVAL '5 days'
FROM usuarios WHERE email = 'melina@fila.com'
ON CONFLICT (usuario_id, fecha) DO UPDATE SET
  score = 70,
  wellness_score = 75,
  cognitivo_score = 72,
  sesion_score = 74;

INSERT INTO readiness_scores (usuario_id, score, wellness_score, cognitivo_score, sesion_score, fecha)
SELECT 
  id,
  73,
  78,
  75,
  77,
  CURRENT_DATE - INTERVAL '6 days'
FROM usuarios WHERE email = 'melina@fila.com'
ON CONFLICT (usuario_id, fecha) DO UPDATE SET
  score = 73,
  wellness_score = 78,
  cognitivo_score = 75,
  sesion_score = 77;
