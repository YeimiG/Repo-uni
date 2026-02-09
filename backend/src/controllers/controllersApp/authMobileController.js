const db = require("../../config/db");
const jwt = require("jsonwebtoken");

exports.loginMobile = async (req, res) => {
    const { correo, clave } = req.body;

    try {
        const result = await db.query(
            `SELECT u.idusuario, u.correo, u.clave, r.nombrerol as rol
             FROM seguridad.usuario u
             INNER JOIN seguridad.rol r ON u.idrol = r.idrol
             WHERE u.correo = $1`,
            [correo]
        );

        if (result.rows.length === 0) {
            return res.status(401).json({ success: false, message: "Usuario no encontrado" });
        }

        const usuario = result.rows[0];

        // Verificación de clave (texto plano según tu compañero)
        if (clave !== usuario.clave) {
            return res.status(401).json({ success: false, message: "Contraseña incorrecta" });
        }

        // Generar Token
        const token = jwt.sign(
            { idUsuario: usuario.idusuario, rol: usuario.rol },
            process.env.JWT_SECRET,
            { expiresIn: "24h" }
        );

        res.json({
            success: true,
            token,
            usuario: {
                idUsuario: usuario.idusuario,
                correo: usuario.correo,
                rol: usuario.rol
            }
        });
    } catch (error) {
        console.error("ERROR LOGIN MOBILE:", error);
        res.status(500).json({ success: false, message: "Error interno" });
    }
};