import { Request, Response } from "express";
import { DataService } from "../DataService";
import { MotorAlerta } from "../../../core/modelo/alerta/MotorAlerta";
import Joi from "joi";
import { SupabaseClientService } from "../../../core/services/supabaseClient";
import { SupabaseClient } from "@supabase/supabase-js";
const supabaseService = new SupabaseClientService();
const client: SupabaseClient = supabaseService.getClient();
const dataService: DataService<MotorAlerta> = new DataService(
  "motores_alertas","motor_alerta_id"
);
const MotorAlertaSchema = Joi.object({
  hr_ejecucion: Joi.string().max(5).required(),
  tipo: Joi.string().max(20).required(),
});
export const MotorAlertasService = {
  async obtener(req: Request, res: Response) {
    try {
      const where = { ...req.query }; // Convertir los parámetros de consulta en filtros
      const motoresAlerta = await dataService.getAll(["*"], where);
      res.json(motoresAlerta);
    } catch (error) {
      console.error("Error al obtener el motor de alerta:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  },
  guardar: async (req: Request, res: Response) => {
    try {
      const motoralerta: MotorAlerta = new MotorAlerta();
      Object.assign(motoralerta, req.body);
      motoralerta.creado_por = req.creado_por;
      motoralerta.actualizado_por = req.actualizado_por;
      let responseSent = false;
      const { error: validationError } = MotorAlertaSchema.validate(req.body);
      if (validationError) {
        responseSent = true;
        throw new Error(validationError.details[0].message);
      }
      if (!responseSent) {
        const savedMotorAlerta = await dataService.processData(motoralerta);
        res.status(201).json(savedMotorAlerta);
      }
    } catch (err) {
      const error = err as Error;
      console.error("Error al guardar el motoralerta:", error);
      res.status(500).json({ message: error.message || "Error inesperado" });
    }
  },
  async actualizar(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);

      const motoralerta: MotorAlerta = new MotorAlerta();
      Object.assign(motoralerta, req.body);
      motoralerta.creado_por = req.creado_por;
      motoralerta.actualizado_por = req.actualizado_por;
      let responseSent = false;
      const { error: validationError } = MotorAlertaSchema.validate(req.body);
      if (validationError) {
        responseSent = true;
        throw new Error(validationError.details[0].message);
      }
      if (!responseSent) {
        await dataService.updateById(id, motoralerta);
        res
          .status(200)
          .json({ message: "Motor de alerta actualizado correctamente" });
      }
    } catch (error) {
      console.error("Error al actualizar el motor de alerta:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  },
  async eliminar(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      await dataService.deleteById(id);
      res
        .status(200)
        .json({ message: "Motor de alerta eliminado correctamente" });
    } catch (error) {
      console.error("Error al eliminar el motor de alerta:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  },
    async ejecutar_motor() {
    const { error } = await client.rpc('ejecutar_generacion_alertas_por_colegios');
    if(error){
      console.error(error.message)
    }
 
  },
};
