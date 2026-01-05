const db = require("../config/db");

// Obtener todos los estudiantes
exports.getEstudiantes = async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM academico.estudiante");
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener estudiante por ID
exports.getEstudianteById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query("SELECT * FROM academico.estudiante WHERE estudiante.idestudiante = $1", [id]);
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Crear estudiante
//exports.crearEstudiante = async (req, res) => {
//  try {
//    const { expediente, nombre, apellidos, fecha_nacimiento, estado_academico, id_usuario, id_carrera } = req.body;
//    const result = await db.query(
//      `INSERT INTO estudiante (expediente, nombre, apellidos, fecha_nacimiento, estado_academico, id_usuario, id_carrera)
//       VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
//      [expediente, nombre, apellidos, fecha_nacimiento, estado_academico, id_usuario, id_carrera]
//    );
//    res.status(201).json(result.rows[0]);
//  } catch (error) {
//    res.status(500).json({ error: error.message });
//  }
//};