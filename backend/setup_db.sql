-- ============================================================
-- SETUP COMPLETO DE LA BASE DE DATOS IEPROES
-- Ejecutar en pgAdmin o psql contra DB_UNI_II
-- ============================================================

-- 1. CREAR SCHEMA configuracion y sus tablas
CREATE SCHEMA IF NOT EXISTS configuracion;

CREATE TABLE IF NOT EXISTS configuracion.periodos_notas (
  idPeriodo     SERIAL PRIMARY KEY,
  nombreperiodo VARCHAR(50) NOT NULL,
  fechaInicio   DATE,
  fechaFin      DATE,
  activo        BOOLEAN DEFAULT false
);

CREATE TABLE IF NOT EXISTS configuracion.permisos_edicion (
  idPermiso          SERIAL PRIMARY KEY,
  idCatedratico      INTEGER NOT NULL,
  idMateria          INTEGER NOT NULL,
  idGrupo            INTEGER NOT NULL,
  puedeEditarNota1   BOOLEAN DEFAULT false,
  puedeEditarNota2   BOOLEAN DEFAULT false,
  puedeEditarNota3   BOOLEAN DEFAULT false,
  editadoNota1       BOOLEAN DEFAULT false,
  editadoNota2       BOOLEAN DEFAULT false,
  editadoNota3       BOOLEAN DEFAULT false,
  habilitadoPor      INTEGER,
  fechaHabilitacion  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(idCatedratico, idMateria, idGrupo)
);

-- Insertar períodos de notas por defecto
INSERT INTO configuracion.periodos_notas (nombreperiodo, fechaInicio, fechaFin, activo)
VALUES
  ('Parcial 1', CURRENT_DATE, CURRENT_DATE + 30, true),
  ('Parcial 2', CURRENT_DATE + 31, CURRENT_DATE + 60, false),
  ('Parcial 3', CURRENT_DATE + 61, CURRENT_DATE + 90, false)
ON CONFLICT DO NOTHING;

-- 2. CREAR USUARIOS FALTANTES
-- ADMIN_FINANCIERO
INSERT INTO seguridad.usuario (correo, clave, idrol, activo, fechacreacion)
SELECT 'financiero@universidad.edu.sv', 'financiero123',
       (SELECT idrol FROM seguridad.rol WHERE nombrerol = 'ADMIN_FINANCIERO'),
       true, NOW()
WHERE NOT EXISTS (SELECT 1 FROM seguridad.usuario WHERE correo = 'financiero@universidad.edu.sv');

-- SECRETARIA
INSERT INTO seguridad.usuario (correo, clave, idrol, activo, fechacreacion)
SELECT 'secretaria@universidad.edu.sv', 'secretaria123',
       (SELECT idrol FROM seguridad.rol WHERE nombrerol = 'SECRETARIA'),
       true, NOW()
WHERE NOT EXISTS (SELECT 1 FROM seguridad.usuario WHERE correo = 'secretaria@universidad.edu.sv');

-- COORDINADOR
INSERT INTO seguridad.usuario (correo, clave, idrol, activo, fechacreacion)
SELECT 'coordinador@universidad.edu.sv', 'coordinador123',
       (SELECT idrol FROM seguridad.rol WHERE nombrerol = 'COORDINADOR'),
       true, NOW()
WHERE NOT EXISTS (SELECT 1 FROM seguridad.usuario WHERE correo = 'coordinador@universidad.edu.sv');

-- Crear personas para los nuevos usuarios
DO $$
DECLARE
  v_idusuario INTEGER;
BEGIN
  -- Financiero
  SELECT idusuario INTO v_idusuario FROM seguridad.usuario WHERE correo = 'financiero@universidad.edu.sv';
  IF v_idusuario IS NOT NULL THEN
    INSERT INTO personas.persona (primernombre, primerapellido, activo, fecharegistro)
    VALUES ('Admin', 'Financiero', true, NOW())
    ON CONFLICT DO NOTHING;
  END IF;

  -- Secretaria
  SELECT idusuario INTO v_idusuario FROM seguridad.usuario WHERE correo = 'secretaria@universidad.edu.sv';
  IF v_idusuario IS NOT NULL THEN
    INSERT INTO personas.persona (primernombre, primerapellido, activo, fecharegistro)
    VALUES ('Secretaria', 'Sistema', true, NOW())
    ON CONFLICT DO NOTHING;
  END IF;

  -- Coordinador
  SELECT idusuario INTO v_idusuario FROM seguridad.usuario WHERE correo = 'coordinador@universidad.edu.sv';
  IF v_idusuario IS NOT NULL THEN
    INSERT INTO personas.persona (primernombre, primerapellido, activo, fecharegistro)
    VALUES ('Coordinador', 'Academico', true, NOW())
    ON CONFLICT DO NOTHING;
  END IF;
