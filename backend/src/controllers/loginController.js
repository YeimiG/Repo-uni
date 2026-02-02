const db = require("../config/db");
const jwt = require("jsonwebtoken");

exports.login = async (req, res) => {
  const { correo, clave } = req.body;

  try {
    const result = await db.query(
      "SELECT * FROM seguridad.usuario where correo = $1",
      [correo],
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: "Credenciales incorrectas",
      });
    }

    const usuario = result.rows[0];

    // 🚫 Bloquear estudiantes
    if (usuario.rol === "Estudiante") {
      return res.status(403).json({
        success: false,
        message: "Acceso no autorizado",
      });
    }

    // 🔑 COMPARACIÓN DIRECTA (texto plano)
    if (clave !== usuario.clave) {
      return res.status(401).json({
        success: false,
        message: "Credenciales incorrectas",
      });
    }

    // 🔐 JWT
    const token = jwt.sign(
      {
        idUsuario: usuario.id_usuario,
        rol: usuario.rol,
      },
      process.env.JWT_SECRET,
      { expiresIn: "8h" },
    );

    res.json({
      success: true,
      token,
      usuario: {
        idUsuario: usuario.id_usuario,
        correo: usuario.correo,
        rol: usuario.rol,
        nombre: usuario.nombre,
        apellidos: usuario.apellidos,
        primerLogin: usuario.primer_login,
      },
    });
  } catch (error) {
    console.error("ERROR LOGIN:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
    });
  }
};
