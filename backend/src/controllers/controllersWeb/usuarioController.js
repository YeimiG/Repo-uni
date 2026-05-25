const db = require("../../config/db");
const bcrypt = require("bcryptjs");

/**
 * CRUD DE USUARIOS - Gestión de usuarios y acceso
 * Los usuarios vinculan personas con roles
 */

// ────────────────────────────────────────────────────────────
// GET - Obtener todos los usuarios
// ────────────────────────────────────────────────────────────
exports.getUsuarios = async (req, res) => {
  try {
    const { activo, rol, search } = req.query;

    let query = `
      SELECT 
        u.idusuario,
        u.correo,
        u.activo,
        u.fechacreacion,
        r.idrol,
        r.nombrerol as rol,
        p.idpersona,
        p.primernombre,
        p.segundonombre,
        p.primerapellido,
        p.segundoapellido,
        (p.primernombre || ' ' || COALESCE(p.segundonombre || ' ', '') || p.primerapellido || ' ' || COALESCE(p.segundoapellido, '')) as nombre_completo
      FROM seguridad.usuario u
      INNER JOIN seguridad.rol r ON u.idrol = r.idrol
      LEFT JOIN personas.persona p ON u.idpersona = p.idpersona
    `;

    const params = [];
    let paramIndex = 1;
    const conditions = [];

    if (activo !== undefined) {
      conditions.push(`u.activo = $${paramIndex++}`);
      params.push(activo === "true");
    }

    if (rol) {
      conditions.push(`r.nombrerol = $${paramIndex++}`);
      params.push(rol);
    }

    if (search) {
      conditions.push(`(
        u.correo ILIKE $${paramIndex} OR
        p.primernombre ILIKE $${paramIndex} OR
        p.primerapellido ILIKE $${paramIndex}
      )`);
      params.push(`%${search}%`);
      paramIndex++;
    }

    if (conditions.length > 0) {
      query += " WHERE " + conditions.join(" AND ");
    }

    query += ` ORDER BY u.correo`;

    const result = await db.query(query, params);

    res.json({
      success: true,
      usuarios: result.rows,
      total: result.rows.length,
    });
  } catch (error) {
    console.error("ERROR GET USUARIOS:", error);
    res.status(500).json({
      success: false,
      message: "Error al obtener usuarios",
      error: error.message,
    });
  }
};

// ────────────────────────────────────────────────────────────
// GET - Obtener usuario por ID
// ────────────────────────────────────────────────────────────
exports.getUsuarioById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await db.query(
      `SELECT 
        u.idusuario,
        u.correo,
        u.activo,
        u.fechacreacion,
        u.idpersona,
        r.idrol,
        r.nombrerol as rol,
        p.primernombre,
        p.primerapellido
      FROM seguridad.usuario u
      INNER JOIN seguridad.rol r ON u.idrol = r.idrol
      LEFT JOIN personas.persona p ON u.idpersona = p.idpersona
      WHERE u.idusuario = $1`,
      [id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Usuario no encontrado",
      });
    }

    res.json({
      success: true,
      usuario: result.rows[0],
    });
  } catch (error) {
    console.error("ERROR GET USUARIO BY ID:", error);
    res.status(500).json({
      success: false,
      message: "Error al obtener usuario",
      error: error.message,
    });
  }
};

