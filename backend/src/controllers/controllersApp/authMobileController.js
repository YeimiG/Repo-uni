const db = require("../../config/db");
const jwt = require("jsonwebtoken");

exports.loginMobile = async (req, res) => {
    const { correo, clave } = req.body;

    try {
        const result = await db.query(
            `SELECT u.idusuario, u.correo, u.clave, r.nombrerol as rol,
                    p.primernombre as nombre, p.primerapellido as apellidos
             FROM seguridad.usuario u
             INNER JOIN seguridad.rol r ON u.idrol = r.idrol
             INNER JOIN estudiantes.estudiante e ON u.idusuario = e.idusuario
             INNER JOIN personas.persona p ON e.idpersona = p.idpersona
             WHERE u.correo = $1 AND r.nombrerol = 'ESTUDIANTE'`,
            [correo]
        );

        if (result.rows.length === 0) {
            return res.status(401).json({ success: false, message: "Credenciales incorrectas o usuario no es estudiante" });
        }

        const usuario = result.rows[0];

        if (clave !== usuario.clave) {
            return res.status(401).json({ success: false, message: "Contraseña incorrecta" });
        }

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
                rol: usuario.rol,
                nombre: usuario.nombre,
                apellidos: usuario.apellidos
            }
        });
    } catch (error) {
        console.error("ERROR LOGIN MOBILE:", error);
        res.status(500).json({ success: false, message: "Error interno" });
    }
};