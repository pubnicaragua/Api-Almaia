import { Request, Response } from "express";

import { DataService } from "../DataService";
import { ApoderadoDireccion } from "../../../core/modelo/apoderado/ApoderadoDireccion";

const dataService:DataService<ApoderadoDireccion> = new DataService("alumnos_respuestas");
export const ApoderadoDireccionService = {
    async obtener(req: Request, res: Response) {
        try {
            const where = { ...req.query }; // Convertir los parámetros de consulta en filtros
            const apoderadoDireccion = await dataService.getAll(["*"],where);
            res.json(apoderadoDireccion);
        } catch (error) {
            console.error("Error al obtener la apoderadoDireccion:", error);
             res.status(500).json({ message: "Error interno del servidor" });
        }
    },
    guardar: async (req: Request, res: Response) => {
        try {
            const apoderadoDireccion: ApoderadoDireccion = req.body;
            const savedApoderadoDireccion = await dataService.processData(apoderadoDireccion);
            res.status(201).json(savedApoderadoDireccion);
        } catch (error) {
            console.error("Error al guardar la apoderadoDireccion:", error);
             res.status(500).json({ message: "Error interno del servidor" });
        }
    }
    ,
    async actualizar(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id);
            const apoderadoDireccion: ApoderadoDireccion = req.body;
            await dataService.updateById(id, apoderadoDireccion);
            res.status(200).json({ message: "ApoderadoDireccion actualizado correctamente" });
        } catch (error) {
            console.error("Error al actualizar la apoderadoDireccion:", error);
             res.status(500).json({ message: "Error interno del servidor" });
        }
    },
    async eliminar(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id);
            await dataService.deleteById(id);
            res.status(200).json({ message: "ApoderadoDireccion eliminada correctamente" });
        } catch (error) {
            console.error("Error al eliminar la apoderadoDireccion:", error);
             res.status(500).json({ message: "Error interno del servidor" });
        }
    }

}