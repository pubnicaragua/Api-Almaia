import { Request, Response } from "express";
import { DataService } from "../DataService";
import { FuncionalidadRol } from "../../../core/modelo/auth/FuncionalidadRol";

const dataService: DataService<FuncionalidadRol> = new DataService("funcionalidades_roles");
export const FuncionalidadRolService = {
  async obtener(req: Request, res: Response) {
    try {
      const where = { ...req.query }; // Convertir los parámetros de consulta en filtros
      const FuncionalidadRol = await dataService.getAll(["*"], where);
      res.json(FuncionalidadRol);
    } catch (error) {
      console.error("Error al obtener la FuncionalidadRol:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  },
  guardar: async (req: Request, res: Response) => {
    try {
      const FuncionalidadRol: FuncionalidadRol = req.body;
      const savedFuncionalidadRol = await dataService.processData(FuncionalidadRol);
      res.status(201).json(savedFuncionalidadRol);
    } catch (error) {
      console.error("Error al guardar la FuncionalidadRol:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  },
  async actualizar(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const FuncionalidadRol: FuncionalidadRol = req.body;
      await dataService.updateById(id, FuncionalidadRol);
      res.status(200).json({ message: "FuncionalidadRol actualizada correctamente" });
    } catch (error) {
      console.error("Error al actualizar la FuncionalidadRol:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  },
  async eliminar(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      await dataService.deleteById(id);
      res.status(200).json({ message: "FuncionalidadRol eliminada correctamente" });
    } catch (error) {
      console.error("Error al eliminar la FuncionalidadRol:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  },
};
