import { Request, Response } from "express";
import { DataService } from "../DataService";
import { AlertaEvidencia } from "../../../core/modelo/alerta/AlertaEvidencia";
import { SupabaseClientService } from "../../../core/services/supabaseClient";
import { SupabaseClient } from "@supabase/supabase-js";
import Joi from "joi";

const AlertaEvidenciaSchema = Joi.object({
  alumno_alerta_id: Joi.number().integer().required(),
  url_evidencia: Joi.string().max(255).required(),
});
const supabaseService = new SupabaseClientService();
const client: SupabaseClient = supabaseService.getClient();
const dataService: DataService<AlertaEvidencia> = new DataService(
  "alumnos_alertas_evidencias","alumno_alerta_evidencia_id"
);
export const AlertaEvidenciasService = {
  async obtener(req: Request, res: Response) {
    try {
      const where = { ...req.query }; // Convertir los parámetros de consulta en filtros
      const alertaEvidencia = await dataService.getAll(
        [
          "*",
          "alumnos_alertas(alumno_alerta_id,fecha_generada,fecha_resolucion,accion_tomada,alumnos(alumno_id,url_foto_perfil,personas(persona_id,nombres,apellidos)),alertas_reglas(alerta_regla_id,nombre),alertas_origenes(alerta_origen_id,nombre),alertas_severidades(alerta_severidad_id,nombre),alertas_prioridades(alerta_prioridad_id,nombre),alertas_tipos(alerta_tipo_id,nombre)))",
        ],
        where
      );
      res.json(alertaEvidencia);
    } catch (error) {
      console.error("Error al obtener la alerta evidencia:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  },
  guardar: async (req: Request, res: Response) => {
    try {
      const alertaEvidencia: AlertaEvidencia = new AlertaEvidencia();
      Object.assign(alertaEvidencia, req.body);
      alertaEvidencia.creado_por = req.creado_por;
      alertaEvidencia.actualizado_por = req.actualizado_por;
      let responseSent = false;
      const { error: validationError } = AlertaEvidenciaSchema.validate(
        req.body
      );
      const { data, error } = await client
        .from("alumnos_alertas")
        .select("*")
        .eq("alumno_alerta_id", alertaEvidencia.alumno_alerta_id)
        .single();
      if (error || !data) {
        throw new Error("El colegio no existe");
      }
      if (validationError) {
        responseSent = true;
        throw new Error(validationError.details[0].message);
      }
      if (!responseSent) {
        const savedAlertaEvidencia = await dataService.processData(
          alertaEvidencia
        );
        res.status(201).json(savedAlertaEvidencia);
      }
    } catch (error) {
      console.error("Error al guardar la alerta evidencia:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  },
  async actualizar(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const alertaEvidencia: AlertaEvidencia = new AlertaEvidencia();
      Object.assign(alertaEvidencia, req.body);
      alertaEvidencia.creado_por = req.creado_por;
      alertaEvidencia.actualizado_por = req.actualizado_por;
      let responseSent = false;
      const { error: validationError } = AlertaEvidenciaSchema.validate(
        req.body
      );
      const { data, error } = await client
        .from("alumnos_alertas")
        .select("*")
        .eq("alumno_alerta_id", alertaEvidencia.alumno_alerta_id)
        .single();
      if (error || !data) {
        throw new Error("El colegio no existe");
      }
      if (validationError) {
        responseSent = true;
        throw new Error(validationError.details[0].message);
      }
      if (!responseSent) {
        await dataService.updateById(id, alertaEvidencia);
        res
          .status(200)
          .json({ message: "Alerta evidencia actualizada correctamente" });
      }
    } catch (error) {
      console.error("Error al actualizar la alerta evidencia:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  },
  async eliminar(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      await dataService.deleteById(id);
      res
        .status(200)
        .json({ message: "Alerta evidencia eliminada correctamente" });
    } catch (error) {
      console.error("Error al eliminar la alerta evidencia:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  },
};
