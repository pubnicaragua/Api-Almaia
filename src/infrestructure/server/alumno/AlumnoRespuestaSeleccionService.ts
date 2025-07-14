/* eslint-disable no-fallthrough */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Request, Response } from "express";
import { DataService } from "../DataService";
import Joi from "joi";
import { SupabaseClientService } from "../../../core/services/supabaseClient";
import { SupabaseClient } from "@supabase/supabase-js";
import { obtenerRelacionados } from "../../../core/services/ObtenerTablasColegioCasoUso";
import { AlumnoRespuestaSeleccion } from "../../../core/modelo/preguntasRespuestas/AlumnoRespuestaSeleccion";
import moment from "moment";
import { distinctPorCampo } from "../../../helpers/objectformat";

const dataService: DataService<AlumnoRespuestaSeleccion> = new DataService(
  "alumnos_respuestas_seleccion",
  "alumno_respuesta_seleccion_id"
);
const AlumnoRespuestaSeleccionSchema = Joi.object({
  alumno_id: Joi.number().integer().required(),
  pregunta_id: Joi.number().integer().required(),
  respuesta_posiblle_id: Joi.number().integer().required(),
});
const RespuestaSchema = Joi.object({
  tipo_pregunta_id: Joi.number().integer().required(),
  id_registro: Joi.number().integer().required(),
  respuestas_posibles: Joi.array().items(Joi.object<{ respuesta_posible_id: number }>()).min(1).optional(),
  respuesta_posible_id: Joi.number().integer().optional(),
});

