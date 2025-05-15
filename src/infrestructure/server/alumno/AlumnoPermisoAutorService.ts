import { Request, Response } from "express";
import { DataService } from "../DataService";
import { AlumnoPermisoAutor } from "../../../core/modelo/alumno/AlumnoPermisoAutor";
import { SupabaseClientService } from "../../../core/services/supabaseClient";
import { SupabaseClient } from "@supabase/supabase-js";
import Joi from "joi";

const supabaseService = new SupabaseClientService();
const client: SupabaseClient = supabaseService.getClient();

const dataService: DataService<AlumnoPermisoAutor> = new DataService(
  "alumnos_permisos_autores",
  "alumno_permiso_autor_id"
);
const AlumnoPermisoAutorSchema = Joi.object({
  alumno_id: Joi.number().integer().required(),
  apoderado_id: Joi.number().integer().required(),
  tipo: Joi.string().max(50).required(),
  descripcion: Joi.string().required(),
  fecha_solicitud: Joi.string().optional(),
  fecha_autorizacion: Joi.string().optional(),
  estado: Joi.string().max(20).required(),
});
export const AlumnoPermisoAutorsService = {
  async obtener(req: Request, res: Response) {
    try {
      const where = { ...req.query }; // Convertir los parámetros de consulta en filtros
      const alumnopermisoautor = await dataService.getAll(
        [
          "*",
          "alumnos(alumno_id,url_foto_perfil,telefono_contacto1,telefono_contacto2,email,personas(persona_id,nombres,apellidos))",
          "apoderados(apoderado_id,personas(persona_id,nombres,apellidos),telefono_contacto1,telefono_contacto2,email_contacto1,email_contacto2)",
        ],
        where
      );
      res.json(alumnopermisoautor);
    } catch (error) {
      console.error("Error al obtener la alumnopermisoautor:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  },
  guardar: async (req: Request, res: Response) => {
    try {
      const alumnopermisoautor: AlumnoPermisoAutor = new AlumnoPermisoAutor();
      Object.assign(alumnopermisoautor, req.body);
      alumnopermisoautor.creado_por = req.creado_por;
      alumnopermisoautor.actualizado_por = req.actualizado_por;

      let responseSent = false;
      const { error: validationError } = AlumnoPermisoAutorSchema.validate(
        req.body
      );
      const { data, error } = await client
        .from("alumnos")
        .select("*")
        .eq("alumno_id", alumnopermisoautor.alumno_id)
        .single();
      if (error || !data) {
        throw new Error("El alumno no existe");
      }
      const { data: dataApoderados, error: errorApoderados } = await client
        .from("apoderados")
        .select("*")
        .eq("apoderado_id", alumnopermisoautor.apoderado_id)
        .single();
      if (errorApoderados || !dataApoderados) {
        throw new Error("El apoderado no existe");
      }
      if (validationError) {
        responseSent = true;
        throw new Error(validationError.details[0].message);
      }
      if (!responseSent) {
        const savedAlumnoPermisoAutor = await dataService.processData(
          alumnopermisoautor
        );
        res.status(201).json(savedAlumnoPermisoAutor);
      }
    } catch (error) {
      console.error("Error al guardar la alumnopermisoautor:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  },
  async actualizar(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const alumnopermisoautor: AlumnoPermisoAutor = new AlumnoPermisoAutor();
      Object.assign(alumnopermisoautor, req.body);
      alumnopermisoautor.creado_por = req.creado_por;
      alumnopermisoautor.actualizado_por = req.actualizado_por;

      let responseSent = false;
      const { error: validationError } = AlumnoPermisoAutorSchema.validate(
        req.body
      );
      const { data, error } = await client
        .from("alumnos")
        .select("*")
        .eq("alumno_id", alumnopermisoautor.alumno_id)
        .single();
      if (error || !data) {
        throw new Error("El colegio no existe");
      }
      const { data: dataApoderados, error: errorApoderados } = await client
        .from("alumnos")
        .select("*")
        .eq("apoderado_id", alumnopermisoautor.apoderado_id)
        .single();
      if (errorApoderados || !dataApoderados) {
        throw new Error("El colegio no existe");
      }
      if (validationError) {
        responseSent = true;
        throw new Error(validationError.details[0].message);
      }
      if (!responseSent) {
        await dataService.updateById(id, alumnopermisoautor);
        res
          .status(200)
          .json({ message: "AlumnoPermisoAutor actualizada correctamente" });
      }
    } catch (error) {
      console.error("Error al actualizar la alumnopermisoautor:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  },
  async eliminar(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      await dataService.deleteById(id);
      res
        .status(200)
        .json({ message: "AlumnoPermisoAutor eliminada correctamente" });
    } catch (error) {
      console.error("Error al eliminar la alumnopermisoautor:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  },
};
