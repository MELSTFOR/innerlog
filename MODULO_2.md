# Módulo 2 - Wellness y Tests Cognitivos

## 📋 Backend

### Controllers
- `wellnessController.js` - Gestión de wellness entries
- `testsController.js` - Gestión de tests cognitivos

### Routes
- `wellnessRoutes.js` - POST /api/wellness, GET /api/wellness, GET /api/wellness/today
- `testsRoutes.js` - POST /api/tests, GET /api/tests, GET /api/tests/:tipo

### Endpoints

#### Wellness

**POST /api/wellness**
```json
{
  "fatiga": 3,
  "sueno": 4,
  "dolor": 2,
  "estres": 3
}
```
Valores: 1-5

**GET /api/wellness**
- Obtiene las últimas 7 entradas de wellness

**GET /api/wellness/today**
- Obtiene el check-in de hoy (si existe)

#### Tests

**POST /api/tests**
```json
{
  "tipo_test": "stroop",
  "precision": 85.5,
  "tr_medio": 450,
  "tr_min": 200,
  "tr_max": 800,
  "lapses": 2,
  "anticipaciones": 1,
  "duracion": 60
}
```
Tipos válidos: `stroop`, `pvt-b`, `msit`

**GET /api/tests**
- Obtiene todos los tests del usuario

**GET /api/tests/:tipo**
- Obtiene los últimos 10 tests de un tipo específico

---

## 🎨 Frontend

### Hooks
- `useWellness.js` - Manejo de wellness entries
- `useTests.js` - Manejo de tests cognitivos

### Componentes Tests
- `Stroop.jsx` - Test de interferencia Stroop (60s)
- `PVTB.jsx` - Psychomotor Vigilance Task (5min)
- `MSIT.jsx` - Multi-Source Interference Task (3min)

### Páginas
- `Wellness.jsx` (/wellness) - Check-in diario de wellness
- `Tests.jsx` (/tests) - Selector y hub de tests

### Navegación
- Actualizada `BottomNav.jsx` con 5 tabs

---

## 📊 Pantalla Wellness (/wellness)

**Sliders 1-5:**
1. **Fatiga**: "Muy fatigado" ↔ "Muy recuperado"
2. **Sueño**: "Insomnio" ↔ "Muy relajante"
3. **Dolor Muscular**: "Muy dolorido" ↔ "Muy buenas sensaciones"
4. **Estrés**: "Muy estresado" ↔ "Muy relajado"

**Características:**
- ✅ Detecta si ya hay entrada de hoy
- ✅ Permite actualizar valores
- ✅ Feedback visual

---

## 🧠 Tests Cognitivos (/tests)

### 1. Test Stroop (60 segundos)
**Concepto:** Palabra escrita en color diferente al que denota

**Ejecución:**
- Se muestra palabra (ej: "ROJO" escrito en azul)
- Usuario pulsa botón del color de la tinta
- 60 segundos

**Métricas Calculadas:**
- Precisión %
- Tiempo promedio de reacción (ms)
- TR mínimo y máximo
- Interpretación: Baja/Media/Alta carga mental

**Interpretación:**
- TR < 400ms: Muy alta
- TR 400-600ms: Alta
- TR 600-800ms: Media
- TR > 800ms: Baja

---

### 2. PVT-B (Psychomotor Vigilance Task - 5 minutos)
**Concepto:** Reactividad a estímulos visuales aleatorios

**Ejecución:**
- Círculo rojo aparece tras 2-10 segundos aleatorios
- Usuario presiona al verlo
- 5 minutos

**Métricas Calculadas:**
- TR promedio (ms)
- TR mínimo y máximo
- Lapses: cantidad de respuestas con TR > 500ms
- Anticipaciones: cantidad de respuestas con TR < 100ms
- Número total de estímulos

**Interpretación:**
- TR < 250ms: Excelente
- TR 250-350ms: Muy bueno
- TR 350-450ms: Bueno
- TR 450-600ms: Regular
- TR > 600ms: Bajo

---

### 3. MSIT (Multi-Source Interference Task - 3 minutos)
**Concepto:** Control inhibitorio bajo interferencia

**Ejecución:**
- Se muestran 3 números: dos iguales, uno diferente
- Usuario presiona el número diferente
- 3 minutos

**Métricas Calculadas:**
- Precisión %
- Tiempo promedio de reacción (ms)
- TR mínimo y máximo

**Interpretación de Control Cognitivo:**
- Precisión > 85%: Excelente
- Precisión 70-85%: Bueno
- Precisión 50-70%: Regular
- Precisión < 50%: Interferencia cognitiva alta

---

## 🗂️ Estructura de Archivos

```
server/
├── controllers/
│   ├── wellnessController.js
│   └── testsController.js
├── routes/
│   ├── wellnessRoutes.js
│   └── testsRoutes.js
└── index.js (actualizado)

client/src/
├── components/
│   ├── tests/
│   │   ├── Stroop.jsx
│   │   ├── PVTB.jsx
│   │   └── MSIT.jsx
│   └── BottomNav.jsx (actualizado)
├── hooks/
│   ├── useWellness.js
│   └── useTests.js
├── pages/
│   ├── Wellness.jsx
│   └── Tests.jsx
└── App.jsx (actualizado)
```

---

## 🎨 Colores Utilizados

- Fondo: `#0f1117`
- Cards: `#1a1f2e`
- Acento principal: `#00d4ff`
- Acento secundario: `#a371f7`
- Acento terciario: `#58a6ff`
- Éxito: `#31eb96`
- Error/Lapses: `#ff6b6b`
- Anticipaciones: `#ffd93d`
- Texto: `#c9d1d9`
- Texto secundario: `#8b92a4`

---

## ✅ Checklist

- [ ] Backend: Controllers y routes funcionando
- [ ] Backend: Endpoints testeados en Postman
- [ ] Frontend: Pantalla Wellness funcional
- [ ] Frontend: Test Stroop funcionando
- [ ] Frontend: Test PVT-B funcionando
- [ ] Frontend: Test MSIT funcionando
- [ ] Frontend: BottomNav actualizado
- [ ] Frontend: Navegación sin errores
- [ ] Tests guardándose en BD

---

## 🧪 Testing Manual

### Wellness
1. Ir a /wellness
2. Mover sliders
3. Guardar
4. Volver y verificar que muestra "Ya completaste tu check-in"
5. Actualizar valores

### Tests
1. Ir a /tests
2. Seleccionar Stroop
3. Completar test
4. Ver resultados
5. Volver a pantalla de selección
6. Repetir con PVT-B y MSIT

