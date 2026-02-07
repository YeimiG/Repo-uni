require('dotenv').config();
const db = require('./src/config/db');

async function checkStructure() {
  try {
    // Ver columnas de la tabla
    const columns = await db.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_schema = 'seguridad' 
      AND table_name = 'usuario'
      ORDER BY ordinal_position
    `);
    
    console.log('📋 Columnas de seguridad.usuario:');
    columns.rows.forEach(col => {
      console.log(`   - ${col.column_name} (${col.data_type})`);
    });
    console.log('');
    
    // Ver todos los datos sin filtrar columnas
    const data = await db.query('SELECT * FROM seguridad.usuario LIMIT 3');
    console.log('📊 Datos de ejemplo:');
    console.log(JSON.stringify(data.rows, null, 2));
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
  
  process.exit(0);
}

checkStructure();
