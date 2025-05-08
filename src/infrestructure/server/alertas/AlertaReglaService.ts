import { Request, Response } from "express";
import { DataService } from "../DataService";
import { AlertaRegla } from "../../../core/modelo/alerta/AlertaRegla";

const dataService: DataService<AlertaRegla> = new DataService("alertareglaes");
export const AlertaReglasService = {
    async obtener(req: Request, res: Response) {
        try {
            //const where = { ...req.query }; // Convertir los parámetros de consulta en filtros
         //   const alertaRegla = await dataService.getAll(["*"], where);
         const reglasAlertas = [
            {
              "alerta_regla_id": 1,
              "nombre": "Inasistencia repetida",
              "tipo_emocion": "Preocupación",
              "umbral": "3 faltas en una semana",
              "descripcion": "Generar alerta cuando el alumno falta 3 o más veces en un periodo de 5 días hábiles"
            },
            {
              "alerta_regla_id": 2,
              "nombre": "Bajo rendimiento",
              "tipo_emocion": "Frustración",
              "umbral": "Calificación < 6.0",
              "descripcion": "Activar alerta si el promedio en un área clave es inferior a 6.0 en dos evaluaciones consecutivas"
            },
            {
              "alerta_regla_id": 3,
              "nombre": "Cambio conductual",
              "tipo_emocion": "Tristeza",
              "umbral": "5 reportes en 15 días",
              "descripcion": "Notificar cuando se detecten cambios abruptos en el comportamiento normal del estudiante"
            },
            {
              "alerta_regla_id": 4,
              "nombre": "Interacción social baja",
              "tipo_emocion": "Aislamiento",
              "umbral": "0 participaciones en clase",
              "descripcion": "Alerta por ausencia de interacción en actividades grupales durante una semana completa"
            },
            {
              "alerta_regla_id": 5,
              "nombre": "Entrega tardía de tareas",
              "tipo_emocion": "Estrés",
              "umbral": "3 entregas tardías",
              "descripcion": "Marcar alerta cuando se acumulen 3 tareas entregadas fuera de plazo en un mismo módulo"
            }
          ];
            res.json(reglasAlertas);

         // res.json(alertaRegla);
        } catch (error) {
            console.error("Error al obtener la alerta regla:", error);
            res.status(500).json({ message: "Error interno del servidor" });
        }
    },
    guardar: async (req: Request, res: Response) => {
        try {
            const alertaRegla: AlertaRegla = req.body;
            const savedAlertaRegla = await dataService.processData(alertaRegla);
            res.status(201).json(savedAlertaRegla);
        } catch (error) {
            console.error("Error al guardar la alerta regla:", error);
            res.status(500).json({ message: "Error interno del servidor" });
        }
    },
    async actualizar(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id);
            const alertaRegla: AlertaRegla = req.body;
            await dataService.updateById(id, alertaRegla);
            res.status(200).json({ message: "Alerta regla actualizada correctamente" });
        } catch (error) {
            console.error("Error al actualizar la alerta regla:", error);
            res.status(500).json({ message: "Error interno del servidor" });
        }
    },
    async eliminar(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id);
            await dataService.deleteById(id);
            res.status(200).json({ message: "Alerta regla eliminada correctamente" });
        } catch (error) {
            console.error("Error al eliminar la alerta regla:", error);
            res.status(500).json({ message: "Error interno del servidor" });
        }
    }
    
}