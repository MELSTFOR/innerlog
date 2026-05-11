# 🧠 Innerlog - Módulo de Análisis de Patrones e Intervención

## Nuevas Características Implementadas

Este documento describe las nuevas funcionalidades agregadas a la plataforma Innerlog para transformar datos en inteligencia accionable.

---

## 1️⃣ Módulo de Patrones (Atleta)

### Ubicación
- **Frontend**: `/patrones` (accesible desde dashboard)
- **Backend**: `GET /api/patrones`

### Funcionalidades
Analiza los últimos 30 días de datos del usuario para detectar:

#### 🔴 Patrón de Fatiga
- Detecta el día de la semana con readiness más bajo
- Ejemplo: "Tus lunes tienen un readiness promedio de 52 — el más bajo de tu semana"
- Incluye gráfico de barras con readiness por día

#### 🛌 Correlación Sueño-Rendimiento Cognitivo
- Compara rendimiento cognitivo cuando el sueño es < 3/5 vs >= 3/5
- Muestra diferencia porcentual
- Recomendación: priorizar sueño en entrenamientos demandantes

#### 😊 Patrón Emocional
- Analiza el estado emocional por día de semana
- Detecta ciclos de estado emocional
- Proporciona recomendaciones personalizadas

#### 🏆 Mejor Momento de la Semana
- Identifica el día con mayor readiness
- Sugiere usarlo para entrenamientos de alto rendimiento

### Datos Visuales
- Cards individuales para cada patrón
- Gráficos pequeños de soporte (barras/líneas)
- Recomendaciones accionables de una línea

---

## 2️⃣ Módulo de Intervenciones

### Ubicación
- **Frontend**: Dashboard (SuggestedIntervention component)
- **Backend**: 
  - `GET /api/intervenciones/sugerida` - intervención del día
  - `POST /api/intervenciones/:id/completar` - marcar completada
  - `GET /api/intervenciones/historial` - historial de intervenciones

### Tipos de Intervención

#### 🧘 Respiración
- Box breathing: 4-4-4-4
- Duración: 2 minutos
- Trigger: Readiness < 50

#### ⚡ Activación
- Rutina pre-entrenamiento
- Movilidad + burpees + visualización + saltos
- Duración: 5 minutos
- Trigger: Readiness > 75

#### 💆 Recuperación
- Protocolo post-entrenamiento
- Caminata + estiramientos + respiración + meditación
- Duración: 5 minutos
- Trigger: Readiness 50-75 (default)

### Características
- **Asignación Automática**: Se sugiere automáticamente según readiness del día
- **Timer Integrado**: Temporizador para cada intervención
- **Pasos Guiados**: Instrucciones paso a paso
- **Historial**: Registro de todas las intervenciones completadas

### Base de Datos
Tabla `intervenciones`:
```sql
id, usuario_id, tipo, titulo, descripcion, duracion_minutos,
completada, fecha_asignacion, fecha_completada, nota_entrenador, 
asignada_por_entrenador
```

---

## 3️⃣ Reporte Semanal

### Ubicación
- **Frontend**: `/reporte` (accesible desde perfil)
- **Backend**: `GET /api/reporte/semana`

### Contenido del Reporte
- 📈 **Readiness Promedio**: promedio, mínimo, máximo de la semana
- 🏆 **Mejor y Peor Día**: días con mayor y menor readiness
- 🧠 **Test Cognitivo Más Frecuente**: tipo y precisión promedio
- 🔍 **Patrón Más Destacado**: resumen del patrón más notable
- ✅ **Intervenciones Completadas**: cantidad de intervenciones hechas
- 📊 **Comparación con Semana Anterior**: tendencia (arriba/abajo/estable)

### Diseño
- Inspiración "Wrapped" (Spotify style)
- Una métrica por card
- Navegación fluida
- Botón compartir: genera texto para redes sociales

---

## 4️⃣ Dashboard del Entrenador - Ampliación

### Ubicación
- **Frontend**: `/entrenador` (con tabs)
- **Backend**: 
  - `GET /api/entrenador/patrones-equipo`
  - `GET /api/entrenador/intervenciones/completadas`

### Tab: Patrones del Equipo

#### 📉 Día Más Difícil para el Equipo
- Día de la semana con readiness más bajo en promedio
- Recomendación: entrenamientos más ligeros

#### 📊 Atleta con Mayor Variabilidad
- Detecta inestabilidad de rendimiento
- Sugiere seguimiento más cercano

#### 🚀 Atleta con Tendencia Positiva (últimas 2 semanas)
- Mejora más notable
- Sugiere reconocimiento del trabajo

### Tab: Intervenciones
- Lista de atletas que completaron intervenciones esta semana
- Cantidad total de intervenciones por atleta
- Tipos de intervenciones completadas
- Fecha de última intervención completada

---

## 🔧 Cambios en la BD

### Nueva Tabla: `intervenciones`
```sql
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
  CONSTRAINT fk_intervenciones_usuario FOREIGN KEY (usuario_id)
);
```

---

## 📱 Rutas Frontend Nuevas

```
/patrones               → Mis Patrones (página completa)
/reporte               → Reporte Semanal (página completa)
/entrenador            → Dashboard ampliado con tabs
```

---

## 🔌 Rutas Backend Nuevas

### Patrones
- `GET /api/patrones` - patrones del usuario (30 días)
- `GET /api/patrones/equipo` - patrones del equipo (solo entrenador)

### Intervenciones
- `GET /api/intervenciones/sugerida` - intervención sugerida del día
- `POST /api/intervenciones/:id/completar` - marcar como completada
- `GET /api/intervenciones/historial` - historial del usuario
- `POST /api/intervenciones/asignar` - asignar manual (solo entrenador)
- `GET /api/intervenciones/equipo/completadas` - completadas esta semana (solo entrenador)

### Reporte
- `GET /api/reporte/semana` - reporte semanal del usuario

---

## 🎨 Diseño y Estilo

Todos los componentes siguen la paleta de colores existente:
- **Fondo Principal**: #0f1117 (casi negro)
- **Fondo Secundario**: #1a1f2e (gris oscuro)
- **Texto Principal**: #c9d1d9 (gris claro)
- **Texto Secundario**: #8b92a4 (gris medio)
- **Acento**: #00d4ff (cyan brillante)
- **Success**: #31eb96 (verde)
- **Warning**: #ffd93d (amarillo)
- **Danger**: #ff6b6b (rojo)

---

## 📊 Lógica de Análisis

### Patrones (30 días)
1. **Fatiga**: MIN(readiness por día de semana)
2. **Sueño-Cognitivo**: Correlación entre sueño y precisión cognitiva
3. **Emocional**: MIN(emocional score por día de semana)
4. **Mejor Día**: MAX(readiness por día de semana)

### Reporte (Semana actual vs anterior)
1. Calcula promedios de readiness
2. Identifica best/worst days
3. Agrupa tests cognitivos
4. Detecta patrón más destacado
5. Cuenta intervenciones completadas
6. Compara con semana anterior

---

## 🚀 Próximas Mejoras Opcionales

- [ ] Notificaciones push con intervenciones sugeridas
- [ ] Programación automática de intervenciones
- [ ] Análisis de correlaciones avanzadas
- [ ] Export de reportes en PDF
- [ ] Integración con calendarios
- [ ] Predicción de bajo rendimiento (ML)

---

## 📝 Notas de Implementación

- Todos los textos están en español
- Mobile-first design
- Datos de 30 días para análisis (configurable)
- Timestamps en UTC
- Índices de BD optimizados para queries frecuentes

---

**Implementado**: 2026-05-06
**Versión**: 1.0
