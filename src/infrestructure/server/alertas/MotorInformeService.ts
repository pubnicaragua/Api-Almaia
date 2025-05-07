import { Request, Response } from "express";
import { DataService } from "../DataService";
import { MotorInforme } from "../../../core/modelo/alerta/MotorInforme";

const dataService: DataService<MotorInforme> = new DataService("alertas_origenes");
export const MotorInformesService = {
    async obtener(req: Request, res: Response) {
        try {
            const where = { ...req.query }; // Convertir los parámetros de consulta en filtros
            const motorInforme = await dataService.getAll(["*"], where);
            res.json(motorInforme);
        } catch (error) {
            console.error("Error al obtener el motor de informe:", error);
            res.status(500).json({ message: "Error interno del servidor" });
        }
    },
    guardar: async (req: Request, res: Response) => {
        try {
            const motorInforme: MotorInforme = req.body;
            const savedMotorInforme = await dataService.processData(motorInforme);
            res.status(201).json(savedMotorInforme);
        } catch (error) {
            console.error("Error al guardar el motor de informe:", error);
            res.status(500).json({ message: "Error interno del servidor" });
        }
    },
    async actualizar(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id);
            const motorInforme: MotorInforme = req.body;
            await dataService.updateById(id, motorInforme);
            res.status(200).json({ message: "Motor de informe actualizado correctamente" });
        } catch (error) {
            console.error("Error al actualizar el motor de informe:", error);
            res.status(500).json({ message: "Error interno del servidor" });
        }
    },
    async eliminar(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id);
            await dataService.deleteById(id);
            res.status(200).json({ message: "Motor de informe eliminado correctamente" });
        } catch (error) {
            console.error("Error al eliminar el motor de informe:", error);
            res.status(500).json({ message: "Error interno del servidor" });
        }
    }
}