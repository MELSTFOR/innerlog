# Módulo de Comunidad

## 📋 Backend - Endpoints

### GET /api/comunidad/feed

**Descripción:** Obtiene feed de actividad reciente del equipo (últimos 7 días).

**Autenticación:** Requerida

**Respuesta:**
```json
{
  "feed": [
    {
      "id": "test-1-2026-05-04T10:30:00Z",
      "tipo": "test",
      "titulo": "Carlos completó Stroop con 94% de precisión",
      "timestamp": "2026-05-04T10:30:00Z",
      "datos": {
        "usuario_nombre": "Carlos",
        "tipo_test": "stroop",
        "precision": 94
      }
    },
    {
      "id": "readiness-2026-05-04",
      "tipo": "readiness",
      "titulo": "Tu equipo tiene un readiness medio de 71% hoy (5 atletas)",
      "timestamp": "2026-05-04",
      "datos": {
        "avg_score": 71,
        "atletas": 5
      }
    },
    {
      "id": "streak-2-2026-05-04",
      "tipo": "streak",
      "titulo": "Ana lleva 7 días seguidos registrando su sesión",
      "timestamp": "2026-05-04",
      "datos": {
        "usuario_nombre": "Ana",
        "streak_dias": 7
      }
    }
  ]
}
```

**Lógica:**
- Agrega tests completados en últimos 7 días
- Calcula readiness promedio del equipo del día
- Identifica streaks de 5+ días consecutivos de check-in
- Ordena por timestamp DESC

---

### GET /api/comunidad/reto

**Descripción:** Obtiene reto semanal activo del equipo con progreso.

**Autenticación:** Requerida

**Respuesta:**
```json
{
  "reto": {
    "id": 1,
    "titulo": "7 Sesiones esta Semana",
    "descripcion": "Registra al menos una sesión cada día",
    "objetivo_sesiones": 7,
    "fecha_inicio": "2026-05-01",
    "fecha_fin": "2026-05-07",
    "progreso": 80,
    "completados": 4,
    "total_atletas": 5,
    "atletas": [
      {
        "id": 1,
        "nombre": "Juan",
        "sesiones_dias": 1
      },
      {
        "id": 2,
        "nombre": "María",
        "sesiones_dias": 0
      }
    ]
  }
}
```

**Lógica:**
- Busca reto activo hoy (fecha_inicio <= hoy <= fecha_fin)
- Cuenta días con al menos 1 sesión registrada
- Calcula progreso como (completados / total_atletas) × 100

---

### GET /api/comunidad/leaderboard

**Descripción:** Ranking ordenado por racha de días consecutivos con check-in.

**Autenticación:** Requerida

**Respuesta:**
```json
{
  "leaderboard": [
    {
      "id": 1,
      "nombre": "Carlos",
      "racha_dias": 14,
      "posicion": 1
    },
    {
      "id": 2,
      "nombre": "Ana",
      "racha_dias": 10,
      "posicion": 2
    }
  ]
}
```

**Lógica:**
- Calcula racha actual (streak) para cada atleta
- Streak = días consecutivos con al menos un check-in (sesión, test o wellness)
- Solo cuenta racha activa (que llegue hasta hoy o ayer)
- Ordena por racha DESC

---

### POST /api/kudos

**Descripción:** Enviar kudo a un compañero del equipo.

**Autenticación:** Requerida

**Body:**
```json
{
  "a_usuario_id": 5,
  "mensaje": "¡Excelente sesión hoy!"
}
```

**Respuesta:**
```json
{
  "success": true,
  "kudo": {
    "id": 10,
    "timestamp": "2026-05-04T15:30:00Z"
  }
}
```

**Validaciones:**
- No puedes enviar kudos a ti mismo
- El receptor debe estar en el mismo equipo

---

### GET /api/kudos/recibidos

**Descripción:** Obtiene últimos 10 kudos recibidos.

**Autenticación:** Requerida

**Respuesta:**
```json
{
  "kudos": [
    {
      "id": 1,
      "de_usuario_id": 2,
      "de_usuario_nombre": "Juan",
      "mensaje": "¡Excelente test hoy!",
      "timestamp": "2026-05-04T10:00:00Z"
    }
  ]
}
```

---

### GET /api/kudos/ranking

**Descripción:** Ranking de kudos del equipo (más kudos recibidos).

**Autenticación:** Requerida

