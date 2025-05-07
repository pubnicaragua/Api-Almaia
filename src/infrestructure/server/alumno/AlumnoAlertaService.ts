import { Request, Response } from "express";
import { DataService } from "../DataService";
import { AlumnoAlerta } from "../../../core/modelo/alumno/AlumnoAlerta";

const dataService: DataService<AlumnoAlerta> = new DataService("alumnos_alertas");
export const AlumnoAlertaService = {
    async obtener(req: Request, res: Response) {
        try {
            const where = { ...req.query }; // Convertir los parámetros de consulta en filtros
            const alumnoAlerta = await dataService.getAll(["*"], where);
            res.json(alumnoAlerta);
        } catch (error) {
            console.error("Error al obtener la alerta del alumno:", error);
            res.status(500).json({ message: "Error interno del servidor" });
        }
    },
    guardar: async (req: Request, res: Response) => {
        try {
            const alumnoAlerta: AlumnoAlerta = req.body;
            const savedAlumnoAlerta = await dataService.processData(alumnoAlerta);
            res.status(201).json(savedAlumnoAlerta);
        } catch (error) {
            console.error("Error al guardar la alerta del alumno:", error);
            res.status(500).json({ message: "Error interno del servidor" });
        }
    },
    async actualizar(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id);
            const alumnoAlerta: AlumnoAlerta = req.body;
            await dataService.updateById(id, alumnoAlerta);
            res.status(200).json({ message: "Alerta del alumno actualizada correctamente" });
        } catch (error) {
            console.error("Error al actualizar la alerta del alumno:", error);
            res.status(500).json({ message: "Error interno del servidor" });
        }
    },
    async eliminar(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id);
            await dataService.deleteById(id);
            res.status(200).json({ message: "Alerta del alumno eliminada correctamente" });
        } catch (error) {
            console.error("Error al eliminar la alerta del alumno:", error);
            res.status(500).json({ message: "Error interno del servidor" });
        }
    }


}
