const app = require("./src/app");
// En desarrollo el backend usa el puerto 3001 para evitar conflicto con el frontend.
const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