// ────────────────────────────────────────────────────────────
// POST - Crear nuevo usuario
// ────────────────────────────────────────────────────────────
exports.crearUsuario = async (req, res) => {
  try {
    const { correo, clave, idrol, idpersona } = req.body;

    // Validar campos obligatorios
    if (!correo || !clave || !idrol) {
      return res.status(400).json({
        success: false,
        message: "Correo, contraseña e ID de rol son obligatorios",
      });
    }

    // Verificar que el correo sea único
    const existeCorreo = await db.query(
      "SELECT idusuario FROM seguridad.usuario WHERE correo = $1",
      [correo.toLowerCase()],
    );
    if (existeCorreo.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: "El correo ya está registrado",
      });
    }

    // Verificar que el rol existe
    const existeRol = await db.query(
      "SELECT idrol FROM seguridad.rol WHERE idrol = $1",
      [idrol],
    );
    if (existeRol.rows.length === 0) {
      return res.status(400).json({
        success: false,
        message: "El rol especificado no existe",
      });
    }

    // Verificar que la persona existe (si se proporciona)
    if (idpersona) {
      const existePersona = await db.query(
        "SELECT idpersona FROM personas.persona WHERE idpersona = $1",
        [idpersona],
      );
      if (existePersona.rows.length === 0) {
        return res.status(400).json({
          success: false,
          message: "La persona especificada no existe",
        });
      }
    }

    // Encriptar contraseña
    const salt = await bcrypt.genSalt(10);
    const claveHash = await bcrypt.hash(clave, salt);

    // Crear usuario
    const result = await db.query(
      `INSERT INTO seguridad.usuario 
       (correo, clave, idrol, idpersona, activo, fechacreacion)
       VALUES ($1, $2, $3, $4, true, NOW())
       RETURNING idusuario, correo, idrol, idpersona, activo, fechacreacion`,
      [correo.toLowerCase(), claveHash, idrol, idpersona || null],
    );

    const usuario = result.rows[0];

    res.json({
      success: true,
      message: "Usuario creado correctamente",
      usuario,
    });
  } catch (error) {
    console.error("ERROR CREAR USUARIO:", error);
    res.status(500).json({
      success: false,
      message: "Error al crear usuario",
      error: error.message,
    });
  }
};

