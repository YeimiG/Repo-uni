require('dotenv').config();
const { Pool } = require('pg');

const p = new Pool({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
});

const queries = [
  // Schema configuracion
  `CREATE SCHEMA IF NOT EXISTS configuracion`,

  // Tabla periodos_notas
  `CREATE TABLE IF NOT EXISTS configuracion.periodos_notas (
    idPeriodo     SERIAL PRIMARY KEY,
    nombreperiodo VARCHAR(50) NOT NULL,
    fechaInicio   DATE,
    fechaFin      DATE,
    activo        BOOLEAN DEFAULT false
  )`,

  // Tabla permisos_edicion
  `CREATE TABLE IF NOT EXISTS configuracion.permisos_edicion (
    idPermiso          SERIAL PRIMARY KEY,
    idCatedratico      INTEGER NOT NULL,
    idMateria          INTEGER NOT NULL,
    idGrupo            INTEGER NOT NULL,
    puedeEditarNota1   BOOLEAN DEFAULT false,
    puedeEditarNota2   BOOLEAN DEFAULT false,
    puedeEditarNota3   BOOLEAN DEFAULT false,
    editadoNota1       BOOLEAN DEFAULT false,
    editadoNota2       BOOLEAN DEFAULT false,
    editadoNota3       BOOLEAN DEFAULT false,
    habilitadoPor      INTEGER,
    fechaHabilitacion  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(idCatedratico, idMateria, idGrupo)
  )`,

  // Periodos de notas por defecto
  `INSERT INTO configuracion.periodos_notas (nombreperiodo, fechaInicio, fechaFin, activo)
   VALUES ('Parcial 1', CURRENT_DATE, CURRENT_DATE+30, true),
          ('Parcial 2', CURRENT_DATE+31, CURRENT_DATE+60, false),
          ('Parcial 3', CURRENT_DATE+61, CURRENT_DATE+90, false)
   ON CONFLICT DO NOTHING`,

  // Usuario ADMIN_FINANCIERO
  `INSERT INTO seguridad.usuario (correo, clave, idrol, activo, fechacreacion)
   SELECT 'financiero@universidad.edu.sv', 'financiero123',
          (SELECT idrol FROM seguridad.rol WHERE nombrerol = 'ADMIN_FINANCIERO'),
          true, NOW()
   WHERE NOT EXISTS (SELECT 1 FROM seguridad.usuario WHERE correo = 'financiero@universidad.edu.sv')`,

  // Usuario SECRETARIA
  `INSERT INTO seguridad.usuario (correo, clave, idrol, activo, fechacreacion)
   SELECT 'secretaria@universidad.edu.sv', 'secretaria123',
          (SELECT idrol FROM seguridad.rol WHERE nombrerol = 'SECRETARIA'),
          true, NOW()
   WHERE NOT EXISTS (SELECT 1 FROM seguridad.usuario WHERE correo = 'secretaria@universidad.edu.sv')`,

  // Usuario COORDINADOR
  `INSERT INTO seguridad.usuario (correo, clave, idrol, activo, fechacreacion)
   SELECT 'coordinador@universidad.edu.sv', 'coordinador123',
          (SELECT idrol FROM seguridad.rol WHERE nombrerol = 'COORDINADOR'),
          true, NOW()
   WHERE NOT EXISTS (SELECT 1 FROM seguridad.usuario WHERE correo = 'coordinador@universidad.edu.sv')`,

  // Materias de ejemplo
  `INSERT INTO academico.materia (codigo, nombre, descripcion, unidadesvalorativas, horasteoricas, horaspracticas, tipo, activo)
   VALUES
     ('MAT101', 'Matemáticas I',         'Cálculo diferencial e integral', 4, 4, 0, 'OBLIGATORIA', true),
     ('PRG101', 'Programación I',        'Fundamentos de programación',    4, 3, 2, 'OBLIGATORIA', true),
     ('FIS101', 'Física I',              'Mecánica clásica',               4, 4, 0, 'OBLIGATORIA', true),
     ('ING101', 'Inglés Técnico I',      'Inglés para ingeniería',         3, 3, 0, 'OBLIGATORIA', true),
     ('BD101',  'Bases de Datos I',      'Diseño y gestión de BD',         4, 3, 2, 'OBLIGATORIA', true),
     ('RED101', 'Redes de Computadoras', 'Fundamentos de redes',           3, 3, 0, 'OBLIGATORIA', true)
   ON CONFLICT (codigo) DO NOTHING`,

  // Plan de estudio si no existe
  `INSERT INTO academico.planestudio (codigo, nombre, añovigencia, idcarrera, activo)
   SELECT 'PLAN-2020', 'Plan 2020', 2020, 1, true
   WHERE NOT EXISTS (SELECT 1 FROM academico.planestudio WHERE idcarrera = 1 AND activo = true)`,
];

