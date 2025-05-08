import { Request, Response } from "express";
import { DataService } from "../DataService";
import { AlertaSeveridad } from "../../../core/modelo/alerta/AlertaSeveridad";

const dataService: DataService<AlertaSeveridad> = new DataService("alertaseveridades");
export const AlertaSeveridadesService = {
    async obtener(req: Request, res: Response) {
        try {
           /* const where = { ...req.query }; // Convertir los parámetros de consulta en filtros
            const alertaSeveridad = await dataService.getAll(["*"], where);
            res.json(alertaSeveridad);*/
            const severidadAlertas = [
                {
                  "alerta_severidad_id": 1,
                  "nombre": "Informativa"
                },
                {
                  "alerta_severidad_id": 2,
                  "nombre": "Leve"
                },
                {
                  "alerta_severidad_id": 3,
                  "nombre": "Moderada"
                },
                {
                  "alerta_severidad_id": 4,
                  "nombre": "Grave"
                },
                {
                  "alerta_severidad_id": 5,
                  "nombre": "Crítica"
                }
              ];
            res.json(severidadAlertas);
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