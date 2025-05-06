import { Request, Response } from "express";
import { DataService } from "../DataService";
import { ConfiguracionComuna } from "../../../core/modelo/localidades/ConfiguracionComuna";

const dataService: DataService<ConfiguracionComuna> = new DataService("configuracioncomunas");
export const ConfiguracionComunaService = {
  async obtener(req: Request, res: Response) {
    try {
      const where = { ...req.query }; // Convertir los parámetros de consulta en filtros
      const configuracioncomuna = await dataService.getAll(["*"], where);
      res.json(configuracioncomuna);
    } catch (error) {
      console.error("Error al obtener la configuracioncomuna:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  },
  guardar: async (req: Request, res: Response) => {
    try {
      const configuracioncomuna: ConfiguracionComuna = req.body;
      const savedconfiguracioncomuna = await dataService.processData(configuracioncomuna);
      res.status(201).json(savedconfiguracioncomuna);
    } catch (error) {
      console.error("Error al guardar la configuracioncomuna:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  },
  async actualizar(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const configuracioncomuna: ConfiguracionComuna = req.body;
      await dataService.updateById(id, configuracioncomuna);
      res.status(200).json({ message: "configuracioncomuna actualizada correctamente" });
    } catch (error) {
      console.error("Error al actualizar la configuracioncomuna:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  },
  async eliminar(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      await dataService.deleteById(id);
      res.status(200).json({ message: "configuracioncomuna eliminada correctamente" });
    } catch (error) {
      console.error("Error al eliminar la configuracioncomuna:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  },
};
