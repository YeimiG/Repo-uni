-- ==============================================
-- CARGA DE DATOS IEPROES - VERSIÓN DOCKER (data.sql)
-- ==============================================

BEGIN;

-- ==============================================
-- 1. ROLES (seguridad.Rol)
-- ==============================================
INSERT INTO seguridad.Rol (nombreRol, descripcion, nivelJerarquico, esDefault) VALUES
('SUPER_ADMIN', 'Administrador general del sistema con todos los permisos', 1, FALSE),
('ADMIN_ACADEMICO', 'Administra carreras, materias, planes de estudio', 2, FALSE),
('ADMIN_FINANCIERO', 'Administra pagos, facturas, becas', 2, FALSE),
('COORDINADOR', 'Coordina grupos y horarios', 3, FALSE),
('DOCENTE', 'Catedrático - ingresa notas y asistencia', 4, TRUE),
('ESTUDIANTE', 'Estudiante - consulta notas y expediente', 5, TRUE),
('TUTOR', 'Padre o encargado del estudiante', 5, FALSE),
('SECRETARIA', 'Asistente administrativo', 3, FALSE);


-- ==============================================
-- 2. MÓDULOS (seguridad.Modulo)
-- ==============================================
INSERT INTO seguridad.Modulo (nombre, descripcion, icono, ruta, orden) VALUES
('Dashboard', 'Panel de control principal', 'dashboard', '/', 1),
('Seguridad', 'Gestión de usuarios y permisos', 'lock', '/seguridad', 2),
('Académico', 'Carreras, materias, planes', 'book', '/academico', 3),
('Estudiantes', 'Registro y expedientes', 'users', '/estudiantes', 4),
('Docentes', 'Catedráticos y contratos', 'chalkboard-teacher', '/docentes', 5),
('Grupos', 'Oferta académica y horarios', 'calendar-alt', '/grupos', 6),
('Inscripciones', 'Matrícula y carga académica', 'user-plus', '/inscripciones', 7),
('Evaluaciones', 'Notas y calificaciones', 'star', '/evaluaciones', 8),
('Asistencia', 'Control de presencia', 'check-circle', '/asistencia', 9),
('Pagos', 'Facturación y cobros', 'money-bill', '/pagos', 10),
('Reportes', 'Informes y estadísticas', 'chart-bar', '/reportes', 11);

-- ==============================================
-- 3. PERMISOS (seguridad.Permiso)
-- ==============================================
-- Permisos de Dashboard
INSERT INTO seguridad.Permiso (nombre, codigo, descripcion, idModulo) VALUES
('Ver Dashboard', 'DASHBOARD_VER', 'Puede ver el panel principal', 1);

-- Permisos de Seguridad
INSERT INTO seguridad.Permiso (nombre, codigo, descripcion, idModulo) VALUES
('Ver Usuarios', 'USUARIO_VER', 'Puede ver lista de usuarios', 2),
('Crear Usuario', 'USUARIO_CREAR', 'Puede crear nuevos usuarios', 2),
('Editar Usuario', 'USUARIO_EDITAR', 'Puede modificar usuarios', 2),
('Eliminar Usuario', 'USUARIO_ELIMINAR', 'Puede eliminar usuarios', 2),
('Ver Roles', 'ROL_VER', 'Puede ver roles', 2),
('Asignar Permisos', 'PERMISO_ASIGNAR', 'Puede asignar permisos a roles', 2);

-- Permisos Académico
INSERT INTO seguridad.Permiso (nombre, codigo, descripcion, idModulo) VALUES
('Ver Carreras', 'CARRERA_VER', 'Puede ver carreras', 3),
('Crear Carrera', 'CARRERA_CREAR', 'Puede crear carreras', 3),
('Editar Carrera', 'CARRERA_EDITAR', 'Puede modificar carreras', 3),
('Ver Materias', 'MATERIA_VER', 'Puede ver materias', 3),
('Crear Materia', 'MATERIA_CREAR', 'Puede crear materias', 3),
('Editar Materia', 'MATERIA_EDITAR', 'Puede modificar materias', 3),
('Ver Planes', 'PLAN_VER', 'Puede ver planes de estudio', 3),
('Crear Plan', 'PLAN_CREAR', 'Puede crear planes', 3);

