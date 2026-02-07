require('dotenv').config();
const db = require('./src/config/db');

async function testRealLogin() {
  try {
    console.log('🔐 Probando login con credenciales reales...\n');
    
    // Usuario 1: enrique.calzadilla@uni.edu.sv / Root
    const correo = 'enrique.calzadilla@uni.edu.sv';
    const clave = 'Root';
    
    console.log('Intentando login con:');
    console.log('Correo:', correo);
    console.log('Clave:', clave);
    console.log('');
    
    const result = await db.query(
      `SELECT u.idusuario, u.correo, u.clave, r.nombrerol as rol
       FROM seguridad.usuario u
       INNER JOIN seguridad.rol r ON u.idrol = r.idrol
       WHERE u.correo = $1`,
      [correo]
    );
    
    if (result.rows.length === 0) {
      console.log('❌ Usuario no encontrado');
    } else {
      const usuario = result.rows[0];
      console.log('✅ Usuario encontrado:');
      console.log('   ID:', usuario.idusuario);
      console.log('   Correo:', usuario.correo);
      console.log('   Clave en DB:', usuario.clave);
      console.log('   Rol:', usuario.rol);
      console.log('');
      
      if (clave === usuario.clave) {
        console.log('✅ Contraseña correcta!');
        console.log('✅ Login exitoso');
      } else {
        console.log('❌ Contraseña incorrecta');
        console.log('   Esperada:', usuario.clave);
        console.log('   Recibida:', clave);
      }
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
  
  process.exit(0);
}

testRealLogin();
