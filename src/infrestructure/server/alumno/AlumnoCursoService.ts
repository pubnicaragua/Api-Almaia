import { Request, Response } from "express";
import { DataService } from "../DataService";
import { AlumnoCurso } from "../../../core/modelo/alumno/AlumnoCurso";

const dataService: DataService<AlumnoCurso> = new DataService("alumnos_alertas");
export const AlumnoCursoService = {
    async obtener(req: Request, res: Response) {
        try {
            const where = { ...req.query }; // Convertir los parámetros de consulta en filtros
            const alumnoCurso = await dataService.getAll(["*"], where);
            res.json(alumnoCurso);
        } catch (error) {
            console.error("Error al obtener el curso del alumno:", error);
            res.status(500).json({ message: "Error interno del servidor" });
        }
    },
    guardar: async (req: Request, res: Response) => {
        try {
            const alumnoCurso: AlumnoCurso = req.body;
            const savedAlumnoCurso = await dataService.processData(alumnoCurso);
            res.status(201).json(savedAlumnoCurso);
        } catch (error) {
            console.error("Error al guardar el curso del alumno:", error);
            res.status(500).json({ message: "Error interno del servidor" });
        }
    },
    async actualizar(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id);
            const alumnoCurso: AlumnoCurso = req.body;
            await dataService.updateById(id, alumnoCurso);
            res.status(200).json({ message: "Curso del alumno actualizado correctamente" });
        } catch (error) {
            console.error("Error al actualizar el curso del alumno:", error);
            res.status(500).json({ message: "Error interno del servidor" });
        }
    },
    async eliminar(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id);
            await dataService.deleteById(id);
            res.status(200).json({ message: "Curso del alumno eliminado correctamente" });
        } catch (error) {
            console.error("Error al eliminar el curso del alumno:", error);
            res.status(500).json({ message: "Error interno del servidor" });
        }
    }
}