-- Permisos Estudiantes
INSERT INTO seguridad.Permiso (nombre, codigo, descripcion, idModulo) VALUES
('Ver Estudiantes', 'ESTUDIANTE_VER', 'Puede ver lista de estudiantes', 4),
('Crear Estudiante', 'ESTUDIANTE_CREAR', 'Puede crear estudiantes', 4),
('Editar Estudiante', 'ESTUDIANTE_EDITAR', 'Puede modificar estudiantes', 4),
('Ver Expediente', 'EXPEDIENTE_VER', 'Puede ver expediente completo', 4);

-- Permisos Docentes
INSERT INTO seguridad.Permiso (nombre, codigo, descripcion, idModulo) VALUES
('Ver Docentes', 'DOCENTE_VER', 'Puede ver lista de docentes', 5),
('Crear Docente', 'DOCENTE_CREAR', 'Puede crear docentes', 5),
('Editar Docente', 'DOCENTE_EDITAR', 'Puede modificar docentes', 5);

-- Permisos Grupos
INSERT INTO seguridad.Permiso (nombre, codigo, descripcion, idModulo) VALUES
('Ver Grupos', 'GRUPO_VER', 'Puede ver grupos', 6),
('Crear Grupo', 'GRUPO_CREAR', 'Puede crear grupos', 6),
('Editar Grupo', 'GRUPO_EDITAR', 'Puede modificar grupos', 6),
('Asignar Horarios', 'HORARIO_ASIGNAR', 'Puede asignar horarios', 6);

-- Permisos Inscripciones
INSERT INTO seguridad.Permiso (nombre, codigo, descripcion, idModulo) VALUES
('Ver Inscripciones', 'INSCRIPCION_VER', 'Puede ver inscripciones', 7),
('Realizar Inscripción', 'INSCRIPCION_CREAR', 'Puede inscribir estudiantes', 7),
('Cancelar Inscripción', 'INSCRIPCION_CANCELAR', 'Puede cancelar inscripciones', 7);

-- Permisos Evaluaciones (importante para docentes)
INSERT INTO seguridad.Permiso (nombre, codigo, descripcion, idModulo) VALUES
('Ver Notas', 'NOTA_VER', 'Puede ver calificaciones', 8),
('Ingresar Notas', 'NOTA_INGRESAR', 'Puede ingresar notas', 8),
('Editar Notas', 'NOTA_EDITAR', 'Puede modificar notas', 8),
('Publicar Notas', 'NOTA_PUBLICAR', 'Puede publicar notas para estudiantes', 8);

-- Permisos Asistencia
INSERT INTO seguridad.Permiso (nombre, codigo, descripcion, idModulo) VALUES
('Ver Asistencia', 'ASISTENCIA_VER', 'Puede ver asistencia', 9),
('Registrar Asistencia', 'ASISTENCIA_REGISTRAR', 'Puede marcar asistencia', 9);

-- Permisos Pagos
INSERT INTO seguridad.Permiso (nombre, codigo, descripcion, idModulo) VALUES
('Ver Facturas', 'FACTURA_VER', 'Puede ver facturas', 10),
('Crear Factura', 'FACTURA_CREAR', 'Puede generar facturas', 10),
('Registrar Pago', 'PAGO_REGISTRAR', 'Puede registrar pagos', 10);

-- Permisos Reportes
INSERT INTO seguridad.Permiso (nombre, codigo, descripcion, idModulo) VALUES
('Ver Reportes', 'REPORTE_VER', 'Puede ver reportes', 11),
('Generar Reportes', 'REPORTE_GENERAR', 'Puede generar reportes', 11);

