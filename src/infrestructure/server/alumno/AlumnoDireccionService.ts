import { Request, Response } from "express";
import { DataService } from "../DataService";
import { AlumnoDireccion } from "../../../core/modelo/alumno/AlumnoDireccion";

const dataService: DataService<AlumnoDireccion> = new DataService("alumnos_alertas");
export const AlumnoDireccionService = {

    async obtener(req: Request, res: Response) {
        try {
            const where = { ...req.query }; // Convertir los parámetros de consulta en filtros
            const alumnoDireccion = await dataService.getAll(["*"], where);
            res.json(alumnoDireccion);
        } catch (error) {
            console.error("Error al obtener la dirección del alumno:", error);
            res.status(500).json({ message: "Error interno del servidor" });
        }
    },
    guardar: async (req: Request, res: Response) => {
        try {
            const alumnoDireccion: AlumnoDireccion = req.body;
            const savedAlumnoDireccion = await dataService.processData(alumnoDireccion);
            res.status(201).json(savedAlumnoDireccion);
        } catch (error) {
            console.error("Error al guardar la dirección del alumno:", error);
            res.status(500).json({ message: "Error interno del servidor" });
        }
    },
    async actualizar(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id);
            const alumnoDireccion: AlumnoDireccion = req.body;
            await dataService.updateById(id, alumnoDireccion);
            res.status(200).json({ message: "Dirección del alumno actualizada correctamente" });
        } catch (error) {
            console.error("Error al actualizar la dirección del alumno:", error);
            res.status(500).json({ message: "Error interno del servidor" });
        }
    },
    async eliminar(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id);
            await dataService.deleteById(id);
            res.status(200).json({ message: "Dirección del alumno eliminada correctamente" });
        } catch (error) {
            console.error("Error al eliminar la dirección del alumno:", error);
            res.status(500).json({ message: "Error interno del servidor" });
        }
    }
        
}