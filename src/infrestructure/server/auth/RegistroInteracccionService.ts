import { Request, Response } from "express";
import { DataService } from "../DataService";
import Joi from "joi";
import { RegistroInteraccion } from "../../../core/modelo/RegistroInteraccion";
const RegistroInteraccionSchema = Joi.object({
  timestamp: Joi.string().max(50).required(),
  tipo_evento: Joi.string().max(50).required(),
  datos_evento: Joi.string().required(),
  sesion_id: Joi.number().integer().required(),
});
const dataService: DataService<RegistroInteraccion> = new DataService(
  "registros_interacciones",
  "registro_interaccion_id"
);
export const RegistroInteraccionesService = {
  async obtener(req: Request, res: Response) {
    try {
      const where = { ...req.query }; // Convertir los parámetros de consulta en filtros
      const registrointeraccion = await dataService.getAll(["*"], where);
      res.json(registrointeraccion);
    } catch (error) {
      console.error("Error al obtener la registrointeraccion:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  },
  guardar: async (req: Request, res: Response) => {
    try {
      const registrointeraccion: RegistroInteraccion = new RegistroInteraccion();
      registrointeraccion.creado_por = req.creado_por
      Object.assign(registrointeraccion, req.body);
      let responseSent = false;
      const { error: validationError } = RegistroInteraccionSchema.validate(req.body);
      if (validationError) {
        responseSent = true;
        throw new Error(validationError.details[0].message);
      }
      if (!responseSent) {
        const savedregistrointeraccion = await dataService.processData(registrointeraccion);
        res.status(201).json(savedregistrointeraccion);
      }
    } catch (error) {
      console.error("Error al guardar la registrointeraccion:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  },
  async actualizar(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const registrointeraccion: RegistroInteraccion = new RegistroInteraccion();
      Object.assign(registrointeraccion, req.body);
      let responseSent = false;
      const { error: validationError } = RegistroInteraccionSchema.validate(req.body);
      if (validationError) {
        responseSent = true;
        throw new Error(validationError.details[0].message);
      }
      if (!responseSent) {
        await dataService.updateById(id, registrointeraccion);
        res
          .status(200)
          .json({ message: "registrointeraccion actualizada correctamente" });
      }
    } catch (error) {
      console.error("Error al actualizar la registrointeraccion:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  },
  async eliminar(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      await dataService.deleteById(id);
      res.status(200).json({ message: "registrointeraccion eliminada correctamente" });
    } catch (error) {
      console.error("Error al eliminar la registrointeraccion:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  },
};
