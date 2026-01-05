const { Pool } = require("pg");

// Crea la configuración desde variables de entorno
const pool = new Pool({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
});

// Probar la conexión al iniciar el backend
(async () => {
  try {
    await pool.query("SELECT NOW()");
    console.log("Conectado a PostgreSQL correctamente");
  } catch (err) {
    console.error("Error al conectar a PostgreSQL:", err.message);
  }
})();

// Exporta un método para ejecutar queries fácilmente
module.exports = {
  query: (text, params) => pool.query(text, params),
};
