import { Request, Response } from "express";
import { DataService } from "../DataService";
import { Colegio } from "../../../core/modelo/colegio/Colegio";

const dataService: DataService<Colegio> = new DataService("colegios");
export const ColegiosService = {
  async obtener(req: Request, res: Response) {
    try {
      const where = { ...req.query }; // Convertir los parámetros de consulta en filtros
        const colegios = await dataService.getAll(["*"], where);
      res.json(colegios);
    } catch (error) {
      console.error("Error al obtener el colegio:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  },
  guardar: async (req: Request, res: Response) => {
    try {
      const colegio: Colegio = req.body;
      const savedcolegio = await dataService.processData(colegio);
      res.status(201).json(savedcolegio);
    } catch (error) {
      console.error("Error al guardar el colegio:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  },
  actualizar: async (req: Request, res: Response) => {
    try {
      const colegioId = parseInt(req.params.id);
      const colegio: Colegio = req.body;
      const updatedcolegio = await dataService.updateById(colegioId, colegio);
      res.status(200).json(updatedcolegio);
    } catch (error) {
      console.error("Error al actualizar el colegio:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  },
  eliminar: async (req: Request, res: Response) => {
    try {
      const colegioId = parseInt(req.params.id);
      await dataService.deleteById(colegioId);
      res.status(204).send();
    } catch (error) {
      console.error("Error al eliminar el colegio:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  },
};
