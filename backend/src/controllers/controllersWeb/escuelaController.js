const db = require("../../config/db");

exports.getEscuelas = async (req, res) => {
  try {
    const r = await db.query(`
      SELECT e.idescuela, e.nombre, e.codigo, e.director, e.activo,
             f.nombre as facultad, e.idfacultad
      FROM academico.escuela e
      INNER JOIN academico.facultad f ON e.idfacultad = f.idfacultad
      ORDER BY e.nombre`);
    res.json({ success: true, escuelas: r.rows });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
};

exports.crearEscuela = async (req, res) => {
  const { nombre, codigo, director, idfacultad } = req.body;
  try {
    if (!nombre || !idfacultad) return res.status(400).json({ success: false, message: "Nombre y facultad son obligatorios" });
    const r = await db.query(
      `INSERT INTO academico.escuela (nombre, codigo, director, idfacultad, activo) VALUES ($1,$2,$3,$4,true) RETURNING idescuela`,
      [nombre, codigo || null, director || null, idfacultad]
    );
    res.json({ success: true, message: "Escuela creada", idescuela: r.rows[0].idescuela });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
};

exports.editarEscuela = async (req, res) => {
  const { id } = req.params;
  const { nombre, codigo, director, idfacultad, activo } = req.body;
  try {
    await db.query(
      `UPDATE academico.escuela SET nombre=COALESCE($1,nombre), codigo=COALESCE($2,codigo), director=COALESCE($3,director), idfacultad=COALESCE($4,idfacultad), activo=COALESCE($5,activo) WHERE idescuela=$6`,
      [nombre, codigo, director, idfacultad, activo, id]
    );
    res.json({ success: true, message: "Escuela actualizada" });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
};
