import { Request, Response } from "express";
import { DataService } from "../DataService";
import { AlumnoInforme } from "../../../core/modelo/alumno/AlumnoInforme";
import { SupabaseClientService } from "../../../core/services/supabaseClient";
import { SupabaseClient } from "@supabase/supabase-js";
import Joi from "joi";
import { MotorInformeService } from "./MotorInformeService";

const supabaseService = new SupabaseClientService();
const client: SupabaseClient = supabaseService.getClient();
const dataService: DataService<AlumnoInforme> = new DataService(
  "alumnos_informes",
  "alumno_informe_id"
);
const AlumnoInformeSchema = Joi.object({
  alumno_id: Joi.number().integer().required(),
  fecha: Joi.string().required(),
  url_reporte: Joi.string().max(255).required(),
});
export const AlumnoInformeService = {
  async obtener(req: Request, res: Response) {
    try {
      const where = { ...req.query }; // Convertir los parámetros de consulta en filtros
      const alumnoInforme = await dataService.getAll(
        [
          "*",
          "alumnos(alumno_id,url_foto_perfil,personas(persona_id,nombres,apellidos),alumnos_cursos(alumno_curso_id,ano_escolar,cursos(curso_id,nombre_curso,colegios(colegio_id,nombre),grados(grado_id,nombre))))",
        ],
        where
      );
      res.json(alumnoInforme);
    } catch (error) {
      console.error("Error al obtener el informe del alumno:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  },
  guardar: async (req: Request, res: Response) => {
    try {
      const alumnoInforme: AlumnoInforme = new AlumnoInforme();
      Object.assign(alumnoInforme, req.body);
      alumnoInforme.creado_por = req.creado_por;
      alumnoInforme.actualizado_por = req.actualizado_por;
      let responseSent = false;
      const { error: validationError } = AlumnoInformeSchema.validate(req.body);
      const { data, error } = await client
        .from("alumnos")
        .select("*")
        .eq("alumno_id", alumnoInforme.alumno_id)
        .single();
      if (error || !data) {
        throw new Error("El alumno no existe");
      }

      if (validationError) {
        responseSent = true;
        throw new Error(validationError.details[0].message);
      }
      if (!responseSent) {
        const savedAlumnoInforme = await dataService.processData(alumnoInforme);
        res.status(201).json(savedAlumnoInforme);
      }
    } catch (error) {
      console.error("Error al guardar el informe del alumno:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  },
  async actualizar(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const alumnoInforme: AlumnoInforme = new AlumnoInforme();
      Object.assign(alumnoInforme, req.body);
      alumnoInforme.creado_por = req.creado_por;
      alumnoInforme.actualizado_por = req.actualizado_por;
      let responseSent = false;
      const { error: validationError } = AlumnoInformeSchema.validate(req.body);
      const { data, error } = await client
        .from("alumnos")
        .select("*")
        .eq("alumno_id", alumnoInforme.alumno_id)
        .single();
      if (error || !data) {
        throw new Error("El alumno no existe");
      }

      if (validationError) {
        responseSent = true;
        throw new Error(validationError.details[0].message);
      }
      if (!responseSent) {
        await dataService.updateById(id, alumnoInforme);
        res
          .status(200)
          .json({ message: "Informe del alumno actualizado correctamente" });
      }
    } catch (error) {
      console.error("Error al actualizar el informe del alumno:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  },
  async eliminar(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      await dataService.deleteById(id);
      res
        .status(200)
        .json({ message: "Informe del alumno eliminado correctamente" });
    } catch (error) {
      console.error("Error al eliminar el informe del alumno:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  },
  async generarInformeManual (req: Request, res: Response) {
    try {
      // Aquí se puede implementar la lógica para generar el informe manualmente
      await MotorInformeService.generarInformeAlumnos();
      res.status(200).json({ message: "Informe generado manualmente" });
    } catch (error) {
      console.error("Error al generar el informe manual:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  },
};