// ────────────────────────────────────────────────────────────
// PUT - Actualizar usuario (sin cambiar contraseña desde aquí)
// ────────────────────────────────────────────────────────────
exports.actualizarUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const { correo, idrol, idpersona, activo } = req.body;

    // Verificar que el usuario existe
    const existe = await db.query(
      "SELECT idusuario FROM seguridad.usuario WHERE idusuario = $1",
      [id],
    );
    if (existe.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Usuario no encontrado",
      });
    }

    // Verificar correo único (si se actualiza)
    if (correo) {
      const existeCorreo = await db.query(
        "SELECT idusuario FROM seguridad.usuario WHERE correo = $1 AND idusuario != $2",
        [correo.toLowerCase(), id],
      );
      if (existeCorreo.rows.length > 0) {
        return res.status(400).json({
          success: false,
          message: "El correo ya está registrado para otro usuario",
        });
      }
    }

    // Verificar rol (si se actualiza)
    if (idrol) {
      const existeRol = await db.query(
        "SELECT idrol FROM seguridad.rol WHERE idrol = $1",
        [idrol],
      );
      if (existeRol.rows.length === 0) {
        return res.status(400).json({
          success: false,
          message: "El rol especificado no existe",
        });
      }
    }

    // Verificar persona (si se actualiza)
    if (idpersona) {
      const existePersona = await db.query(
        "SELECT idpersona FROM personas.persona WHERE idpersona = $1",
        [idpersona],
      );
      if (existePersona.rows.length === 0) {
        return res.status(400).json({
          success: false,
          message: "La persona especificada no existe",
        });
      }
    }

    // Construir query dinámico
    const updates = [];
    const params = [];
    let paramIndex = 1;

    if (correo !== undefined) {
      updates.push(`correo = $${paramIndex++}`);
      params.push(correo.toLowerCase());
    }
    if (idrol !== undefined) {
      updates.push(`idrol = $${paramIndex++}`);
      params.push(idrol);
    }
    if (idpersona !== undefined) {
      updates.push(`idpersona = $${paramIndex++}`);
      params.push(idpersona || null);
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
      UPDATE seguridad.usuario
      SET ${updates.join(", ")}
      WHERE idusuario = $${paramIndex}
      RETURNING idusuario, correo, idrol, idpersona, activo
    `;

    const result = await db.query(query, params);

    res.json({
      success: true,
      message: "Usuario actualizado correctamente",
      usuario: result.rows[0],
    });
  } catch (error) {
    console.error("ERROR ACTUALIZAR USUARIO:", error);
    res.status(500).json({
      success: false,
      message: "Error al actualizar usuario",
      error: error.message,
    });
  }
};

// ────────────────────────────────────────────────────────────
// PATCH - Cambiar contraseña
// ────────────────────────────────────────────────────────────
exports.cambiarContrasena = async (req, res) => {
  try {
    const { id } = req.params;
    const { claveActual, claveNueva } = req.body;

    if (!claveActual || !claveNueva) {
      return res.status(400).json({
        success: false,
        message: "Contraseña actual y nueva son obligatorias",
      });
    }

    // Obtener usuario
    const usuario = await db.query(
      "SELECT clave FROM seguridad.usuario WHERE idusuario = $1",
      [id],
    );

    if (usuario.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Usuario no encontrado",
      });
    }

    // Verificar contraseña actual
    const esValida = await bcrypt.compare(claveActual, usuario.rows[0].clave);
    if (!esValida) {
      return res.status(400).json({
        success: false,
        message: "La contraseña actual es incorrecta",
      });
    }

    // Encriptar nueva contraseña
    const salt = await bcrypt.genSalt(10);
    const claveHash = await bcrypt.hash(claveNueva, salt);

    // Actualizar
    await db.query(
      "UPDATE seguridad.usuario SET clave = $1 WHERE idusuario = $2",
      [claveHash, id],
    );

    res.json({
      success: true,
      message: "Contraseña actualizada correctamente",
    });
  } catch (error) {
    console.error("ERROR CAMBIAR CONTRASEÑA:", error);
    res.status(500).json({
      success: false,
      message: "Error al cambiar contraseña",
      error: error.message,
    });
  }
};

// ────────────────────────────────────────────────────────────
// PATCH - Activar/Desactivar usuario
// ────────────────────────────────────────────────────────────
exports.toggleUsuario = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await db.query(
      `UPDATE seguridad.usuario
       SET activo = NOT activo
       WHERE idusuario = $1
       RETURNING idusuario, correo, activo`,
      [id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Usuario no encontrado",
      });
    }

    const usuario = result.rows[0];
    res.json({
      success: true,
      message: usuario.activo ? "Usuario activado" : "Usuario desactivado",
      usuario,
    });
  } catch (error) {
    console.error("ERROR TOGGLE USUARIO:", error);
    res.status(500).json({
      success: false,
      message: "Error al cambiar estado del usuario",
      error: error.message,
    });
  }
};

// ────────────────────────────────────────────────────────────
// GET - Obtener roles disponibles
// ────────────────────────────────────────────────────────────
exports.getRoles = async (req, res) => {
  try {
    const result = await db.query(
      `SELECT idrol, nombrerol, descripcion
       FROM seguridad.rol
       WHERE activo = true
       ORDER BY nombrerol`,
    );

    res.json({
      success: true,
      roles: result.rows,
    });
  } catch (error) {
    console.error("ERROR GET ROLES:", error);
    res.status(500).json({
      success: false,
      message: "Error al obtener roles",
      error: error.message,
    });
  }
};

// ────────────────────────────────────────────────────────────
// GET - Verificar disponibilidad de correo
// ────────────────────────────────────────────────────────────
exports.verificarCorreo = async (req, res) => {
  try {
    const { correo } = req.query;

    if (!correo) {
      return res.status(400).json({
        success: false,
        message: "El correo es obligatorio",
      });
    }

    const existe = await db.query(
      "SELECT idusuario FROM seguridad.usuario WHERE correo = $1",
      [correo.toLowerCase()],
    );

    res.json({
      success: true,
      disponible: existe.rows.length === 0,
    });
  } catch (error) {
    console.error("ERROR VERIFICAR CORREO:", error);
    res.status(500).json({
      success: false,
      message: "Error al verificar correo",
      error: error.message,
    });
  }
};
