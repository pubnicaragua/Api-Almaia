import { Request, Response } from "express";
import { DataService } from "../DataService";
import { AlumnoMonitoreo } from "../../../core/modelo/alumno/AlumnoMonitoreo";
import { SupabaseClientService } from "../../../core/services/supabaseClient";
import { SupabaseClient } from "@supabase/supabase-js";
import Joi from "joi";
import { obtenerRelacionados } from "../../../core/services/ObtenerTablasColegioCasoUso";
const supabaseService = new SupabaseClientService();
const client: SupabaseClient = supabaseService.getClient();
const dataService: DataService<AlumnoMonitoreo> = new DataService(
  "alumnos_monitoreos",
  "alumno_monitoreo_id"
);
const AlumnoMonitoreoSchema = Joi.object({
  alumno_id: Joi.number().integer().required(),
  fecha_accion: Joi.string().required(),
  tipo_accion: Joi.string().max(15).optional(),
  descripcion_accion: Joi.string().max(50).optional(),
});
export const AlumnoMonitoreoService = {
  async obtener(req: Request, res: Response) {
    try {
      const { colegio_id, ...where } = req.query;
      let respuestaEnviada = false;
      if (colegio_id !== undefined) {
        const alumnoMonitoreo = await obtenerRelacionados({
          tableFilter: "alumnos",
          filterField: "colegio_id",
          filterValue: colegio_id,
          idField: "alumno_id",
          tableIn: "alumnos_monitoreos",
          inField: "alumno_id",
          selectFields: `*,                      
                        alumnos(alumno_id,url_foto_perfil,telefono_contacto1,telefono_contacto2,email,personas(persona_id,nombres,apellidos))",`,
        });
        respuestaEnviada = true;
        res.json(alumnoMonitoreo);
      }
      if (!respuestaEnviada) {
        const alumnoMonitoreo = await dataService.getAll(
          [
            "*",
            "alumnos(alumno_id,url_foto_perfil,telefono_contacto1,telefono_contacto2,email,personas(persona_id,nombres,apellidos,fecha_nacimiento))",
          ],
          where
        );
        res.json(alumnoMonitoreo);
      }
    } catch (error) {
      console.error("Error al obtener el monitoreo del alumno:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  },
  guardar: async (req: Request, res: Response) => {
    try {
      const alumnoMonitoreo: AlumnoMonitoreo = new AlumnoMonitoreo();
      Object.assign(alumnoMonitoreo, req.body);
      let responseSent = false;
      const { error: validationError } = AlumnoMonitoreoSchema.validate(
        req.body
      );
      const { data, error } = await client
        .from("alumnos")
        .select("*")
        .eq("alumno_id", alumnoMonitoreo.alumno_id)
        .single();
      if (error || !data) {
        throw new Error("El colegio no existe");
      }
      if (validationError) {
        responseSent = true;
        throw new Error(validationError.details[0].message);
      }
      if (!responseSent) {
        const savedAlumnoMonitoreo = await dataService.processData(
          alumnoMonitoreo
        );
        res.status(201).json(savedAlumnoMonitoreo);
      }
    } catch (error) {
      console.error("Error al guardar el monitoreo del alumno:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  },
  async actualizar(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const alumnoMonitoreo: AlumnoMonitoreo = new AlumnoMonitoreo();
      Object.assign(alumnoMonitoreo, req.body);
      let responseSent = false;
      const { error: validationError } = AlumnoMonitoreoSchema.validate(
        req.body
      );
      const { data, error } = await client
        .from("alumnos")
        .select("*")
        .eq("alumno_id", alumnoMonitoreo.alumno_id)
        .single();
      if (error || !data) {
        throw new Error("El colegio no existe");
      }
      if (validationError) {
        responseSent = true;
        throw new Error(validationError.details[0].message);
      }
      if (!responseSent) {
        await dataService.updateById(id, alumnoMonitoreo);
        res
          .status(200)
          .json({ message: "Monitoreo del alumno actualizado correctamente" });
      }
    } catch (error) {
      console.error("Error al actualizar el monitoreo del alumno:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  },
  async eliminar(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      await dataService.deleteById(id);
      res
        .status(200)
        .json({ message: "Monitoreo del alumno eliminado correctamente" });
    } catch (error) {
      console.error("Error al eliminar el monitoreo del alumno:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  },
};
