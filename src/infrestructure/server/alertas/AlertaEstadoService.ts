/* eslint-disable @typescript-eslint/no-unused-vars */
import { Request, Response } from "express";
import { DataService } from "../DataService";
import { AlertaEstado } from "../../../core/modelo/alerta/AlertaEstado";
import Joi from "joi";

const dataService: DataService<AlertaEstado> = new DataService("alertas_estado", "alerta_estado_id");
const AlertaEstadoSchema = Joi.object({
  nombre_alerta_estado: Joi.string().max(255).required(),
});
const AlertaEstadoUpdateSchema = Joi.object({
  nombre_alerta_estado: Joi.string().max(255).required(),
  activo: Joi.boolean().optional(),
});
export const AlertaEstadosService = {
    async obtener(req: Request, res: Response) {
        try {
          const { colegio_id, ...where } = req.query; // Convertir los parámetros de consulta en filtros
          const alertaEstado = await dataService.getAll(["*"], where);
          res.json(alertaEstado);

        } catch (error) {
            console.error("Error al obtener la alerta estado:", error);
            res.status(500).json({ message: "Error interno del servidor" });
        }
    },
    guardar: async (req: Request, res: Response) => {
        try {
          const alertaEstado: AlertaEstado = req.body;
          Object.assign(alertaEstado, req.body);
          const { error: validationError } = AlertaEstadoSchema.validate(req.body);
          alertaEstado.creado_por = req.creado_por;
          alertaEstado.actualizado_por = req.actualizado_por;
          if (validationError) {
            throw new Error(validationError.details[0].message);
          }
          const savedAlertaEstado = await dataService.processData(alertaEstado);
          res.status(201).json(savedAlertaEstado);
        } catch (error) {
            console.error("Error al guardar la alerta estado:", error);
            res.status(500).json({ message: "Error interno del servidor" });
        }
    },
    async actualizar(req: Request, res: Response) {
      try {
        const id = parseInt(req.params.id);
        const alertaEstado: AlertaEstado = req.body;
        const { error: validationError } = AlertaEstadoUpdateSchema.validate(req.body);
        Object.assign(alertaEstado, req.body);
        alertaEstado.actualizado_por = req.actualizado_por;
        alertaEstado.fecha_actualizacion = new Date().toISOString();
        if (validationError) {
          throw new Error(validationError.details[0].message);
        }
        await dataService.updateById(id, alertaEstado);
        res.status(200).json({ message: "Alerta estado actualizada correctamente" });
      } catch (error) {
        console.error("Error al actualizar la alerta estado:", error);
        res.status(500).json({ message: "Error interno del servidor" });
      }
    },
    async eliminar(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id);
            await dataService.deleteById(id);
            res.status(200).json({ message: "Alerta estado eliminada correctamente" });
        } catch (error) {
            console.error("Error al eliminar la alerta estado:", error);
            res.status(500).json({ message: "Error interno del servidor" });
        }
    }
}