# INNERLOG

Aplicación web fullstack con React, Node.js/Express y PostgreSQL.

## 🚀 Stack Tecnológico

**Frontend:**
- React
- Tailwind CSS
- Vite (Bundler)

**Backend:**
- Node.js
- Express.js
- PostgreSQL

## 📁 Estructura del Proyecto

```
INNERLOG/
├── client/              # Aplicación React
│   └── src/
│       ├── components/  # Componentes reutilizables
│       ├── pages/       # Páginas principales
│       ├── hooks/       # Custom hooks
│       ├── context/     # Context API
│       └── utils/       # Funciones utilitarias
│
├── server/              # Servidor Express
│   ├── routes/          # Definición de rutas
│   ├── controllers/     # Lógica de negocio
│   ├── models/          # Modelos de datos
│   ├── middleware/      # Middleware
│   └── config/          # Configuración
│
├── .env.example         # Variables de entorno (ejemplo)
└── README.md            # Este archivo
```

## 🔧 Instalación

### Requisitos
- Node.js v16+
- PostgreSQL 12+

### Backend
```bash
cd server
npm install
npm run dev
```

### Frontend
```bash
cd client
npm install
npm run dev
```

## 🗄️ Base de Datos

Ver configuración en `server/config/database.js`

## 📝 Notas

- Copiar `.env.example` a `.env` y configurar variables locales
- Las migraciones van en `server/migrations/` (crear carpeta si es necesario)
- Los seeds van en `server/seeds/` (crear carpeta si es necesaria)
