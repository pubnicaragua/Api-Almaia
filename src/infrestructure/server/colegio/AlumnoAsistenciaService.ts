import { Request, Response } from "express";
import { DataService } from "../DataService";
import { AlumnoAsistencia } from "../../../core/modelo/colegio/AlumnoAsistencia";
import Joi from "joi";
import { SupabaseClientService } from "../../../core/services/supabaseClient";
import { SupabaseClient } from "@supabase/supabase-js";
import { obtenerRelacionados } from "../../../core/services/ObtenerTablasColegioCasoUso";

const supabaseService = new SupabaseClientService();
const client: SupabaseClient = supabaseService.getClient();
const AlumnoAsistenciaSchema = Joi.object({
  alumno_id: Joi.number().integer().required(),
  fecha_hora: Joi.string().optional(),
  estado: Joi.string().max(11).optional(),
  justificacion: Joi.string().max(150).optional(),
  usuario_justifica: Joi.number().integer().required(),
});
const dataService: DataService<AlumnoAsistencia> = new DataService(
  "alumnos_asistencias",
  "alumno_asistencia"
);
export const AlumnoAsistenciasService = {
  async obtener(req: Request, res: Response) {
    try {
      const { colegio_id, ...where } = req.query;
      let respuestaEnviada = false;
      if (colegio_id !== undefined) {
        const alumnoasistencias = await obtenerRelacionados({
          tableFilter: "alumnos",
          filterField: "colegio_id",
          filterValue: colegio_id,
          idField: "alumno_id",
          tableIn: "alumnos_asistencias",
          inField: "alumno_id",
          selectFields: `*,                      
                        alumnos(alumno_id,url_foto_perfil,telefono_contacto1,telefono_contacto2,email,personas(persona_id,nombres,apellidos))",`,
        });
        respuestaEnviada = true;
        res.json(alumnoasistencias);
      }
      if (!respuestaEnviada) {
        const alumnoasistencias = await dataService.getAll(
          [
            "*",
            "alumnos(alumno_id,url_foto_perfil,telefono_contacto1,telefono_contacto2,email,personas(persona_id,nombres,apellidos))",
          ],
          where
        );
        res.json(alumnoasistencias);
      }
    } catch (error) {
      res.status(500).json(error);
    }
  },

  async guardar(req: Request, res: Response) {
    try {
      const nuevoAlumnoAsistencia = new AlumnoAsistencia();
      Object.assign(nuevoAlumnoAsistencia, req.body);
      nuevoAlumnoAsistencia.creado_por = req.creado_por;
      nuevoAlumnoAsistencia.actualizado_por = req.actualizado_por;
      nuevoAlumnoAsistencia.activo = true;
      let responseSent = false;
      const { error: validationError } = AlumnoAsistenciaSchema.validate(
        req.body
      );
      const { data: dataAlumno, error: errorAlumno } = await client
        .from("alumnos")
        .select("*")
        .eq("alumno_id", nuevoAlumnoAsistencia.alumno_id)
        .single();
      if (errorAlumno || !dataAlumno) {
        throw new Error("El alumno no existe");
      }
      if (validationError) {
        responseSent = true;
        throw new Error(validationError.details[0].message);
      }
      if (!responseSent) {
        const resultado = await dataService.processData(nuevoAlumnoAsistencia);
        res.status(201).json(resultado);
      }
    } catch (error) {
      console.log(error);

      res.status(500).json(error);
    }
  },

  async actualizar(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const datosActualizados = new AlumnoAsistencia();
      Object.assign(datosActualizados, req.body);
      datosActualizados.actualizado_por = req.actualizado_por;
      datosActualizados.activo = true;
      let responseSent = false;
      const { error: validationError } = AlumnoAsistenciaSchema.validate(
        req.body
      );
      const { data: dataAlumno, error: errorAlumno } = await client
        .from("alumnos")
        .select("*")
        .eq("alumno_id", datosActualizados.alumno_id)
        .single();
      if (errorAlumno || !dataAlumno) {
        throw new Error("El alumno no existe");
      }
      if (validationError) {
        responseSent = true;
        throw new Error(validationError.details[0].message);
      }
      if (!responseSent) {
        const resultado = await dataService.updateById(id, datosActualizados);
        res.json(resultado);
      }
    } catch (error) {
      res.status(500).json(error);
    }
  },

  async eliminar(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      await dataService.deleteById(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json(error);
    }
  },
};
