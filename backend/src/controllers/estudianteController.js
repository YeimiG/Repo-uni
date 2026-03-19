const db = require("../config/db");

// Función para obtener todos (ya la tenías)
exports.getEstudiantes = async (req, res) => {
  try {
    const result = await db.query("SELECT e.*, p.primernombre, p.primerapellido FROM estudiantes.estudiante e INNER JOIN personas.persona p ON e.idpersona = p.idpersona");
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Función para obtener por ID (ya la tenías)
exports.getEstudianteById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query("SELECT e.*, p.primernombre, p.primerapellido FROM estudiantes.estudiante e INNER JOIN personas.persona p ON e.idpersona = p.idpersona WHERE e.idestudiante = $1", [id]);
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
      SELECT e.expediente, p.primernombre, p.primerapellido, u.correo,
             ee.nombre as estadoAcademico, c.nombre as nombreCarrera
      FROM estudiantes.estudiante e
      INNER JOIN personas.persona p ON e.idpersona = p.idpersona
      INNER JOIN seguridad.usuario u ON e.idusuario = u.idusuario
      INNER JOIN academico.carrera c ON e.idcarrera = c.idcarrera
      INNER JOIN estudiantes.estadoestudiante ee ON e.idestado = ee.idestado
      WHERE e.idestudiante = $1
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