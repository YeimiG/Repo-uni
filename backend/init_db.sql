-- ==============================================
-- BASE DE DATOS IEPROES - VERSIÓN DOCKER (init_db.sql)
-- ==============================================

BEGIN;

-- ==============================================
-- CREACIÓN DE SCHEMAS
-- ==============================================
CREATE SCHEMA IF NOT EXISTS seguridad;
CREATE SCHEMA IF NOT EXISTS personas;
CREATE SCHEMA IF NOT EXISTS academico;
CREATE SCHEMA IF NOT EXISTS docentes;
CREATE SCHEMA IF NOT EXISTS estudiantes;
CREATE SCHEMA IF NOT EXISTS grupos;
CREATE SCHEMA IF NOT EXISTS inscripciones;
CREATE SCHEMA IF NOT EXISTS evaluaciones;
CREATE SCHEMA IF NOT EXISTS asistencia;
CREATE SCHEMA IF NOT EXISTS pagos;
CREATE SCHEMA IF NOT EXISTS proyectos;
CREATE SCHEMA IF NOT EXISTS extension;
CREATE SCHEMA IF NOT EXISTS configuracion; -- [NUEVO] Agregado para el sistema de notas

-- ==============================================
-- SCHEMA: SEGURIDAD
-- ==============================================
CREATE TABLE seguridad.Modulo (
    idModulo SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    descripcion VARCHAR(255),
    icono VARCHAR(50),
    ruta VARCHAR(100),
    orden INT DEFAULT 0,
    activo BOOLEAN DEFAULT TRUE
);

CREATE TABLE seguridad.Permiso (
    idPermiso SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    codigo VARCHAR(50) NOT NULL UNIQUE,
    descripcion VARCHAR(255),
    idModulo INT REFERENCES seguridad.Modulo(idModulo) ON DELETE SET NULL,
    activo BOOLEAN DEFAULT TRUE
);

CREATE TABLE seguridad.Rol (
    idRol SERIAL PRIMARY KEY,
    nombreRol VARCHAR(50) NOT NULL UNIQUE,
    descripcion VARCHAR(255),
    nivelJerarquico INT DEFAULT 0,
    esDefault BOOLEAN DEFAULT FALSE,
    activo BOOLEAN DEFAULT TRUE
);

CREATE TABLE seguridad.RolPermiso (
    idRolPermiso SERIAL PRIMARY KEY,
    idRol INT NOT NULL REFERENCES seguridad.Rol(idRol) ON DELETE CASCADE,
    idPermiso INT NOT NULL REFERENCES seguridad.Permiso(idPermiso) ON DELETE CASCADE,
    fechaAsignacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(idRol, idPermiso)
);

CREATE TABLE seguridad.Usuario (
    idUsuario SERIAL PRIMARY KEY,
    correo VARCHAR(100) NOT NULL UNIQUE,
    clave VARCHAR(255) NOT NULL,
    fechaCreacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ultimoAcceso TIMESTAMP,
    intentosFallidos INT DEFAULT 0,
    bloqueado BOOLEAN DEFAULT FALSE,
    fechaBloqueo TIMESTAMP,
    requiereCambioClave BOOLEAN DEFAULT TRUE,
    tokenRecuperacion VARCHAR(255),
    expiracionToken TIMESTAMP,
    idRol INT NOT NULL REFERENCES seguridad.Rol(idRol),
    activo BOOLEAN DEFAULT TRUE
);

CREATE TABLE seguridad.Sesion (
    idSesion SERIAL PRIMARY KEY,
    idUsuario INT NOT NULL REFERENCES seguridad.Usuario(idUsuario) ON DELETE CASCADE,
    token VARCHAR(500) NOT NULL,
    dispositivo VARCHAR(255),
    direccionIP VARCHAR(45),
    fechaInicio TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fechaFin TIMESTAMP,
    activa BOOLEAN DEFAULT TRUE
);

