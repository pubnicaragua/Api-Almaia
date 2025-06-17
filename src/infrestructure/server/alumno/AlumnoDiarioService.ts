import { Request, Response } from "express";
import { DataService } from "../DataService";
import { AlumnoDiario } from "../../../core/modelo/alumno/AlumnoDiario";
import Joi from "joi";
import { SupabaseClientService } from "../../../core/services/supabaseClient";
import { SupabaseClient } from "@supabase/supabase-js";
import { obtenerRelacionados } from "../../../core/services/ObtenerTablasColegioCasoUso";

const dataService: DataService<AlumnoDiario> = new DataService(
  "alumnos_diarios",
  "alumno_diario_id"
);
const AlumnoDiarioSchema = Joi.object({
  titulo: Joi.string().max(50).required(),
  descripcion: Joi.string().required(),
  fecha: Joi.string().required(),
  alumno_id: Joi.number().integer().required(),
});
const supabaseService = new SupabaseClientService();
const client: SupabaseClient = supabaseService.getClient();
export const AlumnoDiarioService = {
  async obtener(req: Request, res: Response) {
    try {
      const { colegio_id, ...where } = req.query;
      let respuestaEnviada = false;
      if (colegio_id !== undefined) {
        const alumnos_cursos = await obtenerRelacionados({
          tableFilter: "alumnos",
          filterField: "colegio_id",
          filterValue: colegio_id,
          idField: "alumno_id",
          tableIn: "alumnos_diarios",
          inField: "alumno_id",
          selectFields: `*,alumnos(alumno_id,url_foto_perfil,telefono_contacto1,telefono_contacto2,email)`,
          orderBy: { field: 'fecha', ascending: false } 
        });
        respuestaEnviada = true;
        res.json(alumnos_cursos);
      }
      if (!respuestaEnviada) {
        const alumnoDiario = await dataService.getAll(
          [
            "*",
            "alumnos(alumno_id,url_foto_perfil,telefono_contacto1,telefono_contacto2,email)"
          ],
          where,
          'fecha'
        );
        res.json(alumnoDiario);
      }
    } catch (error) {
      console.error("Error al obtener el curso del alumno:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  },
  guardar: async (req: Request, res: Response) => {
    try {
      const alumnoDiario: AlumnoDiario = new AlumnoDiario();
      Object.assign(alumnoDiario, req.body);
      alumnoDiario.creado_por = req.creado_por;
      alumnoDiario.actualizado_por = req.actualizado_por;
      alumnoDiario.activo = true;
      let responseSent = false;
      const { error: validationError } = AlumnoDiarioSchema.validate(req.body);
      const { data, error } = await client
        .from("alumnos")
        .select("*")
        .eq("alumno_id", alumnoDiario.alumno_id)
        .single();
      if (error || !data) {
        throw new Error("El alumno no existe");
      }
      if (validationError) {
        responseSent = true;
        throw new Error(validationError.details[0].message);
      }
      if (!responseSent) {
        const savedAlumnoDiario = await dataService.processData(alumnoDiario);
        res.status(201).json(savedAlumnoDiario);
      }
    } catch (error) {
      console.error("Error al guardar el curso del alumno:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  },
  async actualizar(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const alumnoDiario: AlumnoDiario = new AlumnoDiario();
      Object.assign(alumnoDiario, req.body);
      alumnoDiario.creado_por = req.creado_por;
      alumnoDiario.actualizado_por = req.actualizado_por;
      let responseSent = false;
      const { error: validationError } = AlumnoDiarioSchema.validate(req.body);
      const { data, error } = await client
        .from("alumnos")
        .select("*")
        .eq("alumno_id", alumnoDiario.alumno_id)
        .single();
      if (error || !data) {
        throw new Error("El alumno no existe");
      }
      if (validationError) {
        responseSent = true;
        throw new Error(validationError.details[0].message);
      }
      if (!responseSent) {
        const alumnoDiario: AlumnoDiario = req.body;
        await dataService.updateById(id, alumnoDiario);
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
