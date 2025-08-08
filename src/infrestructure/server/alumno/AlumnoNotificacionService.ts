import { Request, Response } from "express";
import { DataService } from "../DataService";
import { AlumnoNotificacion } from "../../../core/modelo/alumno/AlumnoNotificacion";
import { SupabaseClientService } from "../../../core/services/supabaseClient";
import { SupabaseClient } from "@supabase/supabase-js";
import Joi from "joi";
import { obtenerRelacionados } from "../../../core/services/ObtenerTablasColegioCasoUso";

const supabaseService = new SupabaseClientService();
const client: SupabaseClient = supabaseService.getClient();

const dataService: DataService<AlumnoNotificacion> = new DataService(
  "alumnos_notificaciones",
  "alumno_notificacion_id"
);
const AlumnoNotificacionSchema = Joi.object({
  alumno_id: Joi.number().integer().required(),
  tipo: Joi.string().max(20).required(),
  asunto: Joi.string().max(150).required(),
  cuerpo: Joi.string().required(),
  enviada: Joi.boolean().required(),
  fecha_envio: Joi.string().required(),
});
export const AlumnoNotificacionService = {
  async obtener(req: Request, res: Response) {
    try {
      const { colegio_id, ...where } = req.query;
      let respuestaEnviada = false;
      if (colegio_id !== undefined) {
        const alumnoNotificacion = await obtenerRelacionados({
          tableFilter: "alumnos",
          filterField: "colegio_id",
          filterValue: colegio_id,
          idField: "alumno_id",
          tableIn: "alumnos_notificaciones",
          inField: "alumno_id",
          selectFields: `*,                      
                        alumnos(alumno_id,url_foto_perfil,telefono_contacto1,telefono_contacto2,email,personas(persona_id,nombres,apellidos))",`,
        });
        respuestaEnviada = true;
        res.json(alumnoNotificacion);
      }
      if (!respuestaEnviada) {
        const alumnoNotificacion = await dataService.getAll(
          [
            "*",
            "alumnos(alumno_id,url_foto_perfil,telefono_contacto1,telefono_contacto2,email,personas(persona_id,nombres,apellidos,fecha_nacimiento))",
          ],
          where
        );
        res.json(alumnoNotificacion);
      }
    } catch (error) {
      console.error("Error al obtener la notificación del alumno:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  },
  guardar: async (req: Request, res: Response) => {
    try {
      const alumnoNotificacion: AlumnoNotificacion = new AlumnoNotificacion();
      Object.assign(alumnoNotificacion, req.body);
      alumnoNotificacion.creado_por = req.creado_por;
      alumnoNotificacion.actualizado_por = req.actualizado_por;
      let responseSent = false;
      const { error: validationError } = AlumnoNotificacionSchema.validate(
        req.body
      );
      const { data, error } = await client
        .from("alumnos")
        .select("*")
        .eq("alumno_id", alumnoNotificacion.alumno_id)
        .single();
      if (error || !data) {
        throw new Error("El colegio no existe");
      }
      if (validationError) {
        responseSent = true;
        throw new Error(validationError.details[0].message);
      }
      if (!responseSent) {
        const savedAlumnoNotificacion = await dataService.processData(
          alumnoNotificacion
        );
        res.status(201).json(savedAlumnoNotificacion);
      }
    } catch (error) {
      console.error("Error al guardar la notificación del alumno:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  },
  async actualizar(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const alumnoNotificacion: AlumnoNotificacion = req.body;
      Object.assign(alumnoNotificacion, req.body);
      alumnoNotificacion.actualizado_por = req.actualizado_por;
      let responseSent = false;
      const { error: validationError } = AlumnoNotificacionSchema.validate(
        req.body
      );
      const { data, error } = await client
        .from("alumnos")
        .select("*")
        .eq("alumno_id", alumnoNotificacion.alumno_id)
        .single();
      if (error || !data) {
        throw new Error("El colegio no existe");
      }
      if (validationError) {
        responseSent = true;
        throw new Error(validationError.details[0].message);
      }
      if (!responseSent) {
        await dataService.updateById(id, alumnoNotificacion);
        res.status(200).json({
          message: "Notificación del alumno actualizada correctamente",
        });
      }
    } catch (error) {
      console.error("Error al actualizar la notificación del alumno:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  },
  async eliminar(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      await dataService.deleteById(id);
      res
        .status(200)
        .json({ message: "Notificación del alumno eliminada correctamente" });
    } catch (error) {
      console.error("Error al eliminar la notificación del alumno:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  },
};