async function run() {
  for (const q of queries) {
    try {
      await p.query(q);
      console.log('✅ OK:', q.trim().substring(0, 60));
    } catch (e) {
      console.error('❌ ERR:', e.message.substring(0, 100));
    }
  }

  // Crear grupos para el período activo
  try {
    const periodoRes = await p.query(`SELECT idperiodo FROM academico.periodoacademico WHERE activo = true LIMIT 1`);
    const docenteRes = await p.query(`SELECT iddocente FROM docentes.docente LIMIT 1`);
    const materiasRes = await p.query(`SELECT idmateria FROM academico.materia WHERE activo = true`);

    if (periodoRes.rows.length > 0) {
      const idperiodo = periodoRes.rows[0].idperiodo;
      const iddocente = docenteRes.rows.length > 0 ? docenteRes.rows[0].iddocente : null;

      for (const m of materiasRes.rows) {
        const codigo = `G1-${m.idmateria}-${idperiodo}`;
        try {
          await p.query(
            `INSERT INTO grupos.grupo (codigo, numerogrupo, cupomaximo, cupoactual, idmateria, iddocente, idperiodo, estado)
             VALUES ($1, 1, 30, 0, $2, $3, $4, 'ACTIVO')
             ON CONFLICT DO NOTHING`,
            [codigo, m.idmateria, iddocente, idperiodo]
          );
        } catch (e) { /* skip duplicates */ }
      }
      console.log('✅ Grupos creados para período', idperiodo);
    }
  } catch (e) {
    console.error('❌ Error creando grupos:', e.message);
  }

  // Verificación final
  const checks = [
    ['Usuarios web', `SELECT COUNT(*) as t FROM seguridad.usuario u INNER JOIN seguridad.rol r ON u.idrol=r.idrol WHERE r.nombrerol NOT IN ('ESTUDIANTE','TUTOR')`],
    ['Materias', `SELECT COUNT(*) as t FROM academico.materia`],
    ['Grupos', `SELECT COUNT(*) as t FROM grupos.grupo`],
    ['Periodos notas', `SELECT COUNT(*) as t FROM configuracion.periodos_notas`],
  ];

  console.log('\n=== VERIFICACIÓN FINAL ===');
  for (const [label, q] of checks) {
    const r = await p.query(q);
    console.log(`  ${label}: ${r.rows[0].t}`);
  }

  const usuarios = await p.query(
    `SELECT u.correo, r.nombrerol FROM seguridad.usuario u
     INNER JOIN seguridad.rol r ON u.idrol=r.idrol
     WHERE r.nombrerol NOT IN ('ESTUDIANTE','TUTOR')
     ORDER BY r.niveljerarquico`
  );
  console.log('\n=== USUARIOS DEL SISTEMA ===');
  usuarios.rows.forEach(u => console.log(`  [${u.nombrerol}] ${u.correo}`));

  await p.end();
  console.log('\n✅ Setup completado');
}

run().catch(e => { console.error(e); p.end(); });
