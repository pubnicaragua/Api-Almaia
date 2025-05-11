import { Request, Response } from "express";
import { Rol } from "../../../core/modelo/auth/Rol";
import { DataService } from "../DataService";
import Joi from "joi";
const RolSchema = Joi.object({
  nombre: Joi.string().max(50).required(),
  descripcion: Joi.string().max(50).required(),
});
const dataService: DataService<Rol> = new DataService("roles","rol_id");
export const RolesService = {
  async obtener(req: Request, res: Response) {
    try {
      const where = { ...req.query }; // Convertir los parámetros de consulta en filtros
      const rol = await dataService.getAll(["*"], where);
      res.json(rol);
    } catch (error) {
      console.error("Error al obtener la rol:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  },
  guardar: async (req: Request, res: Response) => {
    try {
      const rol: Rol = new Rol();
      Object.assign(rol, req.body);
      rol.creado_por = req.creado_por;
      rol.actualizado_por = req.actualizado_por;
      let responseSent = false;
      const { error: validationError } = RolSchema.validate(req.body);
      if (validationError) {
        responseSent = true;
        throw new Error(validationError.details[0].message);
      }
      if (!responseSent) {
        const savedrol = await dataService.processData(rol);
        res.status(201).json(savedrol);
      }
    } catch (error) {
      console.error("Error al guardar la rol:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  },
  async actualizar(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const rol: Rol = new Rol();
      Object.assign(rol, req.body);
      rol.creado_por = req.creado_por;
      rol.actualizado_por = req.actualizado_por;
      let responseSent = false;
      const { error: validationError } = RolSchema.validate(req.body);
      if (validationError) {
        responseSent = true;
        throw new Error(validationError.details[0].message);
      }
      if (!responseSent) {
        await dataService.updateById(id, rol);
        res.status(200).json({ message: "rol actualizada correctamente" });
      }
    } catch (error) {
      console.error("Error al actualizar la rol:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  },
  async eliminar(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      await dataService.deleteById(id);
      res.status(200).json({ message: "rol eliminada correctamente" });
    } catch (error) {
      console.error("Error al eliminar la rol:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  },
};
