import { Request, Response } from "express";
import { Pregunta } from "../../../core/modelo/preguntasRespuestas/Pregunta";
import { DataService } from "../DataService";

const dataService: DataService<Pregunta> = new DataService("preguntas");
export const PreguntaService = {
  async obtener(req: Request, res: Response) {
    try {
      /* const where = { ...req.query }; // Convertir los parámetros de consulta en filtros
            const pregunta = await dataService.getAll(["*"],where);
            res.json(pregunta);*/
      const preguntas = [
        {
          pregunta_id: 1,
          tipo_pregunta: {
            tipo_pregunta_id: 2,
            nombre: "Opción múltiple",
          },
          nivel_educativo: {
            nivel_educativo_id: 3,
            nombre: "Secundaria",
          },
          diagnostico: "Problemas de atención",
          sintomas: "Falta de concentración, hiperactividad",
          grupo_preguntas: "Evaluación inicial",
          palabra_clave: "atención",
          horario: "am",
          texto_pregunta:
            "¿Con qué frecuencia tiene dificultad para concentrarse en sus tareas?",
        },
      ];

      res.json(preguntas);
    } catch (error) {
      console.error("Error al obtener la pregunta:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  },
  async detalle(req: Request, res: Response) {
    try {
      /* const where = { ...req.query }; // Convertir los parámetros de consulta en filtros
            const pregunta = await dataService.getAll(["*"],where);
            res.json(pregunta);*/
      const pregunta = {
        pregunta_id: 1,
        tipo_pregunta: {
          tipo_pregunta_id: 2,
          nombre: "Opción múltiple",
        },
        nivel_educativo: {
          nivel_educativo_id: 3,
          nombre: "Secundaria",
        },
        diagnostico: "Problemas de atención",
        sintomas: "Falta de concentración, hiperactividad",
        grupo_preguntas: "Evaluación inicial",
        palabra_clave: "atención",
        horario: "am",
        texto_pregunta:
          "¿Con qué frecuencia tiene dificultad para concentrarse en sus tareas?",
        respuestas_posibles_has_preguntas: [
          {
            respuesta_posible_id: 1,
            pregunta_id: 1,
            nombre: "Nunca",
          },
          {
            respuesta_posible_id: 2,
            pregunta_id: 1,
            nombre: "Ocasionalmente",
          },
          {
            respuesta_posible_id: 3,
            pregunta_id: 1,
            nombre: "Frecuentemente",
          },
        ],
      };

      res.json(pregunta);
    } catch (error) {
      console.error("Error al obtener la pregunta:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  },
  guardar: async (req: Request, res: Response) => {
    try {
      const pregunta: Pregunta = req.body;
      const savedPregunta = await dataService.processData(pregunta);
      res.status(201).json(savedPregunta);
    } catch (error) {
      console.error("Error al guardar la pregunta:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  },
  async actualizar(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const pregunta: Pregunta = req.body;
      await dataService.updateById(id, pregunta);
      res.status(200).json({ message: "Pregunta actualizada correctamente" });
    } catch (error) {
      console.error("Error al actualizar la pregunta:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  },
  async eliminar(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      await dataService.deleteById(id);
      res.status(200).json({ message: "Pregunta eliminada correctamente" });
    } catch (error) {
      console.error("Error al eliminar la pregunta:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  },
  motor_pregunta() {
    // Aquí puedes implementar la lógica para el motor de preguntas
    // Por ejemplo, podrías usar un cron job para ejecutar esta función periódicamente
    console.log("Ejecutando motor de preguntas...");
    // Lógica del motor de preguntas aquí
  },
};
