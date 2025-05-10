import { Request, Response } from "express";
import { DataService } from "../DataService";
import { AlumnoCurso } from "../../../core/modelo/alumno/AlumnoCurso";
import Joi from "joi";
import { SupabaseClientService } from "../../../core/services/supabaseClient";
import { SupabaseClient } from "@supabase/supabase-js";

const dataService: DataService<AlumnoCurso> = new DataService(
  "alumnos_alertas"
);
const AlumnoCursoSchema = Joi.object({
  fecha_egreso: Joi.string().required(),
  fecha_ingreso: Joi.string().required(),
  anio_escolar: Joi.number().integer().required(),
  alumno_id: Joi.number().integer().required(),
  curso_id: Joi.number().integer().required(),
});
const supabaseService = new SupabaseClientService();
const client: SupabaseClient = supabaseService.getClient();
export const AlumnoCursoService = {
  async obtener(req: Request, res: Response) {
    try {
      const where = { ...req.query }; // Convertir los parámetros de consulta en filtros
      const alumnoCurso = await dataService.getAll(
        [
          "*,alumnos('alumno_id','url_foto_perfil','telefono_contacto1','telefono_contacto2','email'),cursos('curso_id','nombre',colegios('colegio_id','nombre'),grados('grado_id','nombre'),nivel_educativo('nivel_educativo_id','nombre'))",
        ],
        where
      );
      res.json(alumnoCurso);
      /*  const alumnos_cursos= [
                {
                  "alumno_curso_id": 601,
                  "alumno_id": 101,
                  "curso_id": 5,
                  "ano_escolar": 2023,
                  "fecha_ingreso": "2023-03-01",
                  "fecha_egreso": "2023-12-15",
                  "estado_matricula": "Activa",
                  "promedio_general": 6.2,
                  "alumno": {
                    "alumno_id": 101,
                    "nombre": "Juan Pérez",
                    "url_foto_perfil": "https://ejemplo.com/fotos/alumno101.jpg"
                  },
                  "curso": {
                    "curso_id": 5,
                    "nombre_curso": "4°",
                    "nivel_educativo": "Básica",
                    "profesor_jefe": "María González",
                    "colegio": {
                      "colegio_id": 1,
                      "nombre": "Colegio Ejemplo"
                    }
                  }
                },
                {
                  "alumno_curso_id": 602,
                  "alumno_id": 102,
                  "curso_id": 8,
                  "ano_escolar": 2023,
                  "fecha_ingreso": "2023-03-01",
                  "fecha_egreso": null,
                  "estado_matricula": "Transferido",
                  "promedio_general": 5.8,
                  "alumno": {
                    "alumno_id": 102,
                    "nombre": "Ana Sánchez"
                  },
                  "curso": {
                    "curso_id": 8,
                    "nombre_curso": "7° B",
                    "nivel_educativo": "Básica"
                  }
                }
              ]
            res.json(alumnos_cursos);*/
    } catch (error) {
      console.error("Error al obtener el curso del alumno:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  },
  guardar: async (req: Request, res: Response) => {
    try {
      const alumnoCurso: AlumnoCurso = req.body;
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
      const alumnoCurso: AlumnoCurso = req.body;
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
