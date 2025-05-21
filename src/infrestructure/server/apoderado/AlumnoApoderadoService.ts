import { Request, Response } from "express";

import { DataService } from "../DataService";
import { AlumnoApoderado } from "../../../core/modelo/apoderado/AlumnoApoderado";
import Joi from "joi";
import { SupabaseClientService } from "../../../core/services/supabaseClient";
import { SupabaseClient } from "@supabase/supabase-js";
import { obtenerRelacionados } from "../../../core/services/ObtenerTablasColegioCasoUso";
const AlumnoApoderadoSchema = Joi.object({
  tipo_apoderado: Joi.string().max(20).optional(),
  observaciones: Joi.string().max(200).optional(),
  estado_usuario: Joi.string().max(20).optional(),
  alumno_id: Joi.number().integer().required(),
  apoderado_id: Joi.number().integer().required(),
});
const supabaseService = new SupabaseClientService();
const client: SupabaseClient = supabaseService.getClient();
const dataService: DataService<AlumnoApoderado> = new DataService(
  "alumnos_apoderados",
  "alumno_apoderado_id"
);
export const AlumnoApoderadoService = {
  async obtener(req: Request, res: Response) {
    try {
      const { colegio_id, ...where } = req.query;
      let respuestaEnviada = false;
      if (colegio_id !== undefined) {
        const alumnos_apoderados = await obtenerRelacionados({
          tableFilter: "apoderados",
          filterField: "colegio_id",
          filterValue: colegio_id,
          idField: "apoderado_id",
          tableIn: "alumnos_apoderados",
          inField: "apoderado_id",
          selectFields: `*,apoderados (
                          apoderado_id,
                          persona_id,
                          personas (
                            persona_id,
                            tipo_documento,
                            numero_documento,
                            nombres,
                            apellidos,
                            genero_id,
                            estado_civil_id
                          )
                        )`,
        });
        respuestaEnviada = true;
        res.json(alumnos_apoderados);
      }
      if (!respuestaEnviada) {
        const alumnoApoderado = await dataService.getAll(
          [
            "*",
            "apoderados(apoderado_id,persona_id,personas(persona_id,tipo_documento,numero_documento,nombres,apellidos,genero_id,estado_civil_id))",
          ],
          where
        );

        res.json(alumnoApoderado);
      }
    } catch (error) {
      console.error("Error al obtener la alumnoApoderado:", error);
      // Solo responde si no se respondió ya
      if (!res.headersSent) {
        res.status(500).json({ message: "Error interno del servidor" });
      }
    }
  },

  guardar: async (req: Request, res: Response) => {
    try {
      const alumnoApoderado: AlumnoApoderado = new AlumnoApoderado();
      Object.assign(alumnoApoderado, req.body);
      alumnoApoderado.creado_por = req.creado_por;
      alumnoApoderado.actualizado_por = req.actualizado_por;
      let responseSent = false;
      const { error: validationError } = AlumnoApoderadoSchema.validate(
        req.body
      );
      const { data, error } = await client
        .from("alumnos")
        .select("*")
        .eq("alumno_id", alumnoApoderado.alumno_id)
        .single();
      if (error || !data) {
        throw new Error("El alumno no existe");
      }
      const { data: dataApoderado, error: errorApoderado } = await client
        .from("apoderados")
        .select("*")
        .eq("apoderado_id", alumnoApoderado.apoderado_id)
        .single();

      if (errorApoderado || !dataApoderado) {
        throw new Error("El apoderado no existe");
      }
      if (validationError) {
        responseSent = true;
        throw new Error(validationError.details[0].message);
      }
      if (!responseSent) {
        const savedAlumnoApoderado = await dataService.processData(
          alumnoApoderado
        );
        res.status(200).json(savedAlumnoApoderado);
      }
    } catch (err) {
      const error = err as Error;
      console.error("Error al guardar la alumnoApoderado:", error);
      res.status(500).json({ message: error.message || "Error inesperado" });
    }
  },
  async actualizar(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const alumnoApoderado: AlumnoApoderado = new AlumnoApoderado();
      Object.assign(alumnoApoderado, req.body);
      alumnoApoderado.actualizado_por = req.actualizado_por;
      let responseSent = false;
      const { error: validationError } = AlumnoApoderadoSchema.validate(
        req.body
      );
      const { data, error } = await client
        .from("alumnos")
        .select("*")
        .eq("alumno_id", alumnoApoderado.alumno_id)
        .single();
      if (error || !data) {
        throw new Error("El alumno no existe");
      }
      const { data: dataApoderado, error: errorApoderado } = await client
        .from("apoderados")
        .select("*")
        .eq("apoderado_id", alumnoApoderado.alumno_id)
        .single();
      if (errorApoderado || !dataApoderado) {
        throw new Error("El apoderado no existe");
      }
      if (validationError) {
        responseSent = true;
        throw new Error(validationError.details[0].message);
      }
      if (!responseSent) {
        await dataService.updateById(id, alumnoApoderado);
        res
          .status(200)
          .json({ message: "AlumnoApoderado actualizado correctamente" });
      }
    } catch (error) {
      console.error("Error al actualizar la alumnoApoderado:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  },
  async eliminar(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      await dataService.deleteById(id);
      res
        .status(200)
        .json({ message: "AlumnoApoderado eliminada correctamente" });
    } catch (error) {
      console.error("Error al eliminar la alumnoApoderado:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  },
};
