# 🔐 CREDENCIALES VÁLIDAS DE LA BASE DE DATOS

## ✅ ADMINISTRADOR
Correo: MP26I01@uni.edu
Clave: 160404
Rol: Administrador

## ✅ CATEDRÁTICOS
Correo: AA26I00@uni.edu
Clave: 310870
Rol: Catedrático

Correo: GC26I00@uni.edu
Clave: 200474
Rol: Catedrático

Correo: GM26I00@uni.edu
Clave: 220400
Rol: Catedrático

Correo: CG26I00@uni.edu
Clave: 010200
Rol: Catedrático

## ❌ ESTUDIANTE (Bloqueado en web)
Correo: enrique.calzadilla@uni.edu.sv
Clave: Root
Rol: ESTUDIANTE
Nota: Este usuario será rechazado con "Acceso no autorizado"

---

## 🔧 CAMBIOS REALIZADOS EN EL CÓDIGO:

1. ✅ Corregido loginController.js para usar:
   - JOIN con tabla seguridad.rol
   - Columna: idusuario (sin guión bajo)
   - Columna: nombrerol (nombre del rol)
   
2. ✅ La estructura real de la DB es:
   - seguridad.usuario (idusuario, correo, clave, idrol)
   - seguridad.rol (idrol, nombrerol, descripcion)
   
3. ✅ Deshabilitada verificación JWT en frontend-web
