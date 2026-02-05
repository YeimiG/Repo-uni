# 🔐 Instrucciones de Login - Frontend Web IEPROES

## ✅ Cambios Realizados

### 1. **Backend**
- ✅ JWT_SECRET agregado al `.env`
- ✅ Login controller ya valida roles (bloquea estudiantes)
- ✅ Comparación de contraseñas en texto plano (sin encriptación)

### 2. **Frontend Web**
- ✅ Servicio de autenticación conectado a la API
- ✅ Hook useAuth mejorado con información del usuario
- ✅ Página de login funcional con validación
- ✅ Dashboard protegido con redirección automática
- ✅ Logout funcional
- ✅ Tipos de usuario actualizados

## 🚀 Cómo Probar

### Paso 1: Iniciar el Backend
```bash
cd backend
npm run dev
```
El backend debe estar corriendo en `http://localhost:3000`

### Paso 2: Iniciar el Frontend Web
```bash
cd frontend-web/frontend-web
npm run dev
```
El frontend debe estar corriendo en `http://localhost:3001`

### Paso 3: Probar el Login
1. Ir a `http://localhost:3001/login`
2. Ingresar credenciales de un **Administrador** o **Catedrático**
3. El sistema debe:
   - ✅ Validar las credenciales
   - ✅ Bloquear estudiantes (mensaje de error)
   - ✅ Redirigir al dashboard si es exitoso
   - ✅ Mostrar nombre y rol del usuario

## 📝 Credenciales de Prueba

Necesitas tener usuarios en tu base de datos con estos roles:

### Administrador
```
Correo: admin@ieproes.edu
Clave: (tu contraseña en texto plano)
Rol: Administrador
```

### Catedrático
```
Correo: profesor@ieproes.edu
Clave: (tu contraseña en texto plano)
Rol: Catedrático
```

### ❌ Estudiante (BLOQUEADO)
```
Correo: estudiante@ieproes.edu
Clave: (cualquiera)
Rol: Estudiante
```
**Resultado:** "Acceso no autorizado"

## 🔍 Verificar en la Base de Datos

Ejecuta esta consulta para ver tus usuarios:

```sql
SELECT id_usuario, correo, rol, nombre, apellidos 
FROM seguridad.usuario;
```

## 🛠️ Archivos Modificados

1. **`backend/.env`** - JWT_SECRET agregado
2. **`frontend-web/src/services/auth.service.ts`** - Conectado a la API
3. **`frontend-web/src/hooks/useAuth.ts`** - Mejorado con datos del usuario
4. **`frontend-web/src/types/user.ts`** - Tipos actualizados
5. **`frontend-web/src/app/login/page.tsx`** - Formulario funcional
6. **`frontend-web/src/app/dashboard/page.tsx`** - Protegido con auth

## 🔐 Flujo de Autenticación

```
1. Usuario ingresa correo y clave
   ↓
2. Frontend envía POST a /api/auth/login
   ↓
3. Backend valida:
   - ✅ Usuario existe
   - ✅ Contraseña correcta (texto plano)
   - ✅ Rol permitido (NO Estudiante)
   ↓
4. Backend genera JWT token
   ↓
5. Frontend guarda:
   - token en localStorage
   - datos del usuario en localStorage
   ↓
6. Redirección al dashboard
   ↓
7. Dashboard verifica autenticación
```

## 🚨 Mensajes de Error

| Error | Causa |
|-------|-------|
| "Credenciales incorrectas" | Correo o contraseña incorrectos |
| "Acceso no autorizado" | Usuario es Estudiante |
| "Error al iniciar sesión" | Problema de conexión con la API |

## 📌 Próximos Pasos

Una vez que el login funcione:

1. ✅ Conectar las demás páginas (usuarios, materias, etc.)
2. ✅ Implementar encriptación de contraseñas (bcrypt)
3. ✅ Agregar refresh tokens
4. ✅ Implementar permisos por rol
5. ✅ Agregar validación de formularios

## 🐛 Troubleshooting

### Error: "Cannot connect to API"
- Verifica que el backend esté corriendo en puerto 3000
- Revisa el archivo `.env.local` del frontend

### Error: "JWT must be provided"
- Verifica que JWT_SECRET esté en el `.env` del backend
- Reinicia el servidor del backend

### Error: "User not found"
- Verifica que el usuario exista en la base de datos
- Revisa que el correo esté escrito correctamente

### Dashboard no carga
- Abre la consola del navegador (F12)
- Verifica que el token esté en localStorage
- Verifica que el usuario esté guardado

## 📞 Soporte

Si tienes problemas:
1. Revisa la consola del navegador (F12)
2. Revisa los logs del backend
3. Verifica que ambos servidores estén corriendo
4. Verifica la conexión a la base de datos

---

**✨ Sistema listo para probar el login!**
