import { Request, Response } from "express";
import { DataService } from "../DataService";
import { AlertaEvidencia } from "../../../core/modelo/alerta/AlertaEvidencia";

const dataService: DataService<AlertaEvidencia> = new DataService(
  "alertaevidenciaes"
);
export const AlertaEvidenciasService = {
  async obtener(req: Request, res: Response) {
    try {
      // const where = { ...req.query }; // Convertir los parámetros de consulta en filtros
      // const alertaEvidencia = await dataService.getAll(["*"], where);
      const alertasEvidencias = [
        {
          alerta_evidencia_id: 1,
          url_evidencia: "https://ejemplo.com/evidencias/alumno1_tarea1.pdf",
          alumno_alerta_id: 1001,
        },
        {
          alerta_evidencia_id: 2,
          url_evidencia:
            "https://ejemplo.com/evidencias/alumno2_participacion.mp4",
          alumno_alerta_id: 1002,
        },
        {
          alerta_evidencia_id: 3,
          url_evidencia: "https://ejemplo.com/evidencias/alumno3_examen.jpg",
          alumno_alerta_id: 1003,
        },
        {
          alerta_evidencia_id: 4,
          url_evidencia: "https://ejemplo.com/evidencias/alumno4_proyecto.zip",
          alumno_alerta_id: 1004,
        },
        {
          alerta_evidencia_id: 5,
          url_evidencia:
            "https://ejemplo.com/evidencias/alumno5_asistencia.docx",
          alumno_alerta_id: 1005,
        },
      ];
      res.json(alertasEvidencias);
      //res.json(alertaEvidencia);
    } catch (error) {
      console.error("Error al obtener la alerta evidencia:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  },
  guardar: async (req: Request, res: Response) => {
    try {
      const alertaEvidencia: AlertaEvidencia = req.body;
      const savedAlertaEvidencia = await dataService.processData(
        alertaEvidencia
      );
      res.status(201).json(savedAlertaEvidencia);
    } catch (error) {
      console.error("Error al guardar la alerta evidencia:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  },
  async actualizar(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const alertaEvidencia: AlertaEvidencia = req.body;
      await dataService.updateById(id, alertaEvidencia);
      res
        .status(200)
        .json({ message: "Alerta evidencia actualizada correctamente" });
    } catch (error) {
      console.error("Error al actualizar la alerta evidencia:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  },
  async eliminar(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      await dataService.deleteById(id);
      res
        .status(200)
        .json({ message: "Alerta evidencia eliminada correctamente" });
    } catch (error) {
      console.error("Error al eliminar la alerta evidencia:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  },
};