-- ==============================================
-- 4. ASIGNACIÓN DE PERMISOS POR ROL (seguridad.RolPermiso)
-- ==============================================

-- SUPER_ADMIN (ID 1)
INSERT INTO seguridad.RolPermiso (idRol, idPermiso)
SELECT 1, idPermiso FROM seguridad.Permiso;

-- ADMIN_ACADEMICO (ID 2)
INSERT INTO seguridad.RolPermiso (idRol, idPermiso) VALUES
(2, 1),  -- Ver Dashboard
(2, 8), (2, 9), (2, 10), -- Carreras
(2, 11), (2, 12), (2, 13), -- Materias
(2, 14), (2, 15), -- Planes
(2, 16), (2, 17), (2, 18), (2, 19), -- Estudiantes
(2, 20), (2, 21), (2, 22), -- Docentes
(2, 39), (2, 40); -- Reportes

-- ADMIN_FINANCIERO (ID 3)
INSERT INTO seguridad.RolPermiso (idRol, idPermiso) VALUES
(3, 1),  -- Ver Dashboard
(3, 36), (3, 37), (3, 38), -- Facturas y Pagos
(3, 39), (3, 40); -- Reportes

-- COORDINADOR (ID 4)
INSERT INTO seguridad.RolPermiso (idRol, idPermiso) VALUES
(4, 1),  -- Ver Dashboard
(4, 8), (4, 11), -- Ver carreras y materias
(4, 16), -- Ver estudiantes
(4, 20), -- Ver docentes
(4, 23), (4, 24), (4, 25), (4, 26), -- Grupos y horarios
(4, 27), (4, 28); -- Inscripciones

-- DOCENTE (ID 5)
INSERT INTO seguridad.RolPermiso (idRol, idPermiso) VALUES
(5, 1),  -- Ver Dashboard
(5, 11), -- Ver materias
(5, 23), -- Ver grupos
(5, 30), (5, 31), (5, 32), (5, 33), -- Notas (Ver, Ingresar, Editar, Publicar)
(5, 34), (5, 35); -- Asistencia

-- ESTUDIANTE (ID 6)
INSERT INTO seguridad.RolPermiso (idRol, idPermiso) VALUES
(6, 1),  -- Ver Dashboard
(6, 11), -- Ver materias
(6, 19), -- Ver su expediente
(6, 30); -- Ver sus notas

-- SECRETARIA (ID 8)
INSERT INTO seguridad.RolPermiso (idRol, idPermiso) VALUES
(8, 1),  -- Ver Dashboard
(8, 8), (8, 11), -- Ver carreras y materias
(8, 16), (8, 17), -- Ver y crear estudiantes
(8, 20), -- Ver docentes
(8, 23), -- Ver grupos
(8, 27), (8, 28); -- Ver y realizar inscripciones

-- ==============================================
-- 5. DEPARTAMENTOS DE EL SALVADOR (personas.Departamento)
-- ==============================================

INSERT INTO personas.Departamento (nombre, codigo) VALUES
('Ahuachapán', 'AH'),
('Cabañas', 'CA'),
('Chalatenango', 'CH'),
('Cuscatlán', 'CU'),
('La Libertad', 'LL'),
('La Paz', 'LZ'),
('La Unión', 'LU'),
('Morazán', 'MO'),
('San Miguel', 'SM'),
('San Salvador', 'SS'),
('San Vicente', 'SV'),
('Santa Ana', 'SA'),
('Sonsonate', 'SO'),
('Usulután', 'US');

-- ==============================================
-- 6. MUNICIPIOS DE EL SALVADOR (personas.Municipio)
-- ==============================================

-- 1. Ahuachapán
INSERT INTO personas.Municipio (nombre, idDepartamento, codigo) VALUES
('Ahuachapán', 1, 'AH01'), ('Atiquizaya', 1, 'AH02'), ('Turín', 1, 'AH03'),
('Apaneca', 1, 'AH04'), ('Tacuba', 1, 'AH05'), ('San Francisco Menéndez', 1, 'AH06');

