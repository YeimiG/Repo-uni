const jwt = require("jsonwebtoken");

// Verifica JWT — usado en rutas web y móvil
exports.verificarToken = (req, res, next) => {
  const auth = req.headers["authorization"];
  if (!auth || !auth.startsWith("Bearer ")) {
    return res.status(401).json({ success: false, message: "Token requerido" });
  }
  const token = auth.split(" ")[1];
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ success: false, message: "Token inválido o expirado" });
  }
};

// Solo admins web
exports.soloAdmin = (req, res, next) => {
  const admins = ["SUPER_ADMIN", "ADMIN_ACADEMICO", "COORDINADOR"];
  if (!req.user || !admins.includes(req.user.rol)) {
    return res.status(403).json({ success: false, message: "Acceso denegado" });
  }
  next();
};

// Admin o Secretaria (para gestión de usuarios/estudiantes)
exports.adminOSecretaria = (req, res, next) => {
  const roles = ["SUPER_ADMIN", "ADMIN_ACADEMICO", "COORDINADOR", "SECRETARIA"];
  if (!req.user || !roles.includes(req.user.rol)) {
    return res.status(403).json({ success: false, message: "Acceso denegado" });
  }
  next();
};

// Solo estudiantes (móvil)
exports.soloEstudiante = (req, res, next) => {
  if (!req.user || req.user.rol !== "ESTUDIANTE") {
    return res.status(403).json({ success: false, message: "Acceso denegado" });
  }
  next();
};
