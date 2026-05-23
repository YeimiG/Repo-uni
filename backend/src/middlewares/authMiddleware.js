const jwt = require("jsonwebtoken");

// Modo web: no bloquear rutas cuando no hay token.
// El frontend web actual no envía Authorization y el backend web ya no debe depender de JWT.
exports.verificarToken = (req, res, next) => {
  const auth = req.headers["authorization"];
  if (!auth || !auth.startsWith("Bearer ")) {
    req.user = null;
    return next();
  }

  const token = auth.split(" ")[1];
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    req.user = null; // Token inválido o expirado no bloquea el acceso web en esta fase.
  }
  next();
};

// Solo admins web: si existe un usuario de token, se valida que sea admin.
// Si no existe token, se permite el acceso porque la autenticación por token se omite.
exports.soloAdmin = (req, res, next) => {
  const admins = ["SUPER_ADMIN", "ADMIN_ACADEMICO", "COORDINADOR"];
  if (!req.user) {
    return next();
  }
  if (!admins.includes(req.user.rol)) {
    return res.status(403).json({ success: false, message: "Acceso denegado" });
  }
  next();
};

// Admin o Secretaria (para gestión de usuarios/estudiantes)
exports.adminOSecretaria = (req, res, next) => {
  const roles = ["SUPER_ADMIN", "ADMIN_ACADEMICO", "COORDINADOR", "SECRETARIA"];
  if (!req.user) {
    return next();
  }
  if (!roles.includes(req.user.rol)) {
    return res.status(403).json({ success: false, message: "Acceso denegado" });
  }
  next();
};

// Solo estudiantes (móvil)
exports.soloEstudiante = (req, res, next) => {
  if (!req.user) {
    return next();
  }
  if (req.user.rol !== "ESTUDIANTE") {
    return res.status(403).json({ success: false, message: "Acceso denegado" });
  }
  next();
};
