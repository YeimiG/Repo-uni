const db = require("../config/db");

exports.getMateriasCatedratico = async (req, res) => {
  const { idCatedratico } = req.params;
  try {
    const query = `
      SELECT m.idMateria, m.codigoMateria, m.nombreMateria, g.idGrupo, g.numeroGrupo
      FROM academico.Materia m
      INNER JOIN academico.Grupo g ON m.idMateria = g.idMateria
      WHERE g.idCatedratico = $1
    `;
    const result = await db.query(query, [idCatedratico]);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getEstudiantesGrupo = async (req, res) => {
  const { idGrupo } = req.params;
  try {
    const query = `
      SELECT e.idEstudiante, e.expediente, e.nombre, e.apellidos, 
             n.nota1, n.nota2, n.nota3, n.notaFinal
      FROM academico.Estudiante e
      INNER JOIN academico.Inscripcion i ON e.idEstudiante = i.idEstudiante
      LEFT JOIN academico.Nota n ON i.idInscripcion = n.idInscripcion
      WHERE i.idGrupo = $1
      ORDER BY e.apellidos, e.nombre
    `;
    const result = await db.query(query, [idGrupo]);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.ingresarNotas = async (req, res) => {
  const { idInscripcion, nota1, nota2, nota3 } = req.body;
  try {
    const notaFinal = ((nota1 + nota2 + nota3) / 3).toFixed(2);
    const query = `
      INSERT INTO academico.Nota (idInscripcion, nota1, nota2, nota3, notaFinal)
      VALUES ($1, $2, $3, $4, $5)
      ON CONFLICT (idInscripcion) 
      DO UPDATE SET nota1 = $2, nota2 = $3, nota3 = $4, notaFinal = $5
      RETURNING *
    `;
    const result = await db.query(query, [idInscripcion, nota1, nota2, nota3, notaFinal]);
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
