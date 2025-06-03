import { Request, Response } from "express";
import { DataService } from "../DataService";
import Joi from "joi";
import { SupabaseClientService } from "../../../core/services/supabaseClient";
import { SupabaseClient } from "@supabase/supabase-js";
import { obtenerRelacionados } from "../../../core/services/ObtenerTablasColegioCasoUso";
import { AlumnoRespuestaSeleccion } from "../../../core/modelo/preguntasRespuestas/AlumnoRespuestaSeleccion";

const dataService: DataService<AlumnoRespuestaSeleccion> = new DataService(
  "alumnos_respuestas_seleccion",
  "alumno_respuesta_seleccion_id"
);
const AlumnoRespuestaSeleccionSchema = Joi.object({
  alumno_id: Joi.number().integer().required(),
  pregunta_id: Joi.number().integer().required(),
  respuesta_posiblle_id: Joi.number().integer().required(),
});
const supabaseService = new SupabaseClientService();
const client: SupabaseClient = supabaseService.getClient();
export const AlumnoRespuestaSeleccionService = {
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
          tableIn: "alumnos_respuestas_seleccion",
          inField: "alumno_id",
          selectFields: `*,
                          alumnos(alumno_id,url_foto_perfil,telefono_contacto1,telefono_contacto2,email)
                          preguntas(pregunta_id,texto_pregunta,grupo_preguntas,tipo_pregunta_id,nivel_educativo_id,template_code,respuestas_posibles(respuesta_posible_id,nombre,icono)),
                          respuestas_posibles(respuesta_posible_id,nombre)`,
        });
        respuestaEnviada = true;
        res.json(alumnos_cursos);
      }
      if (!respuestaEnviada) {
        const alumnoRespuestaSeleccion = await dataService.getAll(
          [
            "*",
            "alumnos(alumno_id,url_foto_perfil,telefono_contacto1,telefono_contacto2,email)",
            "preguntas(pregunta_id,texto_pregunta,grupo_preguntas,tipo_pregunta_id,nivel_educativo_id,template_code,respuestas_posibles(respuesta_posible_id,nombre,icono))",
            "respuestas_posibles(respuesta_posible_id,nombre)",
          ],
          where
        );
        res.json(alumnoRespuestaSeleccion);
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
    const { alumno_id, pregunta_id, respuesta_posible_id } = req.body;

    if (!alumno_id || !pregunta_id || !respuesta_posible_id) {
      throw new Error("Faltan datos obligatorios.");
    }

    const respuesta = new AlumnoRespuestaSeleccion();
    respuesta.alumno_id = alumno_id;
    respuesta.pregunta_id = pregunta_id;
    respuesta.respuesta_posible_id = respuesta_posible_id;
    const { error } = await client
      .from("alumnos_respuestas_seleccion")
      .update({ respuesta_posible_id: respuesta.respuesta_posible_id })
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
    const { alumno_id, pregunta_id, respuestas_posibles } = req.body;
    if (
      !alumno_id ||
      !pregunta_id ||
      !Array.isArray(respuestas_posibles) ||
      respuestas_posibles.length === 0
    ) {
      throw new Error("Datos inválidos o incompletos.");
    }

    try {
      // 1. Buscar respuesta previa
      const { data: existentes, error: fetchError } = await client
        .from("alumnos_respuestas_seleccion")
        .select("*")
        .eq("alumno_id", alumno_id)
        .eq("pregunta_id", pregunta_id);

      if (fetchError) throw fetchError;

      const updates = [];
      const inserts = [];

      if (existentes.length > 0) {
        // Actualizar la primera existente con el primer valor del nuevo array
        const primera = existentes[0];
        updates.push({
          alumno_respuesta_id: primera.alumno_respuesta_id,
          respuesta_posible_id: respuestas_posibles[0],
        });

        // Insertar los demás como nuevos
        for (let i = 1; i < respuestas_posibles.length; i++) {
          inserts.push({
            alumno_id,
            pregunta_id,
            respuesta_posible_id: respuestas_posibles[i],
          });
        }
      } else {
        // No hay existentes: insertar todos
        for (const respuesta_id of respuestas_posibles) {
          inserts.push({
            alumno_id,
            pregunta_id,
            respuesta_posible_id: respuesta_id,
          });
        }
      }


      // Ejecutar la actualización (si aplica)
      if (updates.length > 0) {
        const { error: updateError } = await client
          .from("alumnos_respuestas_seleccion")
          .update({ respuesta_posible_id: updates[0].respuesta_posible_id })
          .eq("respuesta_posible_id", updates[0].respuesta_posible_id);

        if (updateError) throw updateError;
      }

      // Ejecutar las inserciones (si aplica)
      if (inserts.length > 0) {
        const { error: insertError } = await client
          .from("alumnos_respuestas_seleccion")
          .insert(inserts);

        if (insertError) throw insertError;
      }

       res.json({ message: "Respuestas procesadas correctamente." });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error("Error:", err);
       res.status(500).json({ error: err.message });
    }
  },
};
