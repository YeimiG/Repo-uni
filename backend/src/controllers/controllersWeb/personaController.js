const db = require("../../config/db");

/**
 * CRUD DE PERSONAS - Gestión centralizada de personas
 * Las personas son la base para estudiantes, docentes y empleados
 */

// ────────────────────────────────────────────────────────────
// GET - Obtener todas las personas
// ────────────────────────────────────────────────────────────
exports.getPersonas = async (req, res) => {
  try {
    const { activo, search } = req.query;

    let query = `
      SELECT 
        p.idpersona,
        p.primernombre,
        p.segundonombre,
        p.primerapellido,
        p.segundoapellido,
        p.dui,
        p.telefono,
        p.direccion,
        p.fechanacimiento,
        p.activo,
        (p.primernombre || ' ' || COALESCE(p.segundonombre || ' ', '') || p.primerapellido || ' ' || COALESCE(p.segundoapellido, '')) as nombre_completo,
        COUNT(DISTINCT CASE WHEN e.idestudiante IS NOT NULL THEN e.idestudiante END) as es_estudiante,
        COUNT(DISTINCT CASE WHEN d.iddocente IS NOT NULL THEN d.iddocente END) as es_docente,
        COUNT(DISTINCT CASE WHEN em.idempleado IS NOT NULL THEN em.idempleado END) as es_empleado
      FROM personas.persona p
      LEFT JOIN estudiantes.estudiante e ON p.idpersona = e.idpersona
      LEFT JOIN docentes.docente d ON p.idpersona = d.idpersona
      LEFT JOIN empleados.empleado em ON p.idpersona = em.idpersona
    `;

    const params = [];
    let paramIndex = 1;
    const conditions = [];

    if (activo !== undefined) {
      conditions.push(`p.activo = $${paramIndex++}`);
      params.push(activo === "true");
    }

    if (search) {
      conditions.push(`(
        p.primernombre ILIKE $${paramIndex} OR
        p.primerapellido ILIKE $${paramIndex} OR
        p.dui ILIKE $${paramIndex} OR
        p.telefono ILIKE $${paramIndex}
      )`);
      params.push(`%${search}%`);
      paramIndex++;
    }

    if (conditions.length > 0) {
      query += " WHERE " + conditions.join(" AND ");
    }

    query += `
      GROUP BY p.idpersona
      ORDER BY p.primerapellido, p.primernombre
    `;

    const result = await db.query(query, params);

    res.json({
      success: true,
      personas: result.rows,
      total: result.rows.length,
    });
  } catch (error) {
    console.error("ERROR GET PERSONAS:", error);
    res.status(500).json({
      success: false,
      message: "Error al obtener personas",
      error: error.message,
    });
  }
};

// ────────────────────────────────────────────────────────────
// GET - Obtener persona por ID
// ────────────────────────────────────────────────────────────
exports.getPersonaById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await db.query(
      `SELECT 
        p.idpersona,
        p.primernombre,
        p.segundonombre,
        p.primerapellido,
        p.segundoapellido,
        p.dui,
        p.telefono,
        p.direccion,
        p.fechanacimiento,
        p.activo,
        p.fecharegistro,
        (p.primernombre || ' ' || COALESCE(p.segundonombre || ' ', '') || p.primerapellido || ' ' || COALESCE(p.segundoapellido, '')) as nombre_completo
      FROM personas.persona p
      WHERE p.idpersona = $1`,
      [id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Persona no encontrada",
      });
    }

    res.json({
      success: true,
      persona: result.rows[0],
    });
  } catch (error) {
    console.error("ERROR GET PERSONA BY ID:", error);
    res.status(500).json({
      success: false,
      message: "Error al obtener persona",
      error: error.message,
    });
  }
};

// ────────────────────────────────────────────────────────────
// POST - Crear nueva persona
// ────────────────────────────────────────────────────────────
exports.crearPersona = async (req, res) => {
  try {
    const {
      primernombre,
      segundonombre,
      primerapellido,
      segundoapellido,
      dui,
      telefono,
      direccion,
      fechanacimiento,
    } = req.body;

    // Validar campos obligatorios
    if (!primernombre || !primerapellido) {
      return res.status(400).json({
        success: false,
        message: "Nombre y apellido son obligatorios",
      });
    }

    // Verificar DUI único si se proporciona
    if (dui) {
      const existeDUI = await db.query(
        "SELECT idpersona FROM personas.persona WHERE dui = $1",
        [dui],
      );
      if (existeDUI.rows.length > 0) {
        return res.status(400).json({
          success: false,
          message: "El DUI ya está registrado",
        });
      }
    }

    // Crear persona
    const result = await db.query(
      `INSERT INTO personas.persona 
       (primernombre, segundonombre, primerapellido, segundoapellido, dui, 
        telefono, direccion, fechanacimiento, activo, fecharegistro)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, true, NOW())
       RETURNING 
         idpersona, primernombre, segundonombre, primerapellido, segundoapellido,
         dui, telefono, direccion, fechanacimiento, activo, fecharegistro`,
      [
        primernombre,
        segundonombre || null,
        primerapellido,
        segundoapellido || null,
        dui || null,
        telefono || null,
        direccion || null,
        fechanacimiento || null,
      ],
    );

    const persona = result.rows[0];

    res.json({
      success: true,
      message: "Persona creada correctamente",
      persona,
    });
  } catch (error) {
    console.error("ERROR CREAR PERSONA:", error);
    res.status(500).json({
      success: false,
      message: "Error al crear persona",
      error: error.message,
    });
  }
};

