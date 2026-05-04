const db = require("../../config/db");

exports.getCarreras = async (req, res) => {
  try {
    const r = await db.query(`
      SELECT c.idcarrera, c.nombre, c.codigo, c.tituloOtorgado, c.modalidad,
             c.duracionAnios, c.totalUV, c.activo,
             e.nombre as escuela, c.idescuela
      FROM academico.carrera c
      INNER JOIN academico.escuela e ON c.idescuela = e.idescuela
      ORDER BY c.nombre`);
    res.json({ success: true, carreras: r.rows });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
};

exports.crearCarrera = async (req, res) => {
  const { nombre, codigo, tituloOtorgado, modalidad, duracionAnios, totalUV, idescuela } = req.body;
  try {
    if (!nombre || !idescuela) return res.status(400).json({ success: false, message: "Nombre y escuela son obligatorios" });
    const r = await db.query(
      `INSERT INTO academico.carrera (nombre, codigo, tituloOtorgado, modalidad, duracionAnios, totalUV, idescuela, activo)
       VALUES ($1,$2,$3,$4,$5,$6,$7,true) RETURNING idcarrera`,
      [nombre, codigo || null, tituloOtorgado || null, modalidad || "PRESENCIAL", duracionAnios || null, totalUV || null, idescuela]
    );
    res.json({ success: true, message: "Carrera creada", idcarrera: r.rows[0].idcarrera });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
};

exports.editarCarrera = async (req, res) => {
  const { id } = req.params;
  const { nombre, codigo, tituloOtorgado, modalidad, duracionAnios, totalUV, idescuela, activo } = req.body;
  try {
    await db.query(
      `UPDATE academico.carrera SET nombre=COALESCE($1,nombre), codigo=COALESCE($2,codigo),
       tituloOtorgado=COALESCE($3,tituloOtorgado), modalidad=COALESCE($4,modalidad),
       duracionAnios=COALESCE($5,duracionAnios), totalUV=COALESCE($6,totalUV),
       idescuela=COALESCE($7,idescuela), activo=COALESCE($8,activo) WHERE idcarrera=$9`,
      [nombre, codigo, tituloOtorgado, modalidad, duracionAnios, totalUV, idescuela, activo, id]
    );
    res.json({ success: true, message: "Carrera actualizada" });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
};
