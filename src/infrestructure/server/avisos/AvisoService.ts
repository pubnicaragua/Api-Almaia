import { Request, Response } from "express";
import { DataService } from "../DataService";
import { Aviso } from "../../../core/modelo/aviso/Aviso";
import { SupabaseClientService } from "../../../core/services/supabaseClient";
import { SupabaseClient } from "@supabase/supabase-js";
import Joi from "joi";
import { obtenerRelacionados } from "../../../core/services/ObtenerTablasColegioCasoUso";

const supabaseService = new SupabaseClientService();
const client: SupabaseClient = supabaseService.getClient();
const dataService: DataService<Aviso> = new DataService("avisos", "aviso_id");
const AvisoSchema = Joi.object({
  docente_id: Joi.number().integer().required(),
  mensaje: Joi.string().required(),
  dirigido: Joi.string().required(),
  fecha_programada: Joi.string().required(),
  estado: Joi.string().max(20).required(),
});
export const AvisosService = {
  async obtener(req: Request, res: Response) {
    try {
      const { colegio_id, ...where } = req.query;
      let respuestaEnviada = false;
      if (colegio_id !== undefined) {
        const avisos = await obtenerRelacionados({
          tableFilter: "docentes",
          filterField: "colegio_id",
          filterValue: colegio_id,
          idField: "docente_id",
          tableIn: "avisos",
          inField: "docente_id",
          selectFields: `*,                      
                        docentes(docente_id,especialidad,estado,personas(persona_id,nombres,apellidos))`,
        });
        respuestaEnviada = true;
        res.json(avisos);
      }
      if (!respuestaEnviada) {
        const avisos = await dataService.getAll(
          [
            "*",
            "docentes(docente_id,especialidad,estado,personas(persona_id,nombres,apellidos))",
          ],
          where
        );
        res.json(avisos);
      }
    } catch (error) {
      console.error("Error al obtener la aviso:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  },
  guardar: async (req: Request, res: Response) => {
    try {
      const aviso: Aviso = new Aviso();
      Object.assign(aviso, req.body);
      aviso.creado_por = req.creado_por;
      aviso.actualizado_por = req.actualizado_por;
      let responseSent = false;
      const { error: validationError } = AvisoSchema.validate(req.body);
      const { data, error } = await client
        .from("docentes")
        .select("*")
        .eq("docente_id", aviso.docente_id)
        .single();
      if (error || !data) {
        throw new Error("El alumno no existe");
      }

      if (validationError) {
        responseSent = true;
        throw new Error(validationError.details[0].message);
      }
      if (!responseSent) {
        const savedAviso = await dataService.processData(aviso);
        res.status(201).json(savedAviso);
      }
    } catch (err) {
      const error = err as Error;
      console.error("Error al guardar el aviso:", error);
      res.status(500).json({ message: error.message || "Error inesperado" });
    }
  },
  async actualizar(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);

      const aviso: Aviso = new Aviso();
      Object.assign(aviso, req.body);
      aviso.creado_por = req.creado_por;
      aviso.actualizado_por = req.actualizado_por;
      let responseSent = false;
      const { error: validationError } = AvisoSchema.validate(req.body);
      const { data, error } = await client
        .from("docentes")
        .select("*")
        .eq("docente_id", aviso.docente_id)
        .single();
      if (error || !data) {
        throw new Error("El alumno no existe");
      }

      if (validationError) {
        responseSent = true;
        throw new Error(validationError.details[0].message);
      }
      if (!responseSent) {
        await dataService.updateById(id, aviso);
        res.status(200).json({ message: "aviso actualizado correctamente" });
      }
    } catch (error) {
      console.error("Error al actualizar la aviso:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  },
  async eliminar(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      await dataService.deleteById(id);
      res.status(200).json({ message: "aviso eliminada correctamente" });
    } catch (error) {
      console.error("Error al eliminar la aviso:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  },
};
