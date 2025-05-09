import { Request, Response } from "express";

import { DataService } from "../DataService";
import { RespuestaPosiblePregunta } from "../../../core/modelo/preguntasRespuestas/RespuestaPosiblePregunta";
const dataService: DataService<RespuestaPosiblePregunta> = new DataService(
  "respuestas_posibles_has_preguntas"
);
export const RespuestaPosiblePreguntaService = {
  async obtener(req: Request, res: Response) {
    try {
      /*const where = { ...req.query }; // Convertir los parámetros de consulta en filtros
            const respuestaposible = await dataService.getAll(["*"],where);
            res.json(respuestaposible);*/
      const respuestasPosiblesPorPregunta = [
        {
          respuesta_posible: {
            respuesta_posible_id: 1,
            nombre: "Siempre",
          },
          pregunta: {
            pregunta_id: 5,
            texto_pregunta: "¿Con qué frecuencia participa en clase?",
          },
        },
      ];
      res.json(respuestasPosiblesPorPregunta);
    } catch (error) {
      console.error("Error al obtener la respuestaposible:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  },
  guardar: async (req: Request, res: Response) => {
    try {
      const respuestaposible: RespuestaPosiblePregunta = req.body;
      const savedRespuestaPosible = await dataService.processData(
        respuestaposible
      );
      res.status(201).json(savedRespuestaPosible);
    } catch (error) {
      console.error("Error al guardar la respuestaposible:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  },
  async actualizar(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const respuestaposible: RespuestaPosiblePregunta = req.body;
      await dataService.updateById(id, respuestaposible);
      res
        .status(200)
        .json({ message: "RespuestaPosible actualizada correctamente" });
    } catch (error) {
      console.error("Error al actualizar la respuestaposible:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  },
  async eliminar(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      await dataService.deleteById(id);
      res
        .status(200)
        .json({ message: "Respuesta Posible eliminada correctamente" });
    } catch (error) {
      console.error("Error al eliminar la respuestaposible:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  },
};
