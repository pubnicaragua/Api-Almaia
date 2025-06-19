import { Request, Response } from "express";
import { DataService } from "../DataService";
import Joi from "joi";
import { SupabaseClient } from "@supabase/supabase-js";
import { SupabaseClientService } from "../../../core/services/supabaseClient";
import { Persona } from "../../../core/modelo/Persona";

const supabaseService = new SupabaseClientService();
const client: SupabaseClient = supabaseService.getClient();

const dataService: DataService<Persona> = new DataService(
  "personas",
  "persona_id"
);
const PersonaSchema = Joi.object({
  tipo_documento: Joi.string().max(50).required(),
  numero_documento: Joi.string().max(16).required(),
  nombres: Joi.string().max(50).required(),
  apellidos: Joi.string().max(30).required(),
  genero_id: Joi.number().integer().required(),
  estado_civil_id: Joi.number().integer().required(),
});
export const PersonasService = {
  async obtener(req: Request, res: Response) {
    try {
      const { colegio_id, ...filtros } = req.query;
      const where = { ...filtros };
      console.log(colegio_id);

      const personas = await dataService.getAll(
        [
          "*",
          "generos(genero_id,nombre)",
          "estados_civiles(estado_civil_id,nombre)",
        ],
        where
      );
      res.json(personas);
    } catch (error) {
      console.error("Error al obtener el persona:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  },
  guardar: async (req: Request, res: Response) => {
    try {
      const persona: Persona = new Persona();
      Object.assign(persona, req.body);
      persona.creado_por = req.creado_por;
      persona.actualizado_por = req.actualizado_por;
      let responseSent = false;
      const { error: validationError } = PersonaSchema.validate(req.body);
      const { data, error } = await client
        .from("estados_civiles")
        .select("*")
        .eq("estado_civil_id", persona.estado_civil_id)
        .single();
      if (error || !data) {
        throw new Error("El estado civil no existe");
      }
      const { data: dataGenero, error: errorGenero } = await client
        .from("generos")
        .select("*")
        .eq("genero_id", persona.genero_id)
        .single();
      if (errorGenero || !dataGenero) {
        throw new Error("El genero no existe");
      }
      if (validationError) {
        responseSent = true;
        throw new Error(validationError.details[0].message);
      }
      if (!responseSent) {
        console.log(persona);

        const savedPersona = await dataService.processData(persona);
        res.status(201).json(savedPersona);
      }
    } catch (err) {
      const error = err as Error;
      console.error("Error al guardar el persona:", error);
      res.status(500).json({ message: error.message || "Error inesperado" });
    }
  },
  async actualizar(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const persona: Persona = new Persona();
      Object.assign(persona, req.body);
      persona.actualizado_por = req.actualizado_por;
      let responseSent = false;
      const { error: validationError } = PersonaSchema.validate(req.body);
      const { data, error } = await client
        .from("estados_civiles")
        .select("*")
        .eq("estado_civil_id", persona.estado_civil_id)
        .single();
      if (error || !data) {
        throw new Error("El estado civil no existe");
      }
      const { data: dataGenero, error: errorGenero } = await client
        .from("generos")
        .select("*")
        .eq("genero_id", persona.genero_id)
        .single();
      if (errorGenero || !dataGenero) {
        throw new Error("El genero no existe");
      }
      if (validationError) {
        responseSent = true;
        throw new Error(validationError.details[0].message);
      }
      if (!responseSent) {
        await dataService.updateById(id, persona);
        res.status(200).json({ message: "Persona actualizado correctamente" });
      }
    } catch (error) {
      console.error("Error al actualizar el persona:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  },
  async eliminar(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      await dataService.deleteById(id);
      res.status(200).json({ message: "Persona eliminado correctamente" });
    } catch (error) {
      console.error("Error al eliminar el persona:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  },
};
