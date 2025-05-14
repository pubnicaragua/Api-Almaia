import { Request, Response } from "express";
import { DataService } from "../DataService";
import { AlumnoActividad } from "../../../core/modelo/alumno/AlumnoActividad";
import Joi from "joi";
import { SupabaseClientService } from "../../../core/services/supabaseClient";
import { SupabaseClient } from "@supabase/supabase-js";

const dataService: DataService<AlumnoActividad> = new DataService(
  "alumnos_actividades","alumno_actividad_id"
);
const AlumnoActividadSchema = Joi.object({
  alumno_id: Joi.number().integer().required(),
  actividad_id: Joi.number().integer().required(),
});
const supabaseService = new SupabaseClientService();
const client: SupabaseClient = supabaseService.getClient();
export const AlumnoActividadService = {
  async obtener(req: Request, res: Response) {
    try {
      const where = { ...req.query }; // Convertir los parámetros de consulta en filtros
      const alumnoActividad = await dataService.getAll(
        [
          "*",
          "alumnos(alumno_id,url_foto_perfil,telefono_contacto1,telefono_contacto2,email)"
          ,"actividades(actividad_id,nombre)",
        ],
        where
      );
      res.json(alumnoActividad);
     } catch (error) {
      console.error("Error al obtener el curso del alumno:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  },
  guardar: async (req: Request, res: Response) => {
    try {
      const alumnoActividad: AlumnoActividad = new AlumnoActividad();
      Object.assign(alumnoActividad, req.body);
      alumnoActividad.creado_por = req.creado_por;
      alumnoActividad.actualizado_por = req.actualizado_por;
      alumnoActividad.activo=true
      let responseSent = false;
      const { error: validationError } = AlumnoActividadSchema.validate(req.body);
      const { data: dataAlumno, error: errorAlumno } = await client
        .from("alumnos")
        .select("*")
        .eq("alumno_id", alumnoActividad.alumno_id)
        .single();
      if (errorAlumno || !dataAlumno) {
        throw new Error("El alumno no existe");
      } const { data: dataActividad, error: errorActividad } = await client
        .from("actividades")
        .select("*")
        .eq("actividad_id", alumnoActividad.actividad_id)
        .single();
      if (errorActividad || !dataActividad) {
        throw new Error("La actividad no existe");
      }
      if (validationError) {
        responseSent = true;
        throw new Error(validationError.details[0].message);
      }
      if (!responseSent) {
        const savedAlumnoActividad = await dataService.processData(alumnoActividad);
        res.status(201).json(savedAlumnoActividad);
      }
    } catch (error) {
      console.error("Error al guardar el curso del alumno:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  },
  async actualizar(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const alumnoActividad: AlumnoActividad = new AlumnoActividad();
      Object.assign(alumnoActividad, req.body);
      alumnoActividad.creado_por = req.creado_por;
      alumnoActividad.actualizado_por = req.actualizado_por;
      let responseSent = false;
      const { error: validationError } = AlumnoActividadSchema.validate(req.body);
      const { data: dataAlumno, error: errorAlumno } = await client
        .from("alumnos")
        .select("*")
        .eq("alumno_id", alumnoActividad.alumno_id)
        .single();
      if (errorAlumno || !dataAlumno) {
        throw new Error("El alumno no existe");
      }
      const { data: dataActividad, error: errorActividad } = await client
        .from("actividades")
        .select("*")
        .eq("actividad_id", alumnoActividad.actividad_id)
        .single();
      if (errorActividad || !dataActividad) {
        throw new Error("La Actividad  no existe");
      }
      if (validationError) {
        responseSent = true;
        throw new Error(validationError.details[0].message);
      }
      if (!responseSent) {
        const alumnoActividad: AlumnoActividad = req.body;
        await dataService.updateById(id, alumnoActividad);
        res
          .status(200)
          .json({ message: "Curso del alumno actualizado correctamente" });
      }
    } catch (error) {
      console.error("Error al actualizar el curso del alumno:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  },
  async eliminar(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      await dataService.deleteById(id);
      res
        .status(200)
        .json({ message: "Curso del alumno eliminado correctamente" });
    } catch (error) {
      console.error("Error al eliminar el curso del alumno:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  },
};