-- 2. Cabañas
INSERT INTO personas.Municipio (nombre, idDepartamento, codigo) VALUES
('Sensuntepeque', 2, 'CA01'), ('Ilobasco', 2, 'CA02'), ('Victoria', 2, 'CA03'),
('Dolores', 2, 'CA04'), ('Guacotecti', 2, 'CA05'), ('Jutiapa', 2, 'CA06');

-- 3. Chalatenango
INSERT INTO personas.Municipio (nombre, idDepartamento, codigo) VALUES
('Chalatenango', 3, 'CH01'), ('Tejutla', 3, 'CH02'), ('La Palma', 3, 'CH03'),
('San Ignacio', 3, 'CH04'), ('Dulce Nombre de María', 3, 'CH05'), ('La Reina', 3, 'CH06');

-- 4. Cuscatlán
INSERT INTO personas.Municipio (nombre, idDepartamento, codigo) VALUES
('Cojutepeque', 4, 'CU01'), ('Suchitoto', 4, 'CU02'), ('San Pedro Perulapán', 4, 'CU03'),
('San José Guayabal', 4, 'CU04'), ('Tenancingo', 4, 'CU05');

-- 5. La Libertad
INSERT INTO personas.Municipio (nombre, idDepartamento, codigo) VALUES
('Santa Tecla', 5, 'LL01'), ('Antiguo Cuscatlán', 5, 'LL02'), ('Nuevo Cuscatlán', 5, 'LL03'),
('San Juan Opico', 5, 'LL04'), ('Quezaltepeque', 5, 'LL05'), ('Colón', 5, 'LL06'),
('La Libertad', 5, 'LL07'), ('Zaragoza', 5, 'LL08'), ('Huizúcar', 5, 'LL09');

-- 6. La Paz
INSERT INTO personas.Municipio (nombre, idDepartamento, codigo) VALUES
('Zacatecoluca', 6, 'LZ01'), ('Olocuilta', 6, 'LZ02'), ('San Luis Talpa', 6, 'LZ03'),
('San Pedro Masahuat', 6, 'LZ04'), ('Santiago Nonualco', 6, 'LZ05'), ('San Juan Nonualco', 6, 'LZ06');

-- 7. La Unión
INSERT INTO personas.Municipio (nombre, idDepartamento, codigo) VALUES
('La Unión', 7, 'LU01'), ('Santa Rosa de Lima', 7, 'LU02'), ('Pasaquina', 7, 'LU03'),
('Conchagua', 7, 'LU04'), ('El Carmen', 7, 'LU05'), ('Anamorós', 7, 'LU06');

-- 8. Morazán
INSERT INTO personas.Municipio (nombre, idDepartamento, codigo) VALUES
('San Francisco Gotera', 8, 'MO01'), ('Corinto', 8, 'MO02'), ('Jocoro', 8, 'MO03'),
('Perquín', 8, 'MO04'), ('Osicala', 8, 'MO05'), ('Cacaopera', 8, 'MO06');

-- 9. San Miguel
INSERT INTO personas.Municipio (nombre, idDepartamento, codigo) VALUES
('San Miguel', 9, 'SM01'), ('Chinameca', 9, 'SM02'), ('Ciudad Barrios', 9, 'SM03'),
('Moncagua', 9, 'SM04'), ('Lolotique', 9, 'SM05'), ('Sesori', 9, 'SM06');

-- 10. San Salvador
INSERT INTO personas.Municipio (nombre, idDepartamento, codigo) VALUES
('San Salvador', 10, 'SS01'), ('Soyapango', 10, 'SS02'), ('Mejicanos', 10, 'SS03'),
('Apopa', 10, 'SS04'), ('Ilopango', 10, 'SS05'), ('San Martín', 10, 'SS06'),
('Tonacatepeque', 10, 'SS07'), ('Panchimalco', 10, 'SS08'), ('Cuscatancingo', 10, 'SS09');

