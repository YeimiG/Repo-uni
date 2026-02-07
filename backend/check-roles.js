require('dotenv').config();
const db = require('./src/config/db');

async function checkRoles() {
  try {
    // Ver columnas de la tabla rol
    const columns = await db.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_schema = 'seguridad' 
      AND table_name = 'rol'
      ORDER BY ordinal_position
    `);
    
    console.log('📋 Columnas de seguridad.rol:');
    columns.rows.forEach(col => {
      console.log(`   - ${col.column_name} (${col.data_type})`);
    });
    console.log('');
    
    // Ver todos los roles
    const roles = await db.query('SELECT * FROM seguridad.rol');
    console.log('📊 Roles disponibles:');
    console.log(JSON.stringify(roles.rows, null, 2));
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
  
  process.exit(0);
}

checkRoles();
