# Guía de Deployment INNERLOG

## 1. Setup en Railway (Backend + PostgreSQL)

### 1.1 Crear cuenta en Railway
- Ve a https://railway.app
- Sign up con GitHub
- Crea nuevo proyecto

### 1.2 Crear base de datos PostgreSQL en Railway
- En el proyecto, click en "+ Create"
- Selecciona "Database"
- Elige "PostgreSQL"
- Railway te dará un `DATABASE_URL` (cópialo)

### 1.3 Crear aplicación Node en Railway
- Click en "+ Create" again
- Selecciona "GitHub Repo"
- Conecta tu repo de GitHub
- Configura la carpeta root como `server`

### 1.4 Configurar variables de entorno en Railway
En el servicio Node, ve a "Variables":

```
PORT=3000
DATABASE_URL=<el que te generó Railway>
JWT_SECRET=innerlog_jwt_secret_2026_production_key_very_secure_random_string_12345
FRONTEND_URL=https://innerlog.vercel.app
NODE_ENV=production
```

### 1.5 Ejecutar migración de BD en Railway
```bash
# En tu terminal local
railway link  # Conecta a tu proyecto
railway run bash
psql -d $DATABASE_URL < server/models/schema.sql
psql -d $DATABASE_URL < server/seed.sql
```

---

## 2. Deploy Frontend en Vercel

### 2.1 Crear cuenta en Vercel
- Ve a https://vercel.com
- Sign up con GitHub

### 2.2 Importar proyecto
- Click "Import Project"
- Selecciona tu repo
- Framework: React
- Root Directory: `client`

### 2.3 Configurar variables de entorno
En "Environment Variables":

```
VITE_API_URL=https://innerlog-api.up.railway.app
```

(Reemplaza con tu URL real de Railway)

### 2.4 Deploy
- Click "Deploy"
- Vercel construye y despliega automáticamente

---

## 3. Actualizar URLs después de obtener dominios

Una vez que Railway te genere la URL del backend (ej: `https://innerlog-api-prod.up.railway.app`):

1. **En Vercel:** Actualiza la variable `VITE_API_URL`
2. **En Railway:** Actualiza `FRONTEND_URL` si es necesario
3. **Redeploy ambos** si es necesario

---

## 4. Verificar que funciona

1. Accede a `https://innerlog.vercel.app/login`
2. Login con:
   - **Atleta:** melina@fila.com / running123
   - **Entrenador:** pedro@fila.com / running123

¡Listo!
