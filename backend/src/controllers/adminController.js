const db = require("../config/db");

exports.crearUsuario = async (req, res) => {
  const { correo, clave, idRol } = req.body;
  try {
    const query = `INSERT INTO seguridad.Usuario (correo, clave, idRol) VALUES ($1, $2, $3) RETURNING *`;
    const result = await db.query(query, [correo, clave, idRol]);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.crearEstudiante = async (req, res) => {
  const { expediente, nombre, apellidos, idUsuario, idCarrera } = req.body;
  try {
    const query = `
      INSERT INTO academico.Estudiante (expediente, nombre, apellidos, idUsuario, idCarrera, estadoAcademico)
      VALUES ($1, $2, $3, $4, $5, 'Activo') RETURNING *
    `;
    const result = await db.query(query, [expediente, nombre, apellidos, idUsuario, idCarrera]);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.crearCatedratico = async (req, res) => {
  const { nombre, apellidos, idUsuario } = req.body;
  try {
    const query = `INSERT INTO academico.Catedratico (nombre, apellidos, idUsuario) VALUES ($1, $2, $3) RETURNING *`;
    const result = await db.query(query, [nombre, apellidos, idUsuario]);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getUsuarios = async (req, res) => {
  try {
    const query = `
      SELECT u.idUsuario, u.correo, r.nombreRol 
      FROM seguridad.Usuario u
      INNER JOIN seguridad.Rol r ON u.idRol = r.idRol
    `;
    const result = await db.query(query);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.crearMateria = async (req, res) => {
  const { codigoMateria, nombreMateria, unidadesValorativas, idCarrera } = req.body;
  try {
    const query = `
      INSERT INTO academico.Materia (codigoMateria, nombreMateria, unidadesValorativas, idCarrera)
      VALUES ($1, $2, $3, $4) RETURNING *
    `;
    const result = await db.query(query, [codigoMateria, nombreMateria, unidadesValorativas, idCarrera]);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
