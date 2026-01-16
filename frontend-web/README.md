# Sistema Completo IEPROES

## Estructura del Proyecto

```
Repo-uni/
├── backend/              # API REST (Node.js + Express + PostgreSQL)
├── src/                  # App móvil para estudiantes (React Native + Expo)
└── frontend-web/         # Portal web para catedráticos y admin (Next.js)
```

## Roles del Sistema

### 1. Estudiante (App Móvil)
- Ver perfil
- Ver notas
- Ver servicios

### 2. Catedrático (Portal Web)
- Ver materias asignadas
- Ver estudiantes por grupo
- Ingresar y editar notas

### 3. Administrador (Portal Web)
- Crear usuarios
- Crear estudiantes
- Crear catedráticos
- Crear materias
- Ver todos los usuarios

## Instalación y Ejecución

### Backend
```bash
cd backend
npm install
npm start
```

### App Móvil (Estudiantes)
```bash
npm install
npx expo start
```

### Portal Web (Catedráticos y Admin)
```bash
cd frontend-web
npm install
npm run dev
```

Acceder a: http://localhost:3000

## Endpoints API Nuevos

### Catedrático
- GET `/api/catedratico/materias/:idCatedratico` - Obtener materias del catedrático
- GET `/api/catedratico/estudiantes/:idGrupo` - Obtener estudiantes de un grupo
- POST `/api/catedratico/notas` - Ingresar/actualizar notas

### Administrador
- GET `/api/admin/usuarios` - Listar usuarios
- POST `/api/admin/usuarios` - Crear usuario
- POST `/api/admin/estudiantes` - Crear estudiante
- POST `/api/admin/catedraticos` - Crear catedrático
- POST `/api/admin/materias` - Crear materia

## Credenciales de Prueba

Debes crear en la base de datos:
- Admin: admin@ieproes.edu.sv / admin123
- Catedrático: catedratico@ieproes.edu.sv / cate123
- Estudiante: estudiante@ieproes.edu.sv / est123
