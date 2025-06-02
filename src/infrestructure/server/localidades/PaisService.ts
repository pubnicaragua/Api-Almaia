import { Request, Response } from "express";
import { DataService } from "../DataService";
import { Pais } from "../../../core/modelo/localidades/Pais";
import Joi from "joi";

const dataService: DataService<Pais> = new DataService("paises");
const PaisSchema = Joi.object({
  nombre: Joi.string().max(50).required(),
});

export const PaisService = {
  async obtener(req: Request, res: Response) {
    try {
      const where = { ...req.query };
      const pais = await dataService.getAll(["*"], where);
      res.json(pais);
    } catch (error) {
      console.error("Error al obtener la pais:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  },
  guardar: async (req: Request, res: Response) => {
    try {
      const pais: Pais = new Pais();
      Object.assign(pais, req.body); 
      pais.creado_por = req.creado_por; 
      let responseSent = false; 
      const { error: validationError } = PaisSchema.validate(req.body);
      if (validationError) {
        res.status(400).json({ error: validationError.details[0].message });
        responseSent = true;
      }
      if (!responseSent) {
        const savedpais = await dataService.processData(pais);
        res.status(201).json(savedpais);
      }
    } catch (error) {
      console.error("Error al guardar la pais:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  },
  async actualizar(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const pais: Pais = req.body;
      await dataService.updateById(id, pais);
      res.status(200).json({ message: "pais actualizada correctamente" });
    } catch (error) {
      console.error("Error al actualizar la pais:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  },
  async eliminar(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      await dataService.deleteById(id);
      res.status(200).json({ message: "pais eliminada correctamente" });
    } catch (error) {
      console.error("Error al eliminar la pais:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  },
};
