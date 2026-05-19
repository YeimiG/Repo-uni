require('dotenv').config();
const { Pool } = require('pg');
const p = new Pool({
  user: process.env.PG_USER, host: process.env.PG_HOST,
  database: process.env.PG_DATABASE, password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
});

async function run() {
  // Crear persona para el docente Carlos Rivas
  const persona = await p.query(
    `INSERT INTO personas.persona(primernombre, primerapellido, fechanacimiento, activo, fecharegistro)
     VALUES('Carlos', 'Rivas', '1980-01-01', true, NOW()) RETURNING idpersona`
  );
  const idpersona = persona.rows[0].idpersona;
  console.log('Persona creada, idpersona:', idpersona);

  // Crear registro en docentes.docente vinculado al usuario 3
  const doc = await p.query(
    `INSERT INTO docentes.docente(idpersona, codigodocente, fechaingreso, especialidad, idusuario, activo)
     VALUES($1, 'DOC-001', CURRENT_DATE, 'Ingeniería de Sistemas', 3, true)
     RETURNING iddocente`,
    [idpersona]
  );
  const iddocente = doc.rows[0].iddocente;
  console.log('Docente creado, iddocente:', iddocente);

  // Crear grupos para todas las materias en el período activo
  const mats = await p.query(`SELECT idmateria, codigo FROM academico.materia WHERE activo = true`);
  for (const m of mats.rows) {
    const codigo = `G1-${m.idmateria}-1`;
    const r = await p.query(
      `INSERT INTO grupos.grupo(codigo, numerogrupo, cupomaximo, cupoactual, idmateria, iddocente, idperiodo, estado)
       VALUES($1, 1, 30, 0, $2, $3, 1, 'ACTIVO')
       ON CONFLICT DO NOTHING RETURNING idgrupo`,
      [codigo, m.idmateria, iddocente]
    );
    if (r.rows.length > 0) console.log('Grupo creado:', m.codigo, '-> idgrupo:', r.rows[0].idgrupo);
    else console.log('Grupo ya existe:', codigo);
  }

  const g = await p.query(`SELECT COUNT(*) as t FROM grupos.grupo`);
  console.log('Total grupos:', g.rows[0].t);

  await p.end();
  console.log('Done');
}

run().catch(e => { console.error(e.message); p.end(); });
