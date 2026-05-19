-- ============================================================
-- FIX DB_UNI_II — Ejecutar en pgAdmin contra DB_UNI_II
-- Corrige trigger roto, crea schema configuracion, datos de prueba
-- ============================================================

-- 1. ELIMINAR TRIGGER ROTO (referencia academico.Periodo que no existe)
DROP TRIGGER IF EXISTS trg_validar_periodo ON inscripciones.inscripcion;
DROP TRIGGER IF EXISTS trg_validar_periodo_activo ON inscripciones.inscripcion;
DROP FUNCTION IF EXISTS validar_periodo_activo() CASCADE;

-- 1b. COLUMNAS opcionales en periodoacademico (si no existen)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'academico' AND table_name = 'periodoacademico' AND column_name = 'fechainicioinscripciones'
  ) THEN
    ALTER TABLE academico.periodoacademico ADD COLUMN fechainicioinscripciones DATE;
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'academico' AND table_name = 'periodoacademico' AND column_name = 'fechafininscripciones'
  ) THEN
    ALTER TABLE academico.periodoacademico ADD COLUMN fechafininscripciones DATE;
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'academico' AND table_name = 'periodoacademico' AND column_name = 'activo'
  ) THEN
    ALTER TABLE academico.periodoacademico ADD COLUMN activo BOOLEAN DEFAULT false;
  END IF;
END $$;

-- 2. COLUMNA numerogrupo en grupos.grupo (si no existe)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'grupos' AND table_name = 'grupo' AND column_name = 'numerogrupo'
  ) THEN
    ALTER TABLE grupos.grupo ADD COLUMN numerogrupo INTEGER DEFAULT 1;
  END IF;
END $$;

-- 3. SCHEMA configuracion y sus tablas
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

INSERT INTO configuracion.periodos_notas (nombreperiodo, fechaInicio, fechaFin, activo)
SELECT 'Parcial 1', CURRENT_DATE, CURRENT_DATE + 30, true
WHERE NOT EXISTS (SELECT 1 FROM configuracion.periodos_notas WHERE nombreperiodo = 'Parcial 1');

INSERT INTO configuracion.periodos_notas (nombreperiodo, fechaInicio, fechaFin, activo)
SELECT 'Parcial 2', CURRENT_DATE + 31, CURRENT_DATE + 60, false
WHERE NOT EXISTS (SELECT 1 FROM configuracion.periodos_notas WHERE nombreperiodo = 'Parcial 2');

INSERT INTO configuracion.periodos_notas (nombreperiodo, fechaInicio, fechaFin, activo)
SELECT 'Parcial 3', CURRENT_DATE + 61, CURRENT_DATE + 90, false
WHERE NOT EXISTS (SELECT 1 FROM configuracion.periodos_notas WHERE nombreperiodo = 'Parcial 3');

-- 4. PERÍODO ACADÉMICO ACTIVO (si no hay ninguno)
INSERT INTO academico.periodoacademico
  (nombre, año, numeroperiodo, fechainicio, fechafin, estado, activo)
SELECT 'Ciclo I 2025', 2025, 1, '2025-01-15', '2025-05-30', 'ACTIVO', true
WHERE NOT EXISTS (SELECT 1 FROM academico.periodoacademico WHERE activo = true);

-- 5. MATERIAS (si no hay)
INSERT INTO academico.materia (codigo, nombre, unidadesvalorativas, activo)
SELECT 'MAT101', 'Matemáticas I', 4, true
WHERE NOT EXISTS (SELECT 1 FROM academico.materia WHERE codigo = 'MAT101');

INSERT INTO academico.materia (codigo, nombre, unidadesvalorativas, activo)
SELECT 'PRG101', 'Programación I', 4, true
WHERE NOT EXISTS (SELECT 1 FROM academico.materia WHERE codigo = 'PRG101');

INSERT INTO academico.materia (codigo, nombre, unidadesvalorativas, activo)
SELECT 'BD101', 'Bases de Datos I', 4, true
WHERE NOT EXISTS (SELECT 1 FROM academico.materia WHERE codigo = 'BD101');

