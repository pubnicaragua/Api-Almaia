import { Request, Response } from "express";
import { DataService } from "../DataService";
import { AlertaRegla } from "../../../core/modelo/alerta/AlertaRegla";

const dataService: DataService<AlertaRegla> = new DataService("alertareglaes");
export const AlertaReglasService = {
    async obtener(req: Request, res: Response) {
        try {
            const where = { ...req.query }; // Convertir los parámetros de consulta en filtros
            const alertaRegla = await dataService.getAll(["*"], where);
            res.json(alertaRegla);
        } catch (error) {
            console.error("Error al obtener la alerta regla:", error);
            res.status(500).json({ message: "Error interno del servidor" });
        }
    },
    guardar: async (req: Request, res: Response) => {
        try {
            const alertaRegla: AlertaRegla = req.body;
            const savedAlertaRegla = await dataService.processData(alertaRegla);
            res.status(201).json(savedAlertaRegla);
        } catch (error) {
            console.error("Error al guardar la alerta regla:", error);
            res.status(500).json({ message: "Error interno del servidor" });
        }
    },
    async actualizar(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id);
            const alertaRegla: AlertaRegla = req.body;
            await dataService.updateById(id, alertaRegla);
            res.status(200).json({ message: "Alerta regla actualizada correctamente" });
        } catch (error) {
            console.error("Error al actualizar la alerta regla:", error);
            res.status(500).json({ message: "Error interno del servidor" });
        }
    },
    async eliminar(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id);
            await dataService.deleteById(id);
            res.status(200).json({ message: "Alerta regla eliminada correctamente" });
        } catch (error) {
            console.error("Error al eliminar la alerta regla:", error);
            res.status(500).json({ message: "Error interno del servidor" });
        }
    }
    
}