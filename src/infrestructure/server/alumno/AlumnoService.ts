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

const supabaseService = new SupabaseClientService();
const client: SupabaseClient = supabaseService.getClient();

const dataService: DataService<Alumno> = new DataService(
  "alumnos",
  "alumno_id"
);
const AlumnoSchema = Joi.object({
  url_foto_perfil: Joi.string().max(255).optional(),
  telefono_contacto1: Joi.string().max(16).optional(),
  telefono_contacto2: Joi.string().max(16).optional(),
  email: Joi.string().max(45).optional(),
  colegio_id: Joi.number().integer().required(),
});
const UsuarioUpdateSchema = Joi.object({
  nombre_social: Joi.string().max(50).required(),
  email: Joi.string().max(150).required(),
  encripted_password: Joi.string().max(35).optional(),
  nombres: Joi.string().max(35).optional(),
  apellidos: Joi.string().max(35).optional(),
  fecha_nacimiento: Joi.string().optional(),
  numero_documento: Joi.string().optional(),
  rol_id: Joi.number().integer().required(),
  alumno_id: Joi.number().integer().required(),
  telefono_contacto: Joi.string().max(150).required(),
  url_foto_perfil: Joi.string().max(255).required(),
  persona_id: Joi.number().integer().optional(),
  idioma_id: Joi.number().integer().required(),
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
      const alumnos = await dataService.getAll(
        [
          "*",
          "personas(persona_id,nombres,apellidos,fecha_nacimiento,numero_documento,usuarios(usuario_id,rol_id))",
          "colegios(colegio_id,nombre)",
          "cursos(curso_id,nombre_curso,grados(grado_id,nombre),niveles_educativos(nivel_educativo_id,nombre))",
        ],
        where
      );
      res.json(alumnos);
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
    const data_alumno = await dataService.getAll(
      [
        "*",
        "personas(persona_id,nombres,apellidos,fecha_nacimiento,generos(genero_id,nombre))",
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
    const { data: informes, error: error_informes } = await client
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

    // Emociones simuladas
    const emociones = [
      { nombre: "Felicidad", valor: 3100 },
      { nombre: "Tristeza", valor: 1500 },
      { nombre: "Estrés", valor: 950 },
      { nombre: "Ansiedad", valor: 2600 },
      { nombre: "Enojo", valor: 750 },
      { nombre: "Otros", valor: 1900 },
    ];
    const datosComparativa: ComparativaDato[] = [
      {
        emocion: "Feliz",
        alumno: 2.0, // Punto más alejado (y=110)
        promedio: 1.5, // Punto más cercano (y=128)
      },
      {
        emocion: "Triste",
        alumno: 1.9, // x=290
        promedio: 1.6, // x=272
      },
      {
        emocion: "Estresada",
        alumno: 1.5, // y=277
        promedio: 1.2, // y=257
      },
      {
        emocion: "Enojada",
        alumno: 1.5,
        promedio: 1.2,
      },
      {
        emocion: "Ansiosa",
        alumno: 1.9,
        promedio: 1.6,
      },
    ];

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
        console.log(alumno);

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
      console.error("Error al actualizar el alumno:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  },
  async actualizarPerfil(req: Request, res: Response) {
    try {
      const usuarioId = parseInt(req.params.id);
      const usuario = new Usuario();
      const persona = new Persona();
      // Asignar directamente las propiedades correspondientes

      Object.assign(usuario, {
        rol_id: req.body.rol_id,
        nombre_social: req.body.nombre_social,
        email: req.body.email,
        telefono_contacto: req.body.telefono_contacto,
        url_foto_perfil: req.body.url_foto_perfil,
        idioma_id: req.body.idioma_id,
      });
      usuario.actualizado_por = req.actualizado_por;
      let responseSent = false;
      const { error: validationError } = UsuarioUpdateSchema.validate(req.body);
      const { data, error } = await client
        .from("roles")
        .select("*")
        .eq("rol_id", usuario.rol_id)
        .single();
      if (error || !data) {
        throw new Error("El rol no existe");
      }
      const { data: dataUsuario, error: errorUsuario } = await client
        .from("usuarios")
        .select("*")
        .eq("usuario_id", usuarioId)
        .single();
      if (errorUsuario || !dataUsuario) {
        throw new Error("El usuario no existe");
      }
      usuario.persona_id = dataUsuario.persona_id;

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
      persona.fecha_nacimiento = req.body.fecha_nacimiento;
      persona.numero_documento = req.body.numero_documento;
      const { data: dataIdioma, error: errorIdioma } = await client
        .from("idiomas")
        .select("*")
        .eq("idioma_id", usuario.idioma_id)
        .single();
      if (errorIdioma || !dataIdioma) {
        throw new Error("El nivel educativo no existe");
      }
      if (validationError) {
        responseSent = true;
        throw new Error(validationError.details[0].message);
      }
      if (!responseSent) {
        await dataUsuarioService.updateById(usuarioId, usuario);
        const { data: dataUsuarioUpdate, error: errorUsuarioUpdate } =
          await client
            .from("usuarios")
            .select("*")
            .eq("usuario_id", usuarioId)
            .single();
        if (errorUsuarioUpdate) {
          throw new Error(errorUsuarioUpdate.message);
        }
        await dataPersonaService.updateById(usuario.persona_id, persona);
        res.status(200).json(dataUsuarioUpdate);
      }
    } catch (error) {
      console.log(error);

      res.status(500).json(error);
    }
  },
  async eliminar(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      await dataService.deleteById(id);
      res.status(200).json({ message: "Alumno eliminado correctamente" });
    } catch (error) {
      console.error("Error al eliminar el alumno:", error);
      res.status(500).json({ message: "Error interno del servidor" });
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
        resultados = await buscarAlumnos(client, termino,colegio_id);
      }
      resultados = await buscarAlumnos(client, termino);

      res.json(resultados);
    } catch (error) {
      console.error("Error al actualizar la alerta evidencia:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  },
};
