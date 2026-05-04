# Dashboard del Entrenador

## 📋 Backend - Endpoints

### GET /api/entrenador/equipo

**Descripción:** Obtiene lista de atletas del equipo con su readiness del día.

**Autenticación:** Requerida (rol: entrenador)

**Respuesta:**
```json
{
  "atletas": [
    {
      "id": 1,
      "nombre": "Juan Pérez",
      "deporte": "Atletismo",
      "nivel": "avanzado",
      "readiness": 78,
      "status": "green"
    },
    {
      "id": 2,
      "nombre": "María García",
      "deporte": "Natación",
      "nivel": "intermedio",
      "readiness": 35,
      "status": "red"
    }
  ]
}
```

**Lógica:**
- Obtiene el `equipo_id` del entrenador autenticado
- Devuelve todos los `usuarios` con `rol = 'atleta'` del equipo
- Agrega el score más reciente de `readiness_scores` para hoy
- Asigna estado (green/yellow/red) basado en el score

---

### GET /api/entrenador/atleta/:id

**Descripción:** Obtiene historial completo de un atleta.

**Autenticación:** Requerida (rol: entrenador)

**Parámetros:**
- `id`: ID del atleta

**Respuesta:**
```json
{
  "atleta": {
    "id": 1,
    "nombre": "Juan Pérez",
    "deporte": "Atletismo",
    "nivel": "avanzado"
  },
  "tests": [
    {
      "id": 1,
      "tipo_test": "stroop",
      "precision": 92,
      "tr_medio": 350,
      "duracion": 60000,
      "timestamp": "2026-05-04T10:30:00Z"
    }
  ],
  "sesiones": [
    {
      "id": 1,
      "esfuerzo_mental": 8,
      "enfoque": 7,
      "emocional": 6,
      "fatiga_carrera": 4,
      "fatiga_dia_siguiente": 3,
      "satisfaccion": 8,
      "notas": "Sesión muy productiva",
      "timestamp": "2026-05-04T14:00:00Z"
    }
  ],
  "wellness": [
    {
      "id": 1,
      "fatiga": 3,
      "sueno": 4,
      "dolor": 2,
      "estres": 2,
      "timestamp": "2026-05-04T08:00:00Z"
    }
  ]
}
```

**Lógica:**
- Verifica que el entrenador esté en el mismo equipo que el atleta
- Devuelve últimos 10 tests, sesiones y últimos 7 wellness
- Ordenados por timestamp DESC

---

### GET /api/entrenador/tendencia

**Descripción:** Obtiene el readiness promedio del equipo últimos 7 días.

**Autenticación:** Requerida (rol: entrenador)

**Respuesta:**
```json
{
  "tendencia": [
    {
      "fecha": "2026-04-28",
      "score_promedio": 65,
      "atletas_registrados": 5
    },
    {
      "fecha": "2026-04-29",
      "score_promedio": 72,
      "atletas_registrados": 5
    }
  ]
}
```

**Lógica:**
- Agrupa por fecha
- Calcula promedio de readiness de todos los atletas por día
- Cuenta cuántos atletas tienen registro ese día
- Últimos 7 días

---

## 🎨 Frontend - Estructura

### Página: /entrenador (Entrenador.jsx)

**Componentes visuales:**

1. **Header**
   - Título "Mi Equipo"
   - Contador de atletas

2. **Alerta de Readiness Bajo**
   - Solo se muestra si 2+ atletas tienen readiness < 40
   - Fondo rojo, borde izquierdo rojo
   - Mensaje: "X atletas llegan con readiness bajo hoy — considerá reducir la carga"

3. **Lista de Atletas**
   - Card por atleta con:
     - Nombre (bold)
     - Deporte y nivel
     - Score grande (número o "—")
     - Estado (Listo/Regular/Bajo)
     - Semáforo visual (🟢/🟡/🔴)
   - Clickeable → abre `/entrenador/atleta/:id`
   - Border color según readiness

4. **Gráfico de Tendencia**
   - LineChart de Recharts
   - Últimos 7 días
   - Readiness promedio del equipo vs Fecha
   - Solo se muestra si hay datos

---

### Página: /entrenador/atleta/:id (AtletaDetail.jsx)

**Header:**
- Botón "Volver"
- Nombre atleta
- Deporte y nivel

**Tabs:**
1. **🧠 Tests Cognitivos**
   - Card por test con:
     - Tipo (STROOP/PVT-B/MSIT)
     - Fecha/hora
     - Precisión (%) - color según rendimiento
     - TR Promedio
     - Duración
   - Últimos 10 tests

2. **📝 Sesiones Registradas**
   - Card por sesión con:
     - Fecha/hora
     - Satisfacción ★ (color según score)
     - Grid 2x3 con todos los métricas
     - Notas (si existen)
   - Últimas 10 sesiones

3. **💪 Wellness**
   - Card por entrada con:
     - Fecha/hora
     - 4 sliders visuales:
       - Fatiga (morado)
       - Sueño (azul)
       - Dolor (rojo)
       - Estrés (amarillo)
   - Últimos 7 registros

---

## 🎨 Colores

- Fondo: `#0f1117`
- Cards: `#1a1f2e`
- 🟢 Verde: `#31eb96` (readiness > 70)
- 🟡 Amarillo: `#ffd93d` (readiness 40-70)
- 🔴 Rojo: `#ff6b6b` (readiness < 40)
- Acento cyan: `#00d4ff`
- Morado: `#a371f7`
- Azul: `#58a6ff`
- Gris: `#8b92a4`, `#30363d`

---

## 📂 Archivos Creados

```
server/
├── controllers/entrenadorController.js
└── routes/entrenadorRoutes.js

client/src/
├── hooks/useEntrenador.js
├── pages/
│   ├── Entrenador.jsx
│   └── AtletaDetail.jsx
├── components/BottomNav.jsx (actualizado)
└── App.jsx (actualizado)
```

---

## 🧪 Rol Basado en BottomNav

**Si `user.rol === 'entrenador'`:**
- 👥 Mi Equipo → /entrenador
- 📝 Registro → /registro
- 📊 Historia → /historia
- 💪 Wellness → /wellness
- 🧠 Tests → /tests

**Si `user.rol === 'atleta'`:**
- 🏠 Inicio → /inicio
- 📝 Registro → /registro
- 📊 Historia → /historia
- 💪 Wellness → /wellness
- 🧠 Tests → /tests

---

## ✅ Validaciones

1. **Acceso protegido:**
   - Solo usuarios con `rol = 'entrenador'` pueden acceder a `/entrenador`
   - Solo pueden ver atletas de su equipo (`equipo_id` debe coincidir)

2. **Alerta automática:**
   - Se muestra cuando `lowReadinessCount >= 2`
   - Se actualiza cada vez que cambian los atletas

3. **Navegación:**
   - Desde lista de atletas → detalle con pestaña Tests por defecto
   - Botón "Volver" regresa a la lista

---

## 🚀 Próximas Mejoras

1. Exportar datos del equipo a CSV
2. Asignar entrenamientos específicos
3. Comentarios en tiempo real
4. Notificaciones de alertas
5. Gráficos comparativos entre atletas
6. Sistema de retos del equipo

