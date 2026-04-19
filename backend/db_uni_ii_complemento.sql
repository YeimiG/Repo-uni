-- ==============================================
-- COMPLEMENTO PARA DB_UNI_II
-- Ejecutar en pgAdmin sobre DB_UNI_II
-- ==============================================

-- 1. Schema configuracion (no existe en DB_UNI_II)
CREATE SCHEMA IF NOT EXISTS configuracion;

-- 2. Tabla de períodos de notas
CREATE TABLE IF NOT EXISTS configuracion.periodos_notas (
    idPeriodo SERIAL PRIMARY KEY,
    nombrePeriodo VARCHAR(50) NOT NULL,
    fechaInicio DATE NOT NULL,
    fechaFin DATE NOT NULL,
    activo BOOLEAN DEFAULT false,
    creadoPor INTEGER REFERENCES seguridad.Usuario(idUsuario) ON DELETE SET NULL,
    fechaCreacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Tabla de permisos de edición de notas
CREATE TABLE IF NOT EXISTS configuracion.permisos_edicion (
    idPermiso SERIAL PRIMARY KEY,
    idCatedratico INTEGER NOT NULL REFERENCES docentes.Docente(idDocente) ON DELETE CASCADE,
    idMateria INTEGER NOT NULL REFERENCES academico.Materia(idMateria) ON DELETE CASCADE,
    idGrupo INTEGER NOT NULL REFERENCES grupos.Grupo(idGrupo) ON DELETE CASCADE,
    puedeEditarNota1 BOOLEAN DEFAULT false,
    puedeEditarNota2 BOOLEAN DEFAULT false,
    puedeEditarNota3 BOOLEAN DEFAULT false,
    editadoNota1 BOOLEAN DEFAULT false,
    editadoNota2 BOOLEAN DEFAULT false,
    editadoNota3 BOOLEAN DEFAULT false,
    habilitadoPor INTEGER REFERENCES seguridad.Usuario(idUsuario) ON DELETE SET NULL,
    fechaHabilitacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(idCatedratico, idMateria, idGrupo)
);

-- 4. Períodos por defecto
INSERT INTO configuracion.periodos_notas (nombrePeriodo, fechaInicio, fechaFin, activo) VALUES
('Parcial 1', '2025-01-15', '2025-03-15', false),
('Parcial 2', '2025-03-16', '2025-05-15', false),
('Parcial 3', '2025-05-16', '2025-07-15', false)
ON CONFLICT DO NOTHING;

-- 5. grupos.Grupo.idDocente debe ser nullable
--    (la web permite grupos sin docente asignado aún)
ALTER TABLE grupos.Grupo ALTER COLUMN idDocente DROP NOT NULL;

-- 6. personas.Persona.fechaNacimiento debe ser nullable
--    (adminController crea personas sin fecha de nacimiento)
ALTER TABLE personas.Persona ALTER COLUMN fechaNacimiento DROP NOT NULL;
