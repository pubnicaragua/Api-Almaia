import { Request, Response } from "express";
import { DataService } from "../DataService";
import { SupabaseClientService } from "../../../core/services/supabaseClient";
import { SupabaseClient } from "@supabase/supabase-js";
import Joi from "joi";
import { DocenteCurso } from "../../../core/modelo/colegio/DocenteCurso";
const supabaseService = new SupabaseClientService();
const client: SupabaseClient = supabaseService.getClient();
const dataService: DataService<DocenteCurso> = new DataService(
  "docentes_cursos"
);
const DocenteCursoSchema = Joi.object({
  docente_id: Joi.number().integer().required(),
  curso_id: Joi.number().integer().required(),
  ano_escolar: Joi.number().integer().required(),
});
export const DocenteCursosService = {
  async obtener(req: Request, res: Response) {
    try {
      const where = { ...req.query }; // Convertir los parámetros de consulta en filtros
      const docentesCursos = await dataService.getAll(["*",
        "docentes(docente_id,especialidad,personas(persona_id,nombres,apellidos))",
        "cursos(curso_id,nombre_curso,colegios(colegio_id,nombre),grados(grado_id,nombre),niveles_educativos(nivel_educativo_id,nombre))",
      ], where);
      res.json(docentesCursos);
    } catch (error) {
      console.error("Error al obtener el docente:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  },
  guardar: async (req: Request, res: Response) => {
    try {
      const docente: DocenteCurso = new DocenteCurso();
      Object.assign(docente, req.body);
      docente.creado_por = req.creado_por;
      docente.actualizado_por = req.actualizado_por;
      let responseSent = false;
      const { error: validationError } = DocenteCursoSchema.validate(req.body);
      const { data, error } = await client
        .from("docentes")
        .select("*")
        .eq("docente_id", docente.docente_id)
        .single();
      if (error || !data) {
        throw new Error("La persona no existe");
      }
      const { data: dataCurso, error: errorCurso } = await client
        .from("cursos")
        .select("*")
        .eq("curso_id", docente.curso_id)
        .single();
      if (errorCurso || !dataCurso) {
        throw new Error("El curso no existe");
      }

      if (validationError) {
        responseSent = true;
        throw new Error(validationError.details[0].message);
      }
      if (!responseSent) {
        const savedDocente = await dataService.processData(docente);
        res.status(201).json(savedDocente);
      }
    } catch (err) {
      const error = err as Error;
      console.error("Error al guardar el docente:", error);
      res.status(500).json({ message: error.message || "Error inesperado" });
    }
  },
  async actualizar(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const docente: DocenteCurso = new DocenteCurso();
      Object.assign(docente, req.body);
      docente.actualizado_por = req.actualizado_por;
      let responseSent = false;
      const { error: validationError } = DocenteCursoSchema.validate(req.body);
      const { data, error } = await client
        .from("docentes")
        .select("*")
        .eq("docente_id", docente.docente_id)
        .single();
      if (error || !data) {
        throw new Error("La persona no existe");
      }
      const { data: dataCurso, error: errorCurso } = await client
        .from("cursos")
        .select("*")
        .eq("curso_id", docente.curso_id)
        .single();
      if (errorCurso || !dataCurso) {
        throw new Error("El curso no existe");
      }

      if (validationError) {
        responseSent = true;
        throw new Error(validationError.details[0].message);
      }
      if (!responseSent) {
        await dataService.updateById(id, docente);
        res.status(200).json({ message: "docente actualizado correctamente" });
      }
    } catch (error) {
      console.error("Error al actualizar el docente:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  },
  async eliminar(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      await dataService.deleteById(id);
      res.status(200).json({ message: "docente eliminado correctamente" });
    } catch (error) {
      console.error("Error al eliminar el docente:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  },
};