END $$;

-- 3. CREAR MATERIAS DE EJEMPLO (usando columna correcta: horasteoricas)
INSERT INTO academico.materia (codigo, nombre, descripcion, unidadesvalorativas, horasteoricas, horaspracticas, tipo, activo)
VALUES
  ('MAT101', 'Matemáticas I',          'Cálculo diferencial e integral',    4, 4, 0, 'OBLIGATORIA', true),
  ('PRG101', 'Programación I',         'Fundamentos de programación',       4, 3, 2, 'OBLIGATORIA', true),
  ('FIS101', 'Física I',               'Mecánica clásica',                  4, 4, 0, 'OBLIGATORIA', true),
  ('ING101', 'Inglés Técnico I',       'Inglés para ingeniería',            3, 3, 0, 'OBLIGATORIA', true),
  ('BD101',  'Bases de Datos I',       'Diseño y gestión de BD',            4, 3, 2, 'OBLIGATORIA', true),
  ('RED101', 'Redes de Computadoras',  'Fundamentos de redes',              3, 3, 0, 'OBLIGATORIA', true)
ON CONFLICT (codigo) DO NOTHING;

-- 4. CREAR PLAN DE ESTUDIO si no existe para la carrera 1
INSERT INTO academico.planestudio (codigo, nombre, añovigencia, idcarrera, activo)
SELECT 'PLAN-2020', 'Plan 2020', 2020, 1, true
WHERE NOT EXISTS (SELECT 1 FROM academico.planestudio WHERE idcarrera = 1 AND activo = true);

-- 5. CREAR GRUPOS para el período activo (con el docente existente si hay)
DO $$
DECLARE
  v_idperiodo INTEGER;
  v_iddocente INTEGER;
  v_idmateria INTEGER;
  v_codigo    VARCHAR;
BEGIN
  SELECT idperiodo INTO v_idperiodo FROM academico.periodoacademico WHERE activo = true LIMIT 1;
  SELECT iddocente INTO v_iddocente FROM docentes.docente LIMIT 1;

  IF v_idperiodo IS NOT NULL THEN
    FOR v_idmateria IN SELECT idmateria FROM academico.materia WHERE activo = true LOOP
      v_codigo := 'G1-' || v_idmateria || '-' || v_idperiodo;
      INSERT INTO grupos.grupo (codigo, numerogrupo, cupomaximo, cupoactual, idmateria, iddocente, idperiodo, estado)
      VALUES (v_codigo, 1, 30, 0, v_idmateria, v_iddocente, v_idperiodo, 'ACTIVO')
      ON CONFLICT DO NOTHING;
    END LOOP;
  END IF;
END $$;

-- 6. VERIFICAR RESULTADOS
SELECT '=== VERIFICACION ===' as info;
SELECT 'Usuarios' as tabla, COUNT(*) as total FROM seguridad.usuario
UNION ALL SELECT 'Materias', COUNT(*) FROM academico.materia
UNION ALL SELECT 'Grupos', COUNT(*) FROM grupos.grupo
UNION ALL SELECT 'Periodos notas', COUNT(*) FROM configuracion.periodos_notas
UNION ALL SELECT 'Carreras', COUNT(*) FROM academico.carrera;

SELECT '=== USUARIOS DEL SISTEMA ===' as info;
SELECT u.correo, r.nombrerol, u.activo
FROM seguridad.usuario u
INNER JOIN seguridad.rol r ON u.idrol = r.idrol
WHERE r.nombrerol NOT IN ('ESTUDIANTE', 'TUTOR')
ORDER BY r.niveljerarquico;
