const db = require("../config/db");

exports.getMaterias = async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM academico.Materia");
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getMateriaById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query(
      "SELECT * FROM academico.Materia WHERE Materia.idMateria = $1",
      [id]
    );
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//exports.crearMateria = async (req, res) => {
//  try {
//    const { codigo_materia, nombre, unidades_valorativas, id_carrera } = req.body;
//    const result = await db.query(
//      `INSERT INTO materia (codigo_materia,nombre,unidades_valorativas,id_carrera)
//       VALUES ($1,$2,$3,$4) RETURNING *`,
//      [codigo_materia, nombre, unidades_valorativas, id_carrera]
//    );
//    res.status(201).json(result.rows[0]);
//  } catch (error) {
//    res.status(500).json({ error: error.message });
//  }
//};
