const db = require("../../config/db");

/**
 * CRUD DE DOCENTES - Gestión de docentes
 * Los docentes son personas con rol DOCENTE que tienen acceso a grupos
 */

// ────────────────────────────────────────────────────────────
// GET - Obtener todos los docentes
// ────────────────────────────────────────────────────────────
exports.getDocentes = async (req, res) => {
  try {
    const { activo, search } = req.query;

    let query = `
      SELECT 
        d.iddocente,
        d.idpersona,
        d.idusuario,
        d.especialidad,
        d.activo,
        p.primernombre,
        p.segundonombre,
        p.primerapellido,
        p.segundoapellido,
        (p.primernombre || ' ' || COALESCE(p.segundonombre || ' ', '') || p.primerapellido || ' ' || COALESCE(p.segundoapellido, '')) as nombre_completo,
        u.correo,
        COUNT(DISTINCT g.idgrupo) as grupos_asignados
      FROM docentes.docente d
      INNER JOIN personas.persona p ON d.idpersona = p.idpersona
      INNER JOIN seguridad.usuario u ON d.idusuario = u.idusuario
      LEFT JOIN grupos.grupo g ON d.iddocente = g.iddocente
    `;

    const params = [];
    let paramIndex = 1;
    const conditions = [];

    if (activo !== undefined) {
      conditions.push(`d.activo = $${paramIndex++}`);
      params.push(activo === "true");
    }

    if (search) {
      conditions.push(`(
        p.primernombre ILIKE $${paramIndex} OR
        p.primerapellido ILIKE $${paramIndex} OR
        u.correo ILIKE $${paramIndex} OR
        d.especialidad ILIKE $${paramIndex}
      )`);
      params.push(`%${search}%`);
      paramIndex++;
    }

    if (conditions.length > 0) {
      query += " WHERE " + conditions.join(" AND ");
    }

    query += `
      GROUP BY d.iddocente, d.idpersona, d.idusuario, d.especialidad, d.activo,
               p.primernombre, p.segundonombre, p.primerapellido, p.segundoapellido,
               u.correo
      ORDER BY p.primerapellido, p.primernombre
    `;

    const result = await db.query(query, params);

    res.json({
      success: true,
      docentes: result.rows,
      total: result.rows.length,
    });
  } catch (error) {
    console.error("ERROR GET DOCENTES:", error);
    res.status(500).json({
      success: false,
      message: "Error al obtener docentes",
      error: error.message,
    });
  }
};

// ────────────────────────────────────────────────────────────
// GET - Obtener docente por ID
// ────────────────────────────────────────────────────────────
exports.getDocenteById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await db.query(
      `SELECT 
        d.iddocente,
        d.idpersona,
        d.idusuario,
        d.especialidad,
        d.activo,
        p.primernombre,
        p.segundonombre,
        p.primerapellido,
        p.segundoapellido,
        u.correo
      FROM docentes.docente d
      INNER JOIN personas.persona p ON d.idpersona = p.idpersona
      INNER JOIN seguridad.usuario u ON d.idusuario = u.idusuario
      WHERE d.iddocente = $1`,
      [id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Docente no encontrado",
      });
    }

    res.json({
      success: true,
      docente: result.rows[0],
    });
  } catch (error) {
    console.error("ERROR GET DOCENTE BY ID:", error);
    res.status(500).json({
      success: false,
      message: "Error al obtener docente",
      error: error.message,
    });
  }
};

// ────────────────────────────────────────────────────────────
// POST - Crear nuevo docente
// ────────────────────────────────────────────────────────────
exports.crearDocente = async (req, res) => {
  try {
    const { idpersona, idusuario, especialidad } = req.body;

    // Validar campos obligatorios
    if (!idpersona || !idusuario) {
      return res.status(400).json({
        success: false,
        message: "idpersona e idusuario son obligatorios",
      });
    }

    // Verificar que persona existe
    const personaRes = await db.query(
      "SELECT idpersona FROM personas.persona WHERE idpersona = $1",
      [idpersona],
    );
    if (personaRes.rows.length === 0) {
      return res.status(400).json({
        success: false,
        message: "La persona especificada no existe",
      });
    }

    // Verificar que usuario existe y tiene rol DOCENTE
    const usuarioRes = await db.query(
      `SELECT u.idusuario, r.nombrerol
       FROM seguridad.usuario u
       INNER JOIN seguridad.rol r ON u.idrol = r.idrol
       WHERE u.idusuario = $1`,
      [idusuario],
    );
    if (usuarioRes.rows.length === 0) {
      return res.status(400).json({
        success: false,
        message: "El usuario especificado no existe",
      });
    }

    // Validar que el usuario tiene rol DOCENTE
    if (usuarioRes.rows[0].nombrerol !== "DOCENTE") {
      return res.status(400).json({
        success: false,
        message: "El usuario debe tener rol DOCENTE",
      });
    }

    // Verificar que no existe docente para esta persona
    const existeDocente = await db.query(
      "SELECT iddocente FROM docentes.docente WHERE idpersona = $1",
      [idpersona],
    );
    if (existeDocente.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Esta persona ya es un docente",
      });
    }

    // Crear docente
    const result = await db.query(
      `INSERT INTO docentes.docente 
       (idpersona, idusuario, especialidad, activo)
       VALUES ($1, $2, $3, true)
       RETURNING iddocente, idpersona, idusuario, especialidad`,
      [idpersona, idusuario, especialidad || null],
    );

    const docente = result.rows[0];

    res.json({
      success: true,
      message: "Docente creado correctamente",
      docente,
    });
  } catch (error) {
    console.error("ERROR CREAR DOCENTE:", error);
    res.status(500).json({
      success: false,
      message: "Error al crear docente",
      error: error.message,
    });
  }
};

