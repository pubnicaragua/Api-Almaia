import { Request, Response } from "express";
import { DataService } from "../DataService";
import { MotorAlerta } from "../../../core/modelo/alerta/MotorAlerta";

const dataService: DataService<MotorAlerta> = new DataService("alertas_origenes");
export const MotorAlertasService = {
        
    async obtener(req: Request, res: Response) {
        try {
            const where = { ...req.query }; // Convertir los parámetros de consulta en filtros
            const motorAlerta = await dataService.getAll(["*"], where);
            res.json(motorAlerta);
        } catch (error) {
            console.error("Error al obtener el motor de alerta:", error);
            res.status(500).json({ message: "Error interno del servidor" });
        }
    },
    guardar: async (req: Request, res: Response) => {
        try {
            const motorAlerta: MotorAlerta = req.body;
            const savedMotorAlerta = await dataService.processData(motorAlerta);
            res.status(201).json(savedMotorAlerta);
        } catch (error) {
            console.error("Error al guardar el motor de alerta:", error);
            res.status(500).json({ message: "Error interno del servidor" });
        }
    },
    async actualizar(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id);
            const motorAlerta: MotorAlerta = req.body;
            await dataService.updateById(id, motorAlerta);
            res.status(200).json({ message: "Motor de alerta actualizado correctamente" });
        } catch (error) {
            console.error("Error al actualizar el motor de alerta:", error);
            res.status(500).json({ message: "Error interno del servidor" });
        }
    },
    async eliminar(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id);
            await dataService.deleteById(id);
            res.status(200).json({ message: "Motor de alerta eliminado correctamente" });
        } catch (error) {
            console.error("Error al eliminar el motor de alerta:", error);
            res.status(500).json({ message: "Error interno del servidor" });
        }
    }
}