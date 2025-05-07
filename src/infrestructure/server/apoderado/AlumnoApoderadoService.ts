import { Request, Response } from "express";

import { DataService } from "../DataService";
import { AlumnoApoderado } from "../../../core/modelo/apoderado/AlumnoApoderado";

const dataService:DataService<AlumnoApoderado> = new DataService("alumnos_respuestas");
export const AlumnoApoderadoService = {
    async obtener(req: Request, res: Response) {
        try {
            const where = { ...req.query }; // Convertir los parámetros de consulta en filtros
            const alumnoApoderado = await dataService.getAll(["*"],where);
            res.json(alumnoApoderado);
        } catch (error) {
            console.error("Error al obtener la alumnoApoderado:", error);
             res.status(500).json({ message: "Error interno del servidor" });
        }
    },
    guardar: async (req: Request, res: Response) => {
        try {
            const alumnoApoderado: AlumnoApoderado = req.body;
            const savedAlumnoApoderado = await dataService.processData(alumnoApoderado);
            res.status(201).json(savedAlumnoApoderado);
        } catch (error) {
            console.error("Error al guardar la alumnoApoderado:", error);
             res.status(500).json({ message: "Error interno del servidor" });
        }
    }
    ,
    async actualizar(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id);
            const alumnoApoderado: AlumnoApoderado = req.body;
            await dataService.updateById(id, alumnoApoderado);
            res.status(200).json({ message: "AlumnoApoderado actualizado correctamente" });
        } catch (error) {
            console.error("Error al actualizar la alumnoApoderado:", error);
             res.status(500).json({ message: "Error interno del servidor" });
        }
    }
    ,
    async eliminar(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id);
            await dataService.deleteById(id);
            res.status(200).json({ message: "AlumnoApoderado eliminada correctamente" });
        } catch (error) {
            console.error("Error al eliminar la alumnoApoderado:", error);
             res.status(500).json({ message: "Error interno del servidor" });
        }
    }
}