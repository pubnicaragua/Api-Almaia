/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import { DataService } from "../DataService";
import { AlumnoAlertaBitacora } from "../../../core/modelo/alumno/AlumnoAlertaBitacora";
import { SupabaseClientService } from "../../../core/services/supabaseClient";
import { SupabaseClient } from "@supabase/supabase-js";
import Joi from "joi";
import { extractBase64Info, getExtensionFromMime, getURL, isBase64DataUrl } from "../../../core/services/ImagenServiceCasoUso";
import { randomUUID } from "crypto";

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
  responsable_id:Joi.number().optional(),
  url_archivo: Joi.string().optional(),
});
const supabaseService = new SupabaseClientService();
const client: SupabaseClient = supabaseService.getClient();
export const AlumnoAlertaBitacoraService = {
  async obtener(req: Request, res: Response) {
    try {
      const { colegio_id, ...where } = req.query;
      console.log(colegio_id);
      const alumnoAlertaBitacora = await dataService.getAll(["*,alumnos_alertas(*,responsable:personas(*))"], where);
      res.json(alumnoAlertaBitacora);
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  },
guardar: async (req: Request, res: Response) => {
  try {
    const alumnoAlertaBitacora = new AlumnoAlertaBitacora();

    // Solo se asignan los campos válidos
    const camposPermitidos = [
      "alumno_alerta_id",
      "alumno_id",
      "plan_accion",
      "fecha_compromiso",
      "fecha_realizacion",
      "url_archivo",
    ];

    camposPermitidos.forEach((campo) => {
      if (req.body[campo] !== undefined) {
        (alumnoAlertaBitacora as any)[campo] = req.body[campo];
      }
    });

    // Verifica que el alumno exista
    const { data: alumno, error: errorAlumno } = await client
      .from("alumnos")
      .select("*")
      .eq("alumno_id", alumnoAlertaBitacora.alumno_id)
      .single();

    if (errorAlumno || !alumno) {
      throw new Error("El alumno no existe");
    }

    // Verifica que la alerta exista
    const { data: alerta, error: errorAlerta } = await client
      .from("alumnos_alertas")
      .select("*")
      .eq("alumno_alerta_id", alumnoAlertaBitacora.alumno_alerta_id)
      .single();

    if (errorAlerta || !alerta) {
      throw new Error("La Alerta no existe");
    }

    // Se actualiza alerta solo si los campos están presentes
    const updateData: Record<string, any> = {};
    if (req.body.alerta_prioridad_id !== undefined) {
      updateData.prioridad_id = req.body.alerta_prioridad_id;
    }
    if (req.body.alerta_reveridad_id !== undefined) {
      updateData.severidad_id = req.body.alerta_reveridad_id;
    }    
    if (req.body.responsable_id !== undefined) {
      updateData.responsable_actual_id = req.body.responsable_id;
    }

    if (Object.keys(updateData).length > 0) {
      const { error: errorAlertaUpdate } = await client
        .from("alumnos_alertas")
        .update(updateData)
        .eq("alumno_alerta_id", alumnoAlertaBitacora.alumno_alerta_id);

      if (errorAlertaUpdate) {
        throw new Error(errorAlertaUpdate.message);
      }
    }
    // Validación con Joi (o el esquema que uses)
    const { error: validationError } = AlumnoAlertaBitacoraSchema.validate(
      req.body
    );

    if (validationError) {
      throw new Error(validationError.details[0].message);
    }
    alumnoAlertaBitacora.creado_por = req.creado_por;
    alumnoAlertaBitacora.actualizado_por = req.actualizado_por;

    if (isBase64DataUrl(alumnoAlertaBitacora.url_archivo || " ")) {
      
      const { mimeType, base64Data } = extractBase64Info(
        alumnoAlertaBitacora.url_archivo || " "
      );
      const buffer = Buffer.from(base64Data, "base64");
      const extension = getExtensionFromMime(mimeType);
      const fileName = `${randomUUID()}.${extension}`;
      const client_file = req.supabase;

      const { error } = await client_file.storage
        .from("bitacoras")
        .upload(`documents/${fileName}`, buffer, {
          contentType: mimeType,
          upsert: true,
        });

      if (error) throw error;
      alumnoAlertaBitacora.url_archivo = getURL(client_file, 'bitacoras', `documents/${fileName}`);
    }


    // Guarda la bitácora
    const saved = await dataService.processData(alumnoAlertaBitacora);
    res.status(201).json(saved);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
},


  async actualizar(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const alumnoAlertaBitacora: AlumnoAlertaBitacora = new AlumnoAlertaBitacora();
      Object.assign(alumnoAlertaBitacora, req.body);

      alumnoAlertaBitacora.actualizado_por = req.actualizado_por;
      alumnoAlertaBitacora.fecha_actualizacion = req.fecha_creacion;

      if (isBase64DataUrl(alumnoAlertaBitacora.url_archivo || " ")) {
        const { mimeType, base64Data } = extractBase64Info(
          alumnoAlertaBitacora.url_archivo || " "
        );
        const buffer = Buffer.from(base64Data, "base64");
        const extension = getExtensionFromMime(mimeType);
        const fileName = `${randomUUID()}.${extension}`;
        const client_file = req.supabase;

        const { error } = await client_file.storage
          .from("bitacoras")
          .upload(`documents/${fileName}`, buffer, {
            contentType: mimeType,
            upsert: true,
          });
        if (error) throw error;
        alumnoAlertaBitacora.url_archivo = getURL(client_file, 'bitacoras', `documents/${fileName}`);
      }

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
