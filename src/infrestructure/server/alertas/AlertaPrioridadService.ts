import { Request, Response } from "express";
import { DataService } from "../DataService";
import { AlertaPrioridad } from "../../../core/modelo/alerta/AlertaPrioridad";

const dataService: DataService<AlertaPrioridad> = new DataService("alertas_prioridades");
export const AlertaPrioridadsService = {
    async obtener(req: Request, res: Response) {
        try {
            const where = { ...req.query }; // Convertir los parámetros de consulta en filtros
            const alertaPrioridad = await dataService.getAll(["*"], where);
            res.json(alertaPrioridad);
        } catch (error) {
            console.error("Error al obtener la alerta prioridad:", error);
            res.status(500).json({ message: "Error interno del servidor" });
        }
    },
    guardar: async (req: Request, res: Response) => {
        try {
            const alertaPrioridad: AlertaPrioridad = req.body;
            const savedAlertaPrioridad = await dataService.processData(alertaPrioridad);
            res.status(201).json(savedAlertaPrioridad);
        } catch (error) {
            console.error("Error al guardar la alerta prioridad:", error);
            res.status(500).json({ message: "Error interno del servidor" });
        }
    },
    async actualizar(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id);
            const alertaPrioridad: AlertaPrioridad = req.body;
            await dataService.updateById(id, alertaPrioridad);
            res.status(200).json({ message: "Alerta prioridad actualizada correctamente" });
        } catch (error) {
            console.error("Error al actualizar la alerta prioridad:", error);
            res.status(500).json({ message: "Error interno del servidor" });
        }
    },
    async eliminar(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id);
            await dataService.deleteById(id);
            res.status(200).json({ message: "Alerta prioridad eliminada correctamente" });
        } catch (error) {
            console.error("Error al eliminar la alerta prioridad:", error);
            res.status(500).json({ message: "Error interno del servidor" });
        }
    }
}