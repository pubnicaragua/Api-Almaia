import { Request, Response } from "express";
import { DataService } from "../DataService";
import { AlumnoMonitoreo } from "../../../core/modelo/alumno/AlumnoMonitoreo";

const dataService: DataService<AlumnoMonitoreo> = new DataService("alumnos_alertas");
export const AlumnoMonitoreoService = {
        
    async obtener(req: Request, res: Response) {
        try {
            const where = { ...req.query }; // Convertir los parámetros de consulta en filtros
            const alumnoMonitoreo = await dataService.getAll(["*"], where);
            res.json(alumnoMonitoreo);
        } catch (error) {
            console.error("Error al obtener el monitoreo del alumno:", error);
            res.status(500).json({ message: "Error interno del servidor" });
        }
    },
    guardar: async (req: Request, res: Response) => {
        try {
            const alumnoMonitoreo: AlumnoMonitoreo = req.body;
            const savedAlumnoMonitoreo = await dataService.processData(alumnoMonitoreo);
            res.status(201).json(savedAlumnoMonitoreo);
        } catch (error) {
            console.error("Error al guardar el monitoreo del alumno:", error);
            res.status(500).json({ message: "Error interno del servidor" });
        }
    },
    async actualizar(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id);
            const alumnoMonitoreo: AlumnoMonitoreo = req.body;
            await dataService.updateById(id, alumnoMonitoreo);
            res.status(200).json({ message: "Monitoreo del alumno actualizado correctamente" });
        } catch (error) {
            console.error("Error al actualizar el monitoreo del alumno:", error);
            res.status(500).json({ message: "Error interno del servidor" });
        }
    },
    async eliminar(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id);
            await dataService.deleteById(id);
            res.status(200).json({ message: "Monitoreo del alumno eliminado correctamente" });
        } catch (error) {
            console.error("Error al eliminar el monitoreo del alumno:", error);
            res.status(500).json({ message: "Error interno del servidor" });
        }
    }
}