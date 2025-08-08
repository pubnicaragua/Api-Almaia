/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import { DataService } from "../DataService";
import { AlumnoAlerta } from "../../../core/modelo/alumno/AlumnoAlerta";
import Joi from "joi";
import { SupabaseClientService } from "../../../core/services/supabaseClient";
import { type PostgrestError, SupabaseClient } from "@supabase/supabase-js";
import {
  contarAlertasPendientesPorColegio,
  mapearAlertaDetalle,
  mapearAlertaDetalleV2,
  mapearAlertas,
} from "../../../core/services/AlertasServiceCasoUso";
import { obtenerRelacionados } from "../../../core/services/ObtenerTablasColegioCasoUso";
import { EmailService } from "../../../core/services/EmailService";
const emailService = new EmailService();

const AlumnoAlertaSchema = Joi.object({
  alumno_id: Joi.number().integer().allow(null).optional(),
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
  anonimo: Joi.boolean().optional(),
  responsable_actual_id: Joi.number().integer().optional(),
  alertas_tipo_alerta_tipo_id: Joi.number().integer().required(),
});
const AlumnoAlertaUpdateSchema = Joi.object({
  alumno_id: Joi.number().integer().optional(),
  alerta_regla_id: Joi.number().integer().optional(),
  mensaje: Joi.string().max(100).optional(),
  fecha_resolucion: Joi.string().optional(),
  prioridad_id: Joi.number().integer().required(),
  severidad_id: Joi.number().integer().required(),
  responsable_actual_id: Joi.number().integer().required(),
  accion_tomada: Joi.string().max(200).optional(),
  leida: Joi.boolean().default(true).required(),
  estado: Joi.string().max(20).required(),
  // alertas_tipo_alerta_tipo_id: Joi.number().integer().optional(),
  anonimo: Joi.boolean().optional(),
});
const supabaseService = new SupabaseClientService();
const client: SupabaseClient = supabaseService.getClient();
const dataService: DataService<Partial<AlumnoAlerta>> = new DataService(
  "alumnos_alertas",
  "alumno_alerta_id"
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
            alumnos(alumno_id,url_foto_perfil,personas(persona_id,nombres,apellidos)),
            alertas_reglas(alerta_regla_id,nombre),
            alertas_origenes(alerta_origen_id,nombre),
            alertas_severidades(alerta_severidad_id,nombre),
            alertas_prioridades(alerta_prioridad_id,nombre),
            alertas_tipos(alerta_tipo_id,nombre),
            personas(persona_id,nombres,apellidos) `,
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
      const alumnoalertaAlerta = mapearAlertaDetalleV2(alumnoalertaAlerta_data);
      res.json(alumnoalertaAlerta[0]);
    } catch (error) {
      console.error("Error al obtener la alerta del alumnoalerta:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  },
  guardar: async (req: Request, res: Response) => {
    try {
      let destinatarios = ["app@almaia.cl"]; // fallback por defecto

      const alumnoalerta: AlumnoAlerta = new AlumnoAlerta();
      const { anonimo = false, alumno_id, ...bodyWithoutAnonimo } = req.body; // Establece false por defecto si es undefined

      Object.assign(alumnoalerta, bodyWithoutAnonimo);

      alumnoalerta.creado_por = req.creado_por;
      alumnoalerta.actualizado_por = req.actualizado_por;

      let responseSent = false;
      const { error: validationError } = AlumnoAlertaSchema.validate(req.body);

      // Verificación de alumno solo si no es anónimo (anonimo es explícitamente true)

      const { data, error } = await client
        .from("alumnos")
        .select("*")
        .eq("alumno_id", alumno_id)
        .single();
      if (error || !data) {
        throw new Error("El alumno no existe");
      }

      // Obtener información del colegio
      let emailCorreo = "";
      switch (bodyWithoutAnonimo.alertas_tipo_alerta_tipo_id) {
        case 1: // SOS ALMA
          emailCorreo = "correo_sos";
          break;

        case 2: // Denuncia
          emailCorreo = "correo_denuncia";
          break;

        default:
          emailCorreo = "correo_electronico";
          break;
      }

      const { data: dataColegio, error: errorColegio } = await client
        .from("colegios")
        .select(emailCorreo)
        .eq("colegio_id", data.colegio_id)
        .single() as { data: any; error: PostgrestError | null };

      if (!errorColegio && dataColegio[emailCorreo]) {
        // Procesar correos: dividir por comas, limpiar espacios y filtrar vacíos
        destinatarios = dataColegio[emailCorreo]
          .split(",")
          .map((email: string) => email.trim())
          .filter((email: string) => email.length > 0);
      }


      // Resto del código permanece igual
      if (alumnoalerta.alerta_regla_id !== undefined) {
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
        throw new Error("La prioridad no existe");
      }

      const { data: dataAlertaSeveridad, error: errorAlertaSeveridad } =
        await client
          .from("alertas_severidades")
          .select("*")
          .eq("alerta_severidad_id", alumnoalerta.severidad_id)
          .single();
      if (errorAlertaSeveridad || !dataAlertaSeveridad) {
        throw new Error("La severidad no existe");
      }

      const { data: dataAlertaTipo, error: errorAlertaTipo } = await client
        .from("alertas_tipos")
        .select("*")
        .eq("alerta_tipo_id", alumnoalerta.alertas_tipo_alerta_tipo_id)
        .single();
      if (errorAlertaTipo || !dataAlertaTipo) {
        throw new Error("El tipo de alerta no existe");
      }

      if (validationError) {
        responseSent = true;
        throw new Error(validationError.details[0].message);
      }

      if (!responseSent) {
        const savedAlumnoAlerta = await dataService.processData({ ...alumnoalerta, anonimo, alumno_id });
        const email = await emailService.enviarNotificacionAlerta(
          {
            tipo: dataAlertaTipo.nombre,
            codigo: savedAlumnoAlerta.alumno_alerta_id,
            enlace: "https://almacolegios.vercel.app/",
          },
          destinatarios
        );

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
      const { cambiar_lectura } = req.query;
      if (cambiar_lectura !== undefined) {
        const { error } = await client
          .from("alumnos_alertas")
          .update({ leida: req.body.leida })
          .eq("alumno_alerta_id", id);
        if (error) {
          throw new Error(`Error al actualizar lectura: ${error.message}`);
        } else {
          res.status(200).json({ message: "Se actualizo estado de lectura" });
        }
      } else {
        const alumnoalerta: AlumnoAlerta = new AlumnoAlerta();
        const info = {
          alumno_id: req.body.alumno_id,
          alerta_regla_id: req.body.alerta_regla_id,
          mensaje: req.body.mensaje,
          fecha_resolucion: req.body.fecha_resolucion,
          prioridad_id: req.body.prioridad_id,
          responsable_actual_id: req.body.responsable_actual_id,
          // prioridad_id: req.body.alertas_prioridades.alerta_prioridad_id,
          severidad_id: req.body.severidad_id,
          // severidad_id: req.body.alertas_severidades.alerta_severidad_id,
          accion_tomada: req.body.accion_tomada,
          leida: req.body.leida,
          estado: req.body.estado,
          // alertas_tipo_alerta_tipo_id: req.body.alertas_tipos?.alerta_tipo_id,
        };

        Object.assign(alumnoalerta, info);
        alumnoalerta.actualizado_por = req.actualizado_por;
        let responseSent = false;
        const { error: validationError } = AlumnoAlertaUpdateSchema.validate(
          info
        );

        if (alumnoalerta.alumno_id !== undefined && !!alumnoalerta.alumno_id) {
          // Verificación de alumno solo si no es anónimo (anonimo es explícitamente true
          const { data, error } = await client
            .from("alumnos")
            .select("*")
            .eq("alumno_id", alumnoalerta.alumno_id)
            .single();
          if (error || !data) {
            throw new Error("El colegio no existe");
          }
        }

        if (alumnoalerta.alerta_regla_id) {
          const { data: dataAlertaRegla, error: errorAlertaRegla } = await client
            .from("alertas_reglas")
            .select("*")
            .eq("alerta_regla_id", alumnoalerta.alerta_regla_id)
            .single();
          if (errorAlertaRegla || !dataAlertaRegla) {
            throw new Error("El colegio no existe");
          }
        }

        if (alumnoalerta.alerta_origen_id) {
          const { data: dataAlertaOrigen, error: errorAlertaOrigen } =
            await client
              .from("alertas_origenes")
              .select("*")
              .eq("alerta_origen_id", alumnoalerta.alerta_origen_id)
              .single();
          if (errorAlertaOrigen || !dataAlertaOrigen) {
            throw new Error("El origen no existe");
          }
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

        if (alumnoalerta.alertas_tipo_alerta_tipo_id) {
          const { data: dataAlertaTipo, error: errorAlertaTipo } = await client
            .from("alertas_tipos")
            .select("*")
            .eq("alerta_tipo_id", alumnoalerta.alertas_tipo_alerta_tipo_id)
            .single();
          if (errorAlertaTipo || !dataAlertaTipo) {
            throw new Error("Alerta tipo no existe");
          }
        }

        if (validationError) {
          responseSent = true;
          throw new Error(validationError.details[0].message);
        }
        const { data: dataAlumnoAlerta, error: errorAlumnoAlerta } =
          await client
            .from("alumnos_alertas")
            .select("*")
            .eq("alumno_alerta_id", id)
            .single();
        if (errorAlumnoAlerta || !dataAlumnoAlerta) {
          throw new Error("La  severidad no existe");
        }
        alumnoalerta.alerta_origen_id = dataAlumnoAlerta.alerta_origen_id;
        alumnoalerta.fecha_generada = dataAlumnoAlerta.fecha_generada;

        const { alertas_tipo_alerta_tipo_id, ...rest } = alumnoalerta;

        if (!responseSent) {
          await dataService.updateById(id, rest);


          res
            .status(200)
            .json({ message: "Alumno Alerta actualizado correctamente" });
        }
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
  async contarAlertasPendientes(req: Request, res: Response) {
    try {
      const { colegio_id } = req.query;

      if (colegio_id) {
        const colegioIdNumber = Number(colegio_id);
        if (isNaN(colegioIdNumber)) {
          throw new Error("colegio_id debe ser un número");
        }

        const count = await contarAlertasPendientesPorColegio(
          client,
          colegioIdNumber
        );
        res.json({ count });
      } else {
        // Sin filtro de colegio, contar todas las alertas pendientes
        /*const { count, error } = await client
          .from("alumnos_alertas")
          .select("*", { count: "exact", head: true })
          .eq("estado", "pendiente");

        if (error) throw error;*/

        res.json({ count: 0 });
      }
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ error: "Error al contar alertas" });
    }
  },
};
