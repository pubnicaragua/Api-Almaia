import { Request, Response } from "express";

import { DataService } from "../DataService";
import { Apoderado } from "../../../core/modelo/apoderado/Apoderado";
import { SupabaseClientService } from "../../../core/services/supabaseClient";
import { SupabaseClient } from "@supabase/supabase-js";
import Joi from "joi";
import { ApoderadoRespuesta } from "../../../core/modelo/apoderado/ApoderadoRespuesta";
import { mapearDatosAlumno } from "../../../core/services/PerfilServiceCasoUso";

const supabaseService = new SupabaseClientService();
const client: SupabaseClient = supabaseService.getClient();
const dataService: DataService<Apoderado> = new DataService(
  "apoderados",
  "apoderado_id"
);
const ApoderadoSchema = Joi.object({
  persona_id: Joi.number().integer().required(),
  colegio_id: Joi.number().integer().required(),
  telefono_contacto1: Joi.string().max(15).required(),
  telefono_contacto2: Joi.string().max(15).required(),
  email_contacto1: Joi.string().max(128).required(),
  email_contacto2: Joi.string().max(128).required(),
  estado: Joi.string().max(20).required(),
  profesion_id: Joi.number().integer().optional(),
  tipo_oficio_id: Joi.number().integer().optional(),
});
export const ApoderadoService = {
  async obtener(req: Request, res: Response) {
    try {
      const where = { ...req.query }; // Convertir los parámetros de consulta en filtros
      const apoderados = await dataService.getAll(
        [
          "*",
          "personas(persona_id,nombres,apellidos)",
          "colegios(colegio_id,nombre)",
          "profesiones_oficios(profesion_oficio_id,nombre,tipos_oficios(tipo_oficio_id,nombre))",
        ],
        where
      );
      res.json(apoderados);
    } catch (error) {
      console.error("Error al obtener la apoderado:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  },
  guardar: async (req: Request, res: Response) => {
    try {
      const apoderado: Apoderado = new Apoderado();
      Object.assign(apoderado, req.body);
      apoderado.creado_por = req.creado_por;
      apoderado.actualizado_por = req.actualizado_por;
      let responseSent = false;
      const { error: validationError } = ApoderadoSchema.validate(req.body);
      const { data, error } = await client
        .from("personas")
        .select("*")
        .eq("persona_id", apoderado.persona_id)
        .single();
      if (error || !data) {
        throw new Error("La persona no existe");
      }
      const { data: dataColegio, error: errorColegio } = await client
        .from("colegios")
        .select("*")
        .eq("colegio_id", apoderado.colegio_id)
        .single();
      if (errorColegio || !dataColegio) {
        throw new Error("El colegio no existe");
      }

      if (validationError) {
        responseSent = true;
        throw new Error(validationError.details[0].message);
      }
      if (!responseSent) {
        const savedApoderado = await dataService.processData(apoderado);
        res.status(201).json(savedApoderado);
      }
    } catch (err) {
      const error = err as Error;
      console.error("Error al guardar el apoderado:", error);
      res.status(500).json({ message: error.message || "Error inesperado" });
    }
  },
  actualizar: async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const apoderado: Apoderado = new Apoderado();
      Object.assign(apoderado, req.body);
      apoderado.actualizado_por = req.actualizado_por;
      let responseSent = false;
      const { error: validationError } = ApoderadoSchema.validate(req.body);
      const { data, error } = await client
        .from("personas")
        .select("*")
        .eq("persona_id", apoderado.persona_id)
        .single();
      if (error || !data) {
        throw new Error("La persona no existe");
      }
      const { data: dataColegio, error: errorColegio } = await client
        .from("colegios")
        .select("*")
        .eq("colegio_id", apoderado.colegio_id)
        .single();
      if (errorColegio || !dataColegio) {
        throw new Error("El colegio no existe");
      }

      if (validationError) {
        responseSent = true;
        throw new Error(validationError.details[0].message);
      }
      if (!responseSent) {
        await dataService.updateById(id, apoderado);
        res
          .status(200)
          .json({ message: "Apoderado actualizado correctamente" });
      }
    } catch (error) {
      console.error("Error al actualizar la apoderado:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  },
  async responderPreguntas(req: Request, res: Response) {
    const { alumno_id, apoderado_id, pregunta_id, respuesta_posible_id } =
      req.body;

    if (!alumno_id || !pregunta_id || !respuesta_posible_id || !apoderado_id) {
      throw new Error("Faltan datos obligatorios.");
    }

    const respuesta = new ApoderadoRespuesta();
    respuesta.alumno_id = alumno_id;
    respuesta.pregunta_id = pregunta_id;
    respuesta.respuesta_posible_id = respuesta_posible_id;
    respuesta.apoderado_id = apoderado_id;

    const { error } = await client
      .from("apoderados_respuestas") // Tabla que corresponde al modelo
      .update({
        respuesta_posible_id: respuesta.respuesta_posible_id, // Campo correcto según el modelo
      })
      .match({
        alumno_id: respuesta.alumno_id,
        pregunta_id: respuesta.pregunta_id,
        apoderado_id: respuesta.apoderado_id,
      });

    if (error) {
      throw new Error(error.message);
    }

    res.json({ message: "Respuesta actualizada correctamente." });
  },
  async eliminar(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      await dataService.deleteById(id);
      res.status(200).json({ message: "Apoderado eliminada correctamente" });
    } catch (error) {
      console.error("Error al eliminar la apoderado:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  },
  async obtenerPerfil(req: Request, res: Response) {
    const { data: usuario_data, error: error_usuario } = await req.supabase
      .from("usuarios")
      .select(
        "*,idiomas(*),usuarios_colegios(*,colegios(colegio_id,nombre)),personas(persona_id,tipo_documento,numero_documento,nombres,apellidos,genero_id,estado_civil_id,fecha_nacimiento),roles(rol_id,nombre,descripcion,funcionalidades_roles(*,funcionalidad_rol_id,funcionalidades(*,funcionalidad_id)))"
      )
      .eq("usuario_id", req.user.usuario_id)
      .single();
    if (error_usuario) {
      throw new Error(error_usuario.message);
    }
    const data = mapearDatosAlumno(usuario_data);

    const usuario = data.usuario;
    const persona = data.persona;
    const rol = data.rol;
    res.json({
      usuario,
      persona,
      rol,
    });
  },
};
