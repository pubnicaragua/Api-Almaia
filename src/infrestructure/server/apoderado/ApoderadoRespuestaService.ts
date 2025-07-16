/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";

import { DataService } from "../DataService";
import { SupabaseClientService } from "../../../core/services/supabaseClient";
import { SupabaseClient } from "@supabase/supabase-js";
import Joi from "joi";
import { ApoderadoRespuesta } from "../../../core/modelo/apoderado/ApoderadoRespuesta";
import moment from "moment";
import { distinctPorCampo } from "../../../helpers/objectformat";

const supabaseService = new SupabaseClientService();
const client: SupabaseClient = supabaseService.getClient();
const dataService: DataService<ApoderadoRespuesta> = new DataService(
  "apoderados_respuestas",
  "apoderado_respuesta_id"
);
const ApoderadoRespuestaSchema = Joi.object({
  pregunta_id: Joi.number().integer().required(),
  respuesta_posible_id: Joi.number().integer().optional(),
  apoderado_id: Joi.number().integer().required(),
  alumno_id: Joi.number().integer().required(),
  texto_respuesta: Joi.string().max(50).optional(),
  estado_respuesta: Joi.string().max(20).required(),
});
const RespuestaSchema = Joi.object({
  tipo_pregunta_id: Joi.number().integer().required(),
  id_registro: Joi.number().integer().required(),
  respuestas_posibles: Joi.array().items(Joi.object<{ respuesta_posible_id: number }>()).min(1).optional(),
  respuesta_posible_id: Joi.number().integer().optional(),
  respuesta_posible_txt: Joi.string().min(1).optional(),
});
export const ApoderadoRespuestaService = {
  async obtener(req: Request, res: Response) {
    try {
      const {
        respondio = false,
        fecha = moment().format('YYYY-MM-DD'),
        ...where } = req.query; // Convertir los parámetros de consulta en filtros


      let query = client
        .from('apoderados_respuestas')
        .select(
          [
            "*",
            "alumnos(alumno_id,url_foto_perfil,personas(persona_id,nombres,apellidos),colegios(colegio_id,nombre,nombre_fantasia,tipo_colegio))",
            "preguntas(pregunta_id,texto_pregunta,horario,grupo_preguntas,tipo_pregunta_id,template_code,respuestas_posibles(respuesta_posible_id,nombre))",
            "apoderados(apoderado_id,personas(persona_id,nombres,apellidos),telefono_contacto1,telefono_contacto2,email_contacto1,email_contacto2)",
            "respuestas_posibles(respuesta_posible_id,nombre)",
          ].join(',')
        )
        .eq('activo', true)
        .gte('fecha_creacion::date', fecha)
        .order('fecha_creacion', { ascending: true });

      Object.keys(where).forEach((key) => {
        query = query.eq(key, where[key]);
      });

      if (respondio) {
        query = query.not('respuesta_posible_id', 'is', null);
      } else if (!respondio) {
        query = query.is('respuesta_posible_id', null);
      }

      const { data, error } = await query.returns<any[]>();

      if (error) {
        throw error;
      }

      res.status(200).json(data);

      // const apoderadorespuestas = await dataService.getAll(
      //   [
      //     "*",
      //     "alumnos(alumno_id,url_foto_perfil,personas(persona_id,nombres,apellidos))",
      //     "preguntas(pregunta_id,texto_pregunta,respuestas_posibles(respuesta_posible_id,nombre))",
      //     "apoderados(apoderado_id,personas(persona_id,nombres,apellidos),telefono_contacto1,telefono_contacto2,email_contacto1,email_contacto2)",
      //     "respuestas_posibles(respuesta_posible_id,nombre)",
      //   ],
      //   where
      // );
      // res.json(apoderadorespuestas);
    } catch (error) {
      console.error("Error al obtener la apoderadorespuesta:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  },
  guardar: async (req: Request, res: Response) => {
    try {
      const apoderadorespuesta: ApoderadoRespuesta = new ApoderadoRespuesta();
      Object.assign(apoderadorespuesta, req.body);
      apoderadorespuesta.creado_por = req.creado_por;
      apoderadorespuesta.actualizado_por = req.actualizado_por;
      let responseSent = false;
      const { error: validationError } = ApoderadoRespuestaSchema.validate(
        req.body
      );
      const { data, error } = await client
        .from("apoderados")
        .select("*")
        .eq("apoderado_id", apoderadorespuesta.apoderado_id)
        .single();
      if (error || !data) {
        throw new Error("La persona no existe");
      }
      const { data: dataAlumno, error: errorAlumno } = await client
        .from("alumnos")
        .select("*")
        .eq("alumno_id", apoderadorespuesta.alumno_id)
        .single();
      if (errorAlumno || !dataAlumno) {
        throw new Error("El Alumno no existe");
      }
      const { data: dataPregunta, error: errorPregunta } = await client
        .from("preguntas")
        .select("*")
        .eq("pregunta_id", apoderadorespuesta.alumno_id)
        .single();
      if (errorPregunta || !dataPregunta) {
        throw new Error("El Alumno no existe");
      }

      if (validationError) {
        responseSent = true;
        throw new Error(validationError.details[0].message);
      }
      if (!responseSent) {
        const savedApoderadoRespuesta = await dataService.processData(
          apoderadorespuesta
        );
        res.status(201).json(savedApoderadoRespuesta);
      }
    } catch (err) {
      const error = err as Error;
      console.error("Error al guardar el apoderadorespuesta:", error);
      res.status(500).json({ message: error.message || "Error inesperado" });
    }
  },
  actualizar: async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const apoderadorespuesta: ApoderadoRespuesta = new ApoderadoRespuesta();
      Object.assign(apoderadorespuesta, req.body);
      apoderadorespuesta.actualizado_por = req.actualizado_por;
      let responseSent = false;
      const { error: validationError } = ApoderadoRespuestaSchema.validate(
        req.body
      );
      const { data, error } = await client
        .from("apoderados")
        .select("*")
        .eq("apoderado_id", apoderadorespuesta.apoderado_id)
        .single();
      if (error || !data) {
        throw new Error("La persona no existe");
      }
      const { data: dataAlumno, error: errorAlumno } = await client
        .from("alumnos")
        .select("*")
        .eq("alumno_id", apoderadorespuesta.alumno_id)
        .single();
      if (errorAlumno || !dataAlumno) {
        throw new Error("El Alumno no existe");
      }
      const { data: dataPregunta, error: errorPregunta } = await client
        .from("preguntas")
        .select("*")
        .eq("pregunta_id", apoderadorespuesta.alumno_id)
        .single();
      if (errorPregunta || !dataPregunta) {
        throw new Error("El Alumno no existe");
      }
      if (validationError) {
        responseSent = true;
        throw new Error(validationError.details[0].message);
      }
      if (!responseSent) {
        await dataService.updateById(id, apoderadorespuesta);
        res
          .status(200)
          .json({ message: "ApoderadoRespuesta actualizado correctamente" });
      }
    } catch (error) {
      console.error("Error al actualizar la apoderadorespuesta:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  },
  async eliminar(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      await dataService.deleteById(id);
      res
        .status(200)
        .json({ message: "ApoderadoRespuesta eliminada correctamente" });
    } catch (error) {
      console.error("Error al eliminar la apoderadorespuesta:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  },
  async responderpregunta(req: Request, res: Response) {
    try {
      const {
        respuesta_posible_id,
        tipo_pregunta_id,
        respuestas_posibles,
        respuesta_posible_txt,
        id_registro
      } = req.body;

      const { error: validationError } = RespuestaSchema.validate({
        respuesta_posible_id,
        tipo_pregunta_id,
        respuestas_posibles,
        respuesta_posible_txt,
        id_registro
      }, { abortEarly: false });

      if (Array.isArray(validationError?.details) && validationError?.details.length > 0)
        res.status(400).json({
          status: "error",
          details: validationError.details.map(detail => detail.message)
        });

      if (tipo_pregunta_id !== 3) {

        const { data: rowOriginal, error: errorSelect } = await client.from("apoderados_respuestas")
          .select("*").match({ apoderado_respuesta_id: id_registro }).single();

        if (errorSelect) {
          throw new Error(errorSelect.message);
        }

        if (!rowOriginal) {
          res.status(404).json({ message: "Registro no encontrado." });
          return;
        }

        if (rowOriginal.respuesta_posible_id) {
          res.status(400).json({ message: "La respuesta ya ha sido respondida." });
          return;
        }


        switch (tipo_pregunta_id) {
          case 1: // Selección única  
            {
              if (!respuesta_posible_id) {
                res.status(400).json({ message: "Falta el ID de la respuesta posible." });
                return;
              }

              if (!id_registro) {
                res.status(400).json({ message: "Falta el ID del registro." });
                return;
              }

              const { error } = await client
                .from("apoderados_respuestas")
                .update({
                  respuesta_posible_id: respuesta_posible_id,
                  actualizado_por: req.actualizado_por,
                  fecha_actualizacion: req.fecha_creacion || new Date(),
                  activo: true
                })
                .match({ apoderado_respuesta_id: id_registro });

              if (error) {
                throw new Error(error.message);
              }

              res.status(201).json({ message: "Respuesta actualizada correctamente." });
              break;
            }
          case 2: // Selección múltiple
            {
              if (!Array.isArray(respuestas_posibles))
                res.status(400).json({ message: "Faltan respuestas posibles." });

              if (!respuestas_posibles || respuestas_posibles.length === 0) {
                res.status(400).json({ message: "Faltan respuestas posibles." });
                return;
              }

              if (!id_registro) {
                res.status(400).json({ message: "Falta el ID del registro." });
                return;
              }

              let iterador = 0;
              const filterdata = distinctPorCampo(respuestas_posibles, 'respuesta_posible_id');
              filterdata.forEach(async (respuesta: any) => {
                if (respuesta.respuesta_posible_id) {
                  iterador++;
                  if (iterador === 1) {
                    const { error } = await client
                      .from("apoderados_respuestas")
                      .update({
                        respuesta_posible_id: respuesta.respuesta_posible_id,
                        actualizado_por: req.actualizado_por,
                        fecha_actualizacion: req.fecha_creacion || new Date(),
                        activo: true
                      })
                      .match({ apoderado_respuesta_id: id_registro });

                    if (error) {
                      throw new Error(error.message);
                    }
                  } else {

                    const { error } = await client
                      .from("apoderados_respuestas")
                      .insert({
                        alumno_id: rowOriginal.alumno_id,
                        apoderado_id: rowOriginal.apoderado_id,
                        pregunta_id: rowOriginal.pregunta_id,
                        respuesta_posible_id: respuesta.respuesta_posible_id,
                        creado_por: req.creado_por,
                        actualizado_por: req.actualizado_por,
                        fecha_creacion: rowOriginal.fecha_creacion,
                        fecha_actualizacion: req.fecha_creacion || new Date(),
                        activo: true
                      });

                    if (error) {
                      throw new Error(error.message);
                    }
                  }
                }
              });

              res.status(201).json({ message: "Respuestas actualizadas correctamente." });
              break;
            }
          default:
            res.status(400).json({ message: "Tipo de pregunta no soportado para esta operación." });
        }
      } else {
        res.status(400).json({ message: "Tipo de pregunta no soportado para esta operación." });
      }
    } catch (error) {
      console.error("Error al eliminar la apoderadorespuesta:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  }
};
