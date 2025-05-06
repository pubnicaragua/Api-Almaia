import { Request, Response } from "express";
import { DataService } from "../DataService";
import { Aviso } from "../../../core/modelo/aviso/Aviso";

const dataService: DataService<Aviso> = new DataService("avisos");
export const AvisosService = {
  async obtener(req: Request, res: Response) {
    try {
      const where = { ...req.query }; // Convertir los parámetros de consulta en filtros
      const aviso = await dataService.getAll(["*"], where);
      res.json(aviso);
    } catch (error) {
      console.error("Error al obtener la aviso:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  },
  guardar: async (req: Request, res: Response) => {
    try {
      const aviso: Aviso = req.body;
      const savedaviso = await dataService.processData(aviso);
      res.status(201).json(savedaviso);
    } catch (error) {
      console.error("Error al guardar la aviso:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  },
  async actualizar(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const aviso: Aviso = req.body;
      await dataService.updateById(id, aviso);
      res.status(200).json({ message: "aviso actualizada correctamente" });
    } catch (error) {
      console.error("Error al actualizar la aviso:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  },
  async eliminar(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      await dataService.deleteById(id);
      res.status(200).json({ message: "aviso eliminada correctamente" });
    } catch (error) {
      console.error("Error al eliminar la aviso:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  },
};
