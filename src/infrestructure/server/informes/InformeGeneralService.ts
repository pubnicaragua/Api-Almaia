import { Request, Response } from "express";
import { DataService } from "../DataService";
import { InformeGeneral } from "../../../core/modelo/InformeGeneral";
import { SupabaseClientService } from "../../../core/services/supabaseClient";
import { SupabaseClient } from "@supabase/supabase-js";
import Joi from "joi";
import { mapearInformesConNombres } from "../../../core/services/InformeServicioCasoUso";

const supabaseService = new SupabaseClientService();
const client: SupabaseClient = supabaseService.getClient();
const dataService: DataService<InformeGeneral> = new DataService(
  "informes_generales"
);
const InformeGeneralSchema = Joi.object({
  colegio_id: Joi.number().integer().required(),
  tipo: Joi.string().max(50).required(),
  nivel: Joi.string().max(50).required(),
  fecha_generacion: Joi.string().required(),
  url_reporte: Joi.string().max(255).required(),
});
export const InformeGeneralService = {
  async obtener(req: Request, res: Response) {
    try {
      const where = { ...req.query }; // Convertir los parámetros de consulta en filtros
      const { curso_id } = where; // Extraer curso_id si existe
      //si curso_id es string entonces guardarlo en un arreglo
      if (typeof curso_id === "string") {
        where.curso_id = [curso_id];
      }
      //si hay cursos entonces filtrar por cursos
      const { data, error } = await client.rpc('obtener_informes_con_cursos', {
        colegio_id_param: where.colegio_id,
        cursos_param: where.curso_id  // ← esto es clave
      });
      let response = data;
      if (data === null) response = []
      res.json(response);
    } catch (error) {
      console.error("Error al obtener el informe general:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  },
  guardar: async (req: Request, res: Response) => {
    try {
      const informeGeneral: InformeGeneral = new InformeGeneral();
      Object.assign(informeGeneral, req.body);
      informeGeneral.creado_por = req.creado_por;
      informeGeneral.actualizado_por = req.actualizado_por;
      let responseSent = false;
      const { error: validationError } = InformeGeneralSchema.validate(
        req.body
      );
      const { data, error } = await client
        .from("colegios")
        .select("*")
        .eq("colegio_id", informeGeneral.colegio_id)
        .single();
      if (error || !data) {
        throw new Error("El colegio no existe");
      }

      if (validationError) {
        responseSent = true;
        throw new Error(validationError.details[0].message);
      }
      if (!responseSent) {
        const savedInformeGeneral = await dataService.processData(
          informeGeneral
        );
        res.status(201).json(savedInformeGeneral);
      }
    } catch (error) {
      console.error("Error al guardar el informe general:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  },
  actualizar: async (req: Request, res: Response) => {
    try {
      const informeId = parseInt(req.params.id);

      const informeGeneral: InformeGeneral = new InformeGeneral();
      Object.assign(informeGeneral, req.body);
      informeGeneral.creado_por = req.creado_por;
      informeGeneral.actualizado_por = req.actualizado_por;
      let responseSent = false;
      const { error: validationError } = InformeGeneralSchema.validate(
        req.body
      );
      const { data, error } = await client
        .from("colegios")
        .select("*")
        .eq("colegio_id", informeGeneral.colegio_id)
        .single();
      if (error || !data) {
        throw new Error("El colegio no existe");
      }

      if (validationError) {
        responseSent = true;
        throw new Error(validationError.details[0].message);
      }
      if (!responseSent) {
        const updatedInformeGeneral = await dataService.updateById(
          informeId,
          informeGeneral
        );
        res.status(200).json(updatedInformeGeneral);
      }
    } catch (error) {
      console.error("Error al actualizar el informe general:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  },

  eliminar: async (req: Request, res: Response) => {
    try {
      const informeId = parseInt(req.params.id);
      await dataService.deleteById(informeId);
      res.status(204).send();
    } catch (error) {
      console.error("Error al eliminar el informe general:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  },
};
