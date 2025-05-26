import { Request, Response } from "express";
import { DataService } from "../DataService";
import { AlumnoAlerta } from "../../../core/modelo/alumno/AlumnoAlerta";
import Joi from "joi";
import { SupabaseClientService } from "../../../core/services/supabaseClient";
import { SupabaseClient } from "@supabase/supabase-js";
import {
  mapearAlertaDetalle,
  mapearAlertas,
} from "../../../core/services/AlertasServiceCasoUso";
import { obtenerRelacionados } from "../../../core/services/ObtenerTablasColegioCasoUso";
const AlumnoAlertaSchema = Joi.object({
  alumno_id: Joi.number().integer().required(),
  alerta_regla_id: Joi.number().integer().optional(),
  mensaje: Joi.string().max(100).required(),
  fecha_generada: Joi.string().required(),
  fecha_resolucion: Joi.string().optional(),
  alerta_origen_id: Joi.number().integer().required(),
  prioridad_id: Joi.number().integer().required(),
  severidad_id: Joi.number().integer().required(),
  accion_tomada: Joi.string().max(200).optional(),
  leida: Joi.boolean().required(),
  estado: Joi.string().max(20).required(),
  alertas_tipo_alerta_tipo_id: Joi.number().integer().required(),
});
const supabaseService = new SupabaseClientService();
const client: SupabaseClient = supabaseService.getClient();
const dataService: DataService<AlumnoAlerta> = new DataService(
  "alumnos_alertas","alumno_alerta_id"
);
export const AlumnoAlertaService = {
  async obtener(req: Request, res: Response) {
    try {
      const { colegio_id, ...where } = req.query;
      let respuestaEnviada = false;
      if (colegio_id !== undefined) {
        const alumnoalertaAlerta_data = await obtenerRelacionados({
          tableFilter: "alumnos",
          filterField: "colegio_id",
          filterValue: colegio_id,
          idField: "alumno_id",
          tableIn: "alumnos_alertas",
          inField: "alumno_id",
          selectFields: `*,
            alumnos(alumno_id,url_foto_perfil,personas(persona_id,nombres,apellidos))",
            "alertas_reglas(alerta_regla_id,nombre)",
            "alertas_origenes(alerta_origen_id,nombre)",
            "alertas_severidades(alerta_severidad_id,nombre)",
            "alertas_prioridades(alerta_prioridad_id,nombre)",
            "alertas_tipos(alerta_tipo_id,nombre)",
            "personas(persona_id,nombres,apellidos) `,
        });
        respuestaEnviada = true;
        res.json(mapearAlertas(alumnoalertaAlerta_data));
      }
      if (!respuestaEnviada) {
        const alumnoalertaAlerta_data = await dataService.getAll(
          [
            "*",
            "alumnos(alumno_id,url_foto_perfil,personas(persona_id,nombres,apellidos))",
            "alertas_reglas(alerta_regla_id,nombre)",
            "alertas_origenes(alerta_origen_id,nombre)",
            "alertas_severidades(alerta_severidad_id,nombre)",
            "alertas_prioridades(alerta_prioridad_id,nombre)",
            "alertas_tipos(alerta_tipo_id,nombre)",
            "personas(persona_id,nombres,apellidos)",
          ],
          where
        );
        res.json(mapearAlertas(alumnoalertaAlerta_data));
      }
    } catch (error) {
      console.error("Error al obtener la alerta del alumnoalerta:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  },
  async detalle(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const where = { alumno_alerta_id: id }; // Convertir los parámetros de consulta en filtros
      const alumnoalertaAlerta_data = await dataService.getAll(
        [
          "*",
          "alumnos(alumno_id,url_foto_perfil,personas(persona_id,nombres,apellidos),alumnos_cursos(alumno_curso_id,ano_escolar,cursos(curso_id,nombre_curso,colegios(colegio_id,nombre),grados(grado_id,nombre))))",
          "alertas_reglas(alerta_regla_id,nombre)",
          "alertas_origenes(alerta_origen_id,nombre)",
          "alertas_severidades(alerta_severidad_id,nombre)",
          "alertas_prioridades(alerta_prioridad_id,nombre)",
          "alertas_tipos(alerta_tipo_id,nombre)",
          "personas(persona_id,nombres,apellidos,usuarios(usuario_id,nombre_social,url_foto_perfil,roles(rol_id,nombre)))",
        ],
        where
      );
      const alumnoalertaAlerta = mapearAlertaDetalle(alumnoalertaAlerta_data);
      res.json(alumnoalertaAlerta);
    } catch (error) {
      console.error("Error al obtener la alerta del alumnoalerta:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  },
  guardar: async (req: Request, res: Response) => {
    try {
      const alumnoalerta: AlumnoAlerta = new AlumnoAlerta();
      Object.assign(alumnoalerta, req.body);
      alumnoalerta.creado_por = req.creado_por;
      alumnoalerta.actualizado_por = req.actualizado_por;
      let responseSent = false;
      const { error: validationError } = AlumnoAlertaSchema.validate(req.body);
      const { data, error } = await client
        .from("alumnos")
        .select("*")
        .eq("alumno_id", alumnoalerta.alumno_id)
        .single();
      if (error || !data) {
        throw new Error("El colegio no existe");
      }
      if (alumnoalerta.alerta_regla_id !== undefined){
        const { data: dataAlertaRegla, error: errorAlertaRegla } = await client
          .from("alertas_reglas")
          .select("*")
          .eq("alerta_regla_id", alumnoalerta.alerta_regla_id)
          .single();
        if (errorAlertaRegla || !dataAlertaRegla) {
          throw new Error("La regla no existe");
        }
      }
      const { data: dataAlertaOrigen, error: errorAlertaOrigen } = await client
        .from("alertas_origenes")
        .select("*")
        .eq("alerta_origen_id", alumnoalerta.alerta_origen_id)
        .single();
      if (errorAlertaOrigen || !dataAlertaOrigen) {
        throw new Error("El origen no existe");
      }
      const { data: dataAlertaPrioridad, error: errorAlertaPrioridad } =
        await client
          .from("alertas_prioridades")
          .select("*")
          .eq("alerta_prioridad_id", alumnoalerta.prioridad_id)
          .single();
      if (errorAlertaPrioridad || !dataAlertaPrioridad) {
        throw new Error("La  prioridad no existe");
      }
      const { data: dataAlertaSeveridad, error: errorAlertaSeveridad } =
        await client
          .from("alertas_severidades")
          .select("*")
          .eq("alerta_severidad_id", alumnoalerta.severidad_id)
          .single();
      if (errorAlertaSeveridad || !dataAlertaSeveridad) {
        throw new Error("La  severidad no existe");
      }
      const { data: dataAlertaTipo, error: errorAlertaTipo } = await client
        .from("alertas_tipos")
        .select("*")
        .eq("alerta_tipo_id", alumnoalerta.alertas_tipo_alerta_tipo_id)
        .single();
      if (errorAlertaTipo || !dataAlertaTipo) {
        throw new Error("La  severidad no existe");
      }
      if (validationError) {
        responseSent = true;
        throw new Error(validationError.details[0].message);
      }
      if (!responseSent) {
        console.log(alumnoalerta);

        const savedAlumnoAlerta = await dataService.processData(alumnoalerta);
        res.status(201).json(savedAlumnoAlerta);
      }
    } catch (err) {
      const error = err as Error;
      console.error("Error al guardar el alumnoalerta:", error);
      res.status(500).json({ message: error.message || "Error inesperado" });
    }
  },
  async actualizar(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const alumnoalerta: AlumnoAlerta = new AlumnoAlerta();
      Object.assign(alumnoalerta, req.body);
      alumnoalerta.actualizado_por = req.actualizado_por;
      let responseSent = false;
      const { error: validationError } = AlumnoAlertaSchema.validate(req.body);
      const { data, error } = await client
        .from("alumnos")
        .select("*")
        .eq("alumno_id", alumnoalerta.alumno_id)
        .single();
      if (error || !data) {
        throw new Error("El colegio no existe");
      }
      const { data: dataAlertaRegla, error: errorAlertaRegla } = await client
        .from("alertas_reglas")
        .select("*")
        .eq("alerta_regla_id", alumnoalerta.alerta_regla_id)
        .single();
      if (errorAlertaRegla || !dataAlertaRegla) {
        throw new Error("El colegio no existe");
      }
      const { data: dataAlertaOrigen, error: errorAlertaOrigen } = await client
        .from("alertas_origenes")
        .select("*")
        .eq("alerta_origen_id", alumnoalerta.alerta_origen_id)
        .single();
      if (errorAlertaOrigen || !dataAlertaOrigen) {
        throw new Error("El origen no existe");
      }
      const { data: dataAlertaPrioridad, error: errorAlertaPrioridad } =
        await client
          .from("alertas_prioridades")
          .select("*")
          .eq("alerta_prioridad_id", alumnoalerta.prioridad_id)
          .single();
      if (errorAlertaPrioridad || !dataAlertaPrioridad) {
        throw new Error("La  prioridad no existe");
      }
      const { data: dataAlertaSeveridad, error: errorAlertaSeveridad } =
        await client
          .from("alertas_severidades")
          .select("*")
          .eq("alerta_severidad_id", alumnoalerta.severidad_id)
          .single();
      if (errorAlertaSeveridad || !dataAlertaSeveridad) {
        throw new Error("La  severidad no existe");
      }
      const { data: dataAlertaTipo, error: errorAlertaTipo } = await client
        .from("alertas_tipos")
        .select("*")
        .eq("alerta_tipo_id", alumnoalerta.alertas_tipo_alerta_tipo_id)
        .single();
      if (errorAlertaTipo || !dataAlertaTipo) {
        throw new Error("La  severidad no existe");
      }
      if (validationError) {
        responseSent = true;
        throw new Error(validationError.details[0].message);
      }
      if (!responseSent) {
        await dataService.updateById(id, alumnoalerta);
        res
          .status(200)
          .json({ message: "AlumnoAlerta actualizado correctamente" });
      }
    } catch (error) {
      console.error("Error al actualizar el alumnoalerta:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  },
  async eliminar(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      await dataService.deleteById(id);
      res.status(200).json({ message: "AlumnoAlerta eliminado correctamente" });
    } catch (error) {
      console.error("Error al eliminar el alumnoalerta:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  },
};
