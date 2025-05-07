import { Request, Response } from "express";
import { DataService } from "../DataService";
import { AlumnoAntecedenteFamiliar } from "../../../core/modelo/alumno/AlumnoAntecedenteFamiliar";

const dataService: DataService<AlumnoAntecedenteFamiliar> = new DataService("alumnos_antecedentes_clinicos");
export const AlumnoAntecedenteFamiliarsService = {
    async obtener(req: Request, res: Response) {
        try {
            const where = { ...req.query }; // Convertir los parámetros de consulta en filtros
            const antecedentes = await dataService.getAll(["*"], where);
            res.json(antecedentes);
        } catch (error) {
            console.error("Error al obtener los antecedentes clínicos:", error);
            res.status(500).json({ message: "Error interno del servidor" });
        }
    },
    guardar: async (req: Request, res: Response) => {
        try {
            const antecedente: AlumnoAntecedenteFamiliar = req.body;
            const savedAntecedente = await dataService.processData(antecedente);
            res.status(201).json(savedAntecedente);
        } catch (error) {
            console.error("Error al guardar el antecedente clínico:", error);
            res.status(500).json({ message: "Error interno del servidor" });
        }
    },
    async actualizar(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id);
            const antecedente: AlumnoAntecedenteFamiliar = req.body;
            await dataService.updateById(id, antecedente);
            res.status(200).json({ message: "Antecedente clínico actualizado correctamente" });
        } catch (error) {
            console.error("Error al actualizar el antecedente clínico:", error);
            res.status(500).json({ message: "Error interno del servidor" });
        }
    },
    async eliminar(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id);
            await dataService.deleteById(id);
            res.status(200).json({ message: "Antecedente clínico eliminado correctamente" });
        } catch (error) {
            console.error("Error al eliminar el antecedente clínico:", error);
            res.status(500).json({ message: "Error interno del servidor" });
        }
    }
}