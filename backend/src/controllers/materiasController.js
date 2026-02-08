const db = require("../config/db");

// Obtener materias según el rol del usuario
exports.getMaterias = async (req, res) => {
  try {
    const { idUsuario, rol } = req.query;

    let query;
    let params = [];

    if (rol === "Administrador") {
      // Admin ve todas las materias con sus grupos
      query = `
        SELECT 
          g.idgrupo,
          m.idmateria,
          m.codigomateria,
          m.nombre,
          m.unidadesvalorativas as creditos,
          d.nombres || ' ' || d.apellidos as docente,
          g.cupomaximo,
          COUNT(i.idinscripcion) as inscritos,
          c.año || '-' || c.periodo as ciclo
        FROM academico.grupo g
        INNER JOIN academico.materia m ON g.idmateria = m.idmateria
        INNER JOIN academico.docente d ON g.iddocente = d.iddocente
        INNER JOIN academico.cicloacademico c ON g.idciclo = c.idciclo
        LEFT JOIN registro.inscripcion i ON g.idgrupo = i.idgrupo
        GROUP BY g.idgrupo, m.idmateria, m.codigomateria, m.nombre, m.unidadesvalorativas, 
                 d.nombres, d.apellidos, g.cupomaximo, c.año, c.periodo
        ORDER BY m.codigomateria
      `;
    } else {
      // Catedrático solo ve sus materias asignadas
      query = `
        SELECT 
          g.idgrupo,
          m.idmateria,
          m.codigomateria,
          m.nombre,
          m.unidadesvalorativas as creditos,
          d.nombres || ' ' || d.apellidos as docente,
          g.cupomaximo,
          COUNT(i.idinscripcion) as inscritos,
          c.año || '-' || c.periodo as ciclo
        FROM academico.grupo g
        INNER JOIN academico.materia m ON g.idmateria = m.idmateria
        INNER JOIN academico.docente d ON g.iddocente = d.iddocente
        INNER JOIN academico.cicloacademico c ON g.idciclo = c.idciclo
        LEFT JOIN registro.inscripcion i ON g.idgrupo = i.idgrupo
        WHERE d.idusuario = $1
        GROUP BY g.idgrupo, m.idmateria, m.codigomateria, m.nombre, m.unidadesvalorativas, 
                 d.nombres, d.apellidos, g.cupomaximo, c.año, c.periodo
        ORDER BY m.codigomateria
      `;
      params = [idUsuario];
    }

    const result = await db.query(query, params);

    res.json({
      success: true,
      materias: result.rows,
    });
  } catch (error) {
    console.error("ERROR GET MATERIAS:", error);
    res.status(500).json({
      success: false,
      message: "Error al obtener materias",
    });
  }
};

// Obtener estudiantes de un grupo específico
exports.getEstudiantesPorGrupo = async (req, res) => {
  try {
    const { idgrupo } = req.params;

    const query = `
      SELECT 
        e.idestudiante,
        e.expediente as carnet,
        e.nombre || ' ' || e.apellidos as nombre,
        i.idinscripcion,
        COALESCE(n.primero, 0) as parcial1,
        COALESCE(n.segundo, 0) as parcial2,
        COALESCE(n.tercero, 0) as examenfinal,
        COALESCE(n.notafinal, 0) as notafinal
      FROM registro.inscripcion i
      INNER JOIN academico.estudiante e ON i.idestudiante = e.idestudiante
      LEFT JOIN registro.notas n ON i.idinscripcion = n.idinscripcion
      WHERE i.idgrupo = $1
      ORDER BY e.expediente
    `;

    const result = await db.query(query, [idgrupo]);

    res.json({
      success: true,
      estudiantes: result.rows,
    });
  } catch (error) {
    console.error("ERROR GET ESTUDIANTES:", error);
    res.status(500).json({
      success: false,
      message: "Error al obtener estudiantes",
    });
  }
};

// Guardar o actualizar notas
exports.guardarNotas = async (req, res) => {
  try {
    const { idinscripcion, primero, segundo, tercero } = req.body;

    // Calcular nota final: (primero + segundo) * 0.6 + tercero * 0.4
    const notafinal = ((parseFloat(primero) + parseFloat(segundo)) / 2) * 0.6 + parseFloat(tercero) * 0.4;

    // Verificar si ya existe registro de notas
    const existe = await db.query(
      "SELECT idnota FROM registro.notas WHERE idinscripcion = $1",
      [idinscripcion]
    );

    if (existe.rows.length > 0) {
      // Actualizar
      await db.query(
        `UPDATE registro.notas 
         SET primero = $1, segundo = $2, tercero = $3, notafinal = $4
         WHERE idinscripcion = $5`,
        [primero, segundo, tercero, notafinal, idinscripcion]
      );
    } else {
      // Insertar
      await db.query(
        `INSERT INTO registro.notas (primero, segundo, tercero, notafinal, idinscripcion)
         VALUES ($1, $2, $3, $4, $5)`,
        [primero, segundo, tercero, notafinal, idinscripcion]
      );
    }

    res.json({
      success: true,
      message: "Notas guardadas correctamente",
      notafinal,
    });
  } catch (error) {
    console.error("ERROR GUARDAR NOTAS:", error);
    res.status(500).json({
      success: false,
      message: "Error al guardar notas",
    });
  }
};
