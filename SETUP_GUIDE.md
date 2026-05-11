# 🚀 Guía de Instalación y Uso - Módulo de Análisis Innerlog

## Pre-requisitos
- Base de datos PostgreSQL actualizada
- Node.js servidor y cliente instalados
- Cliente React actualizado

## 📋 Paso a Paso de Instalación

### 1️⃣ Actualizar la Base de Datos

Ejecuta el script de schema para crear la tabla `intervenciones`:

```bash
# Desde el servidor
cd server
npm run seed  # o ejecutar el archivo seed.sql manualmente
```

O directamente en PostgreSQL:
```sql
-- Ejecutar la parte nueva del schema.sql que crea la tabla intervenciones
CREATE TABLE intervenciones (
  id SERIAL PRIMARY KEY,
  usuario_id INTEGER NOT NULL,
  tipo VARCHAR(50) NOT NULL,
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

CREATE INDEX idx_intervenciones_usuario_id ON intervenciones(usuario_id);
CREATE INDEX idx_intervenciones_tipo ON intervenciones(tipo);
CREATE INDEX idx_intervenciones_fecha_asignacion ON intervenciones(fecha_asignacion);
CREATE INDEX idx_intervenciones_completada ON intervenciones(completada);
```

### 2️⃣ Instalar Dependencias (Si es necesario)

Los componentes usan bibliotecas ya presentes en el proyecto:
- `recharts` - para gráficos
- `@heroicons/react` - para íconos
- `react-router-dom` - para navegación

### 3️⃣ Variables de Entorno

No requiere nuevas variables de entorno. Usa la configuración existente.

### 4️⃣ Iniciar la Aplicación

```bash
# Terminal 1: Backend
cd server
npm start

# Terminal 2: Frontend
cd client
npm run dev
```

## 🧪 Prueba Rápida

### 1. Acceder como Atleta
1. Login con credenciales de atleta
2. Dashboard (Inicio) → Ver "Intervención sugerida" según readiness
3. Dashboard → Botón "Mis Patrones" → Análisis de últimos 30 días
4. Dashboard → Botón "Mis Patrones" → Click en patrón individual
5. Perfil → "Reporte Semanal" (cuando esté implementado)

### 2. Acceder como Entrenador
1. Login con credenciales de entrenador
2. Dashboard (/entrenador) → Tab "📊 Patrones" → Ver patrones del equipo
3. Dashboard (/entrenador) → Tab "✅ Intervenciones" → Ver intervenciones completadas

## 📊 Flujo de Datos

### Para Atleta

```
Dashboard (Inicio)
├── Intervención Sugerida (card con timer)
│   ├── Se obtiene de: GET /api/intervenciones/sugerida
│   ├── Basada en: readiness del día
│   ├── Tipos:
│   │   ├── Respiración (readiness < 50)
│   │   ├── Activación (readiness > 75)
│   │   └── Recuperación (default)
│   └── Botones: Comenzar → timer → Completé
│
├── Botón "Mis Patrones"
│   └── Página /patrones
│       ├── GET /api/patrones
│       ├── Muestra 4 patrones (fatiga, sueño-cognitivo, emocional, mejor-día)
│       └── Cada patrón: título + insight + gráfico + recomendación
│
└── Perfil → Reporte Semanal
    └── Página /reporte
        ├── GET /api/reporte/semana
        └── Muestra: readiness, best/worst, test frecuente, patrón, intervenciones, comparación

```

### Para Entrenador

```
Dashboard (/entrenador)
├── Tab "Atletas" (existente)
│   └── Lista de atletas con readiness
│
├── Tab "📊 Patrones" (nuevo)
│   ├── GET /api/entrenador/patrones-equipo
│   ├── Muestra:
│   │   ├── Peor día del equipo
│   │   ├── Atleta con mayor variabilidad
│   │   └── Atleta con tendencia positiva
│   └── Recomendaciones contextuales
│
└── Tab "✅ Intervenciones" (nuevo)
    ├── GET /api/entrenador/intervenciones/completadas
    ├── Muestra atletas con intervenciones completadas esta semana
    └── Cantidad y tipos de intervenciones

```