-- 11. San Vicente
INSERT INTO personas.Municipio (nombre, idDepartamento, codigo) VALUES
('San Vicente', 11, 'SV01'), ('Apastepeque', 11, 'SV02'), ('Tecoluca', 11, 'SV03'),
('San Sebastián', 11, 'SV04'), ('Guadalupe', 11, 'SV05'), ('San Cayetano Istepeque', 11, 'SV06');

-- 12. Santa Ana
INSERT INTO personas.Municipio (nombre, idDepartamento, codigo) VALUES
('Santa Ana', 12, 'SA01'), ('Metapán', 12, 'SA02'), ('Chalchuapa', 12, 'SA03'),
('Coatepeque', 12, 'SA04'), ('El Congo', 12, 'SA05'), ('Candelaria de la Frontera', 12, 'SA06');

-- 13. Sonsonate
INSERT INTO personas.Municipio (nombre, idDepartamento, codigo) VALUES
('Sonsonate', 13, 'SO01'), ('Acajutla', 13, 'SO02'), ('Izalco', 13, 'SO03'),
('Armenia', 13, 'SO04'), ('Juayúa', 13, 'SO05'), ('Nahuizalco', 13, 'SO06'), ('Sonzacate', 13, 'SO07');

-- 14. Usulután
INSERT INTO personas.Municipio (nombre, idDepartamento, codigo) VALUES
('Usulután', 14, 'US01'), ('Berlín', 14, 'US02'), ('Jiquilisco', 14, 'US03'),
('Puerto El Triunfo', 14, 'US04'), ('Santiago de María', 14, 'US05'), ('Jucuapa', 14, 'US06');

-- ==============================================
-- INSERTAR TIPOS DE DOCUMENTO DE IDENTIDAD
-- ==============================================

INSERT INTO personas.TipoDocumentoIdentidad (nombre, abreviatura, paisOrigen, activo) VALUES
('Documento Único de Identidad', 'DUI', 'El Salvador', true),
('Pasaporte', 'PAS', 'Internacional', true),
('Carnet de Residente', 'CR', 'El Salvador', true),
('Número de Identificación Tributaria', 'NIT', 'El Salvador', true),
('Carnet de Minoridad', 'CM', 'El Salvador', true);

-- ==============================================
-- INSERTAR FACULTADES
-- ==============================================

INSERT INTO academico.Facultad (nombre, codigo, decano, fechaFundacion, activo) VALUES
('Facultad de Ingeniería y Arquitectura', 'FIA', 'Ing. Roberto Hernández', '1960-05-15', true),
('Facultad de Ciencias Económicas', 'FCE', 'Licda. María Elena López', '1965-02-10', true),
('Facultad de Ciencias y Humanidades', 'FCH', 'Dr. Carlos Mauricio Rivas', '1970-08-22', true),
('Facultad de Medicina', 'FME', 'Dra. Beatriz Alfaro', '1975-03-30', true),
('Facultad de Jurisprudencia y Ciencias Sociales', 'FJC', 'Abog. Francisco Guevara', '1980-01-12', true),
('Facultad de Odontología', 'FOD', 'Dr. Nelson Martínez', '1990-11-05', true),
('Facultad de Ciencias Agronómicas', 'FCA', 'Ing. Julia Estela Castro', '1985-06-18', true);

-- ==============================================
-- INSERTAR ESCUELAS
-- ==============================================

