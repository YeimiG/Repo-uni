const db = require("../../config/db");

// Obtener materias según el rol del usuario
exports.getMaterias = async (req, res) => {
  try {
    const { idUsuario, rol } = req.query;

    let query;
    let params = [];

    if (rol === "SUPER_ADMIN" || rol === "ADMIN_ACADEMICO" || rol === "COORDINADOR") {
      // Admin ve todas las materias con sus grupos
      query = `
        SELECT 
          g.idgrupo,
          m.idmateria,
          m.codigo as codigomateria,
          m.nombre,
          m.unidadesvalorativas as creditos,
          COALESCE(pd.primernombre || ' ' || pd.primerapellido, 'Sin asignar') as docente,
          g.cupomaximo,
          COUNT(i.idinscripcion) as inscritos,
          p.nombre || '-' || p.numeroperiodo as ciclo
        FROM grupos.grupo g
        INNER JOIN academico.materia m ON g.idmateria = m.idmateria
        LEFT JOIN docentes.docente d ON g.iddocente = d.iddocente
        LEFT JOIN personas.persona pd ON d.idpersona = pd.idpersona
        INNER JOIN academico.periodoacademico p ON g.idperiodo = p.idperiodo
        LEFT JOIN inscripciones.inscripcion i ON g.idgrupo = i.idgrupo
        GROUP BY g.idgrupo, m.idmateria, m.codigo, m.nombre, m.unidadesvalorativas,
                 pd.primernombre, pd.primerapellido, g.cupomaximo, p.nombre, p.numeroperiodo
        ORDER BY m.codigo
      `;
    } else {
      // Catedrático solo ve sus materias asignadas
      query = `
        SELECT 
          g.idgrupo,
          m.idmateria,
          m.codigo as codigomateria,
          m.nombre,
          m.unidadesvalorativas as creditos,
          COALESCE(pd.primernombre || ' ' || pd.primerapellido, 'Sin asignar') as docente,
          g.cupomaximo,
          COUNT(i.idinscripcion) as inscritos,
          p.nombre || '-' || p.numeroperiodo as ciclo
        FROM grupos.grupo g
        INNER JOIN academico.materia m ON g.idmateria = m.idmateria
        LEFT JOIN docentes.docente d ON g.iddocente = d.iddocente
        LEFT JOIN personas.persona pd ON d.idpersona = pd.idpersona
        INNER JOIN academico.periodoacademico p ON g.idperiodo = p.idperiodo
        LEFT JOIN inscripciones.inscripcion i ON g.idgrupo = i.idgrupo
        WHERE d.idusuario = $1
        GROUP BY g.idgrupo, m.idmateria, m.codigo, m.nombre, m.unidadesvalorativas,
                 pd.primernombre, pd.primerapellido, g.cupomaximo, p.nombre, p.numeroperiodo
        ORDER BY m.codigo
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
        p.primernombre || ' ' || p.primerapellido as nombre,
        i.idinscripcion,
        COALESCE(n.nota1, 0) as parcial1,
        COALESCE(n.nota2, 0) as parcial2,
        COALESCE(n.nota3, 0) as parcial3,
        COALESCE(n.nota4, 0) as parcial4,
        COALESCE(n.nota5, 0) as parcial5,
        COALESCE(n.notafinal, 0) as notafinal
      FROM inscripciones.inscripcion i
      INNER JOIN estudiantes.estudiante e ON i.idestudiante = e.idestudiante
      INNER JOIN personas.persona p ON e.idpersona = p.idpersona
      LEFT JOIN evaluaciones.notafinal n ON i.idinscripcion = n.idinscripcion
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
    const { idinscripcion, primero, segundo, tercero, cuarto, quinto } = req.body;

    const n1 = parseFloat(primero) || 0;
    const n2 = parseFloat(segundo) || 0;
    const n3 = parseFloat(tercero) || 0;
    const n4 = parseFloat(cuarto)  || 0;
    const n5 = parseFloat(quinto)  || 0;

    const vals = [n1, n2, n3, n4, n5].filter(v => v > 0);
    const notapromedio = vals.length > 0 ? vals.reduce((a, b) => a + b, 0) / vals.length : 0;
    const notafinal = parseFloat(notapromedio.toFixed(2));

    const existe = await db.query(
      "SELECT idnotafinal FROM evaluaciones.notafinal WHERE idinscripcion = $1",
      [idinscripcion]
    );

    if (existe.rows.length > 0) {
      await db.query(
        `UPDATE evaluaciones.notafinal
         SET nota1=$1, nota2=$2, nota3=$3, nota4=$4, nota5=$5, notapromedio=$6, notafinal=$6
         WHERE idinscripcion=$7`,
        [n1, n2, n3, n4, n5, notafinal, idinscripcion]
      );
    } else {
      await db.query(
        `INSERT INTO evaluaciones.notafinal (nota1,nota2,nota3,nota4,nota5,notapromedio,notafinal,idinscripcion)
         VALUES ($1,$2,$3,$4,$5,$6,$6,$7)`,
        [n1, n2, n3, n4, n5, notafinal, idinscripcion]
      );
    }

    res.json({ success: true, message: "Notas guardadas correctamente", notafinal });
  } catch (error) {
    console.error("ERROR GUARDAR NOTAS:", error);
    res.status(500).json({ success: false, message: "Error al guardar notas" });
  }
};