## 🔑 Endpoints API Clave

### Autenticados (Atleta y Entrenador)
```
GET  /api/patrones
GET  /api/intervenciones/sugerida
POST /api/intervenciones/:id/completar
GET  /api/intervenciones/historial
GET  /api/reporte/semana
```

### Entrenador Only
```
GET /api/entrenador/patrones-equipo
GET /api/entrenador/intervenciones/completadas
POST /api/entrenador/intervenciones/asignar
```

## 🎮 Casos de Uso

### Caso 1: Atleta con Readiness Bajo (< 50)
1. Login → Dashboard
2. Ve intervención sugerida: "Respiración Guiada"
3. Hace clic en "Comenzar" → Timer de 2 minutos + pasos
4. Sigue los 5 pasos
5. Hace clic en "Completé" → Intervención marcada como completada
6. Puede ver historial en "Mis Intervenciones"

### Caso 2: Atleta Explorando Patrones
1. Login → Dashboard → "Mis Patrones"
2. Ve 4 patrones de los últimos 30 días:
   - "Patrón de Fatiga": Lunes readiness más bajo
   - "Sueño vs Rendimiento": Cuando duerme menos, rinde menos cognitivamente
   - "Patrón Emocional": Jueves es emocionalmente más bajo
   - "Mejor Momento": Viernes es su mejor día
3. Lee recomendaciones y actúa en consecuencia

### Caso 3: Entrenador Monitoreando Equipo
1. Login → Dashboard
2. Tab "Patrones" → Ve:
   - Lunes es el día más difícil para todo el equipo (readiness bajo)
   - Atleta X tiene mucha variabilidad (podría estar inestable)
   - Atleta Y está mejorando los últimos 14 días
3. Tab "Intervenciones" → Ve:
   - 5 atletas completaron intervenciones esta semana
   - Atleta Z completó 3 intervenciones (muy activo)

## 🐛 Troubleshooting

### "No hay suficientes datos para analizar patrones"
**Causa**: El usuario no tiene 30 días de datos
**Solución**: Esperar o usar datos de testing

### "GET /api/patrones retorna 401"
**Causa**: Token de autenticación inválido o expirado
**Solución**: Re-login

### "Intervención no aparece en el dashboard"
**Causa**: El user_id no coincide o no hay readiness del día
**Solución**: Verificar que el usuario tenga readiness calculado para hoy

## 📈 Monitoreo

### Queries importantes para monitoreo:
```sql
-- Ver intervenciones completadas esta semana
SELECT u.nombre, COUNT(*) as total, i.tipo
FROM intervenciones i
JOIN usuarios u ON u.id = i.usuario_id
WHERE i.completada = TRUE 
  AND i.fecha_completada >= CURRENT_DATE - INTERVAL '7 days'
GROUP BY u.nombre, i.tipo;

-- Ver patrones de readiness por día
SELECT TO_CHAR(fecha, 'day') as dia, ROUND(AVG(score), 1) as avg
FROM readiness_scores
WHERE usuario_id = ? AND fecha >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY TO_CHAR(fecha, 'day')
ORDER BY avg DESC;
```

## ✅ Checklist de Implementación

- [x] Tabla `intervenciones` creada en BD
- [x] Controllers de patrones, intervenciones y reporte
- [x] Routes para todos los endpoints
- [x] Hooks React creados
- [x] Páginas creadas (Patrones, Reporte)
- [x] Componentes visuales creados
- [x] Integración en Inicio.jsx
- [x] Dashboard entrenador ampliado con tabs
- [x] App.jsx con nuevas rutas
- [ ] Testing e2e (próxima fase)
- [ ] Documentación de usuario (próxima fase)

---

**Versión**: 1.0
**Fecha**: 2026-05-06
**Estado**: ✅ LISTO PARA TESTING
