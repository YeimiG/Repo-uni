const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

const app = express();

// Permitir peticiones desde cualquier origen (solo para desarrollo)
app.use(cors());
app.use(express.json());

// ====== OJO hay que cambiar todo, puerto user y contraseña  ======
// ====== CONFIGURACIÓN DE POSTGRES ======
// Cambia estos valores por tus datos locales:
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "DB_UNI",
  password: "root",
  port: 5433,
});

// ====== RUTA DE PRUEBA ======
app.get("/api/test", async (req, res) => {
  try {
    // Intentar consultar la base de datos
    await pool.query("SELECT NOW()");
    res.json({
      status: "ok",
      message: "Conexión a PostgreSQL exitosa",
    });
  } catch (err) {
    console.error("ERROR EN DB:", err);
    res.status(500).json({
      status: "error",
      message: "No se pudo conectar a PostgreSQL",
      detail: err.message,
    });
  }
});

// ====== INICIAR SERVIDOR ======
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor API escuchando en http://localhost:${PORT}`);
});
