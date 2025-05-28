import { Request, Response } from "express";

import { DataService } from "../DataService";
import { SupabaseClientService } from "../../../core/services/supabaseClient";
import { SupabaseClient } from "@supabase/supabase-js";
import Joi from "joi";
import { ApoderadoRespuesta } from "../../../core/modelo/apoderado/ApoderadoRespuesta";

const supabaseService = new SupabaseClientService();
const client: SupabaseClient = supabaseService.getClient();
const dataService: DataService<ApoderadoRespuesta> = new DataService(
  "apoderados_respuestas",
  "apoderado_respuesta_id"
);
const ApoderadoRespuestaSchema = Joi.object({
  pregunta_id: Joi.number().integer().required(),
  respuesta_posible_id: Joi.number().integer().optional(),
  apoderado_id: Joi.number().integer().required(),
  alumno_id: Joi.number().integer().required(),
  texto_respuesta: Joi.string().max(50).optional(),
  estado_respuesta: Joi.string().max(20).required(),
});
export const ApoderadoRespuestaService = {
  async obtener(req: Request, res: Response) {
    try {
      const where = { ...req.query }; // Convertir los parámetros de consulta en filtros
      const apoderadorespuestas = await dataService.getAll(
        [
          "*",
          "alumnos(alumno_id,url_foto_perfil,personas(persona_id,nombres,apellidos))",
          "preguntas(pregunta_id,nombre,respuestas_posibles(respuesta_posible_id,nombre))",
          "apoderados(apoderado_id,personas(persona_id,nombres,apellidos),telefono_contacto1,telefono_contacto2,email_contacto1,email_contacto2)",
          "respuestas_posibles(respuesta_posible_id,nombre)",
        ],
        where
      );
      res.json(apoderadorespuestas);
    } catch (error) {
      console.error("Error al obtener la apoderadorespuesta:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  },
  guardar: async (req: Request, res: Response) => {
    try {
      const apoderadorespuesta: ApoderadoRespuesta = new ApoderadoRespuesta();
      Object.assign(apoderadorespuesta, req.body);
      apoderadorespuesta.creado_por = req.creado_por;
      apoderadorespuesta.actualizado_por = req.actualizado_por;
      let responseSent = false;
      const { error: validationError } = ApoderadoRespuestaSchema.validate(
        req.body
      );
      const { data, error } = await client
        .from("apoderados")
        .select("*")
        .eq("apoderado_id", apoderadorespuesta.apoderado_id)
        .single();
      if (error || !data) {
        throw new Error("La persona no existe");
      }
      const { data: dataAlumno, error: errorAlumno } = await client
        .from("alumnos")
        .select("*")
        .eq("alumno_id", apoderadorespuesta.alumno_id)
        .single();
      if (errorAlumno || !dataAlumno) {
        throw new Error("El Alumno no existe");
      }
      const { data: dataPregunta, error: errorPregunta } = await client
        .from("preguntas")
        .select("*")
        .eq("pregunta_id", apoderadorespuesta.alumno_id)
        .single();
      if (errorPregunta || !dataPregunta) {
        throw new Error("El Alumno no existe");
      }

      if (validationError) {
        responseSent = true;
        throw new Error(validationError.details[0].message);
      }
      if (!responseSent) {
        const savedApoderadoRespuesta = await dataService.processData(
          apoderadorespuesta
        );
        res.status(201).json(savedApoderadoRespuesta);
      }
    } catch (err) {
      const error = err as Error;
      console.error("Error al guardar el apoderadorespuesta:", error);
      res.status(500).json({ message: error.message || "Error inesperado" });
    }
  },
  actualizar: async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const apoderadorespuesta: ApoderadoRespuesta = new ApoderadoRespuesta();
      Object.assign(apoderadorespuesta, req.body);
      apoderadorespuesta.actualizado_por = req.actualizado_por;
      let responseSent = false;
      const { error: validationError } = ApoderadoRespuestaSchema.validate(
        req.body
      );
      const { data, error } = await client
        .from("apoderados")
        .select("*")
        .eq("apoderado_id", apoderadorespuesta.apoderado_id)
        .single();
      if (error || !data) {
        throw new Error("La persona no existe");
      }
      const { data: dataAlumno, error: errorAlumno } = await client
        .from("alumnos")
        .select("*")
        .eq("alumno_id", apoderadorespuesta.alumno_id)
        .single();
      if (errorAlumno || !dataAlumno) {
        throw new Error("El Alumno no existe");
      }
      const { data: dataPregunta, error: errorPregunta } = await client
        .from("preguntas")
        .select("*")
        .eq("pregunta_id", apoderadorespuesta.alumno_id)
        .single();
      if (errorPregunta || !dataPregunta) {
        throw new Error("El Alumno no existe");
      }
      if (validationError) {
        responseSent = true;
        throw new Error(validationError.details[0].message);
      }
      if (!responseSent) {
        await dataService.updateById(id, apoderadorespuesta);
        res
          .status(200)
          .json({ message: "ApoderadoRespuesta actualizado correctamente" });
      }
    } catch (error) {
      console.error("Error al actualizar la apoderadorespuesta:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  },
  async eliminar(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      await dataService.deleteById(id);
      res
        .status(200)
        .json({ message: "ApoderadoRespuesta eliminada correctamente" });
    } catch (error) {
      console.error("Error al eliminar la apoderadorespuesta:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  },
};
