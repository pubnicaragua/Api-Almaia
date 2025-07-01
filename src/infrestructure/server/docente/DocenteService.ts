/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import { DataService } from "../DataService";
import { Docente } from "../../../core/modelo/colegio/Docente";
import { SupabaseClientService } from "../../../core/services/supabaseClient";
import { SupabaseClient } from "@supabase/supabase-js";
import Joi from "joi";

const supabaseService = new SupabaseClientService();
const client: SupabaseClient = supabaseService.getClient();
const dataService: DataService<Docente> = new DataService(
  "docentes",
  "docente_id"
);
const DocenteSchema = Joi.object({
  tipo_documento: Joi.string().max(50).required(),
  numero_documento: Joi.string().max(16).required(),
  nombres: Joi.string().max(50).required(),
  apellidos: Joi.string().max(30).required(),
  genero_id: Joi.number().integer().required(),
  estado_civil_id: Joi.number().integer().required(),
  colegio_id: Joi.number().integer().required(),
  especialidad: Joi.string().max(100).required(),
  estado: Joi.string().max(20).required(),
});
export const DocentesService = {
  async obtener(req: Request, res: Response) {
    try {
      const where = { ...req.query }; // Convertir los parámetros de consulta en filtros
      const docente = await dataService.getAll(
        [
          "*",
          "personas(*,persona_id,nombres,apellidos,usuarios(usuario_id,url_foto_perfil))",
          "colegios(colegio_id,nombre)"
        ],
        where
      );

      const docentes = docente.map((doc: any) => {
        const { personas, colegios, ...rest } = doc; // Desestructurar para evitar conflictos con el nombre de la variable
        const { usuarios , ...persona } = personas;
        return {  
          ...rest,
          url_foto_perfil: usuarios[0]?.url_foto_perfil || '/assets/img/avatar-docente.png',
          personas: { ...persona },
          colegios
        };
      });

      res.json(docentes);
    } catch (error) {
      console.error("Error al obtener el docente:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  },
  async detalle(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const where = { docente_id: id }; // Convertir los parámetros de consulta en filtros
      const docente_data = await dataService.getAll(
        [
          "*",
          "personas(*,persona_id,estados_civiles(estado_civil_id,nombre),generos(genero_id,nombre),usuarios(usuario_id,url_foto_perfil))",
          "colegios(colegio_id,nombre)",
        ],
        where
      );
      const { personas, colegios, ...rest } = docente_data[0] as any;
      const { usuarios, ...persona } = personas;
      
      const docente = {
        ...rest,
        url_foto_perfil: usuarios[0]?.url_foto_perfil || '/assets/img/avatar-docente.png',
        personas: { ...persona },
        colegios
      };
      
      res.json(docente);
    } catch (error) {
      console.error("Error al obtener el docente:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  },
  guardar: async (req: Request, res: Response) => {
    try {
      const docente: Docente = new Docente();
      Object.assign(docente, req.body);
      docente.creado_por = req.creado_por;
      docente.actualizado_por = req.actualizado_por;
      let responseSent = false;
      const { error: validationError } = DocenteSchema.validate(req.body);
      const { data, error } = await client
        .from("personas")
        .select("*")
        .eq("persona_id", docente.persona_id)
        .single();
      if (error || !data) {
        throw new Error("La persona no existe");
      }
      const { data: dataColegio, error: errorColegio } = await client
        .from("colegios")
        .select("*")
        .eq("colegio_id", docente.colegio_id)
        .single();
      if (errorColegio || !dataColegio) {
        throw new Error("El colegio no existe");
      }

      if (validationError) {
        responseSent = true;
        throw new Error(validationError.details[0].message);
      }
      if (!responseSent) {
        const savedDocente = await dataService.processData(docente);
        res.status(201).json(savedDocente);
      }
    } catch (err) {
      const error = err as Error;
      console.error("Error al guardar el docente:", error);
      res.status(500).json({ message: error.message || "Error inesperado" });
    }
  },
  async actualizar(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const docente: Docente = new Docente();
      Object.assign(docente, req.body);
      docente.creado_por = req.creado_por;
      docente.actualizado_por = req.actualizado_por;
      let responseSent = false;
      const { error: validationError } = DocenteSchema.validate(req.body);
      const { data, error } = await client
        .from("personas")
        .select("*")
        .eq("persona_id", docente.persona_id)
        .single();
      if (error || !data) {
        throw new Error("La persona no existe");
      }
      const { data: dataColegio, error: errorColegio } = await client
        .from("colegios")
        .select("*")
        .eq("colegio_id", docente.colegio_id)
        .single();
      if (errorColegio || !dataColegio) {
        throw new Error("El colegio no existe");
      }

      if (validationError) {
        responseSent = true;
        throw new Error(validationError.details[0].message);
      }
      if (!responseSent) {
        await dataService.updateById(id, docente);
        res.status(200).json({ message: "docente actualizado correctamente" });
      }
    } catch (error) {
      console.error("Error al actualizar el docente:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  },
  async eliminar(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      await dataService.deleteById(id);
      res.status(200).json({ message: "docente eliminado correctamente" });
    } catch (error) {
      console.error("Error al eliminar el docente:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  },
};