const supabaseService = new SupabaseClientService();
const client: SupabaseClient = supabaseService.getClient();
export const AlumnoRespuestaSeleccionService = {
  async obtener(req: Request, res: Response) {
    try {
      const { colegio_id, tipo_pregunta_id = 1, ...where } = req.query;

      // const finalWhere = {
      //   ...where,
      //   activo: true,
      //   respondio: false,
      //   'fecha_creacion::date': moment().format('YYYY-MM-DD'),
      // };

      // let respuestaEnviada = false;

      // if (colegio_id !== undefined) {
      //   const alumnos_cursos = await obtenerRelacionados({
      //     tableFilter: "alumnos",
      //     filterField: "colegio_id",
      //     filterValue: colegio_id,
      //     idField: "alumno_id",
      //     tableIn: "alumnos_respuestas_seleccion",
      //     inField: "alumno_id",
      //     selectFields: `*,
      //                     alumnos(alumno_id,url_foto_perfil,telefono_contacto1,telefono_contacto2,email)
      //                     preguntas(pregunta_id,texto_pregunta,grupo_preguntas,tipo_pregunta_id,nivel_educativo_id,template_code,respuestas_posibles(respuesta_posible_id,nombre,icono)),
      //                     respuestas_posibles(respuesta_posible_id,nombre)`,
      //   });
      //   respuestaEnviada = true;
      //   res.json(alumnos_cursos);
      // }
      // if (!respuestaEnviada) {
      //   const alumnoRespuestaSeleccion = await dataService.getAll(
      //     [
      //       "*",
      //       "alumnos(alumno_id,url_foto_perfil,telefono_contacto1,telefono_contacto2,email)",
      //       "preguntas(pregunta_id,texto_pregunta,grupo_preguntas,tipo_pregunta_id,nivel_educativo_id,template_code,respuestas_posibles(respuesta_posible_id,nombre,icono))",
      //       "respuestas_posibles(respuesta_posible_id,nombre)",
      //     ],
      //     finalWhere
      //   );

      //   res.json(alumnoRespuestaSeleccion);
      // }

      if (Number(tipo_pregunta_id) !== 3) {
        let query = client
        .from('alumnos_respuestas_seleccion')
        .select(
          [
            "*",
            "alumnos(alumno_id,url_foto_perfil,telefono_contacto1,telefono_contacto2,email)",
            "preguntas(pregunta_id,texto_pregunta,horario,grupo_preguntas,tipo_pregunta_id,nivel_educativo_id,template_code,respuestas_posibles(respuesta_posible_id,nombre,icono))",
            "respuestas_posibles(respuesta_posible_id,nombre)",
          ].join(',')
        )
        .eq('activo', true)
        .eq('respondio', false)
        .gte('fecha_creacion::date', moment().format('YYYY-MM-DD'))
        .order('fecha_creacion', { ascending: true });

      Object.keys(where).forEach((key) => {
        query = query.eq(key, where[key]);
      });  

      const { data, error } = await query.returns<any[]>();

      if (error) {
        // console.error("Error al obtener las respuestas de los alumnos:", error);
        throw error;
      }

      res.status(200).json(data);
      } else {
        res.status(400).json({ message: "Tipo de pregunta no soportado para esta operación." });
      }
      
    } catch (error) {
      console.error("Error al obtener el curso del alumno:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  },
  guardar: async (req: Request, res: Response) => {
    try {
      const alumnoRespuestaSeleccion: AlumnoRespuestaSeleccion =
        new AlumnoRespuestaSeleccion();
      Object.assign(alumnoRespuestaSeleccion, req.body);
      alumnoRespuestaSeleccion.creado_por = req.creado_por;
      alumnoRespuestaSeleccion.actualizado_por = req.actualizado_por;
      alumnoRespuestaSeleccion.activo = true;
      let responseSent = false;
      const { error: validationError } =
        AlumnoRespuestaSeleccionSchema.validate(req.body);
      const { data, error } = await client
        .from("alumnos")
        .select("*")
        .eq("alumno_id", alumnoRespuestaSeleccion.alumno_id)
        .single();
      if (error || !data) {
        throw new Error("El alumno no existe");
      }
      const { data: dataCurso, error: errorCurso } = await client
        .from("preguntas")
        .select("*")
        .eq("pregunta_id", alumnoRespuestaSeleccion.pregunta_id)
        .single();
      if (errorCurso || !dataCurso) {
        throw new Error("La pregunta no existe");
      }
      const { data: dataRespuestaPosible, error: errorRespuestaPosible } =
        await client
          .from("respuestas_posibles")
          .select("*")
          .eq(
            "respuesta_posible_id",
            alumnoRespuestaSeleccion.respuesta_posible_id
          )
          .single();
      if (errorRespuestaPosible || !dataRespuestaPosible) {
        throw new Error("La respuesta no existe");
      }
      if (validationError) {
        responseSent = true;
        throw new Error(validationError.details[0].message);
      }
      if (!responseSent) {
        const savedAlumnoRespuestaSeleccion = await dataService.processData(
          alumnoRespuestaSeleccion
        );
        res.status(201).json(savedAlumnoRespuestaSeleccion);
      }
    } catch (error) {
      console.error("Error al guardar el curso del alumno:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  },
  async actualizar(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const alumnoRespuestaSeleccion: AlumnoRespuestaSeleccion =
        new AlumnoRespuestaSeleccion();
      Object.assign(alumnoRespuestaSeleccion, req.body);
      alumnoRespuestaSeleccion.creado_por = req.creado_por;
      alumnoRespuestaSeleccion.actualizado_por = req.actualizado_por;
      let responseSent = false;
      const { error: validationError } =
        AlumnoRespuestaSeleccionSchema.validate(req.body);
      const { data, error } = await client
        .from("alumnos")
        .select("*")
        .eq("alumno_id", alumnoRespuestaSeleccion.alumno_id)
        .single();
      if (error || !data) {
        throw new Error("El alumno no existe");
      }
      const { data: dataCurso, error: errorCurso } = await client
        .from("preguntas")
        .select("*")
        .eq("pregunta_id", alumnoRespuestaSeleccion.pregunta_id)
        .single();
      if (errorCurso || !dataCurso) {
        throw new Error("La pregunta no existe");
      }
      const { data: dataRespuestaPosible, error: errorRespuestaPosible } =
        await client
          .from("respuestas_posibles")
          .select("*")
          .eq(
            "respuesta_posible_id",
            alumnoRespuestaSeleccion.respuesta_posible_id
          )
          .single();
      if (errorRespuestaPosible || !dataRespuestaPosible) {
        throw new Error("La respuesta no existe");
      }
      if (validationError) {
        responseSent = true;
        throw new Error(validationError.details[0].message);
      }
      if (!responseSent) {
        const alumnoRespuestaSeleccion: AlumnoRespuestaSeleccion = req.body;
        await dataService.updateById(id, alumnoRespuestaSeleccion);
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
  async responder(req: Request, res: Response) {
    const { alumno_id, pregunta_id, respuesta_posible_id, alumno_respuesta_seleccion_id } = req.body;
  
    if (!alumno_id || !pregunta_id || !respuesta_posible_id) {
      throw new Error("Faltan datos obligatorios.");
    }
  
    const respuesta = new AlumnoRespuestaSeleccion();
    // respuesta.alumno_respuesta_seleccion_id = alumno_respuesta_seleccion_id;
    respuesta.alumno_id = alumno_id;
    respuesta.pregunta_id = pregunta_id;
    respuesta.respuesta_posible_id = respuesta_posible_id;
    respuesta.respondio = true;
  
    const { error } = await client
      .from("alumnos_respuestas_seleccion")
      .update({
        respuesta_posible_id: respuesta.respuesta_posible_id,
        respondio: true,
        actualizado_por: req.actualizado_por,
        fecha_actualizacion: new Date(),  
        activo: true  
      })
      .match({
        alumno_id: respuesta.alumno_id,
        pregunta_id: respuesta.pregunta_id,
      });
  
    if (error) {
      throw new Error(error.message);
    }
  
    res.json({ message: "Respuesta actualizada correctamente." });
  },
  async responderMultiple(req: Request, res: Response) {  
    try {  
      const { alumno_id, pregunta_id, respuestas_posibles } = req.body;  
        
      // Validación de datos de entrada  
      if (  
        !alumno_id ||  
        !pregunta_id ||  
        !Array.isArray(respuestas_posibles) ||  
        respuestas_posibles.length === 0  
      ) {  
            throw new Error("Datos inválidos o incompletos.");
      }  
    
      // Buscar respuestas previas  
      const { data: existentes, error: fetchError } = await client  
        .from("alumnos_respuestas_seleccion")  
        .select("*")  
        .eq("alumno_id", alumno_id)  
        .eq("pregunta_id", pregunta_id);  
    
      if (fetchError) throw fetchError;  
    
      // Si existen respuestas previas, eliminarlas primero para evitar duplicados  
      if (existentes && existentes.length > 0) {  
        const { error: deleteError } = await client  
          .from("alumnos_respuestas_seleccion")  
          .delete()  
          .eq("alumno_id", alumno_id)  
          .eq("pregunta_id", pregunta_id);  
    
        if (deleteError) throw deleteError;  
      }  
    
      // Insertar todas las nuevas respuestas  
      const nuevasRespuestas = respuestas_posibles.map(respuesta_id => ({  
        alumno_id,  
        pregunta_id,  
        respuesta_posible_id: respuesta_id,  
        respondio: true,  
        fecha_creacion: new Date(),  
        fecha_actualizacion: new Date(),  
        activo: true,  
        creado_por: req.creado_por, 
        actualizado_por: req.actualizado_por 
      }));  
    
      const { error: insertError } = await client  
        .from("alumnos_respuestas_seleccion")  
        .insert(nuevasRespuestas);  
    
      if (insertError) throw insertError;  
    
      res.status(200).json({ message: "Respuestas procesadas correctamente." });  
        
    } catch (error) {  
      console.error("Error al procesar respuestas múltiples:", error);  
      res.status(500).json({   
        message: error instanceof Error ? error.message : "Error interno del servidor"   
      });  
    }  
  },

  async omniresponder(req: Request, res: Response) {
    try {
      const {
        respuesta_posible_id,
        tipo_pregunta_id,
        respuestas_posibles,
        id_registro
      } = req.body;

      const { error: validationError } = RespuestaSchema.validate({
        respuesta_posible_id,
        tipo_pregunta_id,
        respuestas_posibles,
        id_registro
      }, { abortEarly: false });

      if (Array.isArray(validationError?.details) && validationError?.details.length > 0)
        res.status(400).json({
          status: "error",
          details: validationError.details.map(detail => detail.message)
        });

      if (tipo_pregunta_id !== 3) {

        const { data: rowOriginal, error: errorSelect } = await client.from("alumnos_respuestas_seleccion")
          .select("*").match({ alumno_respuesta_seleccion_id: id_registro }).single();

        if (errorSelect) {
          throw new Error(errorSelect.message);
        }

        if (!rowOriginal) {
          res.status(404).json({ message: "Registro no encontrado." });
          return;
        }

        if (rowOriginal.respondio) {
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
                .from("alumnos_respuestas_seleccion")
                .update({
                  respuesta_posible_id: respuesta_posible_id,
                  respondio: true,
                  actualizado_por: req.actualizado_por,
                  fecha_actualizacion: new Date(),
                  activo: true
                })
                .match({ alumno_respuesta_seleccion_id: id_registro });

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
                      .from("alumnos_respuestas_seleccion")
                      .update({
                        respuesta_posible_id: respuesta.respuesta_posible_id,
                        respondio: true,
                        actualizado_por: req.actualizado_por,
                        fecha_actualizacion: new Date(),
                        activo: true
                      })
                      .match({ alumno_respuesta_seleccion_id: id_registro });

                    if (error) {
                      throw new Error(error.message);
                    }
                  } else {

                    const { error } = await client
                      .from("alumnos_respuestas_seleccion")
                      .insert({
                        alumno_id: rowOriginal.alumno_id,
                        pregunta_id: rowOriginal.pregunta_id,
                        respuesta_posible_id: respuesta.respuesta_posible_id,
                        respondio: true,
                        creado_por: req.creado_por,
                        actualizado_por: req.actualizado_por,
                        fecha_creacion: rowOriginal.fecha_creacion,
                        fecha_actualizacion: new Date(),
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
        // throw new Error("Tipo de pregunta no soportado para esta operación.");
        res.status(400).json({ message: "Tipo de pregunta no soportado para esta operación." });
        return;
      }
    } catch (error) {
      console.log('======================================');
      console.error(error);
      res.status(500).json({ message: 'Error Interno del Servidor' });
    }
  },


async cambiarEstadoRespuesta(req: Request, res: Response) {    
  try {    
    const { alumno_id, pregunta_id, nuevo_estado, fecha } = req.body;    
    console.log('cambiar estado');  
    
    if (!alumno_id || !pregunta_id || typeof nuevo_estado !== 'boolean') {    
      throw new Error("Faltan datos obligatorios o el estado no es válido.");    
    }    
  
    // Usar la fecha proporcionada o la fecha actual como fallback  
    const fechaActualizacion = fecha ? new Date(fecha) : new Date();  
    
    const { error } = await client    
      .from("alumnos_respuestas_seleccion")    
      .update({    
        respondio: nuevo_estado,    
        fecha_actualizacion: fechaActualizacion,    
        activo: true    
      })    
      .match({    
        alumno_id: alumno_id,    
        pregunta_id: pregunta_id,    
      });    
    
    if (error) {    
      throw new Error(error.message);    
    }    
    
    res.json({     
      message: `Estado de respuesta cambiado a ${nuevo_estado ? 'respondido' : 'no respondido'} correctamente.`     
    });    
    
  } catch (error) {    
    console.error("Error al cambiar estado de respuesta:", error);    
    res.status(500).json({     
      message: error instanceof Error ? error.message : "Error interno del servidor"     
    });    
  }    
},

async cambiarEstadoRespuestaMultiple(req: Request, res: Response) {    
  try {    
    const { alumno_id, pregunta_id, nuevo_estado, fecha } = req.body;    
    
    if (!alumno_id || !pregunta_id || typeof nuevo_estado !== 'boolean') {    
      throw new Error("Faltan datos obligatorios o el estado no es válido.");    
    }    
  
    // Usar la fecha proporcionada o la fecha actual como fallback  
    const fechaActualizacion = fecha ? new Date(fecha) : new Date();  
    
    // Actualizar todas las respuestas de la pregunta para el alumno    
    const { error } = await client    
      .from("alumnos_respuestas_seleccion")    
      .update({    
        respondio: nuevo_estado,    
        fecha_actualizacion: fechaActualizacion,    
        activo: true    
      })    
      .eq("alumno_id", alumno_id)    
      .eq("pregunta_id", pregunta_id);    
    
    if (error) {    
      throw new Error(error.message);    
    }    
    
    res.status(200).json({     
      message: `Estado de todas las respuestas cambiado a ${nuevo_estado ? 'respondido' : 'no respondido'} correctamente.`     
    });    
    
  } catch (error) {    
    console.error("Error al cambiar estado de respuestas múltiples:", error);    
    res.status(500).json({     
      message: error instanceof Error ? error.message : "Error interno del servidor"     
    });    
  }    
}

};
