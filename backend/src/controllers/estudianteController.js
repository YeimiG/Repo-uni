const db = require("../config/db");

// Función para obtener todos (ya la tenías)
exports.getEstudiantes = async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM academico.Estudiante");
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Función para obtener por ID (ya la tenías)
exports.getEstudianteById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query("SELECT * FROM academico.Estudiante WHERE idEstudiante = $1", [id]);
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// NUEVA FUNCIÓN: getPerfilEstudiante
exports.getPerfilEstudiante = async (req, res) => {
  const { id } = req.params;
  try {
    const query = `
      SELECT e.expediente, e.nombre, e.apellidos, u.correo, e.estadoAcademico, c.nombreCarrera
      FROM academico.Estudiante e
      INNER JOIN seguridad.Usuario u ON e.idUsuario = u.idUsuario
      INNER JOIN academico.Carrera c ON e.idCarrera = c.idCarrera
      WHERE e.idEstudiante = $1
    `;
    const result = await db.query(query, [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Perfil no encontrado" });
    }
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};