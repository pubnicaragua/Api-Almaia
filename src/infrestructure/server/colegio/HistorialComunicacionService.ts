import { Request, Response } from "express";
import { DataService } from "../DataService";
import { HistorialComunicacion } from "../../../core/modelo/colegio/HistorialComunicacion";

const dataService: DataService<HistorialComunicacion> = new DataService(
  "historialcomunicacions"
);
export const HistorialComunicacionsService = {
    async obtener(req: Request, res: Response) {
        try {
            /*const historialComunicacion = await dataService.getAll(["*"], req.query);
            res.json(historialComunicacion);*/
            const historialComunicaciones = [
                {
                  historial_comunicacion_id: 1,
                  alumno_id: 101,
                  apoderado_id: 201,
                  usuario_id: 301,
                  fecha_hora: new Date("2025-04-12T10:30:00"),
                  asunto: "Rendimiento Académico",
                  descripcion: "Se informa al apoderado sobre el bajo rendimiento del alumno en matemáticas.",
                  acciones_acuerdos_tomados: "Refuerzo escolar dos veces por semana y seguimiento mensual."
                },
                {
                  historial_comunicacion_id: 2,
                  alumno_id: 102,
                  apoderado_id: 202,
                  usuario_id: 302,
                  fecha_hora: new Date("2025-05-03T14:15:00"),
                  asunto: "Problemas de Conducta",
                  descripcion: "Incidente de mal comportamiento en clase reportado por el docente.",
                  acciones_acuerdos_tomados: "Reunión con orientador escolar y compromiso de mejora por parte del alumno."
                },
                {
                  historial_comunicacion_id: 3,
                  alumno_id: 103,
                  apoderado_id: 203,
                  usuario_id: 303,
                  fecha_hora: new Date("2025-06-07T09:00:00"),
                  asunto: "Asistencia Irregular",
                  descripcion: "Se notifica la inasistencia frecuente del alumno sin justificación.",
                  acciones_acuerdos_tomados: "Entrega de certificados médicos en futuras ausencias y monitoreo por parte del tutor."
                }
              ];
              res.json(historialComunicaciones)
              
        } catch (error) {
            res.status(500).json(error);
        }
    },

    async guardar(req: Request, res: Response) {
        try {
            const nuevoHistorialComunicacion = req.body;
            const historialComunicacionCreado = await dataService.processData(nuevoHistorialComunicacion);
            res.status(201).json(historialComunicacionCreado);
        } catch (error) {
            res.status(500).json(error);
        }
    },

     async actualizar(req: Request, res: Response) {
            try {
                const historialComunicacionId = parseInt(req.params.id);
                const historialActualizado = req.body;
                const resultado = await dataService.updateById(historialComunicacionId, historialActualizado);
                res.status(200).json(resultado);
               
            } catch (error) {
                res.status(500).json(error);
            }
        },
        async eliminar(req: Request, res: Response) {
            try {
                const historialComunicacionId = parseInt(req.params.id);
                await dataService.deleteById(historialComunicacionId);
                res.status(200).json({ message: "Curso eliminado" });
            }
            catch (error) {
                res.status(500).json(error);
            }
        }    
}