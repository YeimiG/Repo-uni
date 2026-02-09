require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Import Routes
const estudianteRoutes = require("./routes/estudianteRoutes");
const materiaRoutes = require("./routes/materiaRoutes");
const authRoutes = require("./routes/authRoutes");
const catedraticoRoutes = require("./routes/catedraticoRoutes");
const adminRoutes = require("./routes/adminRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const materiasRoutes = require("./routes/materiasRoutes");
const reportesRoutes = require("./routes/reportesRoutes");
const appMobileRoutes = require("./routes/appMobileRoutes");

// Ruta para la app móvil
app.use("/api/app", appMobileRoutes);

// Use Routes web
app.use("/api/estudiantes", estudianteRoutes);
app.use("/api/materias", materiaRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/catedratico", catedraticoRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/grupos", materiasRoutes);
app.use("/api/reportes", reportesRoutes);

module.exports = app;
