import { Request, Response } from "express";

import { DataService } from "../DataService";
import { Apoderado } from "../../../core/modelo/apoderado/Apoderado";
import { SupabaseClientService } from "../../../core/services/supabaseClient";
import { SupabaseClient } from "@supabase/supabase-js";
import Joi from "joi";

const supabaseService = new SupabaseClientService();
const client: SupabaseClient = supabaseService.getClient();
const dataService: DataService<Apoderado> = new DataService(
  "apoderados",
  "apoderado_id"
);
const ApoderadoSchema = Joi.object({
  persona_id: Joi.number().integer().required(),
  colegio_id: Joi.number().integer().required(),
  telefono_contacto1: Joi.string().max(15).required(),
  telefono_contacto2: Joi.string().max(15).required(),
  email_contacto1: Joi.string().max(128).required(),
  email_contacto2: Joi.string().max(128).required(),
  estado: Joi.string().max(20).required(),
  profesion_id: Joi.number().integer().required(),
  tipo_oficio_id: Joi.number().integer().required(),
});
export const ApoderadoService = {
  async obtener(req: Request, res: Response) {
    try {
      const where = { ...req.query }; // Convertir los parámetros de consulta en filtros
      const apoderados = await dataService.getAll(["*",
         "personas(persona_id,nombres,apellidos)",
          "colegios(colegio_id,nombre)",
          "profesiones_oficios(profesion_oficio_id,nombre,tipos_oficios(tipo_oficio_id,nombre))",
      ], where);
      res.json(apoderados);
    } catch (error) {
      console.error("Error al obtener la apoderado:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  },
  guardar: async (req: Request, res: Response) => {
    try {
      const apoderado: Apoderado = new Apoderado();
      Object.assign(apoderado, req.body);
      apoderado.creado_por = req.creado_por;
      apoderado.actualizado_por = req.actualizado_por;
      let responseSent = false;
      const { error: validationError } = ApoderadoSchema.validate(req.body);
      const { data, error } = await client
        .from("personas")
        .select("*")
        .eq("persona_id", apoderado.persona_id)
        .single();
      if (error || !data) {
        throw new Error("La persona no existe");
      }
      const { data: dataColegio, error: errorColegio } = await client
        .from("colegios")
        .select("*")
        .eq("colegio_id", apoderado.colegio_id)
        .single();
      if (errorColegio || !dataColegio) {
        throw new Error("El colegio no existe");
      }

      if (validationError) {
        responseSent = true;
        throw new Error(validationError.details[0].message);
      }
      if (!responseSent) {
        const savedApoderado = await dataService.processData(apoderado);
        res.status(201).json(savedApoderado);
      }
    } catch (err) {
      const error = err as Error;
      console.error("Error al guardar el apoderado:", error);
      res.status(500).json({ message: error.message || "Error inesperado" });
    }
  },
  actualizar: async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const apoderado: Apoderado = new Apoderado();
      Object.assign(apoderado, req.body);
      apoderado.actualizado_por = req.actualizado_por;
      let responseSent = false;
      const { error: validationError } = ApoderadoSchema.validate(req.body);
      const { data, error } = await client
        .from("personas")
        .select("*")
        .eq("persona_id", apoderado.persona_id)
        .single();
      if (error || !data) {
        throw new Error("La persona no existe");
      }
      const { data: dataColegio, error: errorColegio } = await client
        .from("colegios")
        .select("*")
        .eq("colegio_id", apoderado.colegio_id)
        .single();
      if (errorColegio || !dataColegio) {
        throw new Error("El colegio no existe");
      }

      if (validationError) {
        responseSent = true;
        throw new Error(validationError.details[0].message);
      }
      if (!responseSent) {
        await dataService.updateById(id, apoderado);
        res
          .status(200)
          .json({ message: "Apoderado actualizado correctamente" });
      }
    } catch (error) {
      console.error("Error al actualizar la apoderado:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  },
  async eliminar(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      await dataService.deleteById(id);
      res.status(200).json({ message: "Apoderado eliminada correctamente" });
    } catch (error) {
      console.error("Error al eliminar la apoderado:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  },
};
