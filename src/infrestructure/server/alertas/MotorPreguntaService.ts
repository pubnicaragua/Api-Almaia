import { Request, Response } from "express";
import { DataService } from "../DataService";
import { MotorPregunta } from "../../../core/modelo/alerta/MotorPregunta";
import Joi from "joi";
import { SupabaseClientService } from "../../../core/services/supabaseClient";
import { SupabaseClient } from "@supabase/supabase-js";
const supabaseService = new SupabaseClientService();
const client: SupabaseClient = supabaseService.getClient();
const dataService: DataService<MotorPregunta> = new DataService(
  "motores_preguntas",
  "motor_pregunta_id"
);
const MotorPreguntaSchema = Joi.object({
  dia_ejecucion: Joi.string().required(),
});
export const MotorPreguntasService = {
  async obtener(req: Request, res: Response) {
    try {
      const where = { ...req.query }; // Convertir los parámetros de consulta en filtros
      const motorPreguntas = await dataService.getAll(["*"], where);
      res.json(motorPreguntas);
    } catch (error) {
      console.error("Error al obtener el motor de pregunta:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  },
  guardar: async (req: Request, res: Response) => {
    try {
      const motorpregunta: MotorPregunta = new MotorPregunta();
      Object.assign(motorpregunta, req.body);
      motorpregunta.creado_por = req.creado_por;
      motorpregunta.actualizado_por = req.actualizado_por;
      let responseSent = false;
      const { error: validationError } = MotorPreguntaSchema.validate(req.body);
      if (validationError) {
        responseSent = true;
        throw new Error(validationError.details[0].message);
      }
      if (!responseSent) {
        const savedMotorPregunta = await dataService.processData(motorpregunta);
        res.status(201).json(savedMotorPregunta);
      }
    } catch (err) {
      const error = err as Error;
      console.error("Error al guardar el motorpregunta:", error);
      res.status(500).json({ message: error.message || "Error inesperado" });
    }
  },
  async actualizar(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);

      const motorpregunta: MotorPregunta = new MotorPregunta();
      Object.assign(motorpregunta, req.body);
      motorpregunta.creado_por = req.creado_por;
      motorpregunta.actualizado_por = req.actualizado_por;
      let responseSent = false;
      const { error: validationError } = MotorPreguntaSchema.validate(req.body);
      if (validationError) {
        responseSent = true;
        throw new Error(validationError.details[0].message);
      }
      if (!responseSent) {
        await dataService.updateById(id, motorpregunta);
        res
          .status(200)
          .json({ message: "Motor de pregunta actualizado correctamente" });
      }
    } catch (error) {
      console.error("Error al actualizar el motor de pregunta:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  },
  async eliminar(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      await dataService.deleteById(id);
      res
        .status(200)
        .json({ message: "Motor de pregunta eliminado correctamente" });
    } catch (error) {
      console.error("Error al eliminar el motor de pregunta:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  },
   async ejecutar_motor(colegio_id:number) {
    console.log('ejecutando motor preguntas');
    const { error } = await client.rpc('generar_preguntas_alumnos',{
      p_colegio_id:colegio_id
    });
    if(error){
      console.error(error.message)
    }
    console.log('finalizo motor preguntas');
 
  },
};
