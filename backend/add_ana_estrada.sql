-- ============================================================
-- ANA ESTRADA — Estudiante con inscripciones y notas
-- Ejecutar DESPUÉS de fix_db.sql en pgAdmin contra DB_UNI_II
-- ============================================================

DO $$
DECLARE
  v_idpersona   INTEGER;
  v_idusuario   INTEGER;
  v_idestudiante INTEGER;
  v_idrol       INTEGER;
  v_idestado    INTEGER;
  v_idcarrera   INTEGER;
  v_idplan      INTEGER;
  v_idperiodo   INTEGER;
  v_idgrupo     INTEGER;
  v_idinscripcion INTEGER;
BEGIN

  -- Obtener IDs necesarios
  SELECT idrol    INTO v_idrol    FROM seguridad.rol WHERE nombrerol = 'ESTUDIANTE' LIMIT 1;
  SELECT idestado INTO v_idestado FROM estudiantes.estadoestudiante WHERE UPPER(nombre) IN ('ACTIVO','ACTIVA','REGULAR') LIMIT 1;
  SELECT idcarrera INTO v_idcarrera FROM academico.carrera WHERE activo = true LIMIT 1;
  SELECT idplanestudio INTO v_idplan FROM academico.planestudio WHERE idcarrera = v_idcarrera AND activo = true LIMIT 1;
  SELECT idperiodo INTO v_idperiodo FROM academico.periodoacademico WHERE activo = true LIMIT 1;

  IF v_idrol IS NULL THEN RAISE EXCEPTION 'Rol ESTUDIANTE no encontrado'; END IF;
  IF v_idestado IS NULL THEN RAISE EXCEPTION 'Estado ACTIVO no encontrado'; END IF;
  IF v_idcarrera IS NULL THEN RAISE EXCEPTION 'Carrera no encontrada'; END IF;
  IF v_idplan IS NULL THEN RAISE EXCEPTION 'Plan de estudio no encontrado'; END IF;
  IF v_idperiodo IS NULL THEN RAISE EXCEPTION 'Período activo no encontrado. Ejecuta fix_db.sql primero'; END IF;

  -- Crear persona Ana Estrada (si no existe)
  IF NOT EXISTS (SELECT 1 FROM personas.persona WHERE primernombre = 'Ana' AND primerapellido = 'Estrada') THEN
    INSERT INTO personas.persona (primernombre, primerapellido, activo, fecharegistro)
    VALUES ('Ana', 'Estrada', true, NOW())
    RETURNING idpersona INTO v_idpersona;
  ELSE
    SELECT idpersona INTO v_idpersona FROM personas.persona WHERE primernombre = 'Ana' AND primerapellido = 'Estrada' LIMIT 1;
  END IF;

  -- Crear usuario (si no existe)
  IF NOT EXISTS (SELECT 1 FROM seguridad.usuario WHERE correo = 'ana.estrada@estudiante.edu.sv') THEN
    INSERT INTO seguridad.usuario (correo, clave, idrol, activo, fechacreacion)
    VALUES ('ana.estrada@estudiante.edu.sv', 'Ana2026', v_idrol, true, NOW())
    RETURNING idusuario INTO v_idusuario;
  ELSE
    SELECT idusuario INTO v_idusuario FROM seguridad.usuario WHERE correo = 'ana.estrada@estudiante.edu.sv';
  END IF;

  -- Crear estudiante (si no existe)
  IF NOT EXISTS (SELECT 1 FROM estudiantes.estudiante WHERE expediente = '2025002') THEN
    INSERT INTO estudiantes.estudiante
      (idpersona, expediente, fechaingreso, idcarrera, idplanestudio, idestado, idusuario, activo)
    VALUES (v_idpersona, '2025002', CURRENT_DATE, v_idcarrera, v_idplan, v_idestado, v_idusuario, true)
    RETURNING idestudiante INTO v_idestudiante;
  ELSE
    SELECT idestudiante INTO v_idestudiante FROM estudiantes.estudiante WHERE expediente = '2025002';
  END IF;

  -- Inscribir en todos los grupos del período activo
  FOR v_idgrupo IN
    SELECT idgrupo FROM grupos.grupo WHERE idperiodo = v_idperiodo AND estado = 'ACTIVO'
  LOOP
    -- Solo inscribir si no está ya inscrita
    IF NOT EXISTS (
      SELECT 1 FROM inscripciones.inscripcion
      WHERE idestudiante = v_idestudiante AND idgrupo = v_idgrupo
    ) THEN
      INSERT INTO inscripciones.inscripcion (idestudiante, idgrupo, estado, fechainscripcion)
      VALUES (v_idestudiante, v_idgrupo, 'INSCRITO', NOW())
      RETURNING idinscripcion INTO v_idinscripcion;

      -- Actualizar cupo
      UPDATE grupos.grupo SET cupoactual = cupoactual + 1 WHERE idgrupo = v_idgrupo;

      -- Insertar notas de ejemplo para esa inscripción
      INSERT INTO evaluaciones.notafinal
        (idinscripcion, nota1, nota2, nota3, nota4, nota5, notapromedio, notafinal, estado, fecharegistro)
      VALUES
        (v_idinscripcion, 8.5, 7.0, 9.0, 0, 0, 8.17, 8.17, 'APROBADO', NOW())
      ON CONFLICT (idinscripcion) DO NOTHING;
    END IF;
  END LOOP;

  RAISE NOTICE 'Ana Estrada creada: idestudiante=%, idusuario=%', v_idestudiante, v_idusuario;
END $$;

-- Verificar
SELECT
  e.expediente,
  p.primernombre || ' ' || p.primerapellido as nombre,
  u.correo,
  c.nombre as carrera,
  COUNT(i.idinscripcion) as inscripciones,
  COUNT(nf.idnotafinal) as notas_registradas
FROM estudiantes.estudiante e
INNER JOIN personas.persona p ON e.idpersona = p.idpersona
INNER JOIN seguridad.usuario u ON e.idusuario = u.idusuario
INNER JOIN academico.carrera c ON e.idcarrera = c.idcarrera
LEFT JOIN inscripciones.inscripcion i ON e.idestudiante = i.idestudiante
LEFT JOIN evaluaciones.notafinal nf ON i.idinscripcion = nf.idinscripcion
WHERE p.primernombre = 'Ana' AND p.primerapellido = 'Estrada'
GROUP BY e.expediente, p.primernombre, p.primerapellido, u.correo, c.nombre;
