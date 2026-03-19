const db = require("../config/db");

// Obtener todos los usuarios
exports.getUsuarios = async (req, res) => {
  try {
    const query = `
      SELECT 
        u.idusuario,
        u.correo,
        r.nombrerol as rol,
        COALESCE(
          p_e.primernombre || ' ' || p_e.primerapellido,
          p_d.primernombre || ' ' || p_d.primerapellido,
          u.correo
        ) as nombre
      FROM seguridad.usuario u
      INNER JOIN seguridad.rol r ON u.idrol = r.idrol
      LEFT JOIN estudiantes.estudiante e ON u.idusuario = e.idusuario
      LEFT JOIN personas.persona p_e ON e.idpersona = p_e.idpersona
      LEFT JOIN docentes.docente d ON u.idusuario = d.idusuario
      LEFT JOIN personas.persona p_d ON d.idpersona = p_d.idpersona
      ORDER BY r.nombrerol, u.correo
    `;

    const result = await db.query(query);

    res.json({
      success: true,
      usuarios: result.rows,
    });
  } catch (error) {
    console.error("ERROR GET USUARIOS:", error);
    res.status(500).json({
      success: false,
      message: "Error al obtener usuarios",
    });
  }
};

// Obtener todos los docentes
exports.getDocentes = async (req, res) => {
  try {
    const query = `
      SELECT 
        d.iddocente,
        p.primernombre || ' ' || p.primerapellido as nombre,
        d.especialidad,
        u.correo,
        COUNT(g.idgrupo) as grupos_asignados
      FROM docentes.docente d
      INNER JOIN personas.persona p ON d.idpersona = p.idpersona
      INNER JOIN seguridad.usuario u ON d.idusuario = u.idusuario
      LEFT JOIN grupos.grupo g ON d.iddocente = g.iddocente
      GROUP BY d.iddocente, p.primernombre, p.primerapellido, d.especialidad, u.correo
      ORDER BY d.nombres
    `;

    const result = await db.query(query);

    res.json({
      success: true,
      docentes: result.rows,
    });
  } catch (error) {
    console.error("ERROR GET DOCENTES:", error);
    res.status(500).json({
      success: false,
      message: "Error al obtener docentes",
    });
  }
};

// Asignar docente a grupo
exports.asignarDocente = async (req, res) => {
  try {
    const { idgrupo } = req.params;
    const { iddocente } = req.body;

    await db.query(
      "UPDATE grupos.grupo SET iddocente = $1 WHERE idgrupo = $2",
      [iddocente, idgrupo]
    );

    res.json({
      success: true,
      message: "Docente asignado correctamente",
    });
  } catch (error) {
    console.error("ERROR ASIGNAR DOCENTE:", error);
    res.status(500).json({
      success: false,
      message: "Error al asignar docente",
    });
  }
};

// Mover estudiante de grupo
exports.moverEstudiante = async (req, res) => {
  try {
    const { idinscripcion } = req.params;
    const { idgrupo_destino } = req.body;

    // Verificar cupo disponible
    const cupo = await db.query(
      `SELECT 
        g.cupomaximo,
        COUNT(i.idinscripcion) as inscritos
      FROM grupos.grupo g
      LEFT JOIN inscripciones.inscripcion i ON g.idgrupo = i.idgrupo
      WHERE g.idgrupo = $1
      GROUP BY g.cupomaximo`,
      [idgrupo_destino]
    );

    if (cupo.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Grupo no encontrado",
      });
    }

    const { cupomaximo, inscritos } = cupo.rows[0];
    if (parseInt(inscritos) >= parseInt(cupomaximo)) {
      return res.status(400).json({
        success: false,
        message: "El grupo destino no tiene cupo disponible",
      });
    }

    // Mover estudiante
    await db.query(
      "UPDATE inscripciones.inscripcion SET idgrupo = $1 WHERE idinscripcion = $2",
      [idgrupo_destino, idinscripcion]
    );

    res.json({
      success: true,
      message: "Estudiante movido correctamente",
    });
  } catch (error) {
    console.error("ERROR MOVER ESTUDIANTE:", error);
    res.status(500).json({
      success: false,
      message: "Error al mover estudiante",
    });
  }
};

