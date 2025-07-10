/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import { Pregunta } from "../../../core/modelo/preguntasRespuestas/Pregunta";
import { DataService } from "../DataService";
import { SupabaseClientService } from "../../../core/services/supabaseClient";
import { SupabaseClient } from "@supabase/supabase-js";
import Joi from "joi";
const supabaseService = new SupabaseClientService();
const client: SupabaseClient = supabaseService.getClient();
const PreguntaSchema = Joi.object({
  tipo_pregunta_id: Joi.number().integer().required(),
  nivel_educativo_id: Joi.number().integer().required(),
  diagnostico: Joi.string().required(),
  sintomas: Joi.string().max(50).required(),
  grupo_preguntas: Joi.string().max(10).required(),
  palabra_clave: Joi.string().max(10).required(),
  horario: Joi.string().max(10).required(),
  texto_pregunta: Joi.string().required(),
});
const dataService: DataService<Pregunta> = new DataService("preguntas");
export const PreguntaService = {
  async obtener(req: Request, res: Response) {
    try {
      const where = { ...req.query }; // Convertir los parámetros de consulta en filtros
      const preguntas = await dataService.getAll(
        [
          "*",
          "tipos_preguntas(tipo_pregunta_id,nombre)",
          "niveles_educativos(nivel_educativo_id,nombre)",
        ],
        where
      );
      res.json(preguntas);
    } catch (error) {
      console.error("Error al obtener la pregunta:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  },
  async detalle(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const where = { pregunta_id: id }; // Convertir los parámetros de consulta en filtros
      const pregunta_data = await dataService.getAll(
        [
          "*",
          "tipos_preguntas(tipo_pregunta_id,nombre)",
          "niveles_educativos(nivel_educativo_id,nombre)",
        ],
        where
      );
      const pregunta = pregunta_data[0];
      res.json(pregunta);
      // res.json(pregunta);
    } catch (error) {
      console.error("Error al obtener la pregunta:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  },
  guardar: async (req: Request, res: Response) => {
    try {
      const pregunta: Pregunta = new Pregunta();
      Object.assign(pregunta, req.body);
      pregunta.creado_por = req.creado_por;
      pregunta.actualizado_por = req.actualizado_por;
      let responseSent = false;
      const { error: validationError } = PreguntaSchema.validate(req.body);
      const { data, error } = await client
        .from("tipos_preguntas")
        .select("*")
        .eq("tipo_pregunta_id", pregunta.tipo_pregunta_id)
        .single();
      if (error || !data) {
        throw new Error("El colegio no existe");
      }
      const { data: dataNivelesEducativos, error: errorNilesEducativos } =
        await client
          .from("niveles_educativos")
          .select("*")
          .eq("nivel_educativo_id", pregunta.nivel_educativo_id)
          .single();
      if (errorNilesEducativos || !dataNivelesEducativos) {
        throw new Error("El colegio no existe");
      }
      if (validationError) {
        responseSent = true;
        throw new Error(validationError.details[0].message);
      }
      if (!responseSent) {
        const savedPregunta = await dataService.processData(pregunta);
        res.status(201).json(savedPregunta);
      }
    } catch (error) {
      console.error("Error al guardar el pregunta:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  },
  async actualizar(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);

      const pregunta: Pregunta = req.body;
      Object.assign(pregunta, req.body);
      pregunta.creado_por = req.creado_por;
      pregunta.actualizado_por = req.actualizado_por;
      let responseSent = false;
      const { error: validationError } = PreguntaSchema.validate(req.body);
      const { data, error } = await client
        .from("tipos_preguntas")
        .select("*")
        .eq("tipo_pregunta_id", pregunta.tipo_pregunta_id)
        .single();
      if (error || !data) {
        throw new Error("El colegio no existe");
      }
      const { data: dataNivelesEducativos, error: errorNilesEducativos } =
        await client
          .from("niveles_educativos")
          .select("*")
          .eq("nivel_educativo_id", pregunta.nivel_educativo_id)
          .single();
      if (errorNilesEducativos || !dataNivelesEducativos) {
        throw new Error("El colegio no existe");
      }
      if (validationError) {
        responseSent = true;
        throw new Error(validationError.details[0].message);
      }
      if (!responseSent) {
        await dataService.updateById(id, pregunta);
        res.status(200).json({ message: "Pregunta actualizada correctamente" });
      }
    } catch (error) {
      console.error("Error al actualizar la pregunta:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  },
  async eliminar(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      await dataService.deleteById(id);
      res.status(200).json({ message: "Pregunta eliminada correctamente" });
    } catch (error) {
      console.error("Error al eliminar la pregunta:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  },
  async motor_pregunta() {
    try {
      console.log("Ejecutando motor de preguntas...");
      const { error } = await client.rpc('ejecutar_generacion_preguntas_por_colegios');
      if (error) {
        throw error;
      }
      console.log("Finalizando motor de preguntas...");
    } catch (error: any) {
      console.error(error.message)
    }
  },
};
