import { Request, Response } from "express";

import { DataService } from "../DataService";
import { GeneradorInforme } from "../../../core/modelo/preguntasRespuestas/GeneradorInforme";

const dataService:DataService<GeneradorInforme> = new DataService("generadores_informes");
export const GeneradorInformeService = {
    async obtener(req: Request, res: Response) {
        try {
            const where = { ...req.query }; // Convertir los parámetros de consulta en filtros
            const generadorInforme = await dataService.getAll(["*"],where);
            res.json(generadorInforme);
        } catch (error) {
            console.error("Error al obtener el generadorInforme:", error);
             res.status(500).json({ message: "Error interno del servidor" });
        }
    },
    guardar: async (req: Request, res: Response) => {
        try {
            const generadorInforme: GeneradorInforme = req.body;
            const savedGeneradorInforme = await dataService.processData(generadorInforme);
            res.status(201).json(savedGeneradorInforme);
        } catch (error) {
            console.error("Error al guardar el generadorInforme:", error);
             res.status(500).json({ message: "Error interno del servidor" });
        }
    },
    async actualizar(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id);
            const generadorInforme: GeneradorInforme = req.body;
            await dataService.updateById(id, generadorInforme);
            res.status(200).json({ message: "GeneradorInforme actualizado correctamente" });
        } catch (error) {
            console.error("Error al actualizar el generadorInforme:", error);
             res.status(500).json({ message: "Error interno del servidor" });
        }
    },
    async eliminar(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id);
            await dataService.deleteById(id);
            res.status(200).json({ message: "Generador Informe eliminado correctamente" });
        } catch (error) {
            console.error("Error al eliminar el generadorInforme:", error);
             res.status(500).json({ message: "Error interno del servidor" });
        }
    }
}