INSERT INTO academico.Escuela (nombre, codigo, director, idFacultad, activo) VALUES
('Escuela de Ingeniería de Sistemas e Informática', 'EISI', 'Ing. Nelson Gavidia', 1, true),
('Escuela de Ingeniería Industrial', 'EII', 'Ing. Sandra Meza', 1, true),
('Escuela de Arquitectura', 'EARQ', 'Arq. Luis Castillo', 1, true),
('Escuela de Administración de Empresas', 'EAE', 'Lic. Ricardo Paz', 2, true),
('Escuela de Contaduría Pública', 'ECP', 'Licda. Elena Rivas', 2, true),
('Escuela de Mercadeo', 'EMER', 'Lic. Jorge Valdés', 2, true),
('Escuela de Ciencias de la Educación', 'ECE', 'Mtro. Julio Amaya', 3, true),
('Escuela de Psicología', 'EPSI', 'Dra. Claudia Zaldaña', 3, true),
('Escuela de Medicina', 'EMED', 'Dr. Manuel Sánchez', 4, true),
('Escuela de Enfermería', 'EENF', 'Licda. Rosa Guardado', 4, true),
('Escuela de Ciencias Jurídicas', 'ECJ', 'Abog. Rafael Montalvo', 5, true),
('Escuela de Odontología', 'EODO', 'Dra. Patricia de Soler', 6, true),
('Escuela de Ingeniería Agronómica', 'EIA', 'Ing. Carlos Funes', 7, true);

-- ==============================================
-- INSERTAR CARRERAS
-- ==============================================

INSERT INTO academico.Carrera (nombre, codigo, tituloOtorgado, modalidad, duracionAnios, totalUV, idEscuela, activo) VALUES
('Ingeniería de Sistemas Informáticos', 'I01', 'Ingeniero(a) de Sistemas Informáticos', 'PRESENCIAL', 5.0, 160, 1, true),
('Licenciatura en Ciencias de la Computación', 'L01', 'Licenciado(a) en Ciencias de la Computación', 'HIBRIDA', 5.0, 155, 1, true),
('Ingeniería Industrial', 'I02', 'Ingeniero(a) Industrial', 'PRESENCIAL', 5.0, 165, 2, true),
('Arquitectura', 'A01', 'Arquitecto(a)', 'PRESENCIAL', 5.0, 170, 3, true),
('Licenciatura en Administración de Empresas', 'L02', 'Licenciado(a) en Administración de Empresas', 'VIRTUAL', 5.0, 150, 4, true),
('Licenciatura en Contaduría Pública', 'L03', 'Licenciado(a) en Contaduría Pública', 'PRESENCIAL', 5.0, 155, 5, true),
('Licenciatura en Mercadeo', 'L04', 'Licenciado(a) en Mercadeo', 'HIBRIDA', 5.0, 150, 6, true),
('Licenciatura en Ciencias de la Educación', 'L05', 'Licenciado(a) en Ciencias de la Educación', 'PRESENCIAL', 5.0, 160, 7, true),
('Licenciatura en Psicología', 'L06', 'Licenciado(a) en Psicología', 'PRESENCIAL', 5.0, 160, 8, true),
('Doctorado en Medicina', 'D01', 'Doctor(a) en Medicina', 'PRESENCIAL', 8.0, 250, 9, true),
('Licenciatura en Enfermería', 'L07', 'Licenciado(a) en Enfermería', 'PRESENCIAL', 5.0, 160, 10, true),
('Licenciatura en Ciencias Jurídicas', 'L08', 'Licenciado(a) en Ciencias Jurídicas', 'PRESENCIAL', 5.0, 170, 11, true),
('Doctorado en Cirugía Dental', 'D02', 'Doctor(a) en Cirugía Dental', 'PRESENCIAL', 7.0, 220, 12, true),
('Ingeniería Agronómica', 'I03', 'Ingeniero(a) Agrónomo', 'PRESENCIAL', 5.0, 160, 13, true);

-- ==============================================
-- INSERTAR DIRECCIONES
-- ==============================================