// ────────────────────────────────────────────────────────────
// PUT - Actualizar persona
// ────────────────────────────────────────────────────────────
exports.actualizarPersona = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      primernombre,
      segundonombre,
      primerapellido,
      segundoapellido,
      dui,
      telefono,
      direccion,
      fechanacimiento,
      activo,
    } = req.body;

    // Verificar que la persona existe
    const existe = await db.query(
      "SELECT idpersona FROM personas.persona WHERE idpersona = $1",
      [id],
    );
    if (existe.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Persona no encontrada",
      });
    }

    // Verificar DUI único si se actualiza y es diferente
    if (dui) {
      const existeDUI = await db.query(
        "SELECT idpersona FROM personas.persona WHERE dui = $1 AND idpersona != $2",
        [dui, id],
      );
      if (existeDUI.rows.length > 0) {
        return res.status(400).json({
          success: false,
          message: "El DUI ya está registrado para otra persona",
        });
      }
    }

    // Construir query dinámico
    const updates = [];
    const params = [];
    let paramIndex = 1;

    if (primernombre !== undefined) {
      updates.push(`primernombre = $${paramIndex++}`);
      params.push(primernombre);
    }
    if (segundonombre !== undefined) {
      updates.push(`segundonombre = $${paramIndex++}`);
      params.push(segundonombre || null);
    }
    if (primerapellido !== undefined) {
      updates.push(`primerapellido = $${paramIndex++}`);
      params.push(primerapellido);
    }
    if (segundoapellido !== undefined) {
      updates.push(`segundoapellido = $${paramIndex++}`);
      params.push(segundoapellido || null);
    }
    if (dui !== undefined) {
      updates.push(`dui = $${paramIndex++}`);
      params.push(dui || null);
    }
    if (telefono !== undefined) {
      updates.push(`telefono = $${paramIndex++}`);
      params.push(telefono || null);
    }
    if (direccion !== undefined) {
      updates.push(`direccion = $${paramIndex++}`);
      params.push(direccion || null);
    }
    if (fechanacimiento !== undefined) {
      updates.push(`fechanacimiento = $${paramIndex++}`);
      params.push(fechanacimiento || null);
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
      UPDATE personas.persona
      SET ${updates.join(", ")}
      WHERE idpersona = $${paramIndex}
      RETURNING idpersona, primernombre, segundonombre, primerapellido, segundoapellido,
                dui, telefono, direccion, fechanacimiento, activo
    `;

    const result = await db.query(query, params);

    res.json({
      success: true,
      message: "Persona actualizada correctamente",
      persona: result.rows[0],
    });
  } catch (error) {
    console.error("ERROR ACTUALIZAR PERSONA:", error);
    res.status(500).json({
      success: false,
      message: "Error al actualizar persona",
      error: error.message,
    });
  }
};

// ────────────────────────────────────────────────────────────
// DELETE - Desactivar persona (soft delete)
// ────────────────────────────────────────────────────────────
exports.desactivarPersona = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await db.query(
      `UPDATE personas.persona
       SET activo = NOT activo
       WHERE idpersona = $1
       RETURNING idpersona, primernombre, primerapellido, activo`,
      [id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Persona no encontrada",
      });
    }

    const persona = result.rows[0];
    res.json({
      success: true,
      message: persona.activo ? "Persona activada" : "Persona desactivada",
      persona,
    });
  } catch (error) {
    console.error("ERROR DESACTIVAR PERSONA:", error);
    res.status(500).json({
      success: false,
      message: "Error al cambiar estado de persona",
      error: error.message,
    });
  }
};

// ────────────────────────────────────────────────────────────
// GET - Personas disponibles para asignar como estudiante/docente
// ────────────────────────────────────────────────────────────
exports.getPersonasDisponibles = async (req, res) => {
  try {
    const { tipo } = req.query; // 'estudiante', 'docente', 'empleado'

    let query = `
      SELECT 
        p.idpersona,
        p.primernombre,
        p.segundonombre,
        p.primerapellido,
        p.segundoapellido,
        p.dui,
        p.telefono,
        (p.primernombre || ' ' || COALESCE(p.segundonombre || ' ', '') || p.primerapellido || ' ' || COALESCE(p.segundoapellido, '')) as nombre_completo
      FROM personas.persona p
      WHERE p.activo = true
    `;

    // Filtrar personas que ya tienen asignación
    if (tipo === "estudiante") {
      query += ` AND NOT EXISTS (SELECT 1 FROM estudiantes.estudiante WHERE idpersona = p.idpersona)`;
    } else if (tipo === "docente") {
      query += ` AND NOT EXISTS (SELECT 1 FROM docentes.docente WHERE idpersona = p.idpersona)`;
    } else if (tipo === "empleado") {
      query += ` AND NOT EXISTS (SELECT 1 FROM empleados.empleado WHERE idpersona = p.idpersona)`;
    }

    query += ` ORDER BY p.primerapellido, p.primernombre`;

    const result = await db.query(query);

    res.json({
      success: true,
      personas: result.rows,
    });
  } catch (error) {
    console.error("ERROR GET PERSONAS DISPONIBLES:", error);
    res.status(500).json({
      success: false,
      message: "Error al obtener personas disponibles",
      error: error.message,
    });
  }
};