INSERT INTO academico.materia (codigo, nombre, unidadesvalorativas, activo)
SELECT 'FIS101', 'Física I', 4, true
WHERE NOT EXISTS (SELECT 1 FROM academico.materia WHERE codigo = 'FIS101');

-- 6. DOCENTE DE PRUEBA (julio.cesar — idusuario del DOCENTE existente)
DO $$
DECLARE
  v_idusuario  INTEGER;
  v_idpersona  INTEGER;
BEGIN
  SELECT idusuario INTO v_idusuario
  FROM seguridad.usuario u
  INNER JOIN seguridad.rol r ON u.idrol = r.idrol
  WHERE r.nombrerol = 'DOCENTE' LIMIT 1;

  IF v_idusuario IS NOT NULL AND NOT EXISTS (
    SELECT 1 FROM docentes.docente WHERE idusuario = v_idusuario
  ) THEN
    INSERT INTO personas.persona (primernombre, primerapellido, activo, fecharegistro)
    VALUES ('Julio', 'César', true, NOW())
    RETURNING idpersona INTO v_idpersona;

    INSERT INTO docentes.docente (idpersona, idusuario, codigodocente, fechaingreso, activo)
    VALUES (v_idpersona, v_idusuario, 'DOC-001', CURRENT_DATE, true);
  END IF;
END $$;

-- 7. GRUPOS para el período activo (uno por materia)
DO $$
DECLARE
  v_idperiodo INTEGER;
  v_iddocente INTEGER;
  v_idmateria INTEGER;
  v_num       INTEGER := 0;
BEGIN
  SELECT idperiodo INTO v_idperiodo FROM academico.periodoacademico WHERE activo = true LIMIT 1;
  SELECT iddocente INTO v_iddocente FROM docentes.docente LIMIT 1;

  IF v_idperiodo IS NOT NULL THEN
    FOR v_idmateria IN SELECT idmateria FROM academico.materia WHERE activo = true LOOP
      v_num := v_num + 1;
      INSERT INTO grupos.grupo (codigo, numerogrupo, cupomaximo, cupoactual, idmateria, iddocente, idperiodo, estado)
      VALUES (
        'G1-' || v_idmateria || '-' || v_idperiodo,
        1, 30, 0,
        v_idmateria, v_iddocente, v_idperiodo, 'ACTIVO'
      )
      ON CONFLICT DO NOTHING;
    END LOOP;
  END IF;
END $$;

-- 8. CONSTRAINT UNIQUE en evaluaciones.notafinal (idinscripcion)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'evaluaciones' AND table_name = 'notafinal' AND column_name = 'nota4'
  ) THEN
    ALTER TABLE evaluaciones.notafinal ADD COLUMN nota4 NUMERIC(4,2) DEFAULT 0;
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'evaluaciones' AND table_name = 'notafinal' AND column_name = 'nota5'
  ) THEN
    ALTER TABLE evaluaciones.notafinal ADD COLUMN nota5 NUMERIC(4,2) DEFAULT 0;
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'evaluaciones' AND table_name = 'notafinal' AND column_name = 'estado'
  ) THEN
    ALTER TABLE evaluaciones.notafinal ADD COLUMN estado VARCHAR(20) DEFAULT 'PENDIENTE';
  END IF;
END $$;

-- Agregar UNIQUE constraint en idinscripcion si no existe
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'notafinal_idinscripcion_key'
      AND conrelid = 'evaluaciones.notafinal'::regclass
  ) THEN
    ALTER TABLE evaluaciones.notafinal ADD CONSTRAINT notafinal_idinscripcion_key UNIQUE (idinscripcion);
  END IF;
END $$;

-- 9. VERIFICACIÓN FINAL
SELECT 'Períodos académicos' as tabla, COUNT(*) as total FROM academico.periodoacademico
UNION ALL SELECT 'Materias',          COUNT(*) FROM academico.materia
UNION ALL SELECT 'Grupos',            COUNT(*) FROM grupos.grupo
UNION ALL SELECT 'Docentes',          COUNT(*) FROM docentes.docente
UNION ALL SELECT 'Periodos notas',    COUNT(*) FROM configuracion.periodos_notas
UNION ALL SELECT 'Inscripciones',     COUNT(*) FROM inscripciones.inscripcion;
