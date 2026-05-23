const db = require("../../config/db");
const bcrypt = require("bcryptjs");

exports.login = async (req, res) => {
  const { correo, clave } = req.body;

  try {
    const result = await db.query(
      `SELECT u.idusuario, u.correo, u.clave, r.nombrerol as rol,
              COALESCE(pd.primernombre, pe.primernombre, u.correo) as nombre,
              COALESCE(pd.primerapellido, pe.primerapellido, '') as apellidos
       FROM seguridad.usuario u
       INNER JOIN seguridad.rol r ON u.idrol = r.idrol
       LEFT JOIN docentes.docente d ON u.idusuario = d.idusuario
       LEFT JOIN personas.persona pd ON d.idpersona = pd.idpersona
       LEFT JOIN estudiantes.estudiante e ON u.idusuario = e.idusuario
       LEFT JOIN personas.persona pe ON e.idpersona = pe.idpersona
       WHERE u.correo = $1`,
      [correo],
    );

    if (result.rows.length === 0) {
      return res
        .status(401)
        .json({ success: false, message: "Credenciales incorrectas" });
    }

    const usuario = result.rows[0];

    const rolesWeb = [
      "SUPER_ADMIN",
      "ADMIN_ACADEMICO",
      "ADMIN_FINANCIERO",
      "COORDINADOR",
      "DOCENTE",
      "SECRETARIA",
    ];

    // Normaliza el rol para evitar fallos cuando el nombre de rol en la base de datos incluye acentos.
    const normalizedRole = String(usuario.rol || "")
      .normalize("NFD")
      .replace(/\p{Diacritic}/gu, "")
      .toUpperCase();

    if (!rolesWeb.includes(normalizedRole)) {
      return res
        .status(403)
        .json({ success: false, message: "Acceso no autorizado" });
    }

    // Soporta contraseñas con bcrypt y también texto plano (legacy)
    const storedClave = typeof usuario.clave === "string" ? usuario.clave : "";
    const claveValida = storedClave.startsWith("$2")
      ? await bcrypt.compare(clave, storedClave)
      : clave === storedClave;

    if (!claveValida) {
      return res
        .status(401)
        .json({ success: false, message: "Credenciales incorrectas" });
    }

    // No generamos ni devolvemos token JWT para la parte web por ahora.
    res.json({
      success: true,
      usuario: {
        idUsuario: usuario.idusuario,
        correo: usuario.correo,
        rol: normalizedRole,
        nombre: usuario.nombre,
        apellidos: usuario.apellidos,
        primerLogin: false,
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
