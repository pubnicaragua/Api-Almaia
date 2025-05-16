import { Request, Response } from "express";
import { Auditoria } from "../../../core/modelo/auth/Auditoria";
import { DataService } from "../DataService";
import Joi from "joi";
const AuditoriaSchema = Joi.object({
  tipo_auditoria_id: Joi.number().integer().required(),
  colegio_id: Joi.number().integer().required(),
  fecha: Joi.string().required(),
  usuario_id: Joi.number().integer().required(),
  descripcion: Joi.string().max(150).required(),
  modulo_afectado: Joi.string().max(50).required(),
  accion_realizada: Joi.string().max(50).required(),
  ip_origen: Joi.string().ip().required(),
  referencia_id: Joi.number().integer().required(),
  model: Joi.string().max(45).required(),
});
const dataService: DataService<Auditoria> = new DataService(
  "auditorias",
  "auditoria_id"
);
export const AuditoriaesService = {
  async obtener(req: Request, res: Response) {
    try {
      const where = { ...req.query }; // Convertir los parámetros de consulta en filtros
      const auditoria = await dataService.getAll(["*"], where);
      res.json(auditoria);
    } catch (error) {
      console.error("Error al obtener la auditoria:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  },
  guardar: async (req: Request, res: Response) => {
    try {
      const auditoria: Auditoria = new Auditoria();
      Object.assign(auditoria, req.body);
      let responseSent = false;
      const { error: validationError } = AuditoriaSchema.validate(req.body);
      if (validationError) {
        responseSent = true;
        throw new Error(validationError.details[0].message);
      }
      if (!responseSent) {
        const savedauditoria = await dataService.processData(auditoria);
        res.status(201).json(savedauditoria);
      }
    } catch (error) {
      console.error("Error al guardar la auditoria:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  },
  async actualizar(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const auditoria: Auditoria = new Auditoria();
      Object.assign(auditoria, req.body);
      let responseSent = false;
      const { error: validationError } = AuditoriaSchema.validate(req.body);
      if (validationError) {
        responseSent = true;
        throw new Error(validationError.details[0].message);
      }
      if (!responseSent) {
        await dataService.updateById(id, auditoria);
        res
          .status(200)
          .json({ message: "auditoria actualizada correctamente" });
      }
    } catch (error) {
      console.error("Error al actualizar la auditoria:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  },
  async eliminar(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      await dataService.deleteById(id);
      res.status(200).json({ message: "auditoria eliminada correctamente" });
    } catch (error) {
      console.error("Error al eliminar la auditoria:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  },
};
