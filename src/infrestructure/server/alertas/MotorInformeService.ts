import { Request, Response } from "express";
import { DataService } from "../DataService";
import { MotorInforme } from "../../../core/modelo/alerta/MotorInforme";
import Joi from "joi";

const dataService: DataService<MotorInforme> = new DataService(
  "motores_informes"
);
const MotorInformeSchema = Joi.object({
  freq_meses: Joi.number().integer().required(),
  dia_ejecucion: Joi.number().integer().required(),
});
export const MotorInformesService = {
  async obtener(req: Request, res: Response) {
    try {
      const where = { ...req.query }; // Convertir los parámetros de consulta en filtros
      const motoresInforme = await dataService.getAll(["*"], where);
      res.json(motoresInforme);
    } catch (error) {
      console.error("Error al obtener el motor de informe:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  },
  guardar: async (req: Request, res: Response) => {
    try {
      const motorinforme: MotorInforme = new MotorInforme();
      Object.assign(motorinforme, req.body);
      motorinforme.creado_por = req.creado_por;
      motorinforme.actualizado_por = req.actualizado_por;
      let responseSent = false;
      const { error: validationError } = MotorInformeSchema.validate(req.body);
      if (validationError) {
        responseSent = true;
        throw new Error(validationError.details[0].message);
      }
      if (!responseSent) {
        const savedMotorInforme = await dataService.processData(motorinforme);
        res.status(201).json(savedMotorInforme);
      }
    } catch (err) {
      const error = err as Error;
      console.error("Error al guardar el motorinforme:", error);
      res.status(500).json({ message: error.message || "Error inesperado" });
    }
  },
  async actualizar(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const motorinforme: MotorInforme = new MotorInforme();
      Object.assign(motorinforme, req.body);
      motorinforme.creado_por = req.creado_por;
      motorinforme.actualizado_por = req.actualizado_por;
      let responseSent = false;
      const { error: validationError } = MotorInformeSchema.validate(req.body);
      if (validationError) {
        responseSent = true;
        throw new Error(validationError.details[0].message);
      }
      if (!responseSent) {
        await dataService.updateById(id, motorinforme);
        res
          .status(200)
          .json({ message: "Motor de informe actualizado correctamente" });
      }
    } catch (error) {
      console.error("Error al actualizar el motor de informe:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  },
  async eliminar(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      await dataService.deleteById(id);
      res
        .status(200)
        .json({ message: "Motor de informe eliminado correctamente" });
    } catch (error) {
      console.error("Error al eliminar el motor de informe:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  },
};
