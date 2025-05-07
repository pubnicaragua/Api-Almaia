import { Patologia } from "../../../core/modelo/Patologia";
import { DataService } from "../DataService";
import { Request, Response } from "express";

const dataService:DataService<Patologia> = new DataService("patologias");
export const PatologiaService = {
     async obtener(req: Request, res: Response) {
            try {
                const where = { ...req.query }; // Convertir los parámetros de consulta en filtros
                const patologia = await dataService.getAll(["*"],where);
                res.json(patologia);
            } catch (error) {
                console.error("Error al obtener la patologia:", error);
                 res.status(500).json({ message: "Error interno del servidor" });
            }
        },
        guardar: async (req: Request, res: Response) => {
            try {
                const patologia: Patologia = req.body;
                const savedPatologia = await dataService.processData(patologia);
                res.status(201).json(savedPatologia);
            } catch (error) {
                console.error("Error al guardar la patologia:", error);
                 res.status(500).json({ message: "Error interno del servidor" });
            }
        }
        ,
        async actualizar(req: Request, res: Response) {
            try {
                const id = parseInt(req.params.id);
                const patologia: Patologia = req.body;
                await dataService.updateById(id, patologia);
                res.status(200).json({ message: "Patologia actualizada correctamente" });
            } catch (error) {
                console.error("Error al actualizar la patologia:", error);
                 res.status(500).json({ message: "Error interno del servidor" });
            }
        },
        async eliminar(req: Request, res: Response) {
            try {
                const id = parseInt(req.params.id);
                await dataService.deleteById(id);
                res.status(200).json({ message: "Patologia eliminada correctamente" });
            } catch (error) {
                console.error("Error al eliminar la patologia:", error);
                 res.status(500).json({ message: "Error interno del servidor" });
            }
        },
}