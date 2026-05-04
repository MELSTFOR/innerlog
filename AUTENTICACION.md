# Sistema de Autenticación INNERLOG

## 📋 Backend

### Dependencias necesarias
```bash
npm install express bcryptjs jsonwebtoken pg cors dotenv
npm install --save-dev nodemon
```

### Variables de entorno (.env)
```
PORT=3000
NODE_ENV=development

DB_HOST=localhost
DB_PORT=5432
DB_NAME=innerlog_db
DB_USER=postgres
DB_PASSWORD=tu_contraseña

JWT_SECRET=tu_secreto_muy_seguro_aqui
JWT_EXPIRY=7d

FRONTEND_URL=http://localhost:5173
```

### Iniciar servidor
```bash
cd server
npm install
npm start  # o npm run dev
```

El servidor correrá en `http://localhost:3000`

---

## 🎨 Frontend

### Dependencias necesarias
```bash
npm install react-router-dom axios
npm install -D tailwindcss postcss autoprefixer
```

### Variables de entorno (.env.local)
```
VITE_API_URL=http://localhost:3000/api
```

### Configuración de Tailwind
```bash
npx tailwindcss init -p
```

### Iniciar aplicación
```bash
cd client
npm install
npm run dev
```

La aplicación correrá en `http://localhost:5173`

---

## 🔐 Endpoints de Autenticación

### 1. Registro
**POST** `/api/auth/register`

```json
{
  "nombre": "Juan Pérez",
  "email": "juan@example.com",
  "password": "contraseña123",
  "rol": "atleta", // "atleta", "entrenador", "club"
  "deporte": "Atletismo",
  "nivel": "intermedio" // "principiante", "intermedio", "avanzado"
}
```

Respuesta:
```json
{
  "message": "Usuario registrado exitosamente",
  "token": "eyJhbGc...",
  "user": {
    "id": 1,
    "nombre": "Juan Pérez",
    "email": "juan@example.com",
    "rol": "atleta",
    "deporte": "Atletismo",
    "nivel": "intermedio"
  }
}
```

### 2. Login
**POST** `/api/auth/login`

```json
{
  "email": "juan@example.com",
  "password": "contraseña123"
}
```

Respuesta: Mismo formato que registro

### 3. Obtener Usuario Actual
**GET** `/api/auth/me`

Header:
```
Authorization: Bearer eyJhbGc...
```

---

## 🛡️ Middlewares

### authMiddleware
Valida que el JWT sea válido y adjunta el usuario al request:

```javascript
const authMiddleware = require('./middleware/auth');

app.get('/ruta-protegida', authMiddleware, (req, res) => {
  console.log(req.user); // { id, email, rol }
});
```

### rolesMiddleware
Verifica que el usuario tenga un rol específico:

```javascript
const { requireRole } = require('./middleware/roles');

app.post(
  '/crear-entrenamiento',
  authMiddleware,
  requireRole(['entrenador', 'admin']),
  (req, res) => {
    // Solo entrenadores y admins
  }
);
```

---

## 🎯 Flujo de Frontend

### AuthContext
Maneja:
- `register(nombre, email, password, rol, deporte, nivel)` - Registra usuario
- `login(email, password)` - Inicia sesión
- `logout()` - Cierra sesión
- `getMe()` - Obtiene datos del usuario actual
- `user` - Datos del usuario logueado
- `token` - JWT actual
- `isAuthenticated` - Boolean

### useAuth Hook
Simplifica el acceso al contexto:

```jsx
import { useAuth } from '../hooks/useAuth';

function MiComponente() {
  const { user, login, logout, isAuthenticated } = useAuth();

  return (
    <div>
      {isAuthenticated ? (
        <p>Bienvenido {user.nombre}</p>
      ) : (
        <p>Inicia sesión</p>
      )}
    </div>
  );
}
```

### ProtectedRoute
Componente para proteger rutas:

```jsx
import ProtectedRoute from '../components/ProtectedRoute';

<Routes>
  <Route path="/login" element={<Login />} />
  <Route
    path="/dashboard"
    element={
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    }
  />
</Routes>
```

---

## 🎨 Colores (Dark Mode)

- **Fondo**: `#0f1117`
- **Cards**: `#1a1f2e`
- **Texto principal**: `#c9d1d9`
- **Texto secundario**: `#8b92a4`
- **Acento**: `#00d4ff` (cyan)
- **Border**: `#30363d`
- **Error**: `#ff6b6b` (rojo)

---

## ✅ Checklist de Instalación

- [ ] Backend: Instalar dependencias
- [ ] Backend: Configurar .env
- [ ] Frontend: Instalar dependencias
- [ ] Frontend: Configurar .env.local
- [ ] Frontend: Configurar Tailwind CSS
- [ ] Frontend: Importar AuthProvider en main.jsx o App.jsx
- [ ] Probar endpoints en Postman/Insomnia
- [ ] Probar Login/Register en navegador

