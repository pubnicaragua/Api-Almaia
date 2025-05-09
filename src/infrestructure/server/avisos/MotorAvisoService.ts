import { Request, Response } from "express";
import { DataService } from "../DataService";
import { MotorAviso } from "../../../core/modelo/aviso/MotorAviso";

const dataService: DataService<MotorAviso> = new DataService("motores_avisos");
export const MotorAvisoService = {
  async obtener(req: Request, res: Response) {
    try {
      /*const where = { ...req.query }; // Convertir los parámetros de consulta en filtros
      const motoraviso = await dataService.getAll(["*"], where);
      res.json(motoraviso);*/
      const motores_avisos = [{
        "motor_aviso": 1,
        "intervalo_min": 30
      }]
      res.json(motores_avisos);
    } catch (error) {
      console.error("Error al obtener la motoraviso:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  },
  guardar: async (req: Request, res: Response) => {
    try {
      const motoraviso: MotorAviso = req.body;
      const savedmotoraviso = await dataService.processData(motoraviso);
      res.status(201).json(savedmotoraviso);
    } catch (error) {
      console.error("Error al guardar la motoraviso:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  },
  async actualizar(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const motoraviso: MotorAviso = req.body;
      await dataService.updateById(id, motoraviso);
      res.status(200).json({ message: "motoraviso actualizada correctamente" });
    } catch (error) {
      console.error("Error al actualizar la motoraviso:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  },
  async eliminar(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      await dataService.deleteById(id);
      res.status(200).json({ message: "motoraviso eliminada correctamente" });
    } catch (error) {
      console.error("Error al eliminar la motoraviso:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  },
};
