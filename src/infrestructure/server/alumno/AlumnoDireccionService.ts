import { Request, Response } from "express";
import { DataService } from "../DataService";
import { AlumnoDireccion } from "../../../core/modelo/alumno/AlumnoDireccion";
import Joi from "joi";
import { SupabaseClientService } from "../../../core/services/supabaseClient";
import { SupabaseClient } from "@supabase/supabase-js";
import { obtenerRelacionados } from "../../../core/services/ObtenerTablasColegioCasoUso";
const AlumnoDireccionSchema = Joi.object({
  descripcion: Joi.string().max(50).required(),
  alumno_id: Joi.number().integer().required(),
  comuna_id: Joi.number().integer().required(),
  pais_id: Joi.number().integer().required(),
  region_id: Joi.number().integer().required(),
});
const dataService: DataService<AlumnoDireccion> = new DataService(
  "alumnos_direcciones",
  "alumno_direccion_id"
);
const supabaseService = new SupabaseClientService();
const client: SupabaseClient = supabaseService.getClient();
export const AlumnoDireccionService = {
  async obtener(req: Request, res: Response) {
    try {
      const { colegio_id, ...where } = req.query;
      let respuestaEnviada = false;
      if (colegio_id !== undefined) {
        const alumnos_direcciones = await obtenerRelacionados({
          tableFilter: "alumnos",
          filterField: "colegio_id",
          filterValue: colegio_id,
          idField: "alumno_id",
          tableIn: "alumnos_direcciones",
          inField: "alumno_id",
          selectFields: `*,
                                alumnos(alumno_id,url_foto_perfil,telefono_contacto1,telefono_contacto2,email)
                                comunas(comuna_id,nombre,regiones(region_id,nombre))`,
        });
        respuestaEnviada = true;
        res.json(alumnos_direcciones);
      }
      if (!respuestaEnviada) {
        const alumnoDireccion = await dataService.getAll(
          [
            "*",
            "alumnos(alumno_id,url_foto_perfil,telefono_contacto1,telefono_contacto2,email)",
            "comunas(comuna_id,nombre,regiones(region_id,nombre))",
          ],
          where
        );
        res.json(alumnoDireccion);
      }
    } catch (error) {
      console.error("Error al obtener la dirección del alumno:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  },
  guardar: async (req: Request, res: Response) => {
    try {
      const alumnoDireccion: AlumnoDireccion = new AlumnoDireccion();
      Object.assign(alumnoDireccion, req.body);
      alumnoDireccion.creado_por = req.creado_por;
      alumnoDireccion.actualizado_por = req.actualizado_por;
      let responseSent = false;
      const { error: validationError } = AlumnoDireccionSchema.validate(
        req.body
      );
      const { data, error } = await client
        .from("alumnos")
        .select("*")
        .eq("alumno_id", alumnoDireccion.alumno_id)
        .single();
      if (error || !data) {
        throw new Error("El alumno no existe");
      }
      const { data: dataPais, error: errorPais } = await client
        .from("paises")
        .select("*")
        .eq("pais_id", alumnoDireccion.pais_id)
        .single();
      if (errorPais || !dataPais) {
        throw new Error("El pais no existe");
      }
      const { data: dataRegion, error: errorRegion } = await client
        .from("regiones")
        .select("*")
        .eq("region_id", alumnoDireccion.pais_id)
        .single();
      if (errorRegion || !dataRegion) {
        throw new Error("La region no existe");
      }
      const { data: dataComuna, error: errorComuna } = await client
        .from("comunas")
        .select("*")
        .eq("comuna_id", alumnoDireccion.comuna_id)
        .single();
      if (errorComuna || !dataComuna) {
        throw new Error("La comuna no existe");
      }
      if (validationError) {
        responseSent = true;
        throw new Error(validationError.details[0].message);
      }
      if (!responseSent) {
        const savedAlumnoDireccion = await dataService.processData(
          alumnoDireccion
        );
        res.status(201).json(savedAlumnoDireccion);
      }
    } catch (error) {
      console.error("Error al guardar la dirección del alumno:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  },
  async actualizar(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const alumnoDireccion: AlumnoDireccion = new AlumnoDireccion();
      Object.assign(alumnoDireccion, req.body);
      alumnoDireccion.actualizado_por = req.actualizado_por;
      let responseSent = false;
      const { error: validationError } = AlumnoDireccionSchema.validate(
        req.body
      );
      const { data, error } = await client
        .from("alumnos")
        .select("*")
        .eq("alumno_id", alumnoDireccion.alumno_id)
        .single();
      if (error || !data) {
        throw new Error("El alumno no existe");
      }
      const { data: dataPais, error: errorPais } = await client
        .from("paises")
        .select("*")
        .eq("pais_id", alumnoDireccion.pais_id)
        .single();
      if (errorPais || !dataPais) {
        throw new Error("El pais no existe");
      }
      const { data: dataRegion, error: errorRegion } = await client
        .from("regiones")
        .select("*")
        .eq("region_id", alumnoDireccion.pais_id)
        .single();
      if (errorRegion || !dataRegion) {
        throw new Error("La region no existe");
      }
      const { data: dataComuna, error: errorComuna } = await client
        .from("comunas")
        .select("*")
        .eq("comuna_id", alumnoDireccion.comuna_id)
        .single();
      if (errorComuna || !dataComuna) {
        throw new Error("La comuna no existe");
      }
      if (validationError) {
        responseSent = true;
        throw new Error(validationError.details[0].message);
      }
      if (!responseSent) {
        await dataService.updateById(id, alumnoDireccion);
        res
          .status(200)
          .json({ message: "Dirección del alumno actualizada correctamente" });
      }
    } catch (error) {
      console.error("Error al actualizar la dirección del alumno:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  },
  async eliminar(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      await dataService.deleteById(id);
      res
        .status(200)
        .json({ message: "Dirección del alumno eliminada correctamente" });
    } catch (error) {
      console.error("Error al eliminar la dirección del alumno:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  },
};
