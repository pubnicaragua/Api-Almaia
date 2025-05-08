import { Request, Response } from "express";
import { DataService } from "../DataService";
import { MotorPregunta } from "../../../core/modelo/alerta/MotorPregunta";

const dataService: DataService<MotorPregunta> = new DataService("alertas_origenes");
export const MotorPreguntasService = {
    async obtener(req: Request, res: Response) {
        try {
            /*const where = { ...req.query }; // Convertir los parámetros de consulta en filtros
            const motorPregunta = await dataService.getAll(["*"], where);
            res.json(motorPregunta);*/
            const motorPreguntas = [
                {
                  "motor_pregunta_id": 1,
                  "dia_ejecucion": "2025-06-01",
                  "tipo_pregunta": "Satisfacción docente",
                  "frecuencia": "mensual"
                },
                {
                  "motor_pregunta_id": 2,
                  "dia_ejecucion": "2025-05-15",
                  "tipo_pregunta": "Evaluación de clima escolar",
                  "frecuencia": "quincenal"
                },
                {
                  "motor_pregunta_id": 3,
                  "dia_ejecucion": "2025-12-31",
                  "tipo_pregunta": "Feedback anual",
                  "frecuencia": "anual"
                },
                {
                  "motor_pregunta_id": 4,
                  "dia_ejecucion": "2025-09-01",
                  "tipo_pregunta": "Preferencias estudiantiles",
                  "frecuencia": "semestral"
                },
                {
                  "motor_pregunta_id": 5,
                  "dia_ejecucion": "2025-05-20",
                  "tipo_pregunta": "Seguimiento emocional",
                  "frecuencia": "semanal"
                }
              ];
            res.json(motorPreguntas);
        } catch (error) {
            console.error("Error al obtener el motor de pregunta:", error);
            res.status(500).json({ message: "Error interno del servidor" });
        }
    },
    guardar: async (req: Request, res: Response) => {
        try {
            const motorPregunta: MotorPregunta = req.body;
            const savedMotorPregunta = await dataService.processData(motorPregunta);
            res.status(201).json(savedMotorPregunta);
        } catch (error) {
            console.error("Error al guardar el motor de pregunta:", error);
            res.status(500).json({ message: "Error interno del servidor" });
        }
    },
    async actualizar(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id);
            const motorPregunta: MotorPregunta = req.body;
            await dataService.updateById(id, motorPregunta);
            res.status(200).json({ message: "Motor de pregunta actualizado correctamente" });
        } catch (error) {
            console.error("Error al actualizar el motor de pregunta:", error);
            res.status(500).json({ message: "Error interno del servidor" });
        }
    },
    async eliminar(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id);
            await dataService.deleteById(id);
            res.status(200).json({ message: "Motor de pregunta eliminado correctamente" });
        } catch (error) {
            console.error("Error al eliminar el motor de pregunta:", error);
            res.status(500).json({ message: "Error interno del servidor" });
        }
    }
}