**Respuesta:**
```json
{
  "ranking": [
    {
      "id": 1,
      "nombre": "Carlos",
      "kudos_recibidos": 15,
      "posicion": 1
    },
    {
      "id": 2,
      "nombre": "Ana",
      "kudos_recibidos": 12,
      "posicion": 2
    }
  ]
}
```

---

## 🎨 Frontend - Página /comunidad (Comunidad.jsx)

### 4 Tabs

#### 1. 📰 FEED
Actividad cronológica del equipo (últimos 7 días):
- **Tests completados**: "Carlos completó Stroop con 94% de precisión"
- **Readiness del equipo**: "Tu equipo tiene un readiness medio de 71% hoy"
- **Streaks**: "Ana lleva 7 días seguidos registrando su sesión"

Cada item con:
- Icono según tipo
- Título descriptivo
- Fecha/hora relativa (ej: "hoy a las 10:30")
- Border izquierdo en color según tipo

#### 2. 🎯 RETO
Card del reto semanal con:
- Título y descripción
- Barra de progreso grupal
- % de progreso y contador (X de Y atletas)
- Rango de fechas
- Lista de atletas: ✓ Completado / ○ Pendiente

Si no hay reto: "No hay reto activo esta semana"

#### 3. 🏆 RANKING
Leaderboard por racha:
- Posición (con medallas: 🥇 🥈 🥉)
- Nombre del atleta
- Racha en días consecutivos

Orden: Por racha descendente

Se premia la **consistencia**, no el rendimiento absoluto.

#### 4. 👏 KUDOS
Dos secciones:

**Enviar Kudo:**
- Botón para abrir formulario
- Select para elegir compañero
- Textarea para mensaje (opcional)
- Botón "Enviar" y "Cancelar"

**Ranking de Kudos:**
- Tabla con nombre + cantidad de kudos recibidos (👏)
- Ordenado por cantidad DESC

---

## 🧮 Cálculo de Streak (Racha)

**Definición:** Días consecutivos con al menos UN registro:
- Sesión de entrenamiento
- Test cognitivo
- Check-in de wellness

**Lógica:**
1. Para cada atleta, revisar últimos 90 días
2. Marcar cada día como "check-in" si tiene ≥1 registro
3. Contar dias consecutivos desde hoy hacia atrás
4. Solo contar si streak llega a hoy o ayer

**Ejemplo:**
```
Hoy (04-05): ✓ Test
Ayer (03-05): ✓ Sesión
02-05: ✓ Wellness
01-05: ○ Sin registro  ← Se corta la racha aquí

Streak actual = 3 días
```

---

## 🎨 Colores

- Fondo: `#0f1117`
- Cards: `#1a1f2e`
- Acento cyan: `#00d4ff`
- Morado: `#a371f7`
- Azul: `#58a6ff`
- Verde: `#31eb96` (streak)
- Amarillo: `#ffd93d` (kudos)
- Rojo: `#ff6b6b`
- Gris: `#8b92a4`, `#30363d`

**Border Colors por Tipo:**
- Tests: Azul (`#58a6ff`)
- Readiness: Morado (`#a371f7`)
- Streaks: Verde (`#31eb96`)
- Default: Cyan (`#00d4ff`)

---

## 📂 Archivos Creados

```
server/
├── controllers/
│   ├── comunidadController.js
│   └── kudosController.js
├── routes/
│   ├── comunidadRoutes.js
│   └── kudosRoutes.js
└── index.js (actualizado)

client/src/
├── hooks/
│   ├── useComunidad.js
│   └── useKudos.js
├── pages/
│   └── Comunidad.jsx
├── components/BottomNav.jsx (actualizado)
└── App.jsx (actualizado)
```

---

## ✅ Validaciones

1. **Kudo a sí mismo:** No permitido
2. **Kudo a usuario de otro equipo:** No permitido
3. **Mensaje:** Opcional
4. **Streak:** Solo cuenta si hay actividad reciente (hoy o ayer)

---

## 🚀 Ejemplos de Actividad

**Feed Real:**
- "Carlos completó Stroop con 94% de precisión" → 🧠
- "Tu equipo tiene un readiness medio de 71% hoy (5 atletas)" → 📊
- "Ana lleva 7 días seguidos registrando su sesión" → 🔥

---

## 📱 Responsive

- 6 tabs en BottomNav (con scroll horizontal en móvil)
- Cards adaptan a pantalla
- Barra de progreso responsive
- Selects nativos en móvil

