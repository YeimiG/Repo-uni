-- Crear esquema academico si no existe
CREATE SCHEMA IF NOT EXISTS academico;

-- Tabla Carrera
CREATE TABLE IF NOT EXISTS academico."Carrera" (
    "idCarrera" SERIAL PRIMARY KEY,
    "nombreCarrera" VARCHAR(255) NOT NULL
);

-- Tabla Estudiante
CREATE TABLE IF NOT EXISTS academico."Estudiante" (
    "idEstudiante" SERIAL PRIMARY KEY,
    "idUsuario" INTEGER NOT NULL,
    nombre VARCHAR(255) NOT NULL,
    apellidos VARCHAR(255) NOT NULL,
    expediente VARCHAR(50) UNIQUE NOT NULL,
    "estadoAcademico" VARCHAR(50),
    "idCarrera" INTEGER REFERENCES academico."Carrera"("idCarrera")
);

-- Insertar datos de prueba
INSERT INTO academico."Carrera" ("nombreCarrera") VALUES ('Ingeniería en Sistemas') ON CONFLICT DO NOTHING;

INSERT INTO academico."Estudiante" ("idUsuario", nombre, apellidos, expediente, "estadoAcademico", "idCarrera")
VALUES (22, 'Juan', 'Pérez', '2022001', 'Activo', 1) ON CONFLICT DO NOTHING;