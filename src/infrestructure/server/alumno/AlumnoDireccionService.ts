import { Request, Response } from "express";
import { DataService } from "../DataService";
import { AlumnoDireccion } from "../../../core/modelo/alumno/AlumnoDireccion";
import Joi from "joi";
import { SupabaseClientService } from "../../../core/services/supabaseClient";
import { SupabaseClient } from "@supabase/supabase-js";
const AlumnoDireccionSchema = Joi.object({
  descripcion: Joi.string().max(50).required(),
  alumno_id: Joi.number().integer().required(),
  comuna_id: Joi.number().integer().required(),
  pais_id: Joi.number().integer().required(),
  region_id: Joi.number().integer().required(),
});
const dataService: DataService<AlumnoDireccion> = new DataService(
  "alumnos_alertas"
);
const supabaseService = new SupabaseClientService();
const client: SupabaseClient = supabaseService.getClient();
export const AlumnoDireccionService = {
  async obtener(req: Request, res: Response) {
    try {
      const where = { ...req.query }; // Convertir los parámetros de consulta en filtros
      const alumnoDireccion = await dataService.getAll(
        [
          "*,alumnos('alumno_id','url_foto_perfil','telefono_contacto1','telefono_contacto2','email'),comunas('comuna_id','nombre'),paises('pais_id','nombre'),regiones('region_id','nombre')",
        ],
        where
      );
      res.json(alumnoDireccion);
      /*const alumnos_direcciones= [
                {
                  "alumno_direccion_id": 701,
                  "alumno_id": 101,
                  "descripcion": "Av. Principal 1234, Depto 501",
                  "es_principal": true,
                  "ubicaciones_mapa": "-33.45694, -70.64827",
                  "comuna_id": 125,
                  "region_id": 13,
                  "pais_id": 1,
                  "fecha_actualizacion": "2023-06-15T10:30:00Z",
                  "alumno": {
                    "alumno_id": 101,
                    "nombre": "Juan Pérez",
                    "curso_actual": "4° Básico A"
                  },
                  "comuna": {
                    "comuna_id": 125,
                    "nombre": "Santiago",
                    "region": {
                      "region_id": 13,
                      "nombre": "Metropolitana",
                      "pais": {
                        "pais_id": 1,
                        "nombre": "Chile"
                      }
                    }
                  }
                },
                {
                  "alumno_direccion_id": 702,
                  "alumno_id": 102,
                  "descripcion": "Calle Secundaria 567, Casa B",
                  "es_principal": false,
                  "ubicaciones_mapa": "-33.45872, -70.65011",
                  "comuna_id": 126,
                  "region_id": 13,
                  "pais_id": 1,
                  "alumno": {
                    "alumno_id": 102,
                    "nombre": "María González"
                  },
                  "comuna": {
                    "comuna_id": 126,
                    "nombre": "Providencia"
                  }
                }
              ]
            res.json(alumnos_direcciones);*/
    } catch (error) {
      console.error("Error al obtener la dirección del alumno:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  },
  guardar: async (req: Request, res: Response) => {
    try {
      const alumnoDireccion: AlumnoDireccion = req.body;
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
      const alumnoDireccion: AlumnoDireccion = req.body;
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
