# 📡 API Endpoints - Sistema IEPROES

## ✅ Endpoints Implementados

### 🔐 Autenticación
```
POST /api/auth/login
Body: { correo, clave }
Response: { success, token, usuario }
```

### 📊 Dashboard
```
GET /api/dashboard/stats
Response: { 
  success, 
  stats: { estudiantes, catedraticos, materias, notas } 
}
```

### 📚 Materias y Grupos
```
GET /api/grupos?idUsuario=X&rol=Y
Response: { success, materias: [...] }
- Admin: ve todas las materias
- Catedrático: solo sus materias asignadas

GET /api/grupos/:idgrupo/estudiantes
Response: { success, estudiantes: [...] }
- Retorna estudiantes inscritos con sus notas

POST /api/grupos/notas
Body: { idinscripcion, primero, segundo, tercero }
Response: { success, message, notafinal }
- Calcula automáticamente: (primero+segundo)/2 * 0.6 + tercero * 0.4
```

## 📋 Estructura de la Base de Datos

### Esquemas:
- `seguridad` - Usuarios y roles
- `academico` - Estudiantes, docentes, materias, grupos
- `registro` - Inscripciones y notas

### Tablas Principales:
```
seguridad.usuario (idusuario, correo, clave, idrol)
seguridad.rol (idrol, nombrerol)

academico.estudiante (idestudiante, expediente, nombre, apellidos, idusuario)
academico.docente (iddocente, nombres, apellidos, idusuario)
academico.materia (idmateria, codigomateria, nombre, unidadesvalorativas)
academico.grupo (idgrupo, cupomaximo, idmateria, iddocente, idciclo)
academico.cicloacademico (idciclo, año, periodo)

registro.inscripcion (idinscripcion, idestudiante, idgrupo)
registro.notas (idnota, primero, segundo, tercero, notafinal, idinscripcion)
```

## 🔄 Próximos Pasos

1. ✅ Conectar página de materias con API
2. ✅ Conectar página de notas con API
3. ⏳ Implementar guardado de notas
4. ⏳ Agregar validaciones
5. ⏳ Implementar búsqueda y filtros

## 🚀 Cómo Usar

### Backend:
```bash
cd backend
npm run dev
```

### Frontend:
```bash
cd frontend-web/frontend-web
npm run dev
```

### Variables de Entorno (.env):
```
PG_USER=postgres
PG_HOST=localhost
PG_DATABASE=DB_UNI
PG_PASSWORD=root
PG_PORT=5433
PORT=3000
JWT_SECRET=ieproes_secret_key_2024_sistema_academico
```

### Frontend (.env.local):
```
NEXT_PUBLIC_API_URL=http://localhost:3000
```
