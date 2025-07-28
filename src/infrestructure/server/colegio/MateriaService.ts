import { Request, Response } from "express";
import { DataService } from "../DataService";
import Joi from "joi";
import { SupabaseClient } from "@supabase/supabase-js";
import { SupabaseClientService } from "../../../core/services/supabaseClient";
import { Materia } from "../../../core/modelo/colegio/Materia";

const supabaseService = new SupabaseClientService();
const client: SupabaseClient = supabaseService.getClient();

const dataService: DataService<Materia> = new DataService(
  "materias",
  "materia_id"
);
const MateriaSchema = Joi.object({
  nombre: Joi.string().max(100).required(),
  codigo: Joi.string().max(20).optional(),
  colegio_id: Joi.number().integer().required(),
});
export const MateriasService = {
  async obtener(req: Request, res: Response) {
    try {
      const where = { ...req.query }; // Convertir los parámetros de consulta en filtros
      const materias = await dataService.getAll(
        [
          "*",
          "colegios(colegio_id,nombre)"
        ],
        where
      );
      res.json(materias);
    } catch (error) {
      console.error("Error al obtener el materia:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  },
  guardar: async (req: Request, res: Response) => {
    try {
      const materia: Materia = new Materia();
      Object.assign(materia, req.body);
      materia.creado_por = req.creado_por;
      materia.actualizado_por = req.actualizado_por;
      let responseSent = false;
      const { error: validationError } = MateriaSchema.validate(req.body);
      const { data, error } = await client
        .from("colegios")
        .select("*")
        .eq("colegio_id", materia.colegio_id)
        .single();
      if (error || !data) {
        throw new Error("El colegio no existe");
      }
      if (validationError) {
        responseSent = true;
        throw new Error(validationError.details[0].message);
      }
      if (!responseSent) {

        const savedMateria = await dataService.processData(materia);
        res.status(201).json(savedMateria);
      }
    } catch (err) {
      const error = err as Error;
      console.error("Error al guardar el materia:", error);
      res.status(500).json({ message: error.message || "Error inesperado" });
    }
  },
  async actualizar(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const materia: Materia = new Materia();
      Object.assign(materia, req.body);
      materia.actualizado_por = req.actualizado_por;
      let responseSent = false;
      const { error: validationError } = MateriaSchema.validate(req.body);
      const { data, error } = await client
        .from("colegios")
        .select("*")
        .eq("colegio_id", materia.colegio_id)
        .single();
      if (error || !data) {
        throw new Error("El colegio no existe");
      }
      if (validationError) {
        responseSent = true;
        throw new Error(validationError.details[0].message);
      }
      if (!responseSent) {
        await dataService.updateById(id, materia);
        res.status(200).json({ message: "Materia actualizado correctamente" });
      }
    } catch (error) {
      console.error("Error al actualizar el materia:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  },
  async eliminar(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      await dataService.deleteById(id);
      res.status(200).json({ message: "Materia eliminado correctamente" });
    } catch (error) {
      console.error("Error al eliminar el materia:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  },
};
