const app = require("./src/app");

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 API ejecutándose en http://localhost:${PORT}`);
});

//const pool = new Pool({
//  user: "postgres",
//  host: "localhost",
//  database: "DB_UNI",
//  password: "root",
//  port: 5433,
//});
