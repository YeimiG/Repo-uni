/**
 * Hook: useStudentCreation
 * Gestiona el flujo de creación de estudiante en 3 pasos
 * Paso 1: Crear/Seleccionar Persona
 * Paso 2: Crear Usuario
 * Paso 3: Crear Estudiante
 */

import { crearEstudiante } from "@/services/estudiantes.service";
import {
    crearPersona,
    getPersonasDisponibles,
} from "@/services/personas.service";
import { crearUsuario, getRoles } from "@/services/usuarios.service";
import type { Persona, PersonaResponse, Rol, Usuario } from "@/types";
import { useState } from "react";

export interface EstudianteCreationStep1 {
  opcion: "nueva" | "existente"; // ¿Crear persona nueva o seleccionar existente?
  persona?: Persona; // Si opción es 'nueva'
  idpersona?: number; // Si opción es 'existente'
}

export interface EstudianteCreationStep2 {
  correo: string;
  clave: string;
  idrol: number;
}

export interface EstudianteCreationStep3 {
  expediente: string;
  idcarrera: number;
  fechaingreso?: string;
}

interface UseStudentCreationReturn {
  // Estado
  paso: 1 | 2 | 3 | "completado";
  loading: boolean;
  error: string | null;

  // Datos
  idpersonaCreada?: number;
  idusuarioCreado?: number;
  personasDisponibles: PersonaResponse[];
  rolesDisponibles: Rol[];

  // Funciones
  cargarPersonasDisponibles: () => Promise<void>;
  cargarRoles: () => Promise<void>;
  procesarStep1: (data: EstudianteCreationStep1) => Promise<number | null>;
  procesarStep2: (data: EstudianteCreationStep2) => Promise<number | null>;
  procesarStep3: (data: EstudianteCreationStep3) => Promise<number | null>;
  irAlPaso: (paso: 1 | 2 | 3) => void;
  resetear: () => void;
}

export function useStudentCreation(): UseStudentCreationReturn {
  const [paso, setPaso] = useState<1 | 2 | 3 | "completado">(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [idpersonaCreada, setIdpersonaCreada] = useState<number>();
  const [idusuarioCreado, setIdusuarioCreado] = useState<number>();
  const [personasDisponibles, setPersonasDisponibles] = useState<
    PersonaResponse[]
  >([]);
  const [rolesDisponibles, setRolesDisponibles] = useState<Rol[]>([]);

  const cargarPersonasDisponibles = async () => {
    setLoading(true);
    setError(null);
    const res = await getPersonasDisponibles("estudiante");
    if (res.success) {
      setPersonasDisponibles(res.data || (res as any).personas || []);
    } else {
      setError(res.message || "Error al cargar personas");
    }
    setLoading(false);
  };

  const cargarRoles = async () => {
    setLoading(true);
    setError(null);
    const res = await getRoles();
    if (res.success) {
      setRolesDisponibles(res.data || []);
    } else {
      setError(res.message || "Error al cargar roles");
    }
    setLoading(false);
  };

  const procesarStep1 = async (
    data: EstudianteCreationStep1,
  ): Promise<number | null> => {
    setLoading(true);
    setError(null);

    try {
      if (data.opcion === "nueva") {
        if (!data.persona) {
          throw new Error("Datos de persona no proporcionados");
        }
        const res = await crearPersona(data.persona);
        if (!res.success) {
          throw new Error(res.message || "Error al crear persona");
        }
        const idpersona = res.data?.idpersona;
        if (!idpersona) {
          throw new Error("No se recibió ID de persona");
        }
        setIdpersonaCreada(idpersona);
        setPaso(2);
        return idpersona;
      } else {
        if (!data.idpersona) {
          throw new Error("ID de persona no proporcionado");
        }
        setIdpersonaCreada(data.idpersona);
        setPaso(2);
        return data.idpersona;
      }
    } catch (err: any) {
      const mensaje = err.message || "Error en paso 1";
      setError(mensaje);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const procesarStep2 = async (
    data: EstudianteCreationStep2,
  ): Promise<number | null> => {
    setLoading(true);
    setError(null);

    try {
      if (!idpersonaCreada) {
        throw new Error("ID de persona no disponible");
      }

      const usuarioData: Omit<
        Usuario,
        "idusuario" | "activo" | "fechacreacion"
      > = {
        correo: data.correo,
        clave: data.clave,
        idrol: data.idrol,
        idpersona: idpersonaCreada,
      };

      const res = await crearUsuario(usuarioData);
      if (!res.success) {
        throw new Error(res.message || "Error al crear usuario");
      }
      const idusuario = res.data?.idusuario;
      if (!idusuario) {
        throw new Error("No se recibió ID de usuario");
      }
      setIdusuarioCreado(idusuario);
      setPaso(3);
      return idusuario;
    } catch (err: any) {
      const mensaje = err.message || "Error en paso 2";
      setError(mensaje);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const procesarStep3 = async (
    data: EstudianteCreationStep3,
  ): Promise<number | null> => {
    setLoading(true);
    setError(null);

    try {
      if (!idpersonaCreada || !idusuarioCreado) {
        throw new Error("Datos incompletos: persona o usuario no disponibles");
      }

      const estudianteData = {
        idpersona: idpersonaCreada,
        idusuario: idusuarioCreado,
        expediente: data.expediente,
        idcarrera: data.idcarrera,
        fechaingreso:
          data.fechaingreso || new Date().toISOString().split("T")[0],
      };

      const res = await crearEstudiante(estudianteData);
      if (!res.success) {
        throw new Error(res.message || "Error al crear estudiante");
      }
      setPaso("completado");
      return res.idestudiante || res.data?.idestudiante;
    } catch (err: any) {
      const mensaje = err.message || "Error en paso 3";
      setError(mensaje);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const irAlPaso = (nuevoPaso: 1 | 2 | 3) => {
    if (
      nuevoPaso === 1 ||
      (nuevoPaso === 2 && idpersonaCreada) ||
      (nuevoPaso === 3 && idpersonaCreada && idusuarioCreado)
    ) {
      setPaso(nuevoPaso);
      setError(null);
    }
  };

  const resetear = () => {
    setPaso(1);
    setLoading(false);
    setError(null);
    setIdpersonaCreada(undefined);
    setIdusuarioCreado(undefined);
  };

  return {
    paso,
    loading,
    error,
    idpersonaCreada,
    idusuarioCreado,
    personasDisponibles,
    rolesDisponibles,
    cargarPersonasDisponibles,
    cargarRoles,
    procesarStep1,
    procesarStep2,
    procesarStep3,
    irAlPaso,
    resetear,
  };
}
