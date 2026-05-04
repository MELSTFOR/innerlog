# Instalación y Configuración - Módulo 1: Sesiones de Entrenamiento

## 📦 Dependencias Frontend Adicionales

```bash
npm install recharts react-router-dom axios
```

## 🛠️ Configuración Tailwind CSS

Si no lo has hecho aún:

```bash
npx tailwindcss init -p
```

En `tailwind.config.js`:
```javascript
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
```

## 🚀 Estructura del Proyecto Frontend

```
client/src/
├── components/
│   ├── AuthContext.jsx
│   ├── ProtectedRoute.jsx
│   ├── Slider.jsx
│   ├── BottomNav.jsx
│   └── .gitkeep
├── pages/
│   ├── Login.jsx
│   ├── Register.jsx
│   ├── Registro.jsx (Registro de sesiones)
│   ├── Historia.jsx (Historial)
│   ├── Resumen.jsx (Resumen y gráficos)
│   └── .gitkeep
├── hooks/
│   ├── useAuth.js
│   ├── useSesiones.js
│   └── .gitkeep
├── context/
│   ├── AuthContext.jsx
│   └── .gitkeep
├── utils/
│   ├── api.js
│   └── .gitkeep
├── App.jsx (routing principal)
└── main.jsx
```

## 🔐 Endpoints Backend

### Sesiones

#### POST /api/sesiones
Crear nueva sesión

```json
{
  "esfuerzo_mental": 7,
  "enfoque": 8,
  "emocional": 6,
  "fatiga_carrera": 5,
  "fatiga_dia_siguiente": 4,
  "satisfaccion": 8,
  "notas": "Buena sesión, me sentí fuerte"
}
```

#### GET /api/sesiones
Obtener todas las sesiones del usuario autenticado

#### GET /api/sesiones/:id
Obtener una sesión específica

#### PATCH /api/sesiones/:id
Actualizar una sesión (cualquier campo)

```json
{
  "fatiga_dia_siguiente": 6
}
```

#### DELETE /api/sesiones/:id
Eliminar una sesión

---

## 📋 Pantallas Implementadas

### 1. **Registro** (`/registro`)
- ✅ Sliders del 1-10 para 6 métricas
- ✅ Campo de notas (textarea)
- ✅ Botón "Guardar Sesión"
- ✅ Validación de datos
- ✅ Feedback de éxito/error

### 2. **Historia** (`/historia`)
- ✅ Lista de todas las sesiones
- ✅ Click en sesión abre modal
- ✅ Editar fatiga_dia_siguiente con slider
- ✅ Guardar cambios parciales
- ✅ Número total de sesiones

### 3. **Resumen** (`/resumen`)
- ✅ Grid 2x3 con 6 estadísticas:
  - Satisfacción promedio
  - Enfoque promedio
  - Esfuerzo mental promedio
  - Sesiones totales
  - Mejor puntuación
  - Fatiga promedio
- ✅ Gráfico de líneas con 3 series (enfoque, esfuerzo, satisfacción)
- ✅ Tooltip interactivo
- ✅ Leyenda de colores

### 4. **Navegación Inferior**
- ✅ 3 botones: Registro, Historia, Resumen
- ✅ Indicador de página activa (border superior cyan)
- ✅ Emojis descriptivos
- ✅ Fixed al pie

---

## 🎨 Colores Implementados

- **Fondo principal**: `#0f1117`
- **Cards**: `#1a1f2e`
- **Texto principal**: `#c9d1d9`
- **Texto secundario**: `#8b92a4`
- **Acento (Cyan)**: `#00d4ff`
- **Acento secundario**: `#a371f7` (morado para líneas)
- **Acento terciario**: `#58a6ff` (azul para líneas)
- **Border**: `#30363d`
- **Error**: `#ff6b6b`
- **Éxito**: `#31eb96`

---

## ✅ Checklist de Instalación

- [ ] Instalar `recharts`
- [ ] Copiar `.env.local` con `VITE_API_URL=http://localhost:3000/api`
- [ ] Actualizar `App.jsx` con rutas
- [ ] Importar `App.jsx` en `main.jsx`
- [ ] Verificar que `AuthProvider` envuelve toda la app
- [ ] Testear navegación entre pantallas
- [ ] Testear creación de sesión
- [ ] Testear visualización de historial
- [ ] Testear gráfico de resumen

---

## 🧪 Testing Manual

1. **Crear sesión**:
   - Ir a `/registro`
   - Ajustar sliders
   - Agregar nota (opcional)
   - Click "Guardar Sesión"
   - Verificar mensaje de éxito

2. **Ver historial**:
   - Ir a `/historia`
   - Click en una sesión
   - Cambiar fatiga al día siguiente
   - Click "Guardar"
   - Verificar actualización

3. **Ver resumen**:
   - Ir a `/resumen`
   - Verificar cálculos de promedios
   - Pasar mouse sobre gráfico
   - Verificar tooltip interactivo

