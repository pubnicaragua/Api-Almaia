import { Request, Response } from "express";
import { DataService } from "../DataService";
import { MotorInforme } from "../../../core/modelo/alerta/MotorInforme";

const dataService: DataService<MotorInforme> = new DataService("alertas_origenes");
export const MotorInformesService = {
    async obtener(req: Request, res: Response) {
        try {
           /* const where = { ...req.query }; // Convertir los parámetros de consulta en filtros
            const motorInforme = await dataService.getAll(["*"], where);
            res.json(motorInforme);*/
            const motoresInforme = [
                {
                  "motor_informe_id": 1,
                  "freq_meses": 1,         // Mensual
                  "dia_ejecucion": 1,      // Día 1 de cada mes
                  "descripcion": "Informe mensual de rendimiento académico"
                },
                {
                  "motor_informe_id": 2,
                  "freq_meses": 3,         // Trimestral
                  "dia_ejecucion": 15,     // Día 15
                  "descripcion": "Informe trimestral de asistencia"
                },
                {
                  "motor_informe_id": 3,
                  "freq_meses": 6,         // Semestral
                  "dia_ejecucion": 30,     // Último día
                  "descripcion": "Informe semestral de conducta"
                },
                {
                  "motor_informe_id": 4,
                  "freq_meses": 12,        // Anual
                  "dia_ejecucion": 31,     // Fin de año
                  "descripcion": "Reporte anual consolidado"
                },
                {
                  "motor_informe_id": 5,
                  "freq_meses": 2,         // Bimestral
                  "dia_ejecucion": 10,     // Día 10
                  "descripcion": "Informe bimestral de actividades extracurriculares"
                }
              ];
            res.json(motoresInforme);
        } catch (error) {
            console.error("Error al obtener el motor de informe:", error);
            res.status(500).json({ message: "Error interno del servidor" });
        }
    },
    guardar: async (req: Request, res: Response) => {
        try {
            const motorInforme: MotorInforme = req.body;
            const savedMotorInforme = await dataService.processData(motorInforme);
            res.status(201).json(savedMotorInforme);
        } catch (error) {
            console.error("Error al guardar el motor de informe:", error);
            res.status(500).json({ message: "Error interno del servidor" });
        }
    },
    async actualizar(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id);
            const motorInforme: MotorInforme = req.body;
            await dataService.updateById(id, motorInforme);
            res.status(200).json({ message: "Motor de informe actualizado correctamente" });
        } catch (error) {
            console.error("Error al actualizar el motor de informe:", error);
            res.status(500).json({ message: "Error interno del servidor" });
        }
    },
    async eliminar(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id);
            await dataService.deleteById(id);
            res.status(200).json({ message: "Motor de informe eliminado correctamente" });
        } catch (error) {
            console.error("Error al eliminar el motor de informe:", error);
            res.status(500).json({ message: "Error interno del servidor" });
        }
    }
}