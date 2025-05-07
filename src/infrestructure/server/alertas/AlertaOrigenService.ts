import { Request, Response } from "express";
import { DataService } from "../DataService";
import { AlertaOrigen } from "../../../core/modelo/alerta/AlertaOrigen";

const dataService: DataService<AlertaOrigen> = new DataService("alertas_origenes");
export const AlertaOrigenesService = {
    async obtener(req: Request, res: Response) {
        try {
            const where = { ...req.query }; // Convertir los parámetros de consulta en filtros
            const alertaOrigen = await dataService.getAll(["*"], where);
            res.json(alertaOrigen);
        } catch (error) {
            console.error("Error al obtener la alerta origen:", error);
            res.status(500).json({ message: "Error interno del servidor" });
        }
    },
    guardar: async (req: Request, res: Response) => {
        try {
            const alertaOrigen: AlertaOrigen = req.body;
            const savedAlertaOrigen = await dataService.processData(alertaOrigen);
            res.status(201).json(savedAlertaOrigen);
        } catch (error) {
            console.error("Error al guardar la alerta origen:", error);
            res.status(500).json({ message: "Error interno del servidor" });
        }
    },
    async actualizar(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id);
            const alertaOrigen: AlertaOrigen = req.body;
            await dataService.updateById(id, alertaOrigen);
            res.status(200).json({ message: "Alerta origen actualizada correctamente" });
        } catch (error) {
            console.error("Error al actualizar la alerta origen:", error);
            res.status(500).json({ message: "Error interno del servidor" });
        }
    },
    async eliminar(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id);
            await dataService.deleteById(id);
            res.status(200).json({ message: "Alerta origen eliminada correctamente" });
        } catch (error) {
            console.error("Error al eliminar la alerta origen:", error);
            res.status(500).json({ message: "Error interno del servidor" });
        }
    }
}