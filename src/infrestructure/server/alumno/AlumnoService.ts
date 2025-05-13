import { Request, Response } from "express";
import { DataService } from "../DataService";
import { Alumno } from "../../../core/modelo/alumno/Alumno";
import Joi from "joi";
import { SupabaseClient } from "@supabase/supabase-js";
import { SupabaseClientService } from "../../../core/services/supabaseClient";
import { ComparativaDato } from "../../../core/modelo/alumno/ComparativaDato";

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
export const AlumnosService = {
  async obtener(req: Request, res: Response) {
    try {
      const where = { ...req.query }; // Convertir los parámetros de consulta en filtros
      const alumnos = await dataService.getAll(
        [
          "*",
          "personas(persona_id,nombres,apellidos,fecha_nacimiento)",
          "colegios(colegio_id,nombre)",
          "cursos(grados(grado_id,nombre),niveles_educativos(nivel_educativo_id,nombre))",
        ],
        where
      );
      res.json(alumnos);
    } catch (error) {
      console.error("Error al obtener el alumno:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  },

  async getAlumnoDetalle(req: Request, res: Response) {
    const { alumnoId } = req.params;
    const where = { alumno_id: alumnoId }; // Convertir los parámetros de consulta en filtros
    const data_alumno = await dataService.getAll(
      [
        "*",
        "personas(persona_id,nombres,apellidos,fecha_nacimiento)",
        "colegios(colegio_id,nombre)",
        "cursos(grados(grado_id,nombre),niveles_educativos(nivel_educativo_id,nombre))",
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
    const { data: alertas, error: error_alertas } = await client
      .from("alumnos_alertas")
      .select(
        "*,alertas_reglas(alerta_regla_id,nombre),alertas_origenes(alerta_origen_id,nombre),alertas_severidades(alerta_severidad_id,nombre)alertas_prioridades(alerta_prioridad_id,nombre),alertas_tipos(alerta_tipo_id,nombre)"
      )
      .eq("alumno_id", alumno.alumno_id);
    if (error_alertas) {
      throw new Error(error_alertas.message);
    }
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
        "*,apoderados(apoderado_id,personas(persona_id,nombres,apellidos))"
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
};
