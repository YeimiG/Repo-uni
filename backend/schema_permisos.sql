-- ============================================
-- SISTEMA DE PERMISOS Y CONFIGURACIÓN DE NOTAS
-- ============================================

-- Tabla de configuración de períodos de notas
CREATE TABLE IF NOT EXISTS configuracion.periodos_notas (
    idPeriodo SERIAL PRIMARY KEY,
    nombrePeriodo VARCHAR(50) NOT NULL, -- 'Parcial 1', 'Parcial 2', 'Parcial 3'
    fechaInicio DATE NOT NULL,
    fechaFin DATE NOT NULL,
    activo BOOLEAN DEFAULT false,
    creadoPor INTEGER REFERENCES seguridad.usuario(idusuario),
    fechaCreacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de permisos de edición de notas
CREATE TABLE IF NOT EXISTS configuracion.permisos_edicion (
    idPermiso SERIAL PRIMARY KEY,
    idCatedratico INTEGER NOT NULL,
    idMateria INTEGER NOT NULL,
    idGrupo INTEGER NOT NULL,
    puedeEditarNota1 BOOLEAN DEFAULT false,
    puedeEditarNota2 BOOLEAN DEFAULT false,
    puedeEditarNota3 BOOLEAN DEFAULT false,
    editadoNota1 BOOLEAN DEFAULT false, -- Ya editó nota1
    editadoNota2 BOOLEAN DEFAULT false, -- Ya editó nota2
    editadoNota3 BOOLEAN DEFAULT false, -- Ya editó nota3
    habilitadoPor INTEGER REFERENCES seguridad.usuario(idusuario),
    fechaHabilitacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(idCatedratico, idMateria, idGrupo)
);

-- Insertar períodos por defecto
INSERT INTO configuracion.periodos_notas (nombrePeriodo, fechaInicio, fechaFin, activo) VALUES
('Parcial 1', '2024-01-15', '2024-03-15', false),
('Parcial 2', '2024-03-16', '2024-05-15', false),
('Parcial 3', '2024-05-16', '2024-07-15', false)
ON CONFLICT DO NOTHING;

-- Comentarios
COMMENT ON TABLE configuracion.periodos_notas IS 'Períodos habilitados para ingreso de notas';
COMMENT ON TABLE configuracion.permisos_edicion IS 'Control de permisos de edición de notas por catedrático';
