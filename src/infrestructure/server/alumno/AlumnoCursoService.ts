import { Request, Response } from "express";
import { DataService } from "../DataService";
import { AlumnoCurso } from "../../../core/modelo/alumno/AlumnoCurso";
import Joi from "joi";
import { SupabaseClientService } from "../../../core/services/supabaseClient";
import { SupabaseClient } from "@supabase/supabase-js";
import { obtenerRelacionados } from "../../../core/services/ObtenerTablasColegioCasoUso";

const dataService: DataService<AlumnoCurso> = new DataService(
  "alumnos_cursos",
  "alumno_curso_id"
);
const AlumnoCursoSchema = Joi.object({
  fecha_egreso: Joi.string().required(),
  fecha_ingreso: Joi.string().required(),
  ano_escolar: Joi.number().integer().required(),
  alumno_id: Joi.number().integer().required(),
  curso_id: Joi.number().integer().required(),
});
const supabaseService = new SupabaseClientService();
const client: SupabaseClient = supabaseService.getClient();
export const AlumnoCursoService = {
  async obtener(req: Request, res: Response) {
    try {
      const { colegio_id, ...where } = req.query;
      let respuestaEnviada = false;
      if (colegio_id !== undefined) {
        const alumnos_apoderados = await obtenerRelacionados({
          tableFilter: "alumnos",
          filterField: "colegio_id",
          filterValue: colegio_id,
          idField: "alumno_id",
          tableIn: "alumnos_cursos",
          inField: "alumno_id",
          selectFields: `*,
                          alumnos(alumno_id,url_foto_perfil,telefono_contacto1,telefono_contacto2,email)
                          cursos(curso_id,nombre_curso,colegios(colegio_id,nombre),grados(grado_id,nombre),niveles_educativos(nivel_educativo_id,nombre))`,
        });
        respuestaEnviada = true;
        res.json(alumnos_apoderados);
      }
      if (!respuestaEnviada) {
        const alumnoCurso = await dataService.getAll(
          [
            "*",
            "alumnos(alumno_id,url_foto_perfil,telefono_contacto1,telefono_contacto2,email)",
            "cursos(curso_id,nombre_curso,colegios(colegio_id,nombre),grados(grado_id,nombre),niveles_educativos(nivel_educativo_id,nombre))",
          ],
          where
        );
        res.json(alumnoCurso);
      }
    } catch (error) {
      console.error("Error al obtener el curso del alumno:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  },
  guardar: async (req: Request, res: Response) => {
    try {
      const alumnoCurso: AlumnoCurso = new AlumnoCurso();
      Object.assign(alumnoCurso, req.body);
      alumnoCurso.creado_por = req.creado_por;
      alumnoCurso.actualizado_por = req.actualizado_por;
      alumnoCurso.activo = true;
      let responseSent = false;
      const { error: validationError } = AlumnoCursoSchema.validate(req.body);
      const { data, error } = await client
        .from("alumnos")
        .select("*")
        .eq("alumno_id", alumnoCurso.alumno_id)
        .single();
      if (error || !data) {
        throw new Error("El alumno no existe");
      }
      const { data: dataCurso, error: errorCurso } = await client
        .from("cursos")
        .select("*")
        .eq("curso_id", alumnoCurso.curso_id)
        .single();
      if (errorCurso || !dataCurso) {
        throw new Error("El alumno no existe");
      }
      if (validationError) {
        responseSent = true;
        throw new Error(validationError.details[0].message);
      }
      if (!responseSent) {
        const savedAlumnoCurso = await dataService.processData(alumnoCurso);
        res.status(201).json(savedAlumnoCurso);
      }
    } catch (error) {
      console.error("Error al guardar el curso del alumno:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  },
  async actualizar(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const alumnoCurso: AlumnoCurso = new AlumnoCurso();
      Object.assign(alumnoCurso, req.body);
      alumnoCurso.creado_por = req.creado_por;
      alumnoCurso.actualizado_por = req.actualizado_por;
      let responseSent = false;
      const { error: validationError } = AlumnoCursoSchema.validate(req.body);
      const { data, error } = await client
        .from("alumnos")
        .select("*")
        .eq("alumno_id", alumnoCurso.alumno_id)
        .single();
      if (error || !data) {
        throw new Error("El alumno no existe");
      }
      const { data: dataCurso, error: errorCurso } = await client
        .from("cursos")
        .select("*")
        .eq("curso_id", alumnoCurso.curso_id)
        .single();
      if (errorCurso || !dataCurso) {
        throw new Error("El alumno no existe");
      }
      if (validationError) {
        responseSent = true;
        throw new Error(validationError.details[0].message);
      }
      if (!responseSent) {
        const alumnoCurso: AlumnoCurso = req.body;
        await dataService.updateById(id, alumnoCurso);
        res
          .status(200)
          .json({ message: "Curso del alumno actualizado correctamente" });
      }
    } catch (error) {
      console.error("Error al actualizar el curso del alumno:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  },
  async eliminar(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      await dataService.deleteById(id);
      res
        .status(200)
        .json({ message: "Curso del alumno eliminado correctamente" });
    } catch (error) {
      console.error("Error al eliminar el curso del alumno:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  },
};
