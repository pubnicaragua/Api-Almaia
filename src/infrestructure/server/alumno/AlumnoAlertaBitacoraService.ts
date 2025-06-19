import { Request, Response } from "express";
import { DataService } from "../DataService";
import { AlumnoAlertaBitacora } from "../../../core/modelo/alumno/AlumnoAlertaBitacora";
import { SupabaseClientService } from "../../../core/services/supabaseClient";
import { SupabaseClient } from "@supabase/supabase-js";
import Joi from "joi";

const dataService: DataService<AlumnoAlertaBitacora> = new DataService(
  "alumnos_alertas_bitacoras",
  "alumno_alerta_bitacora_id"
);
const AlumnoAlertaBitacoraSchema = Joi.object({
  alumno_alerta_id: Joi.number().integer().required(),
  alumno_id: Joi.number().integer().required(),
  plan_accion: Joi.string().required(),
  fecha_compromiso: Joi.string().required(),
  nuevo_estado: Joi.string().optional(),
  nuevo_responsable: Joi.number().optional(),
  fecha_realizacion: Joi.string().optional(),
  alerta_prioridad_id:Joi.number().optional(),
  alerta_severidad_id:Joi.number().optional(),
  url_archivo: Joi.string().max(255).optional(),
});
const supabaseService = new SupabaseClientService();
const client: SupabaseClient = supabaseService.getClient();
export const AlumnoAlertaBitacoraService = {
  async obtener(req: Request, res: Response) {
    try {
      const { colegio_id, ...where } = req.query;
      console.log(colegio_id);
      const alumnoAlertaBitacora = await dataService.getAll(["*"], where);
      res.json(alumnoAlertaBitacora);
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  },
  guardar: async (req: Request, res: Response) => {
    try {
      const alumnoAlertaBitacora: AlumnoAlertaBitacora =
        new AlumnoAlertaBitacora();
      Object.assign(alumnoAlertaBitacora, req.body);
      const { data, error } = await client
        .from("alumnos")
        .select("*")
        .eq("alumno_id", alumnoAlertaBitacora.alumno_id)
        .single();
      if (error || !data) {
        throw new Error("El alumno no existe");
      }
      const { data: dataAlumnoAlerta, error: errorAlumnoAlerta } = await client
        .from("alumnos_alertas")
        .select("*")
        .eq("alumno_alerta_id", alumnoAlertaBitacora.alumno_alerta_id)
        .single();
      if (errorAlumnoAlerta || !dataAlumnoAlerta) {
        throw new Error("La Alerta no existe");
      }
      alumnoAlertaBitacora.creado_por = req.creado_por;
      alumnoAlertaBitacora.actualizado_por = req.actualizado_por;
      let responseSent = false;
      //Actualiza alertas
     // if (
    //    req.body.nuevo_responsable !== undefined ||
    //    req.body.nuevo_responsable !== undefined
    //  ) {
        const { error: errorAlumnosAlertas } = await client
          .from("alumnos_alertas")
          .update({
            //responsable_actual_id: req.body.nuevo_responsable,
            alerta_prioridad_id: req.body.alerta_prioridad_id,
            alerta_reveridad_id:req.body.alerta_reveridad_id,
            //estado: req.body.nuevo_estado,
          })
          .eq("alumno_alerta_id", alumnoAlertaBitacora.alumno_alerta_id); // filtro por el campo 'id'
        if (errorAlumnosAlertas) {
          throw new Error(errorAlumnosAlertas.message);
        }
   //   }
      const { error: validationError } = AlumnoAlertaBitacoraSchema.validate(
        req.body
      );
      if (validationError) {
        responseSent = true;
        throw new Error(validationError.details[0].message);
      }
      if (!responseSent) {
        const savedAlumnoAlertaBitacora = await dataService.processData(
          alumnoAlertaBitacora
        );
        res.status(201).json(savedAlumnoAlertaBitacora);
      }
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  },
  async actualizar(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const alumnoAlertaBitacora: AlumnoAlertaBitacora =
        new AlumnoAlertaBitacora();
      Object.assign(alumnoAlertaBitacora, req.body);
      alumnoAlertaBitacora.creado_por = req.creado_por;
      alumnoAlertaBitacora.actualizado_por = req.actualizado_por;
      await dataService.updateById(id, alumnoAlertaBitacora);
      res
        .status(200)
        .json({ message: "Alumno Alerta Bitácora actualizada correctamente" });
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  },
  async eliminar(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      await dataService.deleteById(id);
      res
        .status(200)
        .json({ message: "Alumno Alerta Bitácora eliminada correctamente" });
    } catch (error) {
      console.error("Error al eliminar la alerta:", error);
      res.status(500).json({ message: (error as Error).message });
    }
  },
};
