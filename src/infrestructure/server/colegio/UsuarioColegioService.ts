import { Request, Response } from "express";
import { DataService } from "../DataService";
import { UsuarioColegio } from "../../../core/modelo/colegio/UsuarioColegio";
import { SupabaseClientService } from "../../../core/services/supabaseClient";
import { SupabaseClient } from "@supabase/supabase-js";
import Joi from "joi";
import { mapearColegios, mapearColegiosConCliente } from "../../../core/services/ColegioServiceCasoUso";

const supabaseService = new SupabaseClientService();
const client: SupabaseClient = supabaseService.getClient();
const UsuarioColegioSchema = Joi.object({
  fecha_asignacion: Joi.date().required(),
  colegio_id: Joi.number().integer().required(),
  usuario_id: Joi.number().integer().required(),
  rol_id: Joi.number().integer().required(),
});
const dataService: DataService<UsuarioColegio> = new DataService(
  "usuarios_colegios"
);
export const UsuarioColegiosService = {
  // async obtener(req: Request, res: Response) {
  //   try {
  //     dataService.setClient(req.supabase); // ← AGREGAR ESTA LÍNEA 
  //     const usuariocolegios = await dataService.getAll(
  //       [
  //         "*",
  //         "colegios(colegio_id,nombre,nombre_fantasia,dependencia,sitio_web,direccion,telefono_contacto,correo_electronico,comuna_id,region_id,pais_id,creado_por,actualizado_por,fecha_creacion,fecha_actualizacion,activo)",
  //         "usuarios(usuario_id,nombre_social)",
  //         "roles(rol_id,nombre)",
  //       ],
  //       req.query
  //     );
  //     console.log(usuariocolegios)
  //     const colegios_maping = await mapearColegios(usuariocolegios);
  //     res.status(200).json(colegios_maping);
  //   } catch (error) {
  //     res.status(500).json(error);
  //   }
  // },
  async obtener(req: Request, res: Response) {
    try {
      dataService.setClient(req.supabase);
      const usuariocolegios = await dataService.getAll(
        [
          "*",
          "colegios(colegio_id,nombre,nombre_fantasia,dependencia,sitio_web,direccion,telefono_contacto,correo_electronico,comuna_id,region_id,pais_id,creado_por,actualizado_por,fecha_creacion,fecha_actualizacion,activo)",
          "usuarios(usuario_id,nombre_social)",
          "roles(rol_id,nombre)",
        ],
        req.query
      );
      // Pasar el cliente autenticado a mapearColegios 
      const colegios_maping = await mapearColegiosConCliente(usuariocolegios, req.supabase);
      res.json(colegios_maping);
    } catch (error: any) {
      console.log(error.message)
      res.status(500).json(error);
    }
  },
  // async obtener(req: Request, res: Response) {
  //   try {
  //     const usuariocolegios = await dataService.getAll(
  //       [
  //         "*",
  //         "colegios(colegio_id,nombre,nombre_fantasia,dependencia,sitio_web,direccion,telefono_contacto,correo_electronico,comuna_id,region_id,pais_id,creado_por,actualizado_por,fecha_creacion,fecha_actualizacion,activo)",
  //         "usuarios(usuario_id,nombre_social)",
  //         "roles(rol_id,nombre)",
  //       ],
  //       req.query
  //     );
  //     console.log(usuariocolegios)
  //     const colegios_maping = await mapearColegios(usuariocolegios);
  //     res.status(200).json(colegios_maping);
  //   } catch (error) {

  //     res.status(500).json(error);
  //   }
  // },

  async guardar(req: Request, res: Response) {
    try {
      const usuariocolegio = new UsuarioColegio();
      Object.assign(usuariocolegio, req.body);
      usuariocolegio.creado_por = req.creado_por;
      usuariocolegio.actualizado_por = req.actualizado_por;
      let responseSent = false;
      const { error: validationError } = UsuarioColegioSchema.validate(
        req.body
      );
      const { data, error } = await client
        .from("colegios")
        .select("*")
        .eq("colegio_id", usuariocolegio.colegio_id)
        .single();
      if (error || !data) {
        throw new Error("El colegio no existe");
      }
      const { data: dataUsuario, error: errorUsuario } = await client
        .from("usuarios")
        .select("*")
        .eq("usuario_id", usuariocolegio.usuario_id)
        .single();
      if (errorUsuario || !dataUsuario) {
        throw new Error("El Usuario no existe");
      }
      const { data: dataRol, error: errorRol } = await client
        .from("roles")
        .select("*")
        .eq("rol_id", usuariocolegio.rol_id)
        .single();
      if (errorRol || !dataRol) {
        throw new Error("El rol no existe");
      }
      if (validationError) {
        responseSent = true;
        throw new Error(validationError.details[0].message);
      }
      if (!responseSent) {
        const usuariocolegioCreado = await dataService.processData(
          usuariocolegio
        );
        res.status(201).json(usuariocolegioCreado);
      }
    } catch (error) {
      res.status(500).json(error);
    }
  },
  async actualizar(req: Request, res: Response) {
    try {
      const usuariocolegioId = parseInt(req.params.id);

      const usuariocolegio = new UsuarioColegio();
      Object.assign(usuariocolegio, req.body);
      usuariocolegio.actualizado_por = req.actualizado_por;
      let responseSent = false;
      const { error: validationError } = UsuarioColegioSchema.validate(
        req.body
      );
      const { data, error } = await client
        .from("colegios")
        .select("*")
        .eq("colegio_id", usuariocolegio.colegio_id)
        .single();
      if (error || !data) {
        throw new Error("El colegio no existe");
      }
      const { data: dataUsuario, error: errorUsuario } = await client
        .from("usuarios")
        .select("*")
        .eq("usuario_id", usuariocolegio.usuario_id)
        .single();
      if (errorUsuario || !dataUsuario) {
        throw new Error("El Usuario no existe");
      }
      const { data: dataRol, error: errorRol } = await client
        .from("roles")
        .select("*")
        .eq("rol_id", usuariocolegio.rol_id)
        .single();
      if (errorRol || !dataRol) {
        throw new Error("El rol no existe");
      }
      if (validationError) {
        responseSent = true;
        throw new Error(validationError.details[0].message);
      }
      if (!responseSent) {
        const resultado = await dataService.updateById(
          usuariocolegioId,
          usuariocolegio
        );
        res.status(200).json(resultado);
      }
    } catch (error) {
      res.status(500).json(error);
    }
  },
  async eliminar(req: Request, res: Response) {
    try {
      const usuariocolegioId = parseInt(req.params.id);
      await dataService.deleteById(usuariocolegioId);
      res.status(200).json({ message: "UsuarioColegio eliminado" });
    } catch (error) {
      res.status(500).json(error);
    }
  },
};
