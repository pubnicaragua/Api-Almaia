import { Request, Response } from "express";
import { DataService } from "../DataService";
import { Alumno } from "../../../core/modelo/alumno/Alumno";
import Joi from "joi";
import { SupabaseClient } from "@supabase/supabase-js";
import { SupabaseClientService } from "../../../core/services/supabaseClient";

const supabaseService = new SupabaseClientService();
const client: SupabaseClient = supabaseService.getClient();

const dataService: DataService<Alumno> = new DataService("alumnos");
const AlumnoSchema = Joi.object({
  url_foto_perfil: Joi.string().max(255).optional(),
  telefono_contacto1: Joi.string().max(16).optional(),
  telefono_contacto2: Joi.string().max(16).optional(),
  email: Joi.string().max(45).optional(),
  colegio_id: Joi.number().integer().required(),
});
export const AlumnosService = {
  async obtener(req: Request, res: Response) {
    try {
      const where = { ...req.query }; // Convertir los parámetros de consulta en filtros
      const alumnos = await dataService.getAll(["*"], where);
      res.json(alumnos);
    } catch (error) {
      console.error("Error al obtener el alumno:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  },

  async getAlumnoDetalle(req: Request, res: Response) {
    const { alumnoId } = req.params;

    // Alumno simulado
    const alumno = {
      alumno_id: parseInt(alumnoId),
      colegio_id: 101,
      url_foto_perfil: "https://example.com/foto.jpg",
      telefono_contacto1: "+56 9 1234 5678",
      telefono_contacto2: "+56 9 8765 4321",
      email: "alumno.demo@colegio.cl",
    };

    // Ficha clínica simulada
    const ficha = {
      alumno_ant_clinico_id: 1,
      alumno_id: parseInt(alumnoId),
      historial_medico: "Historial general sin eventos graves.",
      alergias: "Ninguna conocida",
      enfermedades_cronicas: "Asma leve",
      condiciones_medicas_relevantes: "Controlado por pediatra",
      medicamentos_actuales: "Salbutamol",
      diagnosticos_previos: "Asma infantil",
      terapias_tratamiento_curso: "Inhalador según necesidad",
    };

    // Alertas simuladas
    const alertas = [
      {
        alumno_alerta_id: 1,
        alumno_id: parseInt(alumnoId),
        alerta_regla_id: 12,
        fecha_generada: new Date(),
        fecha_resolucion: null,
        alerta_origen_id: 3,
        prioridad_id: 2,
        severidad_id: 1,
        accion_tomada: "Conversación con apoderado",
        leida: false,
        responsable_actual_id: 7,
        estado: "pendiente",
        alertas_tipo_alerta_tipo_id: 4,
      },
    ];

    // Informes simulados
    const informes = [
      {
        alumno_informe_id: 1,
        alumno_id: parseInt(alumnoId),
        fecha: new Date("2024-12-01"),
        url_reporte: "https://example.com/informe1.pdf",
      },
      {
        alumno_informe_id: 2,
        alumno_id: parseInt(alumnoId),
        fecha: new Date("2025-03-15"),
        url_reporte: "https://example.com/informe2.pdf",
      },
    ];

    // Apoderados simulados
    const apoderados = [
      {
        alumno_apoderado_id: 1,
        alumno_id: parseInt(alumnoId),
        apoderado_id: 1001,
        tipo_apoderado: "Padre",
        observaciones: "Siempre disponible",
        estado_usuario: "activo",
      },
      {
        alumno_apoderado_id: 2,
        alumno_id: parseInt(alumnoId),
        apoderado_id: 1002,
        tipo_apoderado: "Madre",
        observaciones: "Vive con el alumno",
        estado_usuario: "activo",
      },
    ];

    // Emociones simuladas
    const emociones = [
      { nombre: "Felicidad", valor: 3100 },
      { nombre: "Tristeza", valor: 1500 },
      { nombre: "Estrés", valor: 950 },
      { nombre: "Ansiedad", valor: 2600 },
      { nombre: "Enojo", valor: 750 },
      { nombre: "Otros", valor: 1900 },
    ];

    res.json({
      alumno,
      ficha,
      alertas,
      informes,
      emociones,
      apoderados,
    });
  },
  guardar: async (req: Request, res: Response) => {
    try {
      const alumno: Alumno = new Alumno();
      Object.assign(alumno, req.body);
      alumno.creado_por = req.creado_por;
      alumno.actualizado_por = req.actualizado_por
      console.log(alumno);
      
      let responseSent = false;
      const { error: validationError } = AlumnoSchema.validate(req.body);
      const { data, error } = await client
        .from("colegios")
        .select("*")
        .eq("colegio_id", alumno.colegio_id)
        .single();
      if (error || !data) {
        throw new Error("El colegio no existe");
      }
      if (validationError) {
        responseSent = true;
        throw new Error(validationError.details[0].message);
      }
      if (!responseSent) {
        console.log(alumno);
        
        const savedAlumno = await dataService.processData(alumno);
        res.status(201).json(savedAlumno);
      }
    } catch (err) {
      const error = err as Error;
      console.error("Error al guardar el alumno:", error);
      res.status(500).json({ message: error.message || 'Error inesperado' });
    }
  },
  async actualizar(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const alumno: Alumno = req.body;
      await dataService.updateById(id, alumno);
      res.status(200).json({ message: "Alumno actualizado correctamente" });
    } catch (error) {
      console.error("Error al actualizar el alumno:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  },
  async eliminar(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      await dataService.deleteById(id);
      res.status(200).json({ message: "Alumno eliminado correctamente" });
    } catch (error) {
      console.error("Error al eliminar el alumno:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  },
};
