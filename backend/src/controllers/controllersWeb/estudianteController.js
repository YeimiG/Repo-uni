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
    res.status(500).json({ success: false, message: "Error al obtener estudiantes" });
  }
};

exports.getEstudianteById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query(`
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
    `, [id]);
    if (result.rows.length === 0) return res.status(404).json({ success: false, message: "Estudiante no encontrado" });
    res.json({ success: true, estudiante: result.rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.crearEstudiante = async (req, res) => {
  const { primernombre, primerapellido, correo, clave, expediente, idcarrera, fechaingreso } = req.body;
  try {
    // Verificar expediente único
    const existe = await db.query(`SELECT idestudiante FROM estudiantes.estudiante WHERE expediente = $1`, [expediente]);
    if (existe.rows.length > 0) return res.status(400).json({ success: false, message: "El expediente ya existe" });

    // Verificar correo único
    const existeCorreo = await db.query(`SELECT idusuario FROM seguridad.usuario WHERE correo = $1`, [correo]);
    if (existeCorreo.rows.length > 0) return res.status(400).json({ success: false, message: "El correo ya está registrado" });

    // Obtener idRol ESTUDIANTE
    const rolRes = await db.query(`SELECT idrol FROM seguridad.rol WHERE nombrerol = 'ESTUDIANTE' LIMIT 1`);
    if (rolRes.rows.length === 0) return res.status(400).json({ success: false, message: "Rol ESTUDIANTE no encontrado en la DB" });
    const idrol = rolRes.rows[0].idrol;

    // Obtener estado ACTIVO por defecto
    const estadoRes = await db.query(`SELECT idestado FROM estudiantes.estadoestudiante WHERE nombre ILIKE 'ACTIVO' LIMIT 1`);
    if (estadoRes.rows.length === 0) return res.status(400).json({ success: false, message: "Estado ACTIVO no encontrado en la DB" });
    const idestado = estadoRes.rows[0].idestado;

    // Obtener plan de estudio activo de la carrera
    const planRes = await db.query(`SELECT idplanestudio FROM academico.planestudio WHERE idcarrera = $1 AND activo = true LIMIT 1`, [idcarrera]);
    if (planRes.rows.length === 0) return res.status(400).json({ success: false, message: "No hay plan de estudio activo para esta carrera" });
    const idplanestudio = planRes.rows[0].idplanestudio;

    // Crear persona
    const persona = await db.query(
      `INSERT INTO personas.persona (primernombre, primerapellido, fechanacimiento, activo, fecharegistro)
       VALUES ($1, $2, NULL, true, NOW()) RETURNING idpersona`,
      [primernombre, primerapellido]
    );
    const idpersona = persona.rows[0].idpersona;

    // Crear usuario
    const usuario = await db.query(
      `INSERT INTO seguridad.usuario (correo, clave, idrol, activo, fechacreacion)
       VALUES ($1, $2, $3, true, NOW()) RETURNING idusuario`,
      [correo, clave, idrol]
    );
    const idusuario = usuario.rows[0].idusuario;

    // Crear estudiante
    const estudiante = await db.query(
      `INSERT INTO estudiantes.estudiante
         (idpersona, expediente, fechaingreso, idcarrera, idplanestudio, idestado, idusuario, activo)
       VALUES ($1, $2, $3, $4, $5, $6, $7, true) RETURNING idestudiante`,
      [idpersona, expediente, fechaingreso || new Date().toISOString().split("T")[0], idcarrera, idplanestudio, idestado, idusuario]
    );

    res.json({ success: true, message: "Estudiante creado correctamente", idestudiante: estudiante.rows[0].idestudiante });
  } catch (error) {
    console.error("ERROR CREAR ESTUDIANTE:", error);
    res.status(500).json({ success: false, message: "Error al crear estudiante" });
  }
};

exports.editarEstudiante = async (req, res) => {
  const { id } = req.params;
  const { primernombre, primerapellido, correo, idcarrera, idestado } = req.body;
  try {
    // Actualizar persona
    if (primernombre || primerapellido) {
      const sets = []; const vals = []; let idx = 1;
      if (primernombre)   { sets.push(`primernombre = $${idx++}`);   vals.push(primernombre); }
      if (primerapellido) { sets.push(`primerapellido = $${idx++}`); vals.push(primerapellido); }
      vals.push(id);
      await db.query(
        `UPDATE personas.persona SET ${sets.join(", ")}
         WHERE idpersona = (SELECT idpersona FROM estudiantes.estudiante WHERE idestudiante = $${idx})`, vals
      );
    }
    // Actualizar correo
    if (correo) {
      await db.query(
        `UPDATE seguridad.usuario SET correo = $1
         WHERE idusuario = (SELECT idusuario FROM estudiantes.estudiante WHERE idestudiante = $2)`,
        [correo, id]
      );
    }
    // Actualizar carrera/estado
    const camposEst = []; const valsEst = []; let idxEst = 1;
    if (idcarrera) { camposEst.push(`idcarrera = $${idxEst++}`); valsEst.push(idcarrera); }
    if (idestado)  { camposEst.push(`idestado = $${idxEst++}`);  valsEst.push(idestado); }
    if (camposEst.length > 0) {
      valsEst.push(id);
      await db.query(`UPDATE estudiantes.estudiante SET ${camposEst.join(", ")} WHERE idestudiante = $${idxEst}`, valsEst);
    }
    res.json({ success: true, message: "Estudiante actualizado correctamente" });
  } catch (error) {
    console.error("ERROR EDITAR ESTUDIANTE:", error);
    res.status(500).json({ success: false, message: "Error al editar estudiante" });
  }
};

exports.toggleEstudiante = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query(
      `UPDATE estudiantes.estudiante SET activo = NOT activo WHERE idestudiante = $1 RETURNING activo`, [id]
    );
    const activo = result.rows[0].activo;
    res.json({ success: true, message: activo ? "Estudiante activado" : "Estudiante desactivado", activo });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error al cambiar estado" });
  }
};

exports.getCarreras = async (req, res) => {
  try {
    const result = await db.query(`SELECT idcarrera, nombre FROM academico.carrera WHERE activo = true ORDER BY nombre`);
    res.json({ success: true, carreras: result.rows });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error al obtener carreras" });
  }
};

exports.getEstadosEstudiante = async (req, res) => {
  try {
    const result = await db.query(`SELECT idestado, nombre FROM estudiantes.estadoestudiante WHERE activo = true ORDER BY nombre`);
    res.json({ success: true, estados: result.rows });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error al obtener estados" });
  }
};

exports.getPerfilEstudiante = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query(`
      SELECT e.expediente, p.primernombre, p.primerapellido, u.correo,
             ee.nombre as estadoAcademico, c.nombre as nombreCarrera
      FROM estudiantes.estudiante e
      INNER JOIN personas.persona p ON e.idpersona = p.idpersona
      INNER JOIN seguridad.usuario u ON e.idusuario = u.idusuario
      INNER JOIN academico.carrera c ON e.idcarrera = c.idcarrera
      INNER JOIN estudiantes.estadoestudiante ee ON e.idestado = ee.idestado
      WHERE e.idestudiante = $1
    `, [id]);
    if (result.rows.length === 0) return res.status(404).json({ message: "Perfil no encontrado" });
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
