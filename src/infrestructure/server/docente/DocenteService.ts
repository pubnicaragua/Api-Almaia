import { Request, Response } from "express";
import { DataService } from "../DataService";
import { Docente } from "../../../core/modelo/colegio/Docente";
import { SupabaseClientService } from "../../../core/services/supabaseClient";
import { SupabaseClient } from "@supabase/supabase-js";
import Joi from "joi";

const supabaseService = new SupabaseClientService();
const client: SupabaseClient = supabaseService.getClient();
const dataService: DataService<Docente> = new DataService("docentes","docente_id");
const DocenteSchema = Joi.object({
  persona_id: Joi.number().integer().required(),
  colegio_id: Joi.number().integer().required(),
  especialidad: Joi.string().max(100).required(),
  estado: Joi.string().max(20).required(),
});
export const DocentesService = {
  async obtener(req: Request, res: Response) {
    try {
      const where = { ...req.query }; // Convertir los parámetros de consulta en filtros
      const docente = await dataService.getAll(
        [
          "*",
          "personas(persona_id,nombres,apellidos)",
          "colegios(colegio_id,nombre)",
        ],
        where
      );
      res.json(docente);
    } catch (error) {
      console.error("Error al obtener el docente:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  },
  async detalle(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const where = { docente_id: id }; // Convertir los parámetros de consulta en filtros
      const docente_data = await dataService.getAll(
        [
          "*",
          "personas(persona_id,nombres,apellidos)",
          "colegios(colegio_id,nombre)",
        ],
        where
      );
      const docente = docente_data[0];
      res.json(docente);
    } catch (error) {
      console.error("Error al obtener el docente:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  },
  guardar: async (req: Request, res: Response) => {
    try {
      const docente: Docente = new Docente();
      Object.assign(docente, req.body);
      docente.creado_por = req.creado_por;
      docente.actualizado_por = req.actualizado_por;
      let responseSent = false;
      const { error: validationError } = DocenteSchema.validate(req.body);
      const { data, error } = await client
        .from("personas")
        .select("*")
        .eq("persona_id", docente.persona_id)
        .single();
      if (error || !data) {
        throw new Error("La persona no existe");
      }
      const { data: dataColegio, error: errorColegio } = await client
        .from("colegios")
        .select("*")
        .eq("colegio_id", docente.colegio_id)
        .single();
      if (errorColegio || !dataColegio) {
        throw new Error("El colegio no existe");
      }

      if (validationError) {
        responseSent = true;
        throw new Error(validationError.details[0].message);
      }
      if (!responseSent) {
        const savedDocente = await dataService.processData(docente);
        res.status(201).json(savedDocente);
      }
    } catch (err) {
      const error = err as Error;
      console.error("Error al guardar el docente:", error);
      res.status(500).json({ message: error.message || "Error inesperado" });
    }
  },
  async actualizar(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const docente: Docente = new Docente();
      Object.assign(docente, req.body);
      docente.creado_por = req.creado_por;
      docente.actualizado_por = req.actualizado_por;
      let responseSent = false;
      const { error: validationError } = DocenteSchema.validate(req.body);
      const { data, error } = await client
        .from("personas")
        .select("*")
        .eq("persona_id", docente.persona_id)
        .single();
      if (error || !data) {
        throw new Error("La persona no existe");
      }
      const { data: dataColegio, error: errorColegio } = await client
        .from("colegios")
        .select("*")
        .eq("colegio_id", docente.colegio_id)
        .single();
      if (errorColegio || !dataColegio) {
        throw new Error("El colegio no existe");
      }

      if (validationError) {
        responseSent = true;
        throw new Error(validationError.details[0].message);
      }
      if (!responseSent) {
        await dataService.updateById(id, docente);
        res.status(200).json({ message: "docente actualizado correctamente" });
      }
    } catch (error) {
      console.error("Error al actualizar el docente:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  },
  async eliminar(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      await dataService.deleteById(id);
      res.status(200).json({ message: "docente eliminado correctamente" });
    } catch (error) {
      console.error("Error al eliminar el docente:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  },
};
