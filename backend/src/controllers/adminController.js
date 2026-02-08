const db = require("../config/db");

// Obtener todos los usuarios
exports.getUsuarios = async (req, res) => {
  try {
    const query = `
      SELECT 
        u.idusuario,
        u.correo,
        r.nombrerol as rol,
        COALESCE(e.nombre || ' ' || e.apellidos, d.nombres || ' ' || d.apellidos, u.correo) as nombre
      FROM seguridad.usuario u
      INNER JOIN seguridad.rol r ON u.idrol = r.idrol
      LEFT JOIN academico.estudiante e ON u.idusuario = e.idusuario
      LEFT JOIN academico.docente d ON u.idusuario = d.idusuario
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
        d.nombres || ' ' || d.apellidos as nombre,
        d.especialidad,
        u.correo,
        COUNT(g.idgrupo) as grupos_asignados
      FROM academico.docente d
      INNER JOIN seguridad.usuario u ON d.idusuario = u.idusuario
      LEFT JOIN academico.grupo g ON d.iddocente = g.iddocente
      GROUP BY d.iddocente, d.nombres, d.apellidos, d.especialidad, u.correo
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
      "UPDATE academico.grupo SET iddocente = $1 WHERE idgrupo = $2",
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
      FROM academico.grupo g
      LEFT JOIN registro.inscripcion i ON g.idgrupo = i.idgrupo
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
      "UPDATE registro.inscripcion SET idgrupo = $1 WHERE idinscripcion = $2",
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
        c.año || '-' || c.periodo as ciclo,
        d.nombres || ' ' || d.apellidos as docente
      FROM academico.grupo g
      INNER JOIN academico.cicloacademico c ON g.idciclo = c.idciclo
      INNER JOIN academico.docente d ON g.iddocente = d.iddocente
      LEFT JOIN registro.inscripcion i ON g.idgrupo = i.idgrupo
      WHERE g.idmateria = $1
      GROUP BY g.idgrupo, g.cupomaximo, c.año, c.periodo, d.nombres, d.apellidos
      HAVING COUNT(i.idinscripcion) < g.cupomaximo
      ORDER BY c.año DESC, c.periodo DESC
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