// Obtener grupos disponibles para mover estudiante
exports.getGruposDisponibles = async (req, res) => {
  try {
    const { idmateria } = req.params;

    const query = `
      SELECT 
        g.idgrupo,
        g.cupomaximo,
        COUNT(i.idinscripcion) as inscritos,
        p.nombre || '-' || p.numeroperiodo as ciclo,
        pd.primernombre || ' ' || pd.primerapellido as docente
      FROM grupos.grupo g
      INNER JOIN academico.periodoacademico p ON g.idperiodo = p.idperiodo
      INNER JOIN docentes.docente d ON g.iddocente = d.iddocente
      INNER JOIN personas.persona pd ON d.idpersona = pd.idpersona
      LEFT JOIN inscripciones.inscripcion i ON g.idgrupo = i.idgrupo
      WHERE g.idmateria = $1
      GROUP BY g.idgrupo, g.cupomaximo, p.nombre, p.numeroperiodo, pd.primernombre, pd.primerapellido
      HAVING COUNT(i.idinscripcion) < g.cupomaximo
      ORDER BY p.año DESC, p.numeroperiodo DESC
    `;

    const result = await db.query(query, [idmateria]);

    res.json({
      success: true,
      grupos: result.rows,
    });
  } catch (error) {
    console.error("ERROR GET GRUPOS DISPONIBLES:", error);
    res.status(500).json({
      success: false,
      message: "Error al obtener grupos disponibles",
    });
  }
};

// ============================================
// GESTIÓN DE PERMISOS DE NOTAS
// ============================================

// Obtener períodos de notas
exports.getPeriodosNotas = async (req, res) => {
  try {
    const query = `SELECT * FROM configuracion.periodos_notas ORDER BY idPeriodo`;
    const result = await db.query(query);
    res.json({ success: true, periodos: result.rows });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Actualizar período de notas
exports.actualizarPeriodo = async (req, res) => {
  const { idPeriodo } = req.params;
  const { fechaInicio, fechaFin, activo } = req.body;
  try {
    const query = `
      UPDATE configuracion.periodos_notas
      SET fechaInicio = $1, fechaFin = $2, activo = $3
      WHERE idPeriodo = $4
      RETURNING *
    `;
    const result = await db.query(query, [fechaInicio, fechaFin, activo, idPeriodo]);
    res.json({ success: true, periodo: result.rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Obtener todos los permisos de edición
exports.getPermisosEdicion = async (req, res) => {
  try {
    const query = `
      SELECT 
        pe.*,
        pd.primernombre || ' ' || pd.primerapellido as nombreCatedratico,
        m.nombre as nombreMateria,
        m.codigo as codigoMateria,
        g.numeroGrupo
      FROM configuracion.permisos_edicion pe
      INNER JOIN docentes.docente d ON pe.idCatedratico = d.iddocente
      INNER JOIN personas.persona pd ON d.idpersona = pd.idpersona
      INNER JOIN academico.materia m ON pe.idMateria = m.idmateria
      INNER JOIN grupos.grupo g ON pe.idGrupo = g.idgrupo
      ORDER BY pd.primernombre, m.nombre
    `;
    const result = await db.query(query);
    res.json({ success: true, permisos: result.rows });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Habilitar permiso de edición
exports.habilitarPermiso = async (req, res) => {
  const { idCatedratico, idMateria, idGrupo, nota1, nota2, nota3, idAdmin } = req.body;
  try {
    const query = `
      INSERT INTO configuracion.permisos_edicion 
        (idCatedratico, idMateria, idGrupo, puedeEditarNota1, puedeEditarNota2, puedeEditarNota3, habilitadoPor)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      ON CONFLICT (idCatedratico, idMateria, idGrupo)
      DO UPDATE SET 
        puedeEditarNota1 = $4,
        puedeEditarNota2 = $5,
        puedeEditarNota3 = $6,
        habilitadoPor = $7,
        fechaHabilitacion = CURRENT_TIMESTAMP
      RETURNING *
    `;
    const result = await db.query(query, [idCatedratico, idMateria, idGrupo, nota1, nota2, nota3, idAdmin]);
    res.json({ success: true, permiso: result.rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Resetear edición de notas (permitir editar nuevamente)
exports.resetearEdicion = async (req, res) => {
  const { idPermiso } = req.params;
  const { nota1, nota2, nota3 } = req.body;
  try {
    const query = `
      UPDATE configuracion.permisos_edicion
      SET editadoNota1 = CASE WHEN $1 = true THEN false ELSE editadoNota1 END,
          editadoNota2 = CASE WHEN $2 = true THEN false ELSE editadoNota2 END,
          editadoNota3 = CASE WHEN $3 = true THEN false ELSE editadoNota3 END
      WHERE idPermiso = $4
      RETURNING *
    `;
    const result = await db.query(query, [nota1, nota2, nota3, idPermiso]);
    res.json({ success: true, permiso: result.rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
