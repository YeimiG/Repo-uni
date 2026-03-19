-- ============================================
-- SCRIPT DE PRUEBA - SISTEMA DE PERMISOS
-- ============================================

-- 1. Verificar que las tablas existan
SELECT 'Tabla periodos_notas existe' as status 
FROM information_schema.tables 
WHERE table_schema = 'configuracion' AND table_name = 'periodos_notas';

SELECT 'Tabla permisos_edicion existe' as status 
FROM information_schema.tables 
WHERE table_schema = 'configuracion' AND table_name = 'permisos_edicion';

-- 2. Ver períodos de notas
SELECT * FROM configuracion.periodos_notas;

-- 3. Insertar permiso de prueba (ajusta los IDs según tu DB)
-- Ejemplo: Habilitar Nota1 para catedrático ID=1, materia ID=1, grupo ID=1
INSERT INTO configuracion.permisos_edicion 
  (idCatedratico, idMateria, idGrupo, puedeEditarNota1, puedeEditarNota2, puedeEditarNota3, habilitadoPor)
VALUES 
  (1, 1, 1, true, false, false, 1)
ON CONFLICT (idCatedratico, idMateria, idGrupo) 
DO UPDATE SET 
  puedeEditarNota1 = true,
  fechaHabilitacion = CURRENT_TIMESTAMP;

-- 4. Ver permisos creados
SELECT * FROM configuracion.permisos_edicion;

-- 5. Simular ingreso de nota (esto lo hará el backend)
-- INSERT INTO registro.notas (idInscripcion, nota1, nota2, nota3, notaFinal)
-- VALUES (1, 8.5, NULL, NULL, 2.83);

-- 6. Marcar como editado (esto lo hará el backend)
-- UPDATE configuracion.permisos_edicion
-- SET editadoNota1 = true
-- WHERE idCatedratico = 1 AND idGrupo = 1;

-- 7. Verificar estado después de edición
SELECT 
  pe.*,
  CASE WHEN pe.puedeEditarNota1 AND NOT pe.editadoNota1 THEN 'Puede editar Nota1'
       WHEN pe.puedeEditarNota1 AND pe.editadoNota1 THEN 'Ya editó Nota1'
       ELSE 'No tiene permiso Nota1' END as estadoNota1
FROM configuracion.permisos_edicion pe
WHERE idCatedratico = 1 AND idGrupo = 1;

-- 8. Resetear edición (solo admin)
-- UPDATE configuracion.permisos_edicion
-- SET editadoNota1 = false
-- WHERE idPermiso = 1;

-- 9. Activar período actual
UPDATE configuracion.periodos_notas SET activo = false; -- Desactivar todos
UPDATE configuracion.periodos_notas SET activo = true WHERE nombrePeriodo = 'Parcial 1';

-- 10. Ver período activo
SELECT * FROM configuracion.periodos_notas WHERE activo = true;

-- ============================================
-- CONSULTAS ÚTILES
-- ============================================

-- Ver permisos con información completa
SELECT 
  pe.idPermiso,
  d.nombres || ' ' || d.apellidos as catedratico,
  m.nombreMateria,
  g.numeroGrupo,
  pe.puedeEditarNota1,
  pe.puedeEditarNota2,
  pe.puedeEditarNota3,
  pe.editadoNota1,
  pe.editadoNota2,
  pe.editadoNota3,
  pe.fechaHabilitacion
FROM configuracion.permisos_edicion pe
LEFT JOIN academico.docente d ON pe.idCatedratico = d.iddocente
LEFT JOIN academico.materia m ON pe.idMateria = m.idmateria
LEFT JOIN academico.grupo g ON pe.idGrupo = g.idgrupo
ORDER BY d.nombres, m.nombreMateria;

-- Ver notas con información de estudiante
SELECT 
  e.nombre || ' ' || e.apellidos as estudiante,
  m.nombreMateria,
  n.nota1,
  n.nota2,
  n.nota3,
  n.notaFinal
FROM registro.notas n
INNER JOIN academico.inscripcion i ON n.idInscripcion = i.idinscripcion
INNER JOIN academico.estudiante e ON i.idestudiante = e.idestudiante
INNER JOIN academico.grupo g ON i.idgrupo = g.idgrupo
INNER JOIN academico.materia m ON g.idmateria = m.idmateria
ORDER BY e.apellidos, m.nombreMateria;
