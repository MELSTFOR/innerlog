# Dashboard Principal - Readiness Score Unificado

## 📋 Backend - Cálculo del Readiness Score

### Endpoint: GET /api/readiness/hoy

**Descripción:** Calcula el readiness score diario basado en tres componentes principales.

**Lógica de Cálculo:**

#### 1. **Wellness Score** (40% del total)
```
Wellness score = promedio de (fatiga + sueño + dolor + estrés) / 4
Normalizado de 1-5 a 0-100:
Wellness Score = ((promedio - 1) / 4) × 100
```

Rango:
- 1 = 0 puntos
- 3 = 50 puntos
- 5 = 100 puntos

#### 2. **Cognitivo Score** (35% del total)
```
Cognitivo Score = Precisión del último test (0-100)
Decaimiento: -10% por cada día sin test reciente
```

Si no hay test reciente, el score disminuye automáticamente.

#### 3. **Sesión Score** (25% del total)
```
Componentes = (Satisfacción + (10 - Fatiga Carrera) + Enfoque) / 3
Sesión Score = (Componentes / 10) × 100
```

#### 4. **Readiness Final**
```
Readiness = (Wellness × 0.40) + (Cognitivo × 0.35) + (Sesión × 0.25)
```

**Semáforo:**
- 🟢 Verde: > 70 (Listo para competir)
- 🟡 Amarillo: 40-70 (Estado regular)
- 🔴 Rojo: < 40 (Necesita recuperación)

### Endpoints Adicionales

**GET /api/readiness/tendencia**
- Obtiene el score de los últimos 7 días
- Formato: Array de objetos {fecha, score}

**GET /api/readiness/usuario/:userId**
- Obtiene el score de hoy de otro usuario
- Usado para mostrar equipo

---

## 🎨 Frontend - Dashboard (/inicio)

### Componentes

#### 1. **Página Inicio.jsx**
- Página principal del atleta
- Saludo personalizado con nombre y fecha
- Integración de todos los widgets
- Navegación rápida

#### 2. **ReadinessWidget.jsx**
Gran widget circular con:
- Score numérico (0-100)
- Color según estado (verde/amarillo/rojo)
- Etiqueta de estado
- Indicadores de componentes

#### 3. **TeamReadiness.jsx**
Muestra compañeros de equipo:
- Avatares circulares
- Score de readiness
- Color de estado
- Nombre del compañero

#### 4. **BottomNav.jsx (Actualizado)**
5 tabs principales:
- 🏠 Inicio (nuevo)
- 📝 Registro
- 📊 Historia
- 💪 Wellness
- 🧠 Tests

#### 5. **Accesos Rápidos**
Grid de 4 botones:
- 🧠 Test Cognitivo → /tests
- 💪 Wellness → /wellness
- 📝 Registrar Sesión → /registro
- 👥 Comunidad → /historia

#### 6. **Gráfico de Tendencia**
- LineChart de recharts
- Últimos 7 días
- Score vs Fecha
- Tooltip interactivo

#### 7. **Cards de Scores Desglosados**
Grid 3x1 mostrando:
- Wellness Score
- Cognitivo Score
- Sesión Score

---

## 🧮 Ejemplo de Cálculo

### Supongamos un usuario con:

**Wellness (hoy):**
- Fatiga: 4
- Sueño: 3
- Dolor: 2
- Estrés: 3
- Promedio = 3
- Wellness Score = ((3 - 1) / 4) × 100 = **50**

**Cognitivo:**
- Último test (Stroop): Precisión 85%
- Sin días de diferencia
- Cognitivo Score = **85**

**Sesión (hoy):**
- Satisfacción: 8
- Fatiga Carrera: 4
- Enfoque: 7
- Promedio = (8 + (10-4) + 7) / 3 = 21/3 = 7
- Sesión Score = (7 / 10) × 100 = **70**

**Readiness Final:**
```
Readiness = (50 × 0.40) + (85 × 0.35) + (70 × 0.25)
         = 20 + 29.75 + 17.5
         = 67.25 ≈ 67
```

**Estado:** 🟡 Amarillo (40-70) → "Estado regular"

---

## 🗂️ Estructura de Archivos

```
server/
├── controllers/
│   └── readinessController.js
├── routes/
│   └── readinessRoutes.js
└── index.js (actualizado)

client/src/
├── components/
│   ├── ReadinessWidget.jsx
│   ├── TeamReadiness.jsx
│   └── BottomNav.jsx (actualizado)
├── hooks/
│   └── useReadiness.js
├── pages/
│   └── Inicio.jsx
└── App.jsx (actualizado)
```

---

## 📊 Base de Datos

### Tabla: readiness_scores

```sql
CREATE UNIQUE INDEX idx_readiness_usuario_fecha 
ON readiness_scores(usuario_id, fecha);
```

Esto permite upsert diario sin duplicados.

---

## 🎨 Colores

- Fondo: `#0f1117`
- Cards: `#1a1f2e`
- 🟢 Verde: `#31eb96`
- 🟡 Amarillo: `#ffd93d`
- 🔴 Rojo: `#ff6b6b`
- Acento: `#00d4ff`
- Morado: `#a371f7`
- Azul: `#58a6ff`

---

## ✅ Checklist

- [ ] Backend: Endpoint /api/readiness/hoy funcionando
- [ ] Backend: Lógica de ponderación correcta
- [ ] Backend: Decaimiento cognitivo implementado
- [ ] Backend: Upsert diario funcionando
- [ ] Frontend: Dashboard Inicio carga correctamente
- [ ] Frontend: Widget Readiness muestra color correcto
- [ ] Frontend: Accesos rápidos navegan correctamente
- [ ] Frontend: Gráfico de tendencia se renderiza
- [ ] Frontend: Equipo se muestra (cuando hay)
- [ ] Navegación: BottomNav con 5 tabs
- [ ] Navegación: /inicio como página predeterminada

---

## 🚀 Próximos Pasos

1. Implementar funcionalidad de equipos
2. Agregar kudos entre compañeros
3. Historial de retos del equipo
4. Notificaciones de cambios de readiness
5. Comparativas de performance

