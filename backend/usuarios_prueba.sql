-- 🔐 Script de Usuarios de Prueba para Login
-- Ejecutar en PostgreSQL para crear usuarios de prueba

-- IMPORTANTE: Las contraseñas están en TEXTO PLANO (sin encriptación)
-- Esto es temporal hasta implementar bcrypt

-- ============================================
-- 1. ADMINISTRADOR
-- ============================================
INSERT INTO seguridad.usuario (
    correo, 
    clave, 
    rol, 
    nombre, 
    apellidos, 
    primer_login
) VALUES (
    'admin@ieproes.edu',
    'admin123',
    'Administrador',
    'Carlos',
    'Rodríguez',
    false
) ON CONFLICT (correo) DO NOTHING;

-- ============================================
-- 2. CATEDRÁTICO
-- ============================================
INSERT INTO seguridad.usuario (
    correo, 
    clave, 
    rol, 
    nombre, 
    apellidos, 
    primer_login
) VALUES (
    'profesor@ieproes.edu',
    'profe123',
    'Catedrático',
    'María',
    'González',
    false
) ON CONFLICT (correo) DO NOTHING;

-- ============================================
-- 3. ESTUDIANTE (BLOQUEADO EN WEB)
-- ============================================
INSERT INTO seguridad.usuario (
    correo, 
    clave, 
    rol, 
    nombre, 
    apellidos, 
    primer_login
) VALUES (
    'estudiante@ieproes.edu',
    'estudiante123',
    'Estudiante',
    'Juan',
    'Pérez',
    false
) ON CONFLICT (correo) DO NOTHING;

-- ============================================
-- VERIFICAR USUARIOS CREADOS
-- ============================================
SELECT 
    id_usuario,
    correo,
    clave,
    rol,
    nombre,
    apellidos,
    primer_login
FROM seguridad.usuario
WHERE correo IN (
    'admin@ieproes.edu',
    'profesor@ieproes.edu',
    'estudiante@ieproes.edu'
);

-- ============================================
-- CREDENCIALES DE PRUEBA
-- ============================================
/*

✅ ADMINISTRADOR (Acceso permitido)
   Correo: admin@ieproes.edu
   Clave: admin123

✅ CATEDRÁTICO (Acceso permitido)
   Correo: profesor@ieproes.edu
   Clave: profe123

❌ ESTUDIANTE (Acceso bloqueado)
   Correo: estudiante@ieproes.edu
   Clave: estudiante123
   Resultado: "Acceso no autorizado"

*/
