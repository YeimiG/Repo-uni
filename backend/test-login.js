require('dotenv').config();
const db = require('./src/config/db');

async function testLogin() {
  console.log('🔍 Probando conexión y datos...\n');
  
  console.log('📋 Variables de entorno:');
  console.log('PG_USER:', process.env.PG_USER);
  console.log('PG_HOST:', process.env.PG_HOST);
  console.log('PG_DATABASE:', process.env.PG_DATABASE);
  console.log('PG_PORT:', process.env.PG_PORT);
  console.log('PG_PASSWORD:', process.env.PG_PASSWORD ? '***' : 'NO DEFINIDA');
  console.log('');

  try {
    // Test 1: Conexión
    console.log('✅ Test 1: Probando conexión...');
    const testConn = await db.query('SELECT NOW()');
    console.log('   Conexión exitosa:', testConn.rows[0].now);
    console.log('');

    // Test 2: Verificar esquema
    console.log('✅ Test 2: Verificando esquema seguridad...');
    const schema = await db.query(`
      SELECT schema_name 
      FROM information_schema.schemata 
      WHERE schema_name = 'seguridad'
    `);
    console.log('   Esquema existe:', schema.rows.length > 0);
    console.log('');

    // Test 3: Verificar tabla usuario
    console.log('✅ Test 3: Verificando tabla usuario...');
    const table = await db.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'seguridad' 
      AND table_name = 'usuario'
    `);
    console.log('   Tabla existe:', table.rows.length > 0);
    console.log('');

    // Test 4: Listar usuarios
    console.log('✅ Test 4: Listando usuarios...');
    const users = await db.query('SELECT idusuario, correo, clave, rol, nombre, apellidos FROM seguridad.usuario');
    console.log('   Total usuarios:', users.rows.length);
    users.rows.forEach(u => {
      console.log(`   - ${u.correo} | ${u.clave} | ${u.rol} | ${u.nombre} ${u.apellidos}`);
    });
    console.log('');

    // Test 5: Probar login específico
    console.log('✅ Test 5: Probando login con admin@ieproes.edu...');
    const correo = 'admin@ieproes.edu';
    const clave = 'admin123';
    
    const result = await db.query(
      'SELECT * FROM seguridad.usuario WHERE correo = $1',
      [correo]
    );
    
    if (result.rows.length === 0) {
      console.log('   ❌ Usuario no encontrado');
    } else {
      const usuario = result.rows[0];
      console.log('   ✅ Usuario encontrado:', usuario.correo);
      console.log('   Clave en DB:', usuario.clave);
      console.log('   Clave ingresada:', clave);
      console.log('   Coinciden:', clave === usuario.clave);
      console.log('   Rol:', usuario.rol);
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Detalles:', error);
  }
  
  process.exit(0);
}

testLogin();
