const db = require("../../config/db");

exports.getFacultades = async (req, res) => {
  try {
    const r = await db.query(`SELECT idfacultad, nombre, codigo, decano, activo FROM academico.facultad ORDER BY nombre`);
    res.json({ success: true, facultades: r.rows });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
};

exports.crearFacultad = async (req, res) => {
  const { nombre, codigo, decano } = req.body;
  try {
    if (!nombre) return res.status(400).json({ success: false, message: "El nombre es obligatorio" });
    const r = await db.query(
      `INSERT INTO academico.facultad (nombre, codigo, decano, activo) VALUES ($1,$2,$3,true) RETURNING idfacultad`,
      [nombre, codigo || null, decano || null]
    );
    res.json({ success: true, message: "Facultad creada", idfacultad: r.rows[0].idfacultad });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
};

exports.editarFacultad = async (req, res) => {
  const { id } = req.params;
  const { nombre, codigo, decano, activo } = req.body;
  try {
    await db.query(
      `UPDATE academico.facultad SET nombre=COALESCE($1,nombre), codigo=COALESCE($2,codigo), decano=COALESCE($3,decano), activo=COALESCE($4,activo) WHERE idfacultad=$5`,
      [nombre, codigo, decano, activo, id]
    );
    res.json({ success: true, message: "Facultad actualizada" });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
};
