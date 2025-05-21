import { Request, Response } from "express";
import { DataService } from "../DataService";
import { AlumnoAntecedenteClinico } from "../../../core/modelo/alumno/AlumnoAntecedenteClinico";
import Joi from "joi";
import { SupabaseClientService } from "../../../core/services/supabaseClient";
import { SupabaseClient } from "@supabase/supabase-js";
import { obtenerRelacionados } from "../../../core/services/ObtenerTablasColegioCasoUso";
const supabaseService = new SupabaseClientService();
const client: SupabaseClient = supabaseService.getClient();
const dataService: DataService<AlumnoAntecedenteClinico> = new DataService(
  "alumnos_ant_clinicos",
  "alumno_ant_clinico_id"
);
const AlumnoAntecedenteClinicoSchema = Joi.object({
  alumno_id: Joi.number().integer().required(),
  historial_medico: Joi.string().max(30).optional(),
  alergias: Joi.string().max(50).optional(),
  enfermedades_cronicas: Joi.string().max(50).optional(),
  condiciones_medicas_relevantes: Joi.string().max(50).optional(),
  medicamentos_actuales: Joi.string().max(50).optional(),
  diagnosticos_previos: Joi.string().max(50).optional(),
  terapias_tratamiento_curso: Joi.string().max(50).optional(),
});
export const AlumnoAntecedenteClinicosService = {
  async obtener(req: Request, res: Response) {
    try {
      const { colegio_id, ...where } = req.query;
      let respuestaEnviada = false;
      if (colegio_id !== undefined) {
        const antecedentes = await obtenerRelacionados({
          tableFilter: "alumnos",
          filterField: "colegio_id",
          filterValue: colegio_id,
          idField: "alumno_id",
          tableIn: "alumnos_ant_clinicos",
          inField: "alumno_id",
          selectFields: `*,                      
                        alumnos(alumno_id,url_foto_perfil,telefono_contacto1,telefono_contacto2,email,personas(persona_id,nombres,apellidos))",`,
        });
        respuestaEnviada = true;
        res.json(antecedentes);
      }
      if (!respuestaEnviada) {
        const antecedentes = await dataService.getAll(
          [
            "*",
            "alumnos(alumno_id,url_foto_perfil,telefono_contacto1,telefono_contacto2,email,personas(persona_id,nombres,apellidos))",
          ],
          where
        );
        res.json(antecedentes);
      }
    } catch (error) {
      console.error("Error al obtener los antecedentes clínicos:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  },
  guardar: async (req: Request, res: Response) => {
    try {
      const antecedente: AlumnoAntecedenteClinico =
        new AlumnoAntecedenteClinico();
      Object.assign(antecedente, req.body);
      antecedente.creado_por = req.creado_por;
      antecedente.actualizado_por = req.actualizado_por;
      antecedente.activo = true;
      let responseSent = false;

      const { error: validationError } =
        AlumnoAntecedenteClinicoSchema.validate(req.body);

      const { data: dataAlumno, error: errorAlumno } = await client
        .from("alumnos")
        .select("*")
        .eq("alumno_id", antecedente.alumno_id)
        .single();
      if (errorAlumno || !dataAlumno) {
        throw new Error("El alumno no existe");
      }
      if (validationError) {
        responseSent = true;
        throw new Error(validationError.details[0].message);
      }
      if (!responseSent) {
        const savedAntecedente = await dataService.processData(antecedente);
        res.status(201).json(savedAntecedente);
      }
    } catch (error) {
      console.error("Error al guardar el antecedente clínico:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  },
  async actualizar(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);

      const antecedente: AlumnoAntecedenteClinico =
        new AlumnoAntecedenteClinico();
      Object.assign(antecedente, req.body);
      antecedente.actualizado_por = req.actualizado_por;
      antecedente.activo = true;
      let responseSent = false;

      const { error: validationError } =
        AlumnoAntecedenteClinicoSchema.validate(req.body);

      const { data: dataAlumno, error: errorAlumno } = await client
        .from("alumnos")
        .select("*")
        .eq("alumno_id", antecedente.alumno_id)
        .single();
      if (errorAlumno || !dataAlumno) {
        throw new Error("El alumno no existe");
      }
      if (validationError) {
        responseSent = true;
        throw new Error(validationError.details[0].message);
      }
      if (!responseSent) {
        await dataService.updateById(id, antecedente);
        res
          .status(200)
          .json({ message: "Antecedente clínico actualizado correctamente" });
      }
    } catch (error) {
      console.error("Error al actualizar el antecedente clínico:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  },
  async eliminar(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      await dataService.deleteById(id);
      res
        .status(200)
        .json({ message: "Antecedente clínico eliminado correctamente" });
    } catch (error) {
      console.error("Error al eliminar el antecedente clínico:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  },
};
