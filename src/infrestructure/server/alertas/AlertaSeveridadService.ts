/* eslint-disable @typescript-eslint/no-unused-vars */
import { Request, Response } from "express";
import { DataService } from "../DataService";
import { AlertaSeveridad } from "../../../core/modelo/alerta/AlertaSeveridad";

const dataService: DataService<AlertaSeveridad> = new DataService("alertas_severidades");
export const AlertaSeveridadesService = {
    async obtener(req: Request, res: Response) {
        try {
           const { colegio_id, ...where } = req.query; // Convertir los parámetros de consulta en filtros
            const alertaSeveridad = await dataService.getAll(["*"], where);
            res.status(200).json(alertaSeveridad);

        } catch (error) {
            console.error("Error al obtener la alerta severidad:", error);
            res.status(500).json({ message: "Error interno del servidor" });
        }
    },
    guardar: async (req: Request, res: Response) => {
        try {
            const alertaSeveridad: AlertaSeveridad = req.body;
            const savedAlertaSeveridad = await dataService.processData(alertaSeveridad);
            res.status(201).json(savedAlertaSeveridad);
        } catch (error) {
            console.error("Error al guardar la alerta severidad:", error);
            res.status(500).json({ message: "Error interno del servidor" });
        }
    },
    async actualizar(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id);
            const alertaSeveridad: AlertaSeveridad = req.body;
            await dataService.updateById(id, alertaSeveridad);
            res.status(200).json({ message: "Alerta severidad actualizada correctamente" });
        } catch (error) {
            console.error("Error al actualizar la alerta severidad:", error);
            res.status(500).json({ message: "Error interno del servidor" });
        }
    },
    async eliminar(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id);
            await dataService.deleteById(id);
            res.status(200).json({ message: "Alerta severidad eliminada correctamente" });
        } catch (error) {
            console.error("Error al eliminar la alerta severidad:", error);
            res.status(500).json({ message: "Error interno del servidor" });
        }
    }
}