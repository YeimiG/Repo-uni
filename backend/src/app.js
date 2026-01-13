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
//const grupoRoutes = require("./routes/grupoRoutes");
//const inscripcionRoutes = require("./routes/inscripcionRoutes");
//const notasRoutes = require("./routes/notasRoutes");

// Use Routes
app.use("/api/estudiantes", estudianteRoutes);
app.use("/api/materias", materiaRoutes);
app.use("/api/auth", authRoutes);
//app.use("/api/grupos", grupoRoutes);
//app.use("/api/inscripciones", inscripcionRoutes);
//app.use("/api/notas", notasRoutes);

module.exports = app;