// ────────────────────────────────────────────────────────────
// PUT - Actualizar docente
// ────────────────────────────────────────────────────────────
exports.actualizarDocente = async (req, res) => {
  try {
    const { id } = req.params;
    const { especialidad, activo } = req.body;

    // Verificar que el docente existe
    const existe = await db.query(
      "SELECT iddocente FROM docentes.docente WHERE iddocente = $1",
      [id],
    );
    if (existe.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Docente no encontrado",
      });
    }

    // Construir query dinámico
    const updates = [];
    const params = [];
    let paramIndex = 1;

    if (especialidad !== undefined) {
      updates.push(`especialidad = $${paramIndex++}`);
      params.push(especialidad || null);
    }
    if (activo !== undefined) {
      updates.push(`activo = $${paramIndex++}`);
      params.push(activo);
    }

    if (updates.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No hay campos para actualizar",
      });
    }

    params.push(id);
    const query = `
      UPDATE docentes.docente
      SET ${updates.join(", ")}
      WHERE iddocente = $${paramIndex}
      RETURNING iddocente, especialidad, activo
    `;

    const result = await db.query(query, params);

    res.json({
      success: true,
      message: "Docente actualizado correctamente",
      docente: result.rows[0],
    });
  } catch (error) {
    console.error("ERROR ACTUALIZAR DOCENTE:", error);
    res.status(500).json({
      success: false,
      message: "Error al actualizar docente",
      error: error.message,
    });
  }
};

// ────────────────────────────────────────────────────────────
// PATCH - Activar/Desactivar docente
// ────────────────────────────────────────────────────────────
exports.toggleDocente = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await db.query(
      `UPDATE docentes.docente
       SET activo = NOT activo
       WHERE iddocente = $1
       RETURNING iddocente, activo`,
      [id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Docente no encontrado",
      });
    }

    const docente = result.rows[0];
    res.json({
      success: true,
      message: docente.activo ? "Docente activado" : "Docente desactivado",
      docente,
    });
  } catch (error) {
    console.error("ERROR TOGGLE DOCENTE:", error);
    res.status(500).json({
      success: false,
      message: "Error al cambiar estado de docente",
      error: error.message,
    });
  }
};

// ────────────────────────────────────────────────────────────
// GET - Obtener grupos del docente
// ────────────────────────────────────────────────────────────
exports.getGruposDocente = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await db.query(
      `SELECT 
        g.idgrupo,
        g.codigo,
        m.codigo as codigomateria,
        m.nombre as nombremateria,
        p.nombre || '-' || p.numeroperiodo as ciclo,
        g.cupomaximo,
        COUNT(i.idinscripcion) as inscritos,
        g.estado
      FROM grupos.grupo g
      INNER JOIN academico.materia m ON g.idmateria = m.idmateria
      INNER JOIN academico.periodoacademico p ON g.idperiodo = p.idperiodo
      LEFT JOIN inscripciones.inscripcion i ON g.idgrupo = i.idgrupo
      WHERE g.iddocente = $1
      GROUP BY g.idgrupo, g.codigo, m.codigo, m.nombre, p.nombre, p.numeroperiodo,
               g.cupomaximo, g.estado
      ORDER BY p.nombre DESC, m.nombre`,
      [id],
    );

    res.json({
      success: true,
      grupos: result.rows,
    });
  } catch (error) {
    console.error("ERROR GET GRUPOS DOCENTE:", error);
    res.status(500).json({
      success: false,
      message: "Error al obtener grupos del docente",
      error: error.message,
    });
  }
};
