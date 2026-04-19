require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// ── Rutas móvil ──────────────────────────────────────────
const appMobileRoutes = require("./routes/routesMobile/appMobileRoutes");
app.use("/api/app", appMobileRoutes);

// ── Rutas web ────────────────────────────────────────────
const authRoutes        = require("./routes/routesWeb/authRoutes");
const adminRoutes       = require("./routes/routesWeb/adminRoutes");
const dashboardRoutes   = require("./routes/routesWeb/dashboardRoutes");
const estudianteRoutes  = require("./routes/routesWeb/estudianteRoutes");
const inscripcionRoutes = require("./routes/routesWeb/inscripcionRoutes");
const materiaRoutes     = require("./routes/routesWeb/materiaRoutes");
const materiasRoutes    = require("./routes/routesWeb/materiasRoutes");
const catedraticoRoutes = require("./routes/routesWeb/catedraticoRoutes");
const reportesRoutes    = require("./routes/routesWeb/reportesRoutes");
const periodoRoutes     = require("./routes/routesWeb/periodoRoutes");

app.use("/api/auth",          authRoutes);
app.use("/api/admin",         adminRoutes);
app.use("/api/dashboard",     dashboardRoutes);
app.use("/api/estudiantes",   estudianteRoutes);
app.use("/api/inscripciones", inscripcionRoutes);
app.use("/api/materias",      materiaRoutes);
app.use("/api/grupos",        materiasRoutes);
app.use("/api/catedratico",   catedraticoRoutes);
app.use("/api/reportes",      reportesRoutes);
app.use("/api/periodos",      periodoRoutes);

module.exports = app;
