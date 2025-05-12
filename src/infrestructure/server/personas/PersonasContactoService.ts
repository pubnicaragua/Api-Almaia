import { Request, Response } from "express";
import { DataService } from "../DataService";
import Joi from "joi";
import { SupabaseClient } from "@supabase/supabase-js";
import { SupabaseClientService } from "../../../core/services/supabaseClient";
import { PersonaContacto } from "../../../core/modelo/PersonaContacto";

const supabaseService = new SupabaseClientService();
const client: SupabaseClient = supabaseService.getClient();

const dataService: DataService<PersonaContacto> = new DataService(
  "personas_contactos",
  "persona_contacto_id"
);
const PersonaContactoSchema = Joi.object({
  telefono_contacto: Joi.string().max(16).optional(),
  direcccion: Joi.string().max(100).required(),
  persona_id: Joi.number().integer().required(),
});
export const PersonaContactosService = {
  async obtener(req: Request, res: Response) {
    try {
      const where = { ...req.query }; // Convertir los parámetros de consulta en filtros
      const personacontactos = await dataService.getAll(
        [
          "*",
          "personas(persona_id,tipo_documento,numero_documento,nombres,apellidos,generos(genero_id,nombre),estados_civiles(estado_civil_id,nombre))",
        ],
        where
      );
      res.json(personacontactos);
    } catch (error) {
      console.error("Error al obtener el personacontacto:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  },
  guardar: async (req: Request, res: Response) => {
    try {
      const personacontacto: PersonaContacto = new PersonaContacto();
      Object.assign(personacontacto, req.body);
      personacontacto.creado_por = req.creado_por;
      personacontacto.actualizado_por = req.actualizado_por;
      let responseSent = false;
      const { error: validationError } = PersonaContactoSchema.validate(
        req.body
      );
      const { data, error } = await client
        .from("personas")
        .select("*")
        .eq("persona_id", personacontacto.persona_id)
        .single();
      if (error || !data) {
        throw new Error("La persona no existe");
      }
      if (validationError) {
        responseSent = true;
        throw new Error(validationError.details[0].message);
      }
      if (!responseSent) {
        console.log(personacontacto);

        const savedPersonaContacto = await dataService.processData(
          personacontacto
        );
        res.status(201).json(savedPersonaContacto);
      }
    } catch (err) {
      const error = err as Error;
      console.error("Error al guardar el personacontacto:", error);
      res.status(500).json({ message: error.message || "Error inesperado" });
    }
  },
  async actualizar(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const personacontacto: PersonaContacto = new PersonaContacto();
      Object.assign(personacontacto, req.body);
      personacontacto.actualizado_por = req.actualizado_por;
      let responseSent = false;
      const { error: validationError } = PersonaContactoSchema.validate(
        req.body
      );
      const { data, error } = await client
        .from("personas")
        .select("*")
        .eq("persona_id", personacontacto.persona_id)
        .single();
      if (error || !data) {
        throw new Error("La persona no existe");
      }
      if (validationError) {
        responseSent = true;
        throw new Error(validationError.details[0].message);
      }
      if (!responseSent) {
        await dataService.updateById(id, personacontacto);
        res
          .status(200)
          .json({ message: "PersonaContacto actualizado correctamente" });
      }
    } catch (error) {
      console.error("Error al actualizar el personacontacto:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  },
  async eliminar(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      await dataService.deleteById(id);
      res
        .status(200)
        .json({ message: "PersonaContacto eliminado correctamente" });
    } catch (error) {
      console.error("Error al eliminar el personacontacto:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  },
};
