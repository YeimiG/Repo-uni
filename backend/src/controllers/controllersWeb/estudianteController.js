const db = require("../../config/db");

exports.getEstudiantes = async (req, res) => {
  try {
    const result = await db.query(`
      SELECT
        e.idestudiante, e.expediente, e.fechaingreso,
        e.indiceglobal, e.porcentajeavance, e.activo,
        p.primernombre, p.primerapellido,
        p.segundonombre, p.segundoapellido,
        u.correo,
        c.nombre as carrera,
        ee.nombre as estado
      FROM estudiantes.estudiante e
      INNER JOIN personas.persona p ON e.idpersona = p.idpersona
      LEFT JOIN seguridad.usuario u ON e.idusuario = u.idusuario
      INNER JOIN academico.carrera c ON e.idcarrera = c.idcarrera
      INNER JOIN estudiantes.estadoestudiante ee ON e.idestado = ee.idestado
      ORDER BY p.primerapellido, p.primernombre
    `);
    res.json({ success: true, estudiantes: result.rows });
  } catch (error) {
    console.error("ERROR GET ESTUDIANTES:", error);
    res
      .status(500)
      .json({ success: false, message: "Error al obtener estudiantes" });
  }
};

exports.getEstudianteById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query(
      `
      SELECT
        e.idestudiante, e.expediente, e.fechaingreso,
        e.indiceglobal, e.porcentajeavance, e.activo,
        p.primernombre, p.primerapellido,
        p.segundonombre, p.segundoapellido,
        u.correo,
        c.nombre as carrera, c.idcarrera,
        ee.nombre as estado, ee.idestado
      FROM estudiantes.estudiante e
      INNER JOIN personas.persona p ON e.idpersona = p.idpersona
      LEFT JOIN seguridad.usuario u ON e.idusuario = u.idusuario
      INNER JOIN academico.carrera c ON e.idcarrera = c.idcarrera
      INNER JOIN estudiantes.estadoestudiante ee ON e.idestado = ee.idestado
      WHERE e.idestudiante = $1
    `,
      [id],
    );
    if (result.rows.length === 0)
      return res
        .status(404)
        .json({ success: false, message: "Estudiante no encontrado" });
    res.json({ success: true, estudiante: result.rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.crearEstudiante = async (req, res) => {
  const { idpersona, idusuario, expediente, idcarrera, fechaingreso } =
    req.body;
  try {
    // Validar campos obligatorios
    if (!idpersona || !idusuario || !expediente || !idcarrera) {
      return res.status(400).json({
        success: false,
        message:
          "idpersona, idusuario, expediente e idcarrera son obligatorios",
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

    // Verificar que usuario existe
    const usuarioRes = await db.query(
      "SELECT idusuario FROM seguridad.usuario WHERE idusuario = $1",
      [idusuario],
    );
    if (usuarioRes.rows.length === 0) {
      return res.status(400).json({
        success: false,
        message: "El usuario especificado no existe",
      });
    }

    // Verificar expediente único
    const existe = await db.query(
      "SELECT idestudiante FROM estudiantes.estudiante WHERE expediente = $1",
      [expediente],
    );
    if (existe.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: "El expediente ya existe",
      });
    }

    // Verificar que la carrera existe
    const carreraRes = await db.query(
      "SELECT idcarrera FROM academico.carrera WHERE idcarrera = $1",
      [idcarrera],
    );
    if (carreraRes.rows.length === 0) {
      return res.status(400).json({
        success: false,
        message: "La carrera especificada no existe",
      });
    }

    // Obtener estado ACTIVO por defecto
    const estadoRes = await db.query(
      "SELECT idestado FROM estudiantes.estadoestudiante WHERE UPPER(nombre) IN ('ACTIVO','ACTIVA','REGULAR') LIMIT 1",
    );
    if (estadoRes.rows.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Estado ACTIVO no encontrado en la BD",
      });
    }
    const idestado = estadoRes.rows[0].idestado;

    // Obtener plan de estudio activo de la carrera
    const planRes = await db.query(
      "SELECT idplanestudio FROM academico.planestudio WHERE idcarrera = $1 AND activo = true LIMIT 1",
      [idcarrera],
    );
    let idplanestudio =
      planRes.rows.length > 0 ? planRes.rows[0].idplanestudio : null;

    // Si no hay plan activo, buscar cualquier plan
    if (!idplanestudio) {
      const planAny = await db.query(
        "SELECT idplanestudio FROM academico.planestudio WHERE idcarrera = $1 LIMIT 1",
        [idcarrera],
      );
      idplanestudio =
        planAny.rows.length > 0 ? planAny.rows[0].idplanestudio : null;
    }

    if (!idplanestudio) {
      return res.status(400).json({
        success: false,
        message: "No hay plan de estudio para esta carrera",
      });
    }

    // Crear estudiante
    const estudiante = await db.query(
      `INSERT INTO estudiantes.estudiante
       (idpersona, idusuario, expediente, fechaingreso, idcarrera, idplanestudio, idestado, activo)
       VALUES ($1, $2, $3, $4, $5, $6, $7, true)
       RETURNING idestudiante`,
      [
        idpersona,
        idusuario,
        expediente,
        fechaingreso || new Date().toISOString().split("T")[0],
        idcarrera,
        idplanestudio,
        idestado,
      ],
    );

    res.json({
      success: true,
      message: "Estudiante creado correctamente",
      idestudiante: estudiante.rows[0].idestudiante,
    });
  } catch (error) {
    console.error("ERROR CREAR ESTUDIANTE:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.editarEstudiante = async (req, res) => {
  const { id } = req.params;
  const { primernombre, primerapellido, correo, idcarrera, idestado } =
    req.body;
  try {
    // Actualizar persona
    if (primernombre || primerapellido) {
      const sets = [];
      const vals = [];
      let idx = 1;
      if (primernombre) {
        sets.push(`primernombre = $${idx++}`);
        vals.push(primernombre);
      }
      if (primerapellido) {
        sets.push(`primerapellido = $${idx++}`);
        vals.push(primerapellido);
      }
      vals.push(id);
      await db.query(
        `UPDATE personas.persona SET ${sets.join(", ")}
         WHERE idpersona = (SELECT idpersona FROM estudiantes.estudiante WHERE idestudiante = $${idx})`,
        vals,
      );
    }
    // Actualizar correo
    if (correo) {
      await db.query(
        `UPDATE seguridad.usuario SET correo = $1
         WHERE idusuario = (SELECT idusuario FROM estudiantes.estudiante WHERE idestudiante = $2)`,
        [correo, id],
      );
    }
    // Actualizar carrera/estado
    const camposEst = [];
    const valsEst = [];
    let idxEst = 1;
    if (idcarrera) {
      camposEst.push(`idcarrera = $${idxEst++}`);
      valsEst.push(idcarrera);
    }
    if (idestado) {
      camposEst.push(`idestado = $${idxEst++}`);
      valsEst.push(idestado);
    }
    if (camposEst.length > 0) {
      valsEst.push(id);
      await db.query(
        `UPDATE estudiantes.estudiante SET ${camposEst.join(", ")} WHERE idestudiante = $${idxEst}`,
        valsEst,
      );
    }
    res.json({
      success: true,
      message: "Estudiante actualizado correctamente",
    });
  } catch (error) {
    console.error("ERROR EDITAR ESTUDIANTE:", error);
    res
      .status(500)
      .json({ success: false, message: "Error al editar estudiante" });
  }
};

exports.toggleEstudiante = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query(
      `UPDATE estudiantes.estudiante SET activo = NOT activo WHERE idestudiante = $1 RETURNING activo`,
      [id],
    );
    const activo = result.rows[0].activo;
    res.json({
      success: true,
      message: activo ? "Estudiante activado" : "Estudiante desactivado",
      activo,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error al cambiar estado" });
  }
};

exports.getCarreras = async (req, res) => {
  try {
    const result = await db.query(
      `SELECT idcarrera, nombre FROM academico.carrera WHERE activo = true ORDER BY nombre`,
    );
    res.json({ success: true, carreras: result.rows });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error al obtener carreras" });
  }
};

exports.getEstadosEstudiante = async (req, res) => {
  try {
    const result = await db.query(
      `SELECT idestado, nombre FROM estudiantes.estadoestudiante WHERE activo = true ORDER BY nombre`,
    );
    res.json({ success: true, estados: result.rows });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error al obtener estados" });
  }
};

exports.getPerfilEstudiante = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query(
      `
      SELECT e.expediente, p.primernombre, p.primerapellido, u.correo,
             ee.nombre as estadoAcademico, c.nombre as nombreCarrera
      FROM estudiantes.estudiante e
      INNER JOIN personas.persona p ON e.idpersona = p.idpersona
      INNER JOIN seguridad.usuario u ON e.idusuario = u.idusuario
      INNER JOIN academico.carrera c ON e.idcarrera = c.idcarrera
      INNER JOIN estudiantes.estadoestudiante ee ON e.idestado = ee.idestado
      WHERE e.idestudiante = $1
    `,
      [id],
    );
    if (result.rows.length === 0)
      return res.status(404).json({ message: "Perfil no encontrado" });
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
