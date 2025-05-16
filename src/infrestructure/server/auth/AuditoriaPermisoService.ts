import { Request, Response } from "express";
import { DataService } from "../DataService";
import Joi from "joi";
import { AuditoriaPermiso } from "../../../core/modelo/configuracion/AuditoriaPermiso";
const AuditoriaPermisoSchema = Joi.object({
  auditoria_id: Joi.number().integer().required(),
  nombre_permiso: Joi.string().max(50).required(),
});
const dataService: DataService<AuditoriaPermiso> = new DataService(
  "auditorias_permisos",
  "auditoria_permiso_id"
);
export const AuditoriaPermisoesService = {
  async obtener(req: Request, res: Response) {
    try {
      const where = { ...req.query }; // Convertir los parámetros de consulta en filtros
      const auditoriapermiso = await dataService.getAll(["*"], where);
      res.json(auditoriapermiso);
    } catch (error) {
      console.error("Error al obtener la auditoriapermiso:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  },
  guardar: async (req: Request, res: Response) => {
    try {
      const auditoriapermiso: AuditoriaPermiso = new AuditoriaPermiso();
      Object.assign(auditoriapermiso, req.body);
      let responseSent = false;
      const { error: validationError } = AuditoriaPermisoSchema.validate(req.body);
      if (validationError) {
        responseSent = true;
        throw new Error(validationError.details[0].message);
      }
      if (!responseSent) {
        const savedauditoriapermiso = await dataService.processData(auditoriapermiso);
        res.status(201).json(savedauditoriapermiso);
      }
    } catch (error) {
      console.error("Error al guardar la auditoriapermiso:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  },
  async actualizar(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const auditoriapermiso: AuditoriaPermiso = new AuditoriaPermiso();
      Object.assign(auditoriapermiso, req.body);
      let responseSent = false;
      const { error: validationError } = AuditoriaPermisoSchema.validate(req.body);
      if (validationError) {
        responseSent = true;
        throw new Error(validationError.details[0].message);
      }
      if (!responseSent) {
        await dataService.updateById(id, auditoriapermiso);
        res
          .status(200)
          .json({ message: "auditoriapermiso actualizada correctamente" });
      }
    } catch (error) {
      console.error("Error al actualizar la auditoriapermiso:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  },
  async eliminar(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      await dataService.deleteById(id);
      res.status(200).json({ message: "auditoriapermiso eliminada correctamente" });
    } catch (error) {
      console.error("Error al eliminar la auditoriapermiso:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  },
};
