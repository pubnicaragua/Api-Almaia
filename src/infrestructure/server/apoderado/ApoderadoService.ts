import { Request, Response } from "express";

import { DataService } from "../DataService";
import { Apoderado } from "../../../core/modelo/apoderado/Apoderado";

const dataService: DataService<Apoderado> = new DataService(
  "alumnos_respuestas"
);
export const ApoderadoService = {
  async obtener(req: Request, res: Response) {
    try {
      /*const where = { ...req.query }; // Convertir los parámetros de consulta en filtros
            const apoderado = await dataService.getAll(["*"],where);
            res.json(apoderado);*/
      const apoderados = [
        {
          alumno_apoderado_id: 1,
          alumno_id: 123,
          apoderado_id: 1001,
          tipo_apoderado: "Padre",
          observaciones: "Siempre disponible",
          estado_usuario: "activo",
          persona_id: 0,
          colegio_id: 0,
          telefono_contacto1: "string",
          telefono_contacto2: "string",
          email_contacto1: "string",
          email_contacto2: "string",
          profesion_id: 0,
          tipo_oficio_id: 0,
        },
      ];
      res.json(apoderados);
    } catch (error) {
      console.error("Error al obtener la apoderado:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  },
  guardar: async (req: Request, res: Response) => {
    try {
      const apoderado: Apoderado = req.body;
      const savedApoderado = await dataService.processData(apoderado);
      res.status(201).json(savedApoderado);
    } catch (error) {
      console.error("Error al guardar la apoderado:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  },
  actualizar: async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const apoderado: Apoderado = req.body;
      await dataService.updateById(id, apoderado);
      res.status(200).json({ message: "Apoderado actualizado correctamente" });
    } catch (error) {
      console.error("Error al actualizar la apoderado:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  },
  async eliminar(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      await dataService.deleteById(id);
      res.status(200).json({ message: "Apoderado eliminada correctamente" });
    } catch (error) {
      console.error("Error al eliminar la apoderado:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  },
};
