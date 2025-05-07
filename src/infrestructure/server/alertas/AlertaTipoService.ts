import { Request, Response } from "express";
import { DataService } from "../DataService";
import { AlertaTipo } from "../../../core/modelo/alerta/AlertaTipo";

const dataService: DataService<AlertaTipo> = new DataService("alertas_origenes");
export const AlertaTiposService = {
    async obtener(req: Request, res: Response) {
        try {
            const where = { ...req.query }; // Convertir los parámetros de consulta en filtros
            const alertaTipo = await dataService.getAll(["*"], where);
            res.json(alertaTipo);
        } catch (error) {
            console.error("Error al obtener la alerta tipo:", error);
            res.status(500).json({ message: "Error interno del servidor" });
        }
    },
    guardar: async (req: Request, res: Response) => {
        try {
            const alertaTipo: AlertaTipo = req.body;
            const savedAlertaTipo = await dataService.processData(alertaTipo);
            res.status(201).json(savedAlertaTipo);
        } catch (error) {
            console.error("Error al guardar la alerta tipo:", error);
            res.status(500).json({ message: "Error interno del servidor" });
        }
    },
    async actualizar(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id);
            const alertaTipo: AlertaTipo = req.body;
            await dataService.updateById(id, alertaTipo);
            res.status(200).json({ message: "Alerta tipo actualizada correctamente" });
        } catch (error) {
            console.error("Error al actualizar la alerta tipo:", error);
            res.status(500).json({ message: "Error interno del servidor" });
        }
    },
    async eliminar(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id);
            await dataService.deleteById(id);
            res.status(200).json({ message: "Alerta tipo eliminada correctamente" });
        } catch (error) {
            console.error("Error al eliminar la alerta tipo:", error);
            res.status(500).json({ message: "Error interno del servidor" });
        }
    }
}