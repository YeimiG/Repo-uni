const db = require("../../config/db");

exports.getMaterias = async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM academico.materia WHERE activo = true ORDER BY codigo");
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getMateriaById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query("SELECT * FROM academico.materia WHERE idmateria = $1", [id]);
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.crearMateria = async (req, res) => {
  const { codigo, nombre, descripcion, unidadesvalorativas, horasteorias, horaspracticas, tipo } = req.body;
  try {
    const existe = await db.query("SELECT idmateria FROM academico.materia WHERE codigo = $1", [codigo]);
    if (existe.rows.length > 0) return res.status(400).json({ success: false, message: "El código ya existe" });

    const result = await db.query(`
      INSERT INTO academico.materia (codigo, nombre, descripcion, unidadesvalorativas, horasteoricas, horaspracticas, tipo, activo)
      VALUES ($1, $2, $3, $4, $5, $6, $7, true) RETURNING idmateria
    `, [codigo, nombre, descripcion || null, unidadesvalorativas, horasteorias || 0, horaspracticas || 0, tipo || "OBLIGATORIA"]);

    res.json({ success: true, message: "Materia creada correctamente", idmateria: result.rows[0].idmateria });
  } catch (error) {
    console.error("ERROR CREAR MATERIA:", error);
    res.status(500).json({ success: false, message: "Error al crear materia" });
  }
};

exports.editarMateria = async (req, res) => {
  const { id } = req.params;
  const { nombre, descripcion, unidadesvalorativas, horasteorias, horaspracticas, tipo } = req.body;
  try {
    await db.query(`
      UPDATE academico.materia
      SET nombre = COALESCE($1, nombre),
          descripcion = COALESCE($2, descripcion),
          unidadesvalorativas = COALESCE($3, unidadesvalorativas),
          horasteoricas = COALESCE($4, horasteoricas),
          horaspracticas = COALESCE($5, horaspracticas),
          tipo = COALESCE($6, tipo)
      WHERE idmateria = $7
    `, [nombre, descripcion, unidadesvalorativas, horasteorias, horaspracticas, tipo, id]);
    res.json({ success: true, message: "Materia actualizada correctamente" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error al editar materia" });
  }
};

exports.crearGrupo = async (req, res) => {
  const { idmateria, idperiodo, iddocente, numerogrupo, cupomaximo } = req.body;
  try {
    // Verificar que no exista el mismo grupo en ese periodo
    const existe = await db.query(
      "SELECT idgrupo FROM grupos.grupo WHERE idmateria = $1 AND idperiodo = $2 AND numerogrupo = $3",
      [idmateria, idperiodo, numerogrupo]
    );
    if (existe.rows.length > 0) return res.status(400).json({ success: false, message: "Ya existe ese grupo en este período" });

    const codigo = `G${numerogrupo}-${idmateria}-${idperiodo}`;
    const result = await db.query(`
      INSERT INTO grupos.grupo (codigo, numerogrupo, cupomaximo, cupoactual, idmateria, iddocente, idperiodo, estado)
      VALUES ($1, $2, $3, 0, $4, $5, $6, 'ACTIVO') RETURNING idgrupo
    `, [codigo, numerogrupo, cupomaximo, idmateria, iddocente || null, idperiodo]);

    res.json({ success: true, message: "Grupo creado correctamente", idgrupo: result.rows[0].idgrupo });
  } catch (error) {
    console.error("ERROR CREAR GRUPO:", error);
    res.status(500).json({ success: false, message: "Error al crear grupo" });
  }
};
