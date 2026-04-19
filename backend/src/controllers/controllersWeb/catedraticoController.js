const db = require("../../config/db");

exports.getMateriasCatedratico = async (req, res) => {
  const { idCatedratico } = req.params;
  try {
    const query = `
      SELECT m.idmateria, m.codigo as codigoMateria, m.nombre as nombreMateria,
             g.idgrupo, g.numerogrupo,
             p.nombre || '-' || p.numeroperiodo as ciclo
      FROM academico.materia m
      INNER JOIN grupos.grupo g ON m.idmateria = g.idmateria
      INNER JOIN academico.periodoacademico p ON g.idperiodo = p.idperiodo
      WHERE g.iddocente = $1
        AND p.activo = true
    `;
    const result = await db.query(query, [idCatedratico]);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getEstudiantesGrupo = async (req, res) => {
  const { idGrupo } = req.params;
  try {
    const query = `
      SELECT 
        e.idestudiante,
        e.expediente,
        p.primernombre || ' ' || p.segundonombre as nombre,
        p.primerapellido || ' ' || p.segundoapellido as apellidos,
        n.nota1, n.nota2, n.nota3, n.notafinal
      FROM estudiantes.estudiante e
      INNER JOIN personas.persona p ON e.idpersona = p.idpersona
      INNER JOIN inscripciones.inscripcion i ON e.idestudiante = i.idestudiante
      LEFT JOIN evaluaciones.notafinal n ON i.idinscripcion = n.idinscripcion
      WHERE i.idgrupo = $1
      ORDER BY p.primerapellido, p.primernombre
    `;
    const result = await db.query(query, [idGrupo]);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.ingresarNotas = async (req, res) => {
  const { idInscripcion, nota1, nota2, nota3, idCatedratico, idGrupo, esAdmin } = req.body;
  try {
    // Si es admin, saltar verificación de permisos
    if (!esAdmin) {
      // Verificar permisos para catedráticos
      const permisoQuery = `
        SELECT puedeEditarNota1, puedeEditarNota2, puedeEditarNota3,
               editadoNota1, editadoNota2, editadoNota3
        FROM configuracion.permisos_edicion
        WHERE idCatedratico = $1 AND idGrupo = $2
      `;
      const permisoResult = await db.query(permisoQuery, [idCatedratico, idGrupo]);
      
      if (permisoResult.rows.length === 0) {
        return res.status(403).json({ error: "No tiene permisos para editar notas en este grupo" });
      }

      const permisos = permisoResult.rows[0];
      
      // Verificar qué notas puede editar
      if (nota1 !== undefined && nota1 !== null && (!permisos.puedeeditarnota1 || permisos.editadonota1)) {
        return res.status(403).json({ error: "No puede editar Nota 1 o ya fue editada" });
      }
      if (nota2 !== undefined && nota2 !== null && (!permisos.puedeeditarnota2 || permisos.editadonota2)) {
        return res.status(403).json({ error: "No puede editar Nota 2 o ya fue editada" });
      }
      if (nota3 !== undefined && nota3 !== null && (!permisos.puedeeditarnota3 || permisos.editadonota3)) {
        return res.status(403).json({ error: "No puede editar Nota 3 o ya fue editada" });
      }
    }

    // Obtener notas actuales si existen
    const notasActualesQuery = `SELECT nota1, nota2, nota3 FROM evaluaciones.notafinal WHERE idinscripcion = $1`;
    const notasActualesResult = await db.query(notasActualesQuery, [idInscripcion]);
    
    let n1, n2, n3;
    if (notasActualesResult.rows.length > 0) {
      const actual = notasActualesResult.rows[0];
      n1 = nota1 !== undefined && nota1 !== null ? nota1 : actual.nota1;
      n2 = nota2 !== undefined && nota2 !== null ? nota2 : actual.nota2;
      n3 = nota3 !== undefined && nota3 !== null ? nota3 : actual.nota3;
    } else {
      n1 = nota1 !== undefined && nota1 !== null ? nota1 : null;
      n2 = nota2 !== undefined && nota2 !== null ? nota2 : null;
      n3 = nota3 !== undefined && nota3 !== null ? nota3 : null;
    }

    let notaFinal = null;
    const notasValidas = [n1, n2, n3].filter(n => n !== null && n !== undefined);
    if (notasValidas.length > 0) {
      const suma = notasValidas.reduce((acc, n) => acc + parseFloat(n), 0);
      notaFinal = (suma / notasValidas.length).toFixed(2);
    }
    
    const query = `
      INSERT INTO evaluaciones.notafinal (idinscripcion, nota1, nota2, nota3, notapromedio, notafinal)
      VALUES ($1, $2, $3, $4, $5, $5)
      ON CONFLICT (idinscripcion) 
      DO UPDATE SET 
        nota1 = COALESCE($2, evaluaciones.notafinal.nota1),
        nota2 = COALESCE($3, evaluaciones.notafinal.nota2),
        nota3 = COALESCE($4, evaluaciones.notafinal.nota3),
        notapromedio = $5,
        notafinal = $5
      RETURNING *
    `;
    const result = await db.query(query, [idInscripcion, n1, n2, n3, notaFinal]);

    // Marcar como editado solo si NO es admin
    if (!esAdmin && idCatedratico && idGrupo) {
      const updatePermisoQuery = `
        UPDATE configuracion.permisos_edicion
        SET editadoNota1 = CASE WHEN $1 IS NOT NULL THEN true ELSE editadoNota1 END,
            editadoNota2 = CASE WHEN $2 IS NOT NULL THEN true ELSE editadoNota2 END,
            editadoNota3 = CASE WHEN $3 IS NOT NULL THEN true ELSE editadoNota3 END
        WHERE idCatedratico = $4 AND idGrupo = $5
      `;
      await db.query(updatePermisoQuery, [nota1, nota2, nota3, idCatedratico, idGrupo]);
    }

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getPermisosEdicion = async (req, res) => {
  const { idCatedratico, idGrupo } = req.params;
  try {
    const query = `
      SELECT * FROM configuracion.permisos_edicion
      WHERE idCatedratico = $1 AND idGrupo = $2
    `;
    const result = await db.query(query, [idCatedratico, idGrupo]);
    res.json(result.rows[0] || { puedeEditarNota1: false, puedeEditarNota2: false, puedeEditarNota3: false });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
