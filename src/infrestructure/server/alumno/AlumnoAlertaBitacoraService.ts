import { Request, Response } from "express";
import { DataService } from "../DataService";
import { AlumnoAlertaBitacora } from "../../../core/modelo/alumno/AlumnoAlertaBitacora";

const dataService: DataService<AlumnoAlertaBitacora> = new DataService("alumnos_alertas_bitacoras");
export const AlumnoAlertaBitacoraService = {
    async obtener(req: Request, res: Response) {
        try {
            const where = { ...req.query }; // Convertir los parámetros de consulta en filtros
            const alumnoAlertaBitacora = await dataService.getAll(["*"], where);
            res.json(alumnoAlertaBitacora);
        } catch (error) {
            console.error("Error al obtener la alerta:", error);
            res.status(500).json({ message: "Error interno del servidor" });
        }
    },
    guardar: async (req: Request, res: Response) => {
        try {
            const alumnoAlertaBitacora: AlumnoAlertaBitacora = req.body;
            const savedAlumnoAlertaBitacora = await dataService.processData(alumnoAlertaBitacora);
            res.status(201).json(savedAlumnoAlertaBitacora);
        } catch (error) {
            console.error("Error al guardar la alerta:", error);
            res.status(500).json({ message: "Error interno del servidor" });
        }
    },
    async actualizar(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id);
            const alumnoAlertaBitacora: AlumnoAlertaBitacora = req.body;
            await dataService.updateById(id, alumnoAlertaBitacora);
            res.status(200).json({ message: "Alumno Alerta Bitácora actualizada correctamente" });
        } catch (error) {
            console.error("Error al actualizar la alerta:", error);
            res.status(500).json({ message: "Error interno del servidor" });
        }
    },
    async eliminar(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id);
            await dataService.deleteById(id);
            res.status(200).json({ message: "Alumno Alerta Bitácora eliminada correctamente" });
        } catch (error) {
            console.error("Error al eliminar la alerta:", error);
            res.status(500).json({ message: "Error interno del servidor" });
        }
    }
        

}