CREATE TABLE seguridad.Auditoria (
    idAuditoria SERIAL PRIMARY KEY,
    idUsuario INT REFERENCES seguridad.Usuario(idUsuario) ON DELETE SET NULL,
    tabla VARCHAR(100),
    accion VARCHAR(20),
    datosAntiguos JSONB,
    datosNuevos JSONB,
    direccionIP VARCHAR(45),
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE seguridad.Notificacion (
    idNotificacion SERIAL PRIMARY KEY,
    idUsuario INT NOT NULL REFERENCES seguridad.Usuario(idUsuario) ON DELETE CASCADE,
    titulo VARCHAR(200) NOT NULL,
    mensaje TEXT,
    tipo VARCHAR(50) DEFAULT 'INFO',
    leida BOOLEAN DEFAULT FALSE,
    fechaCreacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fechaLectura TIMESTAMP,
    accionEnlace VARCHAR(500)
);

-- ==============================================
-- SCHEMA: PERSONAS
-- ==============================================
CREATE TABLE personas.TipoDocumentoIdentidad (
    idTipoDocumento SERIAL PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL UNIQUE,
    abreviatura VARCHAR(10),
    paisOrigen VARCHAR(100),
    activo BOOLEAN DEFAULT TRUE
);

CREATE TABLE personas.Departamento (
    idDepartamento SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    codigo VARCHAR(10) UNIQUE,
    activo BOOLEAN DEFAULT TRUE
);

CREATE TABLE personas.Municipio (
    idMunicipio SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    idDepartamento INT NOT NULL REFERENCES personas.Departamento(idDepartamento) ON DELETE RESTRICT,
    codigo VARCHAR(10) UNIQUE,
    activo BOOLEAN DEFAULT TRUE,
    UNIQUE(nombre, idDepartamento)
);

CREATE TABLE personas.Direccion (
    idDireccion SERIAL PRIMARY KEY,
    linea1 VARCHAR(255) NOT NULL,
    linea2 VARCHAR(255),
    referencia VARCHAR(255),
    codigoPostal VARCHAR(20),
    idMunicipio INT NOT NULL REFERENCES personas.Municipio(idMunicipio),
    activo BOOLEAN DEFAULT TRUE
);

CREATE TABLE personas.Contacto (
    idContacto SERIAL PRIMARY KEY,
    telefonoFijo VARCHAR(20),
    telefonoMovil VARCHAR(20),
    telefonoAlternativo VARCHAR(20),
    correoPersonal VARCHAR(100),
    correoInstitucional VARCHAR(100) UNIQUE,
    activo BOOLEAN DEFAULT TRUE
);

CREATE TABLE personas.Persona (
    idPersona SERIAL PRIMARY KEY,
    primerNombre VARCHAR(100) NOT NULL,
    segundoNombre VARCHAR(100),
    primerApellido VARCHAR(100) NOT NULL,
    segundoApellido VARCHAR(100),
    fechaNacimiento DATE NOT NULL,
    genero CHAR(1) CHECK (genero IN ('M', 'F', 'O')),
    estadoCivil VARCHAR(20),
    fotografia TEXT,
    idTipoDocumento INT REFERENCES personas.TipoDocumentoIdentidad(idTipoDocumento),
    numeroDocumento VARCHAR(50) UNIQUE,
    idDireccion INT REFERENCES personas.Direccion(idDireccion),
    idContacto INT REFERENCES personas.Contacto(idContacto),
    activo BOOLEAN DEFAULT TRUE,
    fechaRegistro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==============================================
-- SCHEMA: ACADEMICO
-- ==============================================
CREATE TABLE academico.Facultad (
    idFacultad SERIAL PRIMARY KEY,
    nombre VARCHAR(200) NOT NULL UNIQUE,
    codigo VARCHAR(20) UNIQUE,
    decano VARCHAR(200),
    fechaFundacion DATE,
    activo BOOLEAN DEFAULT TRUE
);

CREATE TABLE academico.Escuela (
    idEscuela SERIAL PRIMARY KEY,
    nombre VARCHAR(200) NOT NULL UNIQUE,
    codigo VARCHAR(20) UNIQUE,
    director VARCHAR(200),
    idFacultad INT NOT NULL REFERENCES academico.Facultad(idFacultad) ON DELETE RESTRICT,
    activo BOOLEAN DEFAULT TRUE
);

CREATE TABLE academico.Carrera (
    idCarrera SERIAL PRIMARY KEY,
    nombre VARCHAR(200) NOT NULL UNIQUE,
    codigo VARCHAR(20) UNIQUE,
    tituloOtorgado VARCHAR(200),
    modalidad VARCHAR(50) CHECK (modalidad IN ('PRESENCIAL', 'VIRTUAL', 'HIBRIDA')),
    duracionAnios DECIMAL(3,1),
    totalUV INT,
    idEscuela INT NOT NULL REFERENCES academico.Escuela(idEscuela) ON DELETE RESTRICT,
    activo BOOLEAN DEFAULT TRUE
);

CREATE TABLE academico.PlanEstudio (
    idPlanEstudio SERIAL PRIMARY KEY,
    codigo VARCHAR(20) UNIQUE NOT NULL,
    nombre VARCHAR(200) NOT NULL,
    añoVigencia INT NOT NULL,
    resolucion VARCHAR(100),
    fechaAprobacion DATE,
    idCarrera INT NOT NULL REFERENCES academico.Carrera(idCarrera) ON DELETE CASCADE,
    activo BOOLEAN DEFAULT TRUE,
    UNIQUE(codigo, idCarrera)
);

CREATE TABLE academico.AreaConocimiento (
    idArea SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    descripcion TEXT,
    idAreaPadre INT REFERENCES academico.AreaConocimiento(idArea),
    activo BOOLEAN DEFAULT TRUE
);

CREATE TABLE academico.Materia (
    idMateria SERIAL PRIMARY KEY,
    codigo VARCHAR(20) NOT NULL UNIQUE,
    nombre VARCHAR(200) NOT NULL,
    descripcion TEXT,
    unidadesValorativas INT NOT NULL CHECK (unidadesValorativas > 0),
    horasTeoricas INT DEFAULT 0,
    horasPracticas INT DEFAULT 0,
    horasLaboratorio INT DEFAULT 0,
    horasTotales INT GENERATED ALWAYS AS (horasTeoricas + horasPracticas + horasLaboratorio) STORED,
    tipo VARCHAR(50) CHECK (tipo IN ('OBLIGATORIA', 'OPTATIVA', 'LIBRE')) DEFAULT 'OBLIGATORIA',
    idArea INT REFERENCES academico.AreaConocimiento(idArea),
    requiereProyecto BOOLEAN DEFAULT FALSE,
    requierePractica BOOLEAN DEFAULT FALSE,
    activo BOOLEAN DEFAULT TRUE
);

CREATE TABLE academico.PlanMateria (
    idPlanMateria SERIAL PRIMARY KEY,
    idPlanEstudio INT NOT NULL REFERENCES academico.PlanEstudio(idPlanEstudio) ON DELETE CASCADE,
    idMateria INT NOT NULL REFERENCES academico.Materia(idMateria) ON DELETE CASCADE,
    ciclo INT NOT NULL CHECK (ciclo > 0),
    semestre INT CHECK (semestre IN (1, 2)),
    esObligatoria BOOLEAN DEFAULT TRUE,
    UNIQUE(idPlanEstudio, idMateria)
);

CREATE TABLE academico.Prerrequisito (
    idPrerrequisito SERIAL PRIMARY KEY,
    idPlanMateria INT NOT NULL REFERENCES academico.PlanMateria(idPlanMateria) ON DELETE CASCADE,
    idMateriaRequerida INT NOT NULL REFERENCES academico.Materia(idMateria) ON DELETE CASCADE,
    tipoRequisito VARCHAR(50) DEFAULT 'OBLIGATORIO',
    notaMinima DECIMAL(5,2) DEFAULT 6.0,
    UNIQUE(idPlanMateria, idMateriaRequerida)
);

CREATE TABLE academico.PeriodoAcademico (
    idPeriodo SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    año INT NOT NULL,
    numeroPeriodo INT NOT NULL CHECK (numeroPeriodo IN (1, 2, 3)),
    fechaInicio DATE NOT NULL,
    fechaFin DATE NOT NULL,
    fechaInicioInscripciones DATE,
    fechaFinInscripciones DATE,
    fechaInicioRetiros DATE,
    fechaFinRetiros DATE,
    fechaMaximaSubirNotas DATE,
    estado VARCHAR(50) DEFAULT 'PLANIFICADO',
    activo BOOLEAN DEFAULT TRUE,
    CONSTRAINT fechas_validas CHECK (fechaFin > fechaInicio),
    UNIQUE(año, numeroPeriodo)
);

-- ==============================================
-- SCHEMA: DOCENTES
-- ==============================================
CREATE TABLE docentes.CategoriaDocente (
    idCategoria SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    descripcion VARCHAR(255),
    nivelJerarquico INT DEFAULT 0,
    activo BOOLEAN DEFAULT TRUE
);

CREATE TABLE docentes.TipoContrato (
    idTipoContrato SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    descripcion VARCHAR(255),
    horasMinimas INT DEFAULT 0,
    horasMaximas INT,
    activo BOOLEAN DEFAULT TRUE
);

CREATE TABLE docentes.TituloAcademico (
    idTitulo SERIAL PRIMARY KEY,
    nombre VARCHAR(200) NOT NULL,
    nivel VARCHAR(50) CHECK (nivel IN ('PREGRADO', 'POSTGRADO', 'DOCTORADO')),
    institucion VARCHAR(200),
    pais VARCHAR(100),
    añoObtencion INT,
    activo BOOLEAN DEFAULT TRUE
);

CREATE TABLE docentes.Docente (
    idDocente SERIAL PRIMARY KEY,
    idPersona INT NOT NULL UNIQUE REFERENCES personas.Persona(idPersona) ON DELETE RESTRICT,
    codigoDocente VARCHAR(50) UNIQUE NOT NULL,
    fechaIngreso DATE NOT NULL,
    idCategoria INT REFERENCES docentes.CategoriaDocente(idCategoria),
    idTipoContrato INT REFERENCES docentes.TipoContrato(idTipoContrato),
    especialidad VARCHAR(200),
    tituloPregrado VARCHAR(200),
    tituloPostgrado VARCHAR(200),
    horasAsignadas INT DEFAULT 0,
    disponibleParaTutorias BOOLEAN DEFAULT TRUE,
    idUsuario INT UNIQUE REFERENCES seguridad.Usuario(idUsuario) ON DELETE SET NULL,
    activo BOOLEAN DEFAULT TRUE
);

CREATE TABLE docentes.DocenteTitulo (
    idDocenteTitulo SERIAL PRIMARY KEY,
    idDocente INT NOT NULL REFERENCES docentes.Docente(idDocente) ON DELETE CASCADE,
    idTitulo INT NOT NULL REFERENCES docentes.TituloAcademico(idTitulo) ON DELETE CASCADE,
    fechaObtencion DATE,
    numeroRegistro VARCHAR(100),
    UNIQUE(idDocente, idTitulo)
);

CREATE TABLE docentes.DisponibilidadHoraria (
    idDisponibilidad SERIAL PRIMARY KEY,
    idDocente INT NOT NULL REFERENCES docentes.Docente(idDocente) ON DELETE CASCADE,
    diaSemana INT CHECK (diaSemana BETWEEN 1 AND 7),
    horaInicio TIME NOT NULL,
    horaFin TIME NOT NULL,
    tipo VARCHAR(50) DEFAULT 'CLASES',
    idPeriodo INT REFERENCES academico.PeriodoAcademico(idPeriodo) ON DELETE CASCADE
);

CREATE TABLE docentes.EvaluacionDocente (
    idEvaluacion SERIAL PRIMARY KEY,
    idDocente INT NOT NULL REFERENCES docentes.Docente(idDocente) ON DELETE CASCADE,
    idPeriodo INT NOT NULL REFERENCES academico.PeriodoAcademico(idPeriodo) ON DELETE CASCADE,
    fechaEvaluacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    promedioEstudiantes DECIMAL(3,2),
    promedioDirector DECIMAL(3,2),
    promedioGeneral DECIMAL(3,2),
    comentarios TEXT,
    UNIQUE(idDocente, idPeriodo)
);

-- ==============================================
-- SCHEMA: CONFIGURACION (NUEVO - NOTAS)
-- ==============================================
CREATE TABLE configuracion.periodos_notas (
    idPeriodo INT PRIMARY KEY,
    nombreperiodo VARCHAR(100),
    fechaInicio DATE,
    fechaFin DATE,
    activo BOOLEAN DEFAULT TRUE
);

CREATE TABLE configuracion.permisos_edicion (
    idPermiso SERIAL PRIMARY KEY,
    idCatedratico INT NOT NULL REFERENCES docentes.Docente(idDocente) ON DELETE CASCADE,
    idMateria INT NOT NULL REFERENCES academico.Materia(idMateria) ON DELETE CASCADE,
    idGrupo INT NOT NULL REFERENCES grupos.Grupo(idGrupo) ON DELETE CASCADE,
    puedeEditarNota1 BOOLEAN DEFAULT FALSE,
    puedeEditarNota2 BOOLEAN DEFAULT FALSE,
    puedeEditarNota3 BOOLEAN DEFAULT FALSE,
    editadoNota1 BOOLEAN DEFAULT FALSE,
    editadoNota2 BOOLEAN DEFAULT FALSE,
    editadoNota3 BOOLEAN DEFAULT FALSE,
    habilitadoPor INT REFERENCES seguridad.Usuario(idUsuario) ON DELETE SET NULL
);

-- ==============================================
-- SCHEMA: ESTUDIANTES
-- ==============================================
CREATE TABLE estudiantes.TipoIngreso (
    idTipoIngreso SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    descripcion VARCHAR(255),
    activo BOOLEAN DEFAULT TRUE
);

CREATE TABLE estudiantes.EstadoEstudiante (
    idEstado SERIAL PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL UNIQUE,
    descripcion VARCHAR(255),
    activo BOOLEAN DEFAULT TRUE
);

CREATE TABLE estudiantes.Estudiante (
    idEstudiante SERIAL PRIMARY KEY,
    idPersona INT NOT NULL UNIQUE REFERENCES personas.Persona(idPersona) ON DELETE RESTRICT,
    expediente VARCHAR(20) NOT NULL UNIQUE,
    fechaIngreso DATE NOT NULL,
    idCarrera INT NOT NULL REFERENCES academico.Carrera(idCarrera),
    idPlanEstudio INT NOT NULL REFERENCES academico.PlanEstudio(idPlanEstudio),
    idEstado INT NOT NULL REFERENCES estudiantes.EstadoEstudiante(idEstado),
    idTipoIngreso INT REFERENCES estudiantes.TipoIngreso(idTipoIngreso),
    colegioProcedencia VARCHAR(200),
    añoEgresoColegio INT,
    promedioIngreso DECIMAL(5,2),
    cantidadMateriasAprobadas INT DEFAULT 0,
    cantidadMateriasReprobadas INT DEFAULT 0,
    indiceGlobal DECIMAL(5,2),
    indicePeriodo DECIMAL(5,2),
    creditosAcumulados INT DEFAULT 0,
    creditosTotales INT,
    porcentajeAvance DECIMAL(5,2),
    idUsuario INT UNIQUE REFERENCES seguridad.Usuario(idUsuario) ON DELETE SET NULL,
    activo BOOLEAN DEFAULT TRUE
);

CREATE TABLE estudiantes.HistoricoAcademico (
    idHistorico SERIAL PRIMARY KEY,
    idEstudiante INT NOT NULL REFERENCES estudiantes.Estudiante(idEstudiante) ON DELETE CASCADE,
    idPeriodo INT NOT NULL REFERENCES academico.PeriodoAcademico(idPeriodo) ON DELETE CASCADE,
    materiasInscritas INT DEFAULT 0,
    materiasAprobadas INT DEFAULT 0,
    materiasReprobadas INT DEFAULT 0,
    indicePeriodo DECIMAL(5,2),
    creditosGanados INT DEFAULT 0,
    observaciones TEXT,
    UNIQUE(idEstudiante, idPeriodo)
);

CREATE TABLE estudiantes.Beca (
    idBeca SERIAL PRIMARY KEY,
    nombre VARCHAR(200) NOT NULL UNIQUE,
    tipo VARCHAR(100),
    porcentajeCobertura INT CHECK (porcentajeCobertura BETWEEN 0 AND 100),
    requisitos TEXT,
    activo BOOLEAN DEFAULT TRUE
);

CREATE TABLE estudiantes.EstudianteBeca (
    idEstudianteBeca SERIAL PRIMARY KEY,
    idEstudiante INT NOT NULL REFERENCES estudiantes.Estudiante(idEstudiante) ON DELETE CASCADE,
    idBeca INT NOT NULL REFERENCES estudiantes.Beca(idBeca) ON DELETE RESTRICT,
    fechaAsignacion DATE NOT NULL,
    fechaVencimiento DATE,
    activa BOOLEAN DEFAULT TRUE,
    motivoSuspension TEXT,
    UNIQUE(idEstudiante, idBeca, fechaAsignacion)
);

CREATE TABLE estudiantes.DocumentoEstudiante (
    idDocumento SERIAL PRIMARY KEY,
    idEstudiante INT NOT NULL REFERENCES estudiantes.Estudiante(idEstudiante) ON DELETE CASCADE,
    tipo VARCHAR(100) NOT NULL,
    nombreArchivo VARCHAR(255),
    rutaArchivo TEXT,
    fechaSubida TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    valido BOOLEAN DEFAULT FALSE
);

CREATE TABLE estudiantes.Tutor (
    idTutor SERIAL PRIMARY KEY,
    idPersona INT NOT NULL UNIQUE REFERENCES personas.Persona(idPersona) ON DELETE RESTRICT,
    parentesco VARCHAR(50),
    esResponsableEconomico BOOLEAN DEFAULT FALSE,
    activo BOOLEAN DEFAULT TRUE
);

CREATE TABLE estudiantes.EstudianteTutor (
    idEstudianteTutor SERIAL PRIMARY KEY,
    idEstudiante INT NOT NULL REFERENCES estudiantes.Estudiante(idEstudiante) ON DELETE CASCADE,
    idTutor INT NOT NULL REFERENCES estudiantes.Tutor(idTutor) ON DELETE CASCADE,
    esEmergencia BOOLEAN DEFAULT FALSE,
    UNIQUE(idEstudiante, idTutor)
);

-- ==============================================
-- SCHEMA: GRUPOS
-- ==============================================
CREATE TABLE grupos.Edificio (
    idEdificio SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    direccion TEXT,
    activo BOOLEAN DEFAULT TRUE
);

CREATE TABLE grupos.Salon (
    idSalon SERIAL PRIMARY KEY,
    codigo VARCHAR(20) UNIQUE NOT NULL,
    nombre VARCHAR(100),
    capacidad INT NOT NULL CHECK (capacidad > 0),
    tipo VARCHAR(50) CHECK (tipo IN ('AULA', 'LABORATORIO', 'TALLER', 'AUDITORIO')),
    equipamiento TEXT,
    ubicacion VARCHAR(200),
    idEdificio INT REFERENCES grupos.Edificio(idEdificio),
    disponible BOOLEAN DEFAULT TRUE
);

CREATE TABLE grupos.ModalidadGrupo (
    idModalidad SERIAL PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL UNIQUE,
    descripcion VARCHAR(255)
);

CREATE TABLE grupos.Horario (
    idHorario SERIAL PRIMARY KEY,
    diaSemana INT CHECK (diaSemana BETWEEN 1 AND 7),
    horaInicio TIME NOT NULL,
    horaFin TIME NOT NULL,
    tipo VARCHAR(50) DEFAULT 'TEORIA',
    CONSTRAINT hora_valida CHECK (horaFin > horaInicio)
);

CREATE TABLE grupos.Grupo (
    idGrupo SERIAL PRIMARY KEY,
    codigo VARCHAR(50) NOT NULL,
    numeroGrupo INT NOT NULL,
    cupoMaximo INT NOT NULL CHECK (cupoMaximo > 0),
    cupoActual INT DEFAULT 0,
    idMateria INT NOT NULL REFERENCES academico.Materia(idMateria) ON DELETE RESTRICT,
    idDocente INT NOT NULL REFERENCES docentes.Docente(idDocente) ON DELETE RESTRICT,
    idPeriodo INT NOT NULL REFERENCES academico.PeriodoAcademico(idPeriodo) ON DELETE CASCADE,
    idModalidad INT REFERENCES grupos.ModalidadGrupo(idModalidad),
    enlaceClaseVirtual VARCHAR(500),
    observaciones TEXT,
    estado VARCHAR(50) DEFAULT 'ACTIVO',
    UNIQUE(idMateria, idPeriodo, numeroGrupo)
);

CREATE TABLE grupos.GrupoHorario (
    idGrupoHorario SERIAL PRIMARY KEY,
    idGrupo INT NOT NULL REFERENCES grupos.Grupo(idGrupo) ON DELETE CASCADE,
    idHorario INT NOT NULL REFERENCES grupos.Horario(idHorario) ON DELETE CASCADE,
    idSalon INT REFERENCES grupos.Salon(idSalon) ON DELETE SET NULL,
    UNIQUE(idGrupo, idHorario)
);

CREATE TABLE grupos.GrupoDocenteAuxiliar (
    idGrupoDocente SERIAL PRIMARY KEY,
    idGrupo INT NOT NULL REFERENCES grupos.Grupo(idGrupo) ON DELETE CASCADE,
    idDocente INT NOT NULL REFERENCES docentes.Docente(idDocente) ON DELETE CASCADE,
    rol VARCHAR(50) CHECK (rol IN ('TITULAR', 'AUXILIAR', 'LABORATORISTA')),
    horasAsignadas INT,
    UNIQUE(idGrupo, idDocente, rol)
);

-- ==============================================
-- SCHEMA: INSCRIPCIONES
-- ==============================================
CREATE TABLE inscripciones.Preinscripcion (
    idPreinscripcion SERIAL PRIMARY KEY,
    idEstudiante INT NOT NULL REFERENCES estudiantes.Estudiante(idEstudiante) ON DELETE CASCADE,
    idPeriodo INT NOT NULL REFERENCES academico.PeriodoAcademico(idPeriodo) ON DELETE CASCADE,
    fechaPreinscripcion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    estado VARCHAR(50) DEFAULT 'PENDIENTE',
    observaciones TEXT,
    UNIQUE(idEstudiante, idPeriodo)
);

CREATE TABLE inscripciones.Inscripcion (
    idInscripcion SERIAL PRIMARY KEY,
    idEstudiante INT NOT NULL REFERENCES estudiantes.Estudiante(idEstudiante) ON DELETE CASCADE,
    idGrupo INT NOT NULL REFERENCES grupos.Grupo(idGrupo) ON DELETE CASCADE,
    fechaInscripcion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    tipoInscripcion VARCHAR(50) DEFAULT 'REGULAR',
    estado VARCHAR(50) DEFAULT 'INSCRITO',
    fechaRetiro TIMESTAMP,
    motivoRetiro TEXT,
    UNIQUE(idEstudiante, idGrupo)
);

CREATE TABLE inscripciones.InscripcionHistorial (
    idHistorial SERIAL PRIMARY KEY,
    idInscripcion INT NOT NULL REFERENCES inscripciones.Inscripcion(idInscripcion) ON DELETE CASCADE,
    estadoAnterior VARCHAR(50),
    estadoNuevo VARCHAR(50),
    fechaCambio TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    motivo TEXT,
    idUsuario INT REFERENCES seguridad.Usuario(idUsuario) ON DELETE SET NULL
);

CREATE TABLE inscripciones.ListaEspera (
    idListaEspera SERIAL PRIMARY KEY,
    idEstudiante INT NOT NULL REFERENCES estudiantes.Estudiante(idEstudiante) ON DELETE CASCADE,
    idGrupo INT NOT NULL REFERENCES grupos.Grupo(idGrupo) ON DELETE CASCADE,
    posicion INT NOT NULL,
    fechaSolicitud TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    notificado BOOLEAN DEFAULT FALSE,
    UNIQUE(idGrupo, posicion)
);

CREATE TABLE inscripciones.CargaAcademica (
    idCarga SERIAL PRIMARY KEY,
    idEstudiante INT NOT NULL REFERENCES estudiantes.Estudiante(idEstudiante) ON DELETE CASCADE,
    idPeriodo INT NOT NULL REFERENCES academico.PeriodoAcademico(idPeriodo) ON DELETE CASCADE,
    totalUV INT DEFAULT 0,
    cantidadMaterias INT DEFAULT 0,
    fechaCalculo TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(idEstudiante, idPeriodo)
);

-- ==============================================
-- SCHEMA: EVALUACIONES
-- ==============================================
CREATE TABLE evaluaciones.TipoEvaluacion (
    idTipoEvaluacion SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    pesoPorDefecto DECIMAL(5,2),
    requiereRecuperacion BOOLEAN DEFAULT FALSE,
    activo BOOLEAN DEFAULT TRUE
);

CREATE TABLE evaluaciones.ActividadEvaluacion (
    idActividad SERIAL PRIMARY KEY,
    idGrupo INT NOT NULL REFERENCES grupos.Grupo(idGrupo) ON DELETE CASCADE,
    idTipoEvaluacion INT NOT NULL REFERENCES evaluaciones.TipoEvaluacion(idTipoEvaluacion),
    nombre VARCHAR(200) NOT NULL,
    descripcion TEXT,
    fechaRealizacion DATE,
    fechaEntrega DATE,
    pesoPorcentaje DECIMAL(5,2) NOT NULL CHECK (pesoPorcentaje > 0 AND pesoPorcentaje <= 100),
    publicado BOOLEAN DEFAULT FALSE
);

CREATE TABLE evaluaciones.Calificacion (
    idCalificacion SERIAL PRIMARY KEY,
    idActividad INT NOT NULL REFERENCES evaluaciones.ActividadEvaluacion(idActividad) ON DELETE CASCADE,
    idInscripcion INT NOT NULL REFERENCES inscripciones.Inscripcion(idInscripcion) ON DELETE CASCADE,
    nota DECIMAL(5,2) CHECK (nota >= 0 AND nota <= 10),
    fechaCalificacion TIMESTAMP,
    retroalimentacion TEXT,
    calificadoPor INT REFERENCES docentes.Docente(idDocente) ON DELETE SET NULL,
    publicado BOOLEAN DEFAULT FALSE,
    UNIQUE(idActividad, idInscripcion)
);

CREATE TABLE evaluaciones.NotaFinal (
    idNotaFinal SERIAL PRIMARY KEY,
    idInscripcion INT NOT NULL UNIQUE REFERENCES inscripciones.Inscripcion(idInscripcion) ON DELETE CASCADE,
    nota1 DECIMAL(5,2),
    nota2 DECIMAL(5,2),
    nota3 DECIMAL(5,2),
    nota4 DECIMAL(5,2),
    nota5 DECIMAL(5,2),
    notaRecuperacion DECIMAL(5,2),
    notaPromedio DECIMAL(5,2),
    notaFinal DECIMAL(5,2),
    letraCalificacion CHAR(2),
    estado VARCHAR(50) CHECK (estado IN ('APROBADO', 'REPROBADO', 'RETIRADO')),
    fechaRegistro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    registradoPor INT REFERENCES docentes.Docente(idDocente) ON DELETE SET NULL
);

CREATE TABLE evaluaciones.Recuperacion (
    idRecuperacion SERIAL PRIMARY KEY,
    idInscripcion INT NOT NULL UNIQUE REFERENCES inscripciones.Inscripcion(idInscripcion) ON DELETE CASCADE,
    fechaSolicitud TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fechaAsignada DATE,
    notaObtenida DECIMAL(5,2),
    estado VARCHAR(50) DEFAULT 'PENDIENTE'
);

-- ==============================================
-- SCHEMA: ASISTENCIA
-- ==============================================
CREATE TABLE asistencia.TipoAsistencia (
    idTipoAsistencia SERIAL PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL UNIQUE,
    valorPorDefecto DECIMAL(5,2) DEFAULT 100,
    activo BOOLEAN DEFAULT TRUE
);

CREATE TABLE asistencia.Asistencia (
    idAsistencia SERIAL PRIMARY KEY,
    idInscripcion INT NOT NULL REFERENCES inscripciones.Inscripcion(idInscripcion) ON DELETE CASCADE,
    idGrupoHorario INT NOT NULL REFERENCES grupos.GrupoHorario(idGrupoHorario) ON DELETE CASCADE,
    fecha DATE NOT NULL,
    idTipoAsistencia INT REFERENCES asistencia.TipoAsistencia(idTipoAsistencia),
    observaciones TEXT,
    registradoPor INT REFERENCES docentes.Docente(idDocente) ON DELETE SET NULL,
    horaRegistro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(idInscripcion, idGrupoHorario, fecha)
);

CREATE TABLE asistencia.Justificacion (
    idJustificacion SERIAL PRIMARY KEY,
    idAsistencia INT NOT NULL UNIQUE REFERENCES asistencia.Asistencia(idAsistencia) ON DELETE CASCADE,
    motivo TEXT NOT NULL,
    documentoSoporte TEXT,
    fechaSolicitud TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    aprobado BOOLEAN,
    aprobadoPor INT REFERENCES docentes.Docente(idDocente) ON DELETE SET NULL
);

CREATE TABLE asistencia.ResumenAsistencia (
    idResumen SERIAL PRIMARY KEY,
    idInscripcion INT NOT NULL UNIQUE REFERENCES inscripciones.Inscripcion(idInscripcion) ON DELETE CASCADE,
    totalClases INT DEFAULT 0,
    asistencias INT DEFAULT 0,
    ausencias INT DEFAULT 0,
    tardias INT DEFAULT 0,
    justificadas INT DEFAULT 0,
    porcentajeAsistencia DECIMAL(5,2),
    fechaCalculo TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==============================================
-- SCHEMA: PAGOS
-- ==============================================
CREATE TABLE pagos.ConceptoPago (
    idConcepto SERIAL PRIMARY KEY,
    nombre VARCHAR(200) NOT NULL UNIQUE,
    descripcion TEXT,
    monto DECIMAL(10,2) NOT NULL CHECK (monto >= 0),
    tipo VARCHAR(50) CHECK (tipo IN ('MATRICULA', 'COLEGIATURA', 'DERECHO', 'MULTA')),
    periodicidad VARCHAR(50) CHECK (periodicidad IN ('UNICO', 'MENSUAL', 'SEMESTRAL', 'ANUAL')),
    aplicaBeca BOOLEAN DEFAULT TRUE,
    activo BOOLEAN DEFAULT TRUE
);

CREATE TABLE pagos.Descuento (
    idDescuento SERIAL PRIMARY KEY,
    nombre VARCHAR(200) NOT NULL UNIQUE,
    tipo VARCHAR(50) CHECK (tipo IN ('PORCENTAJE', 'MONTO FIJO')),
    valor DECIMAL(10,2) NOT NULL CHECK (valor >= 0),
    descripcion TEXT,
    activo BOOLEAN DEFAULT TRUE
);

-- [CORRECCIÓN APLICADA AQUI] Se agregó la columna "pagado"
CREATE TABLE pagos.Factura (
    idFactura SERIAL PRIMARY KEY,
    numeroFactura VARCHAR(50) UNIQUE NOT NULL,
    idEstudiante INT NOT NULL REFERENCES estudiantes.Estudiante(idEstudiante) ON DELETE RESTRICT,
    fechaEmision DATE NOT NULL,
    fechaVencimiento DATE NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL CHECK (subtotal >= 0),
    descuento DECIMAL(10,2) DEFAULT 0 CHECK (descuento >= 0),
    total DECIMAL(10,2) NOT NULL CHECK (total >= 0),
    pagado DECIMAL(10,2) DEFAULT 0 CHECK (pagado >= 0), 
    estado VARCHAR(50) DEFAULT 'PENDIENTE',
    idPeriodo INT REFERENCES academico.PeriodoAcademico(idPeriodo)
);

CREATE TABLE pagos.DetalleFactura (
    idDetalle SERIAL PRIMARY KEY,
    idFactura INT NOT NULL REFERENCES pagos.Factura(idFactura) ON DELETE CASCADE,
    idConcepto INT NOT NULL REFERENCES pagos.ConceptoPago(idConcepto),
    cantidad INT DEFAULT 1 CHECK (cantidad > 0),
    precioUnitario DECIMAL(10,2) NOT NULL CHECK (precioUnitario >= 0),
    descuentoAplicado DECIMAL(10,2) DEFAULT 0 CHECK (descuentoAplicado >= 0),
    subtotal DECIMAL(10,2) NOT NULL CHECK (subtotal >= 0)
);

CREATE TABLE pagos.Pago (
    idPago SERIAL PRIMARY KEY,
    idFactura INT NOT NULL REFERENCES pagos.Factura(idFactura) ON DELETE CASCADE,
    monto DECIMAL(10,2) NOT NULL CHECK (monto > 0),
    fechaPago TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    metodoPago VARCHAR(50) CHECK (metodoPago IN ('EFECTIVO', 'TARJETA', 'TRANSFERENCIA', 'CHEQUE')),
    referencia VARCHAR(100),
    estado VARCHAR(50) DEFAULT 'COMPLETADO'
);

CREATE TABLE pagos.BecaDescuento (
    idBecaDescuento SERIAL PRIMARY KEY,
    idEstudiante INT NOT NULL REFERENCES estudiantes.Estudiante(idEstudiante) ON DELETE CASCADE,
    idDescuento INT NOT NULL REFERENCES pagos.Descuento(idDescuento),
    idFactura INT REFERENCES pagos.Factura(idFactura) ON DELETE CASCADE,
    fechaAplicacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    montoAplicado DECIMAL(10,2)
);

-- ==============================================
-- SCHEMA: PROYECTOS
-- ==============================================
CREATE TABLE proyectos.TipoProyecto (
    idTipoProyecto SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    descripcion TEXT,
    activo BOOLEAN DEFAULT TRUE
);

CREATE TABLE proyectos.Proyecto (
    idProyecto SERIAL PRIMARY KEY,
    titulo VARCHAR(500) NOT NULL,
    descripcion TEXT,
    idTipoProyecto INT REFERENCES proyectos.TipoProyecto(idTipoProyecto),
    fechaInicio DATE,
    fechaFin DATE,
    estado VARCHAR(50) DEFAULT 'EN CURSO',
    activo BOOLEAN DEFAULT TRUE
);

CREATE TABLE proyectos.EstudianteProyecto (
    idEstudianteProyecto SERIAL PRIMARY KEY,
    idProyecto INT NOT NULL REFERENCES proyectos.Proyecto(idProyecto) ON DELETE CASCADE,
    idEstudiante INT NOT NULL REFERENCES estudiantes.Estudiante(idEstudiante) ON DELETE CASCADE,
    rol VARCHAR(50) DEFAULT 'TESISTA',
    fechaAsignacion DATE,
    UNIQUE(idProyecto, idEstudiante)
);

CREATE TABLE proyectos.AsesorProyecto (
    idAsesorProyecto SERIAL PRIMARY KEY,
    idProyecto INT NOT NULL REFERENCES proyectos.Proyecto(idProyecto) ON DELETE CASCADE,
    idDocente INT NOT NULL REFERENCES docentes.Docente(idDocente) ON DELETE CASCADE,
    tipo VARCHAR(50) CHECK (tipo IN ('TUTOR', 'COTUTOR', 'ASESOR')),
    fechaAsignacion DATE,
    UNIQUE(idProyecto, idDocente, tipo)
);

-- ==============================================
-- SCHEMA: EXTENSION
-- ==============================================
CREATE TABLE extension.TipoActividad (
    idTipoActividad SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    creditosEquivalentes INT DEFAULT 0,
    activo BOOLEAN DEFAULT TRUE
);

CREATE TABLE extension.Actividad (
    idActividad SERIAL PRIMARY KEY,
    nombre VARCHAR(200) NOT NULL,
    descripcion TEXT,
    idTipoActividad INT REFERENCES extension.TipoActividad(idTipoActividad),
    fechaInicio DATE,
    fechaFin DATE,
    cupoMaximo INT,
    creditosOtorgados INT DEFAULT 0,
    organizador VARCHAR(200),
    activo BOOLEAN DEFAULT TRUE
);

CREATE TABLE extension.ParticipacionActividad (
    idParticipacion SERIAL PRIMARY KEY,
    idActividad INT NOT NULL REFERENCES extension.Actividad(idActividad) ON DELETE CASCADE,
    idEstudiante INT NOT NULL REFERENCES estudiantes.Estudiante(idEstudiante) ON DELETE CASCADE,
    fechaInscripcion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    asistencia BOOLEAN,
    calificacion DECIMAL(5,2),
    creditosObtenidos INT DEFAULT 0,
    UNIQUE(idActividad, idEstudiante)
);

-- ==============================================
-- ÍNDICES PARA RENDIMIENTO
-- ==============================================
CREATE INDEX idx_usuario_correo ON seguridad.Usuario(correo);
CREATE INDEX idx_usuario_rol ON seguridad.Usuario(idRol);
CREATE INDEX idx_persona_nombre ON personas.Persona(primerNombre, primerApellido);
CREATE INDEX idx_persona_documento ON personas.Persona(numeroDocumento);
CREATE INDEX idx_estudiante_expediente ON estudiantes.Estudiante(expediente);
CREATE INDEX idx_estudiante_carrera ON estudiantes.Estudiante(idCarrera);
CREATE INDEX idx_docente_codigo ON docentes.Docente(codigoDocente);
CREATE INDEX idx_inscripcion_estudiante ON inscripciones.Inscripcion(idEstudiante);
CREATE INDEX idx_inscripcion_grupo ON inscripciones.Inscripcion(idGrupo);
CREATE INDEX idx_grupo_materia ON grupos.Grupo(idMateria);
CREATE INDEX idx_grupo_docente ON grupos.Grupo(idDocente);
CREATE INDEX idx_grupo_periodo ON grupos.Grupo(idPeriodo);
CREATE INDEX idx_notafinal_inscripcion ON evaluaciones.NotaFinal(idInscripcion);
CREATE INDEX idx_calificacion_actividad ON evaluaciones.Calificacion(idActividad);
CREATE INDEX idx_asistencia_fecha ON asistencia.Asistencia(fecha);
CREATE INDEX idx_factura_estudiante ON pagos.Factura(idEstudiante);
CREATE INDEX idx_inscripcion_estudiante_grupo ON inscripciones.Inscripcion(idEstudiante, idGrupo);
CREATE INDEX idx_notafinal_estudiante ON evaluaciones.NotaFinal(idInscripcion);
CREATE INDEX idx_grupo_materia_periodo ON grupos.Grupo(idMateria, idPeriodo);

-- ==============================================
-- CONSTRAINTS ADICIONALES
-- ==============================================
ALTER TABLE evaluaciones.NotaFinal
ADD CONSTRAINT check_nota_final 
CHECK (notaFinal BETWEEN 0 AND 10);

-- ==============================================
-- FUNCIONES Y TRIGGERS
-- ==============================================

-- 1. Auditoría
CREATE OR REPLACE FUNCTION auditoria_general()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO seguridad.Auditoria(tabla, accion, datosNuevos)
    VALUES (TG_TABLE_NAME, TG_OP, row_to_json(NEW));
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 2. Actualizar cupo del grupo
CREATE OR REPLACE FUNCTION actualizar_cupo_grupo()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE grupos.Grupo SET cupoActual = cupoActual + 1 WHERE idGrupo = NEW.idGrupo;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE grupos.Grupo SET cupoActual = cupoActual - 1 WHERE idGrupo = OLD.idGrupo;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_actualizar_cupo_grupo
AFTER INSERT OR DELETE ON inscripciones.Inscripcion
FOR EACH ROW EXECUTE FUNCTION actualizar_cupo_grupo();

-- 3. Calcular nota final
CREATE OR REPLACE FUNCTION calcular_nota_final()
RETURNS TRIGGER AS $$
DECLARE
    suma_ponderada DECIMAL(5,2);
    peso_total DECIMAL(5,2);
BEGIN
    SELECT SUM(c.nota * a.pesoPorcentaje / 100), SUM(a.pesoPorcentaje)
    INTO suma_ponderada, peso_total
    FROM evaluaciones.Calificacion c
    JOIN evaluaciones.ActividadEvaluacion a ON c.idActividad = a.idActividad
    WHERE c.idInscripcion = NEW.idInscripcion AND c.publicado = TRUE;
    
    IF peso_total > 0 THEN
        UPDATE evaluaciones.NotaFinal 
        SET notaPromedio = suma_ponderada, notaFinal = suma_ponderada, fechaRegistro = CURRENT_TIMESTAMP
        WHERE idInscripcion = NEW.idInscripcion;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_calcular_nota_final
AFTER INSERT OR UPDATE ON evaluaciones.Calificacion
FOR EACH ROW WHEN (NEW.publicado = TRUE)
EXECUTE FUNCTION calcular_nota_final();

-- 4. Validar cupo
CREATE OR REPLACE FUNCTION validar_cupo()
RETURNS TRIGGER AS $$
DECLARE cupo_actual INT; cupo_max INT;
BEGIN
    SELECT cupoActual, cupoMaximo INTO cupo_actual, cupo_max FROM grupos.Grupo WHERE idGrupo = NEW.idGrupo;
    IF cupo_actual >= cupo_max THEN RAISE EXCEPTION 'No hay cupo disponible en este grupo'; END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_validar_cupo
BEFORE INSERT ON inscripciones.Inscripcion
FOR EACH ROW EXECUTE FUNCTION validar_cupo();

-- 5. Actualizar Histórico
CREATE OR REPLACE FUNCTION actualizar_historico()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO estudiantes.HistoricoAcademico (idEstudiante, idPeriodo, materiasInscritas)
    VALUES (NEW.idEstudiante, (SELECT idPeriodo FROM grupos.Grupo WHERE idGrupo = NEW.idGrupo), 1)
    ON CONFLICT (idEstudiante, idPeriodo)
    DO UPDATE SET materiasInscritas = estudiantes.HistoricoAcademico.materiasInscritas + 1;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_historico
AFTER INSERT ON inscripciones.Inscripcion
FOR EACH ROW EXECUTE FUNCTION actualizar_historico();

-- 6. Calcular estado de nota
CREATE OR REPLACE FUNCTION calcular_estado_nota()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.notaFinal >= 6 THEN
        NEW.estado := 'APROBADO';
    ELSE
        NEW.estado := 'REPROBADO';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_estado_nota
BEFORE INSERT OR UPDATE ON evaluaciones.NotaFinal
FOR EACH ROW EXECUTE FUNCTION calcular_estado_nota();

-- 7. Calcular total factura
CREATE OR REPLACE FUNCTION calcular_total_factura()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE pagos.Factura SET total = subtotal - descuento WHERE idFactura = NEW.idFactura;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_total_factura
AFTER INSERT OR UPDATE ON pagos.DetalleFactura
FOR EACH ROW EXECUTE FUNCTION calcular_total_factura();

-- 8. Actualizar resumen asistencia
CREATE OR REPLACE FUNCTION actualizar_resumen_asistencia()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO asistencia.ResumenAsistencia (idInscripcion, totalClases, asistencias)
    VALUES (NEW.idInscripcion, 1, CASE WHEN NEW.idTipoAsistencia = 1 THEN 1 ELSE 0 END)
    ON CONFLICT (idInscripcion)
    DO UPDATE SET
        totalClases = asistencia.ResumenAsistencia.totalClases + 1,
        asistencias = asistencia.ResumenAsistencia.asistencias + CASE WHEN NEW.idTipoAsistencia = 1 THEN 1 ELSE 0 END;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_asistencia
AFTER INSERT ON asistencia.Asistencia
FOR EACH ROW EXECUTE FUNCTION actualizar_resumen_asistencia();

-- 9. Validar prerrequisitos
CREATE OR REPLACE FUNCTION validar_prerrequisitos()
RETURNS TRIGGER AS $$
DECLARE
    requisito RECORD;
    aprobado BOOLEAN;
    materia_actual INT;
BEGIN
    SELECT idMateria INTO materia_actual FROM grupos.Grupo WHERE idGrupo = NEW.idGrupo;

    FOR requisito IN
        SELECT pr.idMateriaRequerida 
        FROM academico.Prerrequisito pr
        JOIN academico.PlanMateria pm ON pr.idPlanMateria = pm.idPlanMateria
        WHERE pm.idMateria = materia_actual
    LOOP
        SELECT EXISTS (
            SELECT 1 FROM evaluaciones.NotaFinal nf
            JOIN inscripciones.Inscripcion i ON nf.idInscripcion = i.idInscripcion
            JOIN grupos.Grupo g ON i.idGrupo = g.idGrupo
            WHERE i.idEstudiante = NEW.idEstudiante 
            AND g.idMateria = requisito.idMateriaRequerida 
            AND nf.estado = 'APROBADO'
        ) INTO aprobado;

        IF NOT aprobado THEN
            RAISE EXCEPTION 'El estudiante % no cumple el prerrequisito %', NEW.idEstudiante, requisito.idMateriaRequerida;
        END IF;
    END LOOP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_validar_prerrequisitos
BEFORE INSERT ON inscripciones.Inscripcion
FOR EACH ROW EXECUTE FUNCTION validar_prerrequisitos();

-- 10. Validar periodo activo
CREATE OR REPLACE FUNCTION validar_periodo_activo()
RETURNS TRIGGER AS $$
DECLARE estado_periodo VARCHAR;
BEGIN
    SELECT p.estado INTO estado_periodo
    FROM academico.PeriodoAcademico p
    JOIN grupos.Grupo g ON g.idPeriodo = p.idPeriodo
    WHERE g.idGrupo = NEW.idGrupo;

    IF estado_periodo <> 'ACTIVO' THEN
        RAISE EXCEPTION 'El periodo no está activo';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_periodo_activo
BEFORE INSERT ON inscripciones.Inscripcion
FOR EACH ROW EXECUTE FUNCTION validar_periodo_activo();

-- 11. Evitar repetir aprobadas
CREATE OR REPLACE FUNCTION evitar_repetir_aprobadas()
RETURNS TRIGGER AS $$
DECLARE materia_actual INT; ya_aprobada BOOLEAN;
BEGIN
    SELECT idMateria INTO materia_actual FROM grupos.Grupo WHERE idGrupo = NEW.idGrupo;

    SELECT EXISTS (
        SELECT 1 FROM evaluaciones.NotaFinal nf
        JOIN inscripciones.Inscripcion i ON nf.idInscripcion = i.idInscripcion
        JOIN grupos.Grupo g ON i.idGrupo = g.idGrupo
        WHERE i.idEstudiante = NEW.idEstudiante AND g.idMateria = materia_actual AND nf.estado = 'APROBADO'
    ) INTO ya_aprobada;

    IF ya_aprobada THEN RAISE EXCEPTION 'La materia ya fue aprobada'; END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_evitar_repetir_aprobadas
BEFORE INSERT ON inscripciones.Inscripcion
FOR EACH ROW EXECUTE FUNCTION evitar_repetir_aprobadas();

-- 12. Validar pago inscripción
CREATE OR REPLACE FUNCTION validar_pago_inscripcion()
RETURNS TRIGGER AS $$
DECLARE deuda DECIMAL;
BEGIN
    SELECT COALESCE(SUM(total - pagado), 0) INTO deuda FROM pagos.Factura WHERE idEstudiante = NEW.idEstudiante;
    IF deuda > 0 THEN RAISE EXCEPTION 'El estudiante tiene deuda pendiente'; END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_validar_pago_inscripcion
BEFORE INSERT ON inscripciones.Inscripcion
FOR EACH ROW EXECUTE FUNCTION validar_pago_inscripcion();

-- ==============================================
-- PROCEDIMIENTOS ALMACENADOS
-- ==============================================
CREATE OR REPLACE PROCEDURE inscribir_estudiante(p_estudiante INT, p_grupo INT)
LANGUAGE plpgsql AS $$
BEGIN
    INSERT INTO inscripciones.Inscripcion(idEstudiante, idGrupo) VALUES (p_estudiante, p_grupo);
END;
$$;

CREATE OR REPLACE PROCEDURE registrar_calificacion(p_actividad INT, p_inscripcion INT, p_nota DECIMAL)
LANGUAGE plpgsql AS $$
BEGIN
    INSERT INTO evaluaciones.Calificacion(idActividad, idInscripcion, nota, publicado)
    VALUES (p_actividad, p_inscripcion, p_nota, TRUE);
END;
$$;

CREATE OR REPLACE PROCEDURE generar_factura(p_estudiante INT, p_total DECIMAL)
LANGUAGE plpgsql AS $$
BEGIN
    INSERT INTO pagos.Factura(numeroFactura, idEstudiante, fechaEmision, fechaVencimiento, subtotal, total)
    VALUES (CONCAT('FAC-', NOW()), p_estudiante, CURRENT_DATE, CURRENT_DATE + INTERVAL '30 days', p_total, p_total);
END;
$$;

-- ==============================================
-- VISTAS
-- ==============================================
CREATE OR REPLACE VIEW vw_estudiante_notas AS
SELECT 
    e.idEstudiante,
    p.primerNombre,
    m.nombre AS materia,
    nf.notaFinal
FROM estudiantes.Estudiante e
JOIN personas.Persona p ON e.idPersona = p.idPersona
JOIN inscripciones.Inscripcion i ON e.idEstudiante = i.idEstudiante
JOIN grupos.Grupo g ON i.idGrupo = g.idGrupo
JOIN academico.Materia m ON g.idMateria = m.idMateria
JOIN evaluaciones.NotaFinal nf ON nf.idInscripcion = i.idInscripcion;

COMMIT;