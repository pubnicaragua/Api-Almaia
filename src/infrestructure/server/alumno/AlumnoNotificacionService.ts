import { Request, Response } from "express";
import { DataService } from "../DataService";
import { AlumnoNotificacion } from "../../../core/modelo/alumno/AlumnoNotificacion";

const dataService: DataService<AlumnoNotificacion> = new DataService("alumnos_alertas");
export const AlumnoNotificacionService = {
    async obtener(req: Request, res: Response) {
        try {
            const where = { ...req.query }; // Convertir los parámetros de consulta en filtros
            const alumnoNotificacion = await dataService.getAll(["*"], where);
            res.json(alumnoNotificacion);
        } catch (error) {
            console.error("Error al obtener la notificación del alumno:", error);
            res.status(500).json({ message: "Error interno del servidor" });
        }
    },
    guardar: async (req: Request, res: Response) => {
        try {
            const alumnoNotificacion: AlumnoNotificacion = req.body;
            const savedAlumnoNotificacion = await dataService.processData(alumnoNotificacion);
            res.status(201).json(savedAlumnoNotificacion);
        } catch (error) {
            console.error("Error al guardar la notificación del alumno:", error);
            res.status(500).json({ message: "Error interno del servidor" });
        }
    },
    async actualizar(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id);
            const alumnoNotificacion: AlumnoNotificacion = req.body;
            await dataService.updateById(id, alumnoNotificacion);
            res.status(200).json({ message: "Notificación del alumno actualizada correctamente" });
        } catch (error) {
            console.error("Error al actualizar la notificación del alumno:", error);
            res.status(500).json({ message: "Error interno del servidor" });
        }
    },
    async eliminar(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id);
            await dataService.deleteById(id);
            res.status(200).json({ message: "Notificación del alumno eliminada correctamente" });
        } catch (error) {
            console.error("Error al eliminar la notificación del alumno:", error);
            res.status(500).json({ message: "Error interno del servidor" });
        }
    }

        


}