import { Request, Response } from "express";
import { DataService } from "../DataService";
import { Comuna } from "../../../core/modelo/localidades/Comuna";

const dataService: DataService<Comuna> = new DataService("comunas");
export const ComunaService = {
  async obtener(req: Request, res: Response) {
    try {
      /*const where = { ...req.query }; // Convertir los parámetros de consulta en filtros
      const comuna = await dataService.getAll(["*"], where);
      res.json(comuna);*/
     const comunas = [
        {
          "comuna_id": 23,
          "nombre": "Viña del Mar",
          "region_id": 5,
          "pais_id": 1
        }
      ]
      res.json(comunas);
    } catch (error) {
      console.error("Error al obtener la comuna:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  },
  guardar: async (req: Request, res: Response) => {
    try {
      const comuna: Comuna = req.body;
      const savedcomuna = await dataService.processData(comuna);
      res.status(201).json(savedcomuna);
    } catch (error) {
      console.error("Error al guardar la comuna:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  },
  async actualizar(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const comuna: Comuna = req.body;
      await dataService.updateById(id, comuna);
      res.status(200).json({ message: "comuna actualizada correctamente" });
    } catch (error) {
      console.error("Error al actualizar la comuna:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  },
  async eliminar(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      await dataService.deleteById(id);
      res.status(200).json({ message: "comuna eliminada correctamente" });
    } catch (error) {
      console.error("Error al eliminar la comuna:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  },
};
