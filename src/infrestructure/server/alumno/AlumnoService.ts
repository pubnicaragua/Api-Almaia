import { Request, Response } from "express";
import { DataService } from "../DataService";
import { Alumno } from "../../../core/modelo/alumno/Alumno";

const dataService: DataService<Alumno> = new DataService("alumnos");
export const AlumnosService = {
    async obtener(req: Request, res: Response) {
        try {
        const where = { ...req.query }; // Convertir los parámetros de consulta en filtros
        const alumno = await dataService.getAll(["*"], where);
        res.json(alumno);
        } catch (error) {
        console.error("Error al obtener el alumno:", error);
        res.status(500).json({ message: "Error interno del servidor" });
        }
    },
    guardar: async (req: Request, res: Response) => {
        try {
        const alumno: Alumno = req.body;
        const savedAlumno = await dataService.processData(alumno);
        res.status(201).json(savedAlumno);
        } catch (error) {
        console.error("Error al guardar el alumno:", error);
        res.status(500).json({ message: "Error interno del servidor" });
        }
    },
    async actualizar(req: Request, res: Response) {
        try {
        const id = parseInt(req.params.id);
        const alumno: Alumno = req.body;
        await dataService.updateById(id, alumno);
        res.status(200).json({ message: "Alumno actualizado correctamente" });
        } catch (error) {
        console.error("Error al actualizar el alumno:", error);
        res.status(500).json({ message: "Error interno del servidor" });
        }
    },
    async eliminar(req: Request, res: Response) {
        try {
        const id = parseInt(req.params.id);
        await dataService.deleteById(id);
        res.status(200).json({ message: "Alumno eliminado correctamente" });
        } catch (error) {
        console.error("Error al eliminar el alumno:", error);
        res.status(500).json({ message: "Error interno del servidor" });
        }
    }
}