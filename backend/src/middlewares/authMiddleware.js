exports.onlyAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== "ADMIN") {
    return res.status(403).json({ message: "Acceso denegado" });
  }
  next();
};