INSERT INTO personas.Direccion (linea1, linea2, referencia, codigoPostal, idMunicipio, activo) VALUES
('Colonia Escalón, Calle Nueva 1', 'Apartamento 4B', 'Cerca del Redondel Masferrer', '01101', 40, true),
('Final 25 Avenida Sur', 'Casa #123', 'Frente al Hospital Rosales', '01101', 40, true),
('Residencial Santa Teresa', 'Senda 5, Polígono G', 'A la par del parque principal', '01501', 21, true),
('7ma Avenida Norte', 'Casa #10', 'A dos cuadras de la Alcaldía', '01501', 21, true),
('Urbanización El Trébol', 'Pasaje 2, Casa #45', 'Cerca de Metrocentro Santa Ana', '02101', 51, true),
('Avenida Independencia Sur', 'Barrio San Sebastián', 'Contiguo a la iglesia', '02101', 51, true),
('Colonia Ciudad Jardín', 'Calle Los Pinos #5', 'A espaldas del estado Charlaix', '03101', 34, true),
('Barrio San Antonio', 'Calle principal #8', 'Frente al arco de la entrada', '02101', 1, true);

-- ==============================================
-- INSERTAR CONTACTOS
-- ==============================================

INSERT INTO personas.Contacto (telefonoFijo, telefonoMovil, correoPersonal, correoInstitucional, activo) VALUES
('2222-0001', '7788-9900', 'juan.perez@gmail.com', 'jperez@universidad.edu.sv', true),
('2222-0002', '7122-3344', 'maria.lopez@yahoo.com', 'mlopez@universidad.edu.sv', true),
('2222-0003', '7055-6677', 'carlos.rivas@outlook.com', 'crivas@universidad.edu.sv', true),
('2222-0004', '7599-8811', 'ana.estrada@gmail.com', 'aestrada@universidad.edu.sv', true);

-- ==============================================
-- INSERTAR PERSONAS
-- ==============================================

INSERT INTO personas.Persona (
    primerNombre, segundoNombre, primerApellido, segundoApellido, 
    fechaNacimiento, genero, estadoCivil, idTipoDocumento, 
    numeroDocumento, idDireccion, idContacto, activo
) VALUES
('Juan', 'Alberto', 'Pérez', 'Rodríguez', '1995-05-15', 'M', 'SOLTERO', 1, '05123456-7', 1, 1, true),
('María', 'Elena', 'López', 'García', '1998-10-22', 'F', 'SOLTERO', 1, '06123456-8', 2, 2, true),
('Carlos', 'Mauricio', 'Rivas', 'Zaldaña', '1985-03-12', 'M', 'CASADO', 2, 'A12345678', 3, 3, true),
('Ana', 'Beatriz', 'Estrada', 'Pineda', '2000-01-30', 'F', 'SOLTERO', 1, '07123456-9', 4, 4, true);

-- ==============================================
-- INSERTAR USUARIOS 
-- ==============================================
-- NOTA: Se mantienen los IDs fijos (1, 2, 3, 4) por ser datos semilla requeridos por otras tablas
-- Para sincronizar la secuencia SERIAL y evitar conflictos futuros al registrar nuevos usuarios desde la web:
ALTER SEQUENCE seguridad.usuario_idusuario_seq RESTART WITH 10;

INSERT INTO seguridad.Usuario (
    idUsuario, correo, clave, fechaCreacion, ultimoAcceso, 
    intentosFallidos, bloqueado, fechaBloqueo, requiereCambioClave, 
    tokenRecuperacion, expiracionToken, idRol, activo
) VALUES
(1, 'admin@universidad.edu.sv', 'admin123', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0, false, '1900-01-01 00:00:00', false, 'N/A', '1900-01-01 00:00:00', 1, true),
(2, 'registro@universidad.edu.sv', 'registro2026', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0, false, '1900-01-01 00:00:00', false, 'N/A', '1900-01-01 00:00:00', 2, true),
(3, 'carlos.rivas@universidad.edu.sv', 'docente789', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0, false, '1900-01-01 00:00:00', false, 'N/A', '1900-01-01 00:00:00', 5, true),
(4, 'ana.estrada@universidad.edu.sv', 'estudiante456', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0, false, '1900-01-01 00:00:00', false, 'N/A', '1900-01-01 00:00:00', 6, true);

