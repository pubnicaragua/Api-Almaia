import { Request, Response } from "express";
import { DataService } from "../DataService";
import { RespuestaPosible } from "../../../core/modelo/preguntasRespuestas/RespuestaPosible";

const dataService:DataService<RespuestaPosible> = new DataService("respuestaposibles");
export const RespuestaPosibleService = {
    async obtener(req: Request, res: Response) {
        try {
            const where = { ...req.query }; // Convertir los parámetros de consulta en filtros
            const respuestaposible = await dataService.getAll(["*"],where);
            res.json(respuestaposible);
        } catch (error) {
            console.error("Error al obtener la respuestaposible:", error);
             res.status(500).json({ message: "Error interno del servidor" });
        }
    },
    guardar: async (req: Request, res: Response) => {
        try {
            const respuestaposible: RespuestaPosible = req.body;
            const savedRespuestaPosible = await dataService.processData(respuestaposible);
            res.status(201).json(savedRespuestaPosible);
        } catch (error) {
            console.error("Error al guardar la respuestaposible:", error);
             res.status(500).json({ message: "Error interno del servidor" });
        }
    },
    async actualizar(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id);
            const respuestaposible: RespuestaPosible = req.body;
            await dataService.updateById(id, respuestaposible);
            res.status(200).json({ message: "RespuestaPosible actualizada correctamente" });
        } catch (error) {
            console.error("Error al actualizar la respuestaposible:", error);
             res.status(500).json({ message: "Error interno del servidor" });
        }
    },
    async eliminar(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id);
            await dataService.deleteById(id);
            res.status(200).json({ message: "RespuestaPosible eliminada correctamente" });
        } catch (error) {
            console.error("Error al eliminar la respuestaposible:", error);
             res.status(500).json({ message: "Error interno del servidor" });
        }
    }
}