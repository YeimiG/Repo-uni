# 🚀 Guía de Inicio Rápido

## Opción 1: Inicio Automático (Recomendado)
Ejecuta el archivo `start-services.bat` haciendo doble clic en él. Este script:
- Instala todas las dependencias automáticamente
- Inicia el backend en puerto 3000
- Inicia el frontend en puerto 3001

## Opción 2: Inicio Manual

### 1. Backend (Puerto 3000)
```bash
cd backend
npm install
npm run dev
```

### 2. Frontend (Puerto 3001)
```bash
cd frontend-web
npm install
npm run dev
```

## 🔗 URLs de Acceso

- **Backend API**: http://localhost:3000
- **Frontend Web**: http://localhost:3001

## 🎯 Accesos de Prueba

En el frontend web (http://localhost:3001):
- **Administrador**: Clic en botón "Admin"
- **Catedrático**: Clic en botón "Catedrático"

## 📋 Requisitos Previos

- Node.js 18+
- PostgreSQL 12+ (configurado según backend/.env)
- npm o yarn

## ⚠️ Solución de Problemas

### Error de Puerto Ocupado
Si el puerto 3000 o 3001 están ocupados:
```bash
# Encontrar proceso usando el puerto
netstat -ano | findstr :3000
# Terminar proceso (reemplaza PID)
taskkill /PID <PID> /F
```

### Error de Base de Datos
Verifica que PostgreSQL esté corriendo y la configuración en `backend/.env` sea correcta:
```
PG_USER=postgres
PG_HOST=localhost
PG_DATABASE=DB_UNI
PG_PASSWORD=root
PG_PORT=5433
```

### Error de Dependencias
Si hay errores de instalación:
```bash
# Limpiar cache de npm
npm cache clean --force
# Eliminar node_modules y reinstalar
rm -rf node_modules package-lock.json
npm install
```