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
        p.numerodocumento as dui,
        p.genero,
        p.estadocivil,
        COALESCE(c.telefonomovil, c.telefonofijo, c.telefonoalternativo, '') as telefono,
        TRIM(CONCAT(
          COALESCE(d.linea1, ''), ' ',
          COALESCE(d.linea2, ''), ' ',
          COALESCE(d.referencia, '')
        )) as direccion,
        p.fechanacimiento,
        p.activo,
        (p.primernombre || ' ' || COALESCE(p.segundonombre || ' ', '') || p.primerapellido || ' ' || COALESCE(p.segundoapellido, '')) as nombre_completo,
        COUNT(DISTINCT CASE WHEN e.idestudiante IS NOT NULL THEN e.idestudiante END) as es_estudiante,
        COUNT(DISTINCT CASE WHEN doc.iddocente IS NOT NULL THEN doc.iddocente END) as es_docente
      FROM personas.persona p
      LEFT JOIN personas.contacto c ON p.idcontacto = c.idcontacto
      LEFT JOIN personas.direccion d ON p.iddireccion = d.iddireccion
      LEFT JOIN estudiantes.estudiante e ON p.idpersona = e.idpersona
      LEFT JOIN docentes.docente doc ON p.idpersona = doc.idpersona
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
        p.primernombre ILIKE ${paramIndex} OR
        p.primerapellido ILIKE ${paramIndex} OR
        p.dui ILIKE ${paramIndex} OR
        p.telefono ILIKE ${paramIndex}
      )`);
      params.push(`%${search}%`);
      paramIndex++;
    }

    if (conditions.length > 0) {
      query += " WHERE " + conditions.join(" AND ");
    }

    query += `
      GROUP BY
        p.idpersona,
        p.primernombre,
        p.segundonombre,
        p.primerapellido,
        p.segundoapellido,
        p.numerodocumento,
        c.telefonomovil,
        c.telefonofijo,
        c.telefonoalternativo,
        d.linea1,
        d.linea2,
        d.referencia,
        p.fechanacimiento,
        p.activo
      ORDER BY p.primerapellido, p.primernombre
    `;

    const result = await db.query(query, params);

    res.json({
      success: true,
      data: result.rows,
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
        p.numerodocumento as dui,
        p.genero,
        p.estadocivil,
        COALESCE(c.telefonomovil, c.telefonofijo, c.telefonoalternativo, '') as telefono,
        TRIM(CONCAT(
          COALESCE(d.linea1, ''), ' ',
          COALESCE(d.linea2, ''), ' ',
          COALESCE(d.referencia, '')
        )) as direccion,
        p.fechanacimiento,
        p.genero,
        p.estadocivil,
        p.activo,
        p.fecharegistro,
        (p.primernombre || ' ' || COALESCE(p.segundonombre || ' ', '') || p.primerapellido || ' ' || COALESCE(p.segundoapellido, '')) as nombre_completo
      FROM personas.persona p
      LEFT JOIN personas.contacto c ON p.idcontacto = c.idcontacto
      LEFT JOIN personas.direccion d ON p.iddireccion = d.iddireccion
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
      genero,
      estadocivil,
    } = req.body;

    // Verificar número de documento único si se proporciona
    if (dui) {
      const existeDUI = await db.query(
        "SELECT idpersona FROM personas.persona WHERE numerodocumento = $1",
        [dui],
      );
      if (existeDUI.rows.length > 0) {
        return res.status(400).json({
          success: false,
          message: "El número de documento ya está registrado",
        });
      }
    }

    const fechaNacimientoFinal = fechanacimiento || "1900-01-01";

    let idcontacto = null;
    let iddireccion = null;

    if (telefono) {
      const contactResult = await db.query(
        `INSERT INTO personas.contacto (telefonomovil, activo)
         VALUES ($1, true)
         RETURNING idcontacto`,
        [telefono],
      );
      idcontacto = contactResult.rows[0].idcontacto;
    }

    if (direccion) {
      const direccionResult = await db.query(
        `INSERT INTO personas.direccion (linea1, linea2, referencia, codigoPostal, idMunicipio, activo)
         VALUES ($1, NULL, NULL, NULL, 1, true)
         RETURNING iddireccion`,
        [direccion],
      );
      iddireccion = direccionResult.rows[0].iddireccion;
    }

    const result = await db.query(
      `INSERT INTO personas.persona 
       (primernombre, segundonombre, primerapellido, segundoapellido, fechanacimiento, genero, estadocivil, numerodocumento, iddireccion, idcontacto, activo, fecharegistro)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, true, NOW())
       RETURNING idpersona`,
      [
        primernombre,
        segundonombre || null,
        primerapellido,
        segundoapellido || null,
        fechaNacimientoFinal,
        genero || null,
        estadocivil || null,
        dui || null,
        iddireccion,
        idcontacto,
      ],
    );

    const personaResult = await db.query(
      `SELECT 
        p.idpersona,
        p.primernombre,
        p.segundonombre,
        p.primerapellido,
        p.segundoapellido,
        p.numerodocumento as dui,
        p.genero,
        p.estadocivil,
        COALESCE(c.telefonomovil, c.telefonofijo, c.telefonoalternativo, '') as telefono,
        TRIM(CONCAT(
          COALESCE(d.linea1, ''), ' ',
          COALESCE(d.linea2, ''), ' ',
          COALESCE(d.referencia, '')
        )) as direccion,
        p.fechanacimiento,
        p.activo,
        p.fecharegistro
      FROM personas.persona p
      LEFT JOIN personas.contacto c ON p.idcontacto = c.idcontacto
      LEFT JOIN personas.direccion d ON p.iddireccion = d.iddireccion
      WHERE p.idpersona = $1`,
      [result.rows[0].idpersona],
    );

    const persona = personaResult.rows[0];

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
      genero,
      estadocivil,
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

    // Verificar número de documento único si se actualiza y es diferente
    if (dui) {
      const existeDUI = await db.query(
        "SELECT idpersona FROM personas.persona WHERE numerodocumento = $1 AND idpersona != $2",
        [dui, id],
      );
      if (existeDUI.rows.length > 0) {
        return res.status(400).json({
          success: false,
          message:
            "El número de documento ya está registrado para otra persona",
        });
      }
    }

    const personaActual = await db.query(
      `SELECT idcontacto, iddireccion FROM personas.persona WHERE idpersona = $1`,
      [id],
    );
    const personaRow = personaActual.rows[0];

    let idcontacto = personaRow.idcontacto;
    let iddireccion = personaRow.iddireccion;

    if (telefono !== undefined) {
      if (telefono) {
        if (idcontacto) {
          await db.query(
            `UPDATE personas.contacto SET telefonomovil = $1 WHERE idcontacto = $2`,
            [telefono, idcontacto],
          );
        } else {
          const contactResult = await db.query(
            `INSERT INTO personas.contacto (telefonomovil, activo) VALUES ($1, true) RETURNING idcontacto`,
            [telefono],
          );
          idcontacto = contactResult.rows[0].idcontacto;
        }
      } else if (idcontacto) {
        await db.query(
          `UPDATE personas.contacto SET telefonomovil = NULL WHERE idcontacto = $1`,
          [idcontacto],
        );
      }
    }

    if (direccion !== undefined) {
      if (direccion) {
        if (iddireccion) {
          await db.query(
            `UPDATE personas.direccion SET linea1 = $1 WHERE iddireccion = $2`,
            [direccion, iddireccion],
          );
        } else {
          const direccionResult = await db.query(
            `INSERT INTO personas.direccion (linea1, linea2, referencia, codigoPostal, idMunicipio, activo)
             VALUES ($1, NULL, NULL, NULL, 1, true)
             RETURNING iddireccion`,
            [direccion],
          );
          iddireccion = direccionResult.rows[0].iddireccion;
        }
      } else if (iddireccion) {
        await db.query(
          `UPDATE personas.direccion SET linea1 = NULL WHERE iddireccion = $1`,
          [iddireccion],
        );
      }
    }

    // Construir query dinámico para actualizar campos de persona
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
      updates.push(`numerodocumento = $${paramIndex++}`);
      params.push(dui || null);
    }
    if (fechanacimiento !== undefined) {
      updates.push(`fechanacimiento = $${paramIndex++}`);
      params.push(fechanacimiento || null);
    }
    if (genero !== undefined) {
      updates.push(`genero = $${paramIndex++}`);
      params.push(genero || null);
    }
    if (estadocivil !== undefined) {
      updates.push(`estadocivil = $${paramIndex++}`);
      params.push(estadocivil || null);
    }
    if (activo !== undefined) {
      updates.push(`activo = $${paramIndex++}`);
      params.push(activo);
    }
    if (idcontacto !== undefined) {
      updates.push(`idcontacto = $${paramIndex++}`);
      params.push(idcontacto);
    }
    if (iddireccion !== undefined) {
      updates.push(`iddireccion = $${paramIndex++}`);
      params.push(iddireccion);
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
      WHERE idpersona = ${paramIndex}
      RETURNING idpersona
    `;

    const result = await db.query(query, params);
    const personaActualizada = result.rows[0];

    const personaResult = await db.query(
      `SELECT 
        p.idpersona,
        p.primernombre,
        p.segundonombre,
        p.primerapellido,
        p.segundoapellido,
        p.numerodocumento as dui,
        p.genero,
        p.estadocivil,
        COALESCE(c.telefonomovil, c.telefonofijo, c.telefonoalternativo, '') as telefono,
        TRIM(CONCAT(
          COALESCE(d.linea1, ''), ' ',
          COALESCE(d.linea2, ''), ' ',
          COALESCE(d.referencia, '')
        )) as direccion,
        p.fechanacimiento,
        p.activo
      FROM personas.persona p
      LEFT JOIN personas.contacto c ON p.idcontacto = c.idcontacto
      LEFT JOIN personas.direccion d ON p.iddireccion = d.iddireccion
      WHERE p.idpersona = $1`,
      [personaActualizada.idpersona],
    );

    res.json({
      success: true,
      message: "Persona actualizada correctamente",
      persona: personaResult.rows[0],
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
// GET - Tipos de documento de identidad
// ────────────────────────────────────────────────────────────
exports.getTiposDocumento = async (req, res) => {
  try {
    const result = await db.query(
      `SELECT idTipoDocumento, nombre, abreviatura, paisOrigen, activo
       FROM personas.TipoDocumentoIdentidad
       WHERE activo = true
       ORDER BY nombre`,
    );

    res.json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    console.error("ERROR GET TIPOS DOCUMENTO:", error);
    res.status(500).json({
      success: false,
      message: "Error al obtener los tipos de documento",
      error: error.message,
    });
  }
};

// ────────────────────────────────────────────────────────────
// GET - Personas disponibles para asignar como estudiante/docente
// ────────────────────────────────────────────────────────────
exports.getPersonasDisponibles = async (req, res) => {
  try {
    const { tipo } = req.params; // 'estudiante', 'docente', 'empleado'

    let query = `
      SELECT 
        p.idpersona,
        p.primernombre,
        p.segundonombre,
        p.primerapellido,
        p.segundoapellido,
        p.numerodocumento as dui,
        COALESCE(c.telefonomovil, c.telefonofijo, c.telefonoalternativo, '') as telefono,
        (p.primernombre || ' ' || COALESCE(p.segundonombre || ' ', '') || p.primerapellido || ' ' || COALESCE(p.segundoapellido, '')) as nombre_completo
      FROM personas.persona p
      LEFT JOIN personas.contacto c ON p.idcontacto = c.idcontacto
      WHERE p.activo = true
    `;

    // Filtrar personas que ya tienen asignación
    if (tipo === "estudiante") {
      query += ` AND NOT EXISTS (SELECT 1 FROM estudiantes.estudiante WHERE idpersona = p.idpersona)`;
    } else if (tipo === "docente") {
      query += ` AND NOT EXISTS (SELECT 1 FROM docentes.docente WHERE idpersona = p.idpersona)`;
    } else if (tipo === "empleado") {
      query += ` AND NOT EXISTS (SELECT 1 FROM seguridad.usuario WHERE idpersona = p.idpersona)`;
    }

    query += ` ORDER BY p.primerapellido, p.primernombre`;

    const result = await db.query(query);

    res.json({
      success: true,
      data: result.rows,
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
