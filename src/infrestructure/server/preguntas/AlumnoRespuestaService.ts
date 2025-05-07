import { Request, Response } from "express";

import { DataService } from "../DataService";
import { AlumnoRespuesta } from "../../../core/modelo/preguntasRespuestas/AlumnoRespuesta";

const dataService:DataService<AlumnoRespuesta> = new DataService("alumnos_respuestas");
export const AlumnoRespuestaService = {
     async obtener(req: Request, res: Response) {
            try {
                const where = { ...req.query }; // Convertir los parámetros de consulta en filtros
                const alumnorespuesta = await dataService.getAll(["*"],where);
                res.json(alumnorespuesta);
            } catch (error) {
                console.error("Error al obtener la alumnorespuesta:", error);
                 res.status(500).json({ message: "Error interno del servidor" });
            }
        },
        guardar: async (req: Request, res: Response) => {
            try {
                const alumnorespuesta: AlumnoRespuesta = req.body;
                const savedAlumnoRespuesta = await dataService.processData(alumnorespuesta);
                res.status(201).json(savedAlumnoRespuesta);
            } catch (error) {
                console.error("Error al guardar la alumnorespuesta:", error);
                 res.status(500).json({ message: "Error interno del servidor" });
            }
        }
        ,
        async actualizar(req: Request, res: Response) {
            try {
                const id = parseInt(req.params.id);
                const alumnorespuesta: AlumnoRespuesta = req.body;
                await dataService.updateById(id, alumnorespuesta);
                res.status(200).json({ message: "AlumnoRespuesta actualizada correctamente" });
            } catch (error) {
                console.error("Error al actualizar la alumnorespuesta:", error);
                 res.status(500).json({ message: "Error interno del servidor" });
            }
        },
        async eliminar(req: Request, res: Response) {
            try {
                const id = parseInt(req.params.id);
                await dataService.deleteById(id);
                res.status(200).json({ message: "Alumno Respuesta eliminada correctamente" });
            } catch (error) {
                console.error("Error al eliminar la alumnorespuesta:", error);
                 res.status(500).json({ message: "Error interno del servidor" });
            }
        },
}