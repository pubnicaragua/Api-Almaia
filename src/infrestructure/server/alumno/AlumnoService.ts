import { Request, Response } from "express";
import { DataService } from "../DataService";
import { Alumno } from "../../../core/modelo/alumno/Alumno";
import Joi from "joi";
import { SupabaseClient } from "@supabase/supabase-js";
import { SupabaseClientService } from "../../../core/services/supabaseClient";
import { ComparativaDato } from "../../../core/modelo/alumno/ComparativaDato";
import { Usuario } from "../../../core/modelo/auth/Usuario";
import { Persona } from "../../../core/modelo/Persona";
import { buscarAlumnos } from "../../../core/services/AlumnoServicioCasoUso";
import { mapearAlertas } from "../../../core/services/AlertasServiceCasoUso";
import { mapEmotions, mapEmotionsPromedio } from "../../../core/services/DashboardServiceCasoUso";
import { mapearDatosAlumno } from "../../../core/services/PerfilServiceCasoUso";
import { extractBase64Info, getExtensionFromMime, getURL, isBase64DataUrl } from "../../../core/services/ImagenServiceCasoUso";
import { randomUUID } from "crypto";

const supabaseService = new SupabaseClientService();
const client: SupabaseClient = supabaseService.getClient();

const dataService: DataService<Alumno> = new DataService(
  "alumnos",
  "alumno_id"
);
const dataImagesService: DataService<Partial<Alumno>> = new DataService(
  "alumnos",
  "persona_id"
);
const AlumnoSchema = Joi.object({
  url_foto_perfil: Joi.string().max(255).optional(),
  telefono_contacto1: Joi.string().max(16).optional(),
  telefono_contacto2: Joi.string().max(16).optional(),
  email: Joi.string().max(45).optional(),
  colegio_id: Joi.number().integer().required(),
});
const UsuarioUpdateSchema = Joi.object({
  nombre_social: Joi.string().max(50).optional(),
  email: Joi.string().max(150).optional(),
  encripted_password: Joi.string().max(35).optional(),
  nombres: Joi.string().max(35).optional(),
  apellidos: Joi.string().max(35).optional(),
  fecha_nacimiento: Joi.date().optional(),
  numero_documento: Joi.string().optional(),
  alumno_id: Joi.number().integer().optional(),
  telefono_contacto: Joi.string().max(150).optional(),
  url_foto_perfil: Joi.string().optional(),
  persona_id: Joi.number().integer().optional(),
  idioma_id: Joi.number().integer().optional(),
});
const dataUsuarioService: DataService<Usuario> = new DataService(
  "usuarios",
  "usuario_id"
);
const dataPersonaService: DataService<Persona> = new DataService(
  "personas",
  "persona_id"
);
export const AlumnosService = {
  async obtener(req: Request, res: Response) {
    try {
      const where = { ...req.query }; // Convertir los parámetros de consulta en filtros
      dataService.setClient(req.supabase);
      let alumnos = await dataService.getAll(
        [
          "*",
          "personas(persona_id,nombres,apellidos,fecha_nacimiento,numero_documento,usuarios(usuario_id,rol_id))",
          "colegios(colegio_id,nombre)",
          "cursos(curso_id,nombre_curso,grados(grado_id,nombre),niveles_educativos(nivel_educativo_id,nombre))",
        ],
        where
      );
      const rawCursoIds = where['cursos.curso_id'];

      let cursoIdArray: number[] = [];

      if (rawCursoIds) {
        if (Array.isArray(rawCursoIds)) {
          // Si viene como array tipo ["33", "35"]
          cursoIdArray = rawCursoIds.map(id => Number(id)).filter(id => !isNaN(id));
        } else if (typeof rawCursoIds === 'string') {
          // Si viene como string tipo "33,35"
          cursoIdArray = rawCursoIds
            .split(',')
            .map(id => Number(id.trim()))
            .filter(id => !isNaN(id));
        }
      }

      // ✅ Luego haces el filtrado
      const alumnosFiltrados = alumnos.filter(alumno =>
        alumno?.cursos?.some(curso => cursoIdArray.includes(curso.curso_id))
      );
  
      res.json(alumnosFiltrados);
    } catch (error) {
      console.error("Error al obtener el alumno:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  },
  async establecer_consentimiento(req: Request, res: Response) {
    try {
      const alumnoId = parseInt(req.params.id);
      const { consentimiento } = req.body;
      if (!consentimiento && consentimiento === false) {
        throw new Error("El consentimiento es requerido.");
      }
      const { error } = await client
        .from("alumnos")
        .update({ consentimiento: consentimiento })
        .eq("alumno_id", alumnoId);

      if (error) {
        throw new Error(error.message);
      }

      res.status(200).json({ message: "Acepto consentimiento y asentamiento" });
    } catch (err) {
      const error = err as Error;
      console.error("Error al guardar el motoralerta:", error);
      res.status(500).json({ message: error.message || "Error inesperado" });
    }
  },
  async getAlumnoDetalle(req: Request, res: Response) {
    const { alumnoId } = req.params;
    const where = { alumno_id: alumnoId }; // Convertir los parámetros de consulta en filtros
    dataService.setClient(req.supabase);
    const data_alumno = await dataService.getAll(
      [
        "*",
        "personas(*,persona_id,nombres,apellidos,fecha_nacimiento,generos(genero_id,nombre))",
        "colegios(colegio_id,nombre)",
        "cursos(curso_id,nombre_curso,grados(grado_id,nombre),niveles_educativos(nivel_educativo_id,nombre))",
      ],
      where
    );
    const alumno = data_alumno[0];
    const { data: ficha, error: error_ant_clinicos } = await client
      .from("alumnos_ant_clinicos")
      .select("*")
      .eq("alumno_id", alumno.alumno_id);
    if (error_ant_clinicos) {
      throw new Error(error_ant_clinicos.message);
    }
    const { data: alertas_data, error: error_alertas } = await client
      .from("alumnos_alertas")
      .select(
        "*,personas(persona_id,nombres,apellidos),alertas_reglas(alerta_regla_id,nombre),alertas_origenes(alerta_origen_id,nombre),alertas_severidades(alerta_severidad_id,nombre)alertas_prioridades(alerta_prioridad_id,nombre),alertas_tipos(alerta_tipo_id,nombre)"
      )
      .eq("alumno_id", alumno.alumno_id);
    if (error_alertas) {
      throw new Error(error_alertas.message);
    }
    const alertas = mapearAlertas(alertas_data);
    const { data: informes, error: error_informes } = await req.supabase
      .from("alumnos_informes")
      .select("*")
      .eq("alumno_id", alumno.alumno_id);
    if (error_informes) {
      throw new Error(error_informes.message);
    }
    const { data: apoderados, error: error_apoderados } = await client
      .from("alumnos_apoderados")
      .select(
        "*,apoderados(apoderado_id,telefono_contacto1,telefono_contacto2,email_contacto1,email_contacto2,personas(persona_id,nombres,apellidos))"
      )
      .eq("alumno_id", alumno.alumno_id);
    if (error_apoderados) {
      throw new Error(error_apoderados.message);
    }

    const { colegio_id } = req.query;
    let data;
    if (colegio_id !== undefined) {
      const { data: data_emociones, error } = await client.rpc(
        "obtener_cantidades_pregunta_3_por_alumno",
        {
          p_colegio_id: colegio_id || null,
          p_alumno_id: alumnoId,
        }
      );
      if (error) {
        console.error("Error al obtener cantidades:", error);
      } else {
        data = mapEmotions(data_emociones);
      }
    } else {
      const { data: data_emociones, error } = await client.rpc(
        "obtener_cantidades_pregunta_3_por_alumno",
        {
          alumno_id: alumnoId,
        }
      );
      if (error) {
        console.error("Error al obtener cantidades:", error);
      } else {
        data = mapEmotions(data_emociones);
      }
    }
    const emociones = data;
    // Emociones para el grafico en promedio
    let data_emociones_prom_result: ComparativaDato[] = [];
    const { data: data_emociones_promedio, error } = await client.rpc(
      "obtener_cantidades_pregunta_3_por_alumno_promedio",
      {
        p_colegio_id: colegio_id || null,
        p_alumno_id: alumnoId,
      }
    );
    if (error) {
      console.error("Error al obtener cantidades en promedio:", error);
    } else {
      data_emociones_prom_result = mapEmotionsPromedio(data_emociones_promedio);
    }
    // Emociones simuladas
    const datosComparativa: ComparativaDato[] = data_emociones_prom_result ? data_emociones_prom_result : [];
    // const datosComparativa: ComparativaDato[] = [
    //   {
    //     emocion: "Feliz",
    //     alumno: 2.0, // Punto más alejado (y=110)
    //     promedio: 1.5, // Punto más cercano (y=128)
    //   },
    //   {
    //     emocion: "Triste",
    //     alumno: 1.9, // x=290
    //     promedio: 1.6, // x=272
    //   },
    //   {
    //     emocion: "Estresada",
    //     alumno: 1.5, // y=277
    //     promedio: 1.2, // y=257
    //   },
    //   {
    //     emocion: "Enojada",
    //     alumno: 1.5,
    //     promedio: 1.2,
    //   },
    //   {
    //     emocion: "Ansiosa",
    //     alumno: 1.9,
    //     promedio: 1.6,
    //   },
    // ];
    res.json({
      alumno,
      ficha,
      alertas,
      informes,
      emociones,
      datosComparativa,
      apoderados,
    });
  },
  guardar: async (req: Request, res: Response) => {
    try {
      const alumno: Alumno = new Alumno();
      Object.assign(alumno, req.body);
      alumno.creado_por = req.creado_por;
      alumno.actualizado_por = req.actualizado_por;
      let responseSent = false;
      const { error: validationError } = AlumnoSchema.validate(req.body);
      const { data, error } = await client
        .from("colegios")
        .select("*")
        .eq("colegio_id", alumno.colegio_id)
        .single();
      if (error || !data) {
        throw new Error("El colegio no existe");
      }
      if (validationError) {
        responseSent = true;
        throw new Error(validationError.details[0].message);
      }
      if (!responseSent) {
        const savedAlumno = await dataService.processData(alumno);
        res.status(201).json(savedAlumno);
      }
    } catch (err) {
      const error = err as Error;
      console.error("Error al guardar el alumno:", error);
      res.status(500).json({ message: error.message || "Error inesperado" });
    }
  },
  async actualizar(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const alumno: Alumno = new Alumno();
      Object.assign(alumno, req.body);
      alumno.actualizado_por = req.actualizado_por;
      let responseSent = false;
      const { error: validationError } = AlumnoSchema.validate(req.body);
      const { data, error } = await client
        .from("colegios")
        .select("*")
        .eq("colegio_id", alumno.colegio_id)
        .single();
      if (error || !data) {
        throw new Error("El colegio no existe");
      }
      if (validationError) {
        responseSent = true;
        throw new Error(validationError.details[0].message);
      }
      if (!responseSent) {
        await dataService.updateById(id, alumno);
        res.status(200).json({ message: "Alumno actualizado correctamente" });
      }
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  },

  async actualizarPerfil(req: Request, res: Response) {
    try {
      const usuarioId = parseInt(req.params.id);
      const usuario = new Usuario();
      const persona = new Persona();
      const { encripted_password = undefined, ...rest } = req.body;

      Object.assign(usuario, {
        nombre_social: req.body.nombre_social,
        email: req.body.email,
        telefono_contacto: req.body.telefono_contacto,
        url_foto_perfil: req.body.url_foto_perfil, /// IMAGENES DE PERFIL
        idioma_id: req.body.idioma_id,
      });
      usuario.actualizado_por = req.actualizado_por;
      let responseSent = false;

      const { error: validationError } = UsuarioUpdateSchema.validate(rest);
      const { data: dataUsuario, error: errorUsuario } = await client
        .from("usuarios")
        .select("*")
        .eq("usuario_id", usuarioId)
        .single();
      if (errorUsuario || !dataUsuario) {
        throw new Error("El usuario no existe");
      }

      usuario.persona_id = dataUsuario.persona_id;
      usuario.rol_id = dataUsuario.rol_id;
      usuario.idioma_id = dataUsuario.idioma_id;
      const { data: dataPersona, error: errorPersona } = await client
        .from("personas")
        .select("*")
        .eq("persona_id", usuario.persona_id)
        .single();
      if (errorPersona || !dataPersona) {
        throw new Error("La persona no existe");
      }

      Object.assign(persona, dataPersona);
      persona.nombres = req.body.nombres;
      persona.apellidos = req.body.apellidos;

      persona.fecha_nacimiento = new Date(req.body.fecha_nacimiento);
      persona.numero_documento = req.body.numero_documento;

      if (validationError) {
        responseSent = true;
        throw new Error(validationError.details[0].message);
      }

      if (!responseSent) {

        if (usuario.url_foto_perfil)
          if (isBase64DataUrl(usuario.url_foto_perfil || " ")) {
            const { mimeType, base64Data } = extractBase64Info(
              usuario.url_foto_perfil || " "
            );
            const buffer = Buffer.from(base64Data, "base64");
            const extension = getExtensionFromMime(mimeType);
            const fileName = `${randomUUID()}.${extension}`;
            const client_file = req.supabase;

            const { error } = await client_file.storage
              .from("user-profile")
              .upload(`private/${fileName}`, buffer, {
                contentType: mimeType,
                upsert: true,
              });
            if (error) throw error;
            usuario.url_foto_perfil = getURL(client_file, 'user-profile', `private/${fileName}`);
          }

        await dataUsuarioService.updateById(usuarioId, usuario); /// ACTUALIZA EL USUARIO
        await dataImagesService.updateById(usuario.persona_id, {
          url_foto_perfil: usuario?.url_foto_perfil,
          actualizado_por: req.actualizado_por,
          fecha_actualizacion: req.fecha_creacion
        }); // ACTUALIZA LA IMAGEN DE LOS ALUMNOS VINCULADOS CON persona_id

        const { data: dataUsuarioUpdate, error: errorUsuarioUpdate } =
          await client
            .from("usuarios")
            .select("*")
            .eq("usuario_id", usuarioId)
            .single();
        if (errorUsuarioUpdate) {
          throw new Error(errorUsuarioUpdate.message);
        }
        await dataPersonaService.updateById(usuario.persona_id, persona); // ACTUALIZA LA PERSONA


        if (encripted_password && String(encripted_password).trim() !== "") {
          const { error: updateError } = await client.rpc(
            "cambiar_contrasena",
            {
              p_email: dataUsuarioUpdate.email,
              p_nueva_contrasena: encripted_password,
            }
          );
          if (updateError) {
            throw new Error(updateError.message);
          }
        }

        res.status(200).json(dataUsuarioUpdate);
      }
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  },
  async eliminar(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      await dataService.deleteById(id);
      res.status(200).json({ message: "Alumno eliminado correctamente" });
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  },
  async buscar(req: Request, res: Response) {
    const { termino } = req.body;
    const { colegio_id } = req.query;

    if (!termino || typeof termino !== "string") {
      throw new Error(
        "Debe proporcionar un campo 'termino' en el cuerpo de la solicitud"
      );
    }

    try {
      let resultados;
      if (colegio_id !== undefined) {
        resultados = await buscarAlumnos(client, termino, colegio_id);
      } else {
        resultados = await buscarAlumnos(client, termino);
      }
      if (resultados === null) {
        resultados = [];
      }
      res.json(resultados);
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  },
  async obtenerRacha(req: Request, res: Response) {
    try {
      const { alumno_id } = req.query;
      if (alumno_id === undefined) {
        throw new Error("Falta el parámetro alumno_id");
      }
      const { data, error } = await client.rpc("obtener_rachas_combinadas", {
        alumno_id_param: alumno_id || null,
      });
      if (error) {
        throw new Error(error.message);
      }
      res.json(data[0]);
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  },
  async obtenerLogros(req: Request, res: Response) {
    try {
      const { alumno_id } = req.query;
      if (alumno_id === undefined) {
        throw new Error("Falta el parámetro alumno_id");
      }
      const { data, error } = await client.rpc("obtener_registro_hoy", {
        alumno_id_param: alumno_id || null,
      });
      if (error) {
        throw new Error(error.message);
      }
      res.json(data[0]);
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  },

  async obtenerRegistroSemanal(req: Request, res: Response) {
    try {
      const { alumno_id } = req.query;
      if (alumno_id === undefined) {
        throw new Error("Falta el parámetro alumno_id");
      }
      const { data, error } = await client.rpc("obtener_dias_respondidos", {
        p_alumno_id: alumno_id || null,
      });
      if (error) {
        throw new Error(error.message);
      }
      res.json(data[0].dias_respondidos_json);
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
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
    const funcionalidades = data.funcionalidades
    const { data: alumno_data, error: error_alumno } = await req.supabase
      .from("alumnos")
      .select(
        "*,alumnos_apoderados(*,apoderados(*,personas(persona_id,tipo_documento,numero_documento,nombres,apellidos,genero_id,estado_civil_id,fecha_nacimiento)))"
      )
      .eq("persona_id", data.persona.persona_id);
    if (error_alumno) {
      throw new Error(error_alumno.message);
    }
    const apoderados = alumno_data[0]?.alumnos_apoderados


    res.json({
      usuario,
      persona,
      rol,
      funcionalidades,
      apoderados
    });
  },
};