-- ==============================================
-- INSERTAR PLANES DE ESTUDIO
-- ==============================================

INSERT INTO academico.planestudio (
    idplanestudio, codigo, nombre, añovigencia, 
    resolucion, fechaaprobacion, idcarrera, activo
) VALUES
(1, 'PLAN-I01-2026', 'Plan de Estudios Ingeniería de Sistemas 2026', 2026, 'RES-FIA-001-2025', '2025-11-15', 1, true),
(2, 'PLAN-I02-2026', 'Plan de Estudios Ingeniería Industrial 2026', 2026, 'RES-FIA-002-2025', '2025-11-20', 3, true),
(3, 'PLAN-A01-2026', 'Plan de Estudios Arquitectura 2026', 2026, 'RES-FIA-003-2025', '2025-11-25', 4, true),
(4, 'PLAN-L02-2026', 'Plan de Estudios Administración de Empresas 2026', 2026, 'RES-FCE-010-2025', '2025-12-01', 5, true),
(5, 'PLAN-L03-2026', 'Plan de Estudios Contaduría Pública 2026', 2026, 'RES-FCE-011-2025', '2025-12-05', 6, true);

-- ==============================================
-- INSERTAR ESTADOS DE ESTUDIANTE (CORREGIDO NOMBRE DE TABLA)
-- ==============================================

INSERT INTO estudiantes.EstadoEstudiante (
    idEstado, nombre, descripcion, activo
) VALUES
(1, 'ACTIVO', 'Estudiante con matrícula vigente y apto para inscribir materias', true),
(2, 'INACTIVO', 'Estudiante que no ha registrado carga académica en el periodo vigente', true),
(3, 'EGRESADO', 'Estudiante que ha completado el 100% de su plan de estudios', true),
(4, 'GRADUADO', 'Persona que ha recibido su título profesional', true),
(5, 'SUSPENDIDO', 'Estudiante con restricción temporal de acceso al sistema', true),
(6, 'RETIRADO', 'Estudiante que ha solicitado el retiro oficial de la institución', true);

-- ==============================================
-- INSERTAR TIPOS DE INGRESO
-- ==============================================

INSERT INTO estudiantes.TipoIngreso (
    idTipoIngreso, nombre, descripcion, activo
) VALUES
(1, 'NUEVO INGRESO', 'Estudiantes que ingresan por primera vez a la universidad tras el bachillerato', true),
(2, 'TRASLADO EXTERNO', 'Estudiantes que provienen de otras instituciones de educación superior', true),
(3, 'TRASLADO INTERNO', 'Estudiantes que realizan un cambio de carrera dentro de la institución', true),
(4, 'REINGRESO', 'Estudiantes que retoman sus estudios tras un periodo de inactividad', true),
(5, 'EQUIVALENCIAS', 'Ingreso mediante el proceso de acreditación de materias aprobadas anteriormente', true);

-- ==============================================
-- INSERTAR ESTUDIANTES
-- ==============================================

INSERT INTO estudiantes.Estudiante (
    idPersona, expediente, fechaIngreso, idCarrera, idPlanEstudio, 
    idEstado, idTipoIngreso, colegioProcedencia, añoEgresoColegio, 
    promedioIngreso, cantidadMateriasAprobadas, cantidadMateriasReprobadas, 
    indiceGlobal, indicePeriodo, creditosAcumulados, creditosTotales, 
    porcentajeAvance, idUsuario, activo
) VALUES
(4, 'EXP-2026-001', CURRENT_DATE, 1, 1, 1, 1, 'Instituto Nacional de San Salvador', 2025, 8.5, 0, 0, 0.0, 0.0, 0, 160, 0.0, 4, true),
(2, 'EXP-2026-002', CURRENT_DATE, 4, 4, 1, 1, 'Colegio García Flamenco', 2025, 9.0, 0, 0, 0.0, 0.0, 0, 150, 0.0, 2, true);

COMMIT;