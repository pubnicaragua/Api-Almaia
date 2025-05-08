import { Request, Response } from "express";
import { DataService } from "../DataService";
import { MotorAlerta } from "../../../core/modelo/alerta/MotorAlerta";

const dataService: DataService<MotorAlerta> = new DataService("alertas_origenes");
export const MotorAlertasService = {
        
    async obtener(req: Request, res: Response) {
        try {
            /*const where = { ...req.query }; // Convertir los parámetros de consulta en filtros
            const motorAlerta = await dataService.getAll(["*"], where);
            res.json(motorAlerta);*/
            const motoresAlerta = [
                {
                  "motor_alerta_id": 1,
                  "hr_ejecucion": "00:00",
                  "tipo": "Nocturno",
                  "descripcion": "Ejecución diaria a medianoche"
                },
                {
                  "motor_alerta_id": 2,
                  "hr_ejecucion": "08:30",
                  "tipo": "Matutino",
                  "descripcion": "Ejecución al inicio de la jornada escolar"
                },
                {
                  "motor_alerta_id": 3,
                  "hr_ejecucion": "12:00;16:00",
                  "tipo": "Interdiario",
                  "descripcion": "Ejecución al mediodía y tarde"
                },
                {
                  "motor_alerta_id": 4,
                  "hr_ejecucion": "*/30 * * * *",
                  "tipo": "Tiempo Real",
                  "descripcion": "Ejecución cada 30 minutos (formato cron)"
                },
                {
                  "motor_alerta_id": 5,
                  "hr_ejecucion": "09:00;13:00;17:00",
                  "tipo": "Horario Escolar",
                  "descripcion": "Ejecución en cada cambio de periodo"
                }
              ];
            res.json(motoresAlerta);
        } catch (error) {
            console.error("Error al obtener el motor de alerta:", error);
            res.status(500).json({ message: "Error interno del servidor" });
        }
    },
    guardar: async (req: Request, res: Response) => {
        try {
            const motorAlerta: MotorAlerta = req.body;
            const savedMotorAlerta = await dataService.processData(motorAlerta);
            res.status(201).json(savedMotorAlerta);
        } catch (error) {
            console.error("Error al guardar el motor de alerta:", error);
            res.status(500).json({ message: "Error interno del servidor" });
        }
    },
    async actualizar(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id);
            const motorAlerta: MotorAlerta = req.body;
            await dataService.updateById(id, motorAlerta);
            res.status(200).json({ message: "Motor de alerta actualizado correctamente" });
        } catch (error) {
            console.error("Error al actualizar el motor de alerta:", error);
            res.status(500).json({ message: "Error interno del servidor" });
        }
    },
    async eliminar(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id);
            await dataService.deleteById(id);
            res.status(200).json({ message: "Motor de alerta eliminado correctamente" });
        } catch (error) {
            console.error("Error al eliminar el motor de alerta:", error);
            res.status(500).json({ message: "Error interno del servidor" });
        }
    }
}