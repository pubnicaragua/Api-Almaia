import { SupabaseClient } from "@supabase/supabase-js";
import Joi from "joi";
import { SupabaseClientService } from "../../../core/services/supabaseClient";
import { Usuario } from "../../../core/modelo/auth/Usuario";
import { DataService } from "../DataService";
import { Request, Response } from "express";
import { Persona } from "../../../core/modelo/Persona";
import {
  extractBase64Info,
  getExtensionFromMime,
  getURL,
  isBase64DataUrl,
} from "../../../core/services/ImagenServiceCasoUso";
import { randomUUID } from "crypto";

const supabaseService = new SupabaseClientService();
const client: SupabaseClient = supabaseService.getClient();
const UsuarioSchema = Joi.object({
  nombre_social: Joi.string().max(50).required(),
  email: Joi.string().max(150).required(),
  encripted_password: Joi.string().max(35).required(),
  rol_id: Joi.number().integer().required(),
  telefono_contacto: Joi.string().max(150).required(),
  url_foto_perfil: Joi.string().max(255).required(),
  persona_id: Joi.number().integer().required(),
  idioma_id: Joi.number().integer().required(),
});
const UsuarioUpdateSchema = Joi.object({
  nombre_social: Joi.string().max(50).required(),
  email: Joi.string().max(150).required(),
  encripted_password: Joi.string().max(35).optional(),
  nombres: Joi.string().max(35).optional(),
  apellidos: Joi.string().max(35).optional(),
  rol_id: Joi.number().integer().required(),
  telefono_contacto: Joi.string().max(150).required(),
  url_foto_perfil: Joi.string().required(),
  persona_id: Joi.number().integer().optional(),
  idioma_id: Joi.number().integer().required(),
});
const dataService: DataService<Usuario> = new DataService(
  "usuarios",
  "usuario_id"
);
const dataPersonaService: DataService<Persona> = new DataService(
  "personas",
  "persona_id"
);
export const UsuariosService = {
  async obtener(req: Request, res: Response) {
    try {
      dataService.setClient(req.supabase)
      const usuarios = await dataService.getAll(
        [
          "*",
          "roles(rol_id,nombre)",
          "personas(persona_id,nombres,apellidos)",
          "idiomas(idioma_id,nombre)",
        ],
        req.query
      );
      res.json(usuarios);
    } catch (error) {
      res.status(500).json(error);
    }
  },

  async guardar(req: Request, res: Response) {
    try {
      const usuario = new Usuario();
      Object.assign(usuario, req.body);
      usuario.creado_por = req.creado_por;
      usuario.actualizado_por = req.actualizado_por;
      const email = usuario.email;
      const password = usuario.encripted_password;
      const { data: dataAuth, error: errorAuth } = await client.auth.signUp({
        email,
        password,
      });

      if (errorAuth) {
        res.status(400).json({ message: errorAuth.message });
      }
      usuario.auth_id = dataAuth.user?.id;
      let responseSent = false;
      const { error: validationError } = UsuarioSchema.validate(req.body);
      const { data, error } = await client
        .from("roles")
        .select("*")
        .eq("rol_id", usuario.rol_id)
        .single();
      if (error || !data) {
        throw new Error("El rol no existe");
      }
      const { data: dataPersona, error: errorPersona } = await client
        .from("personas")
        .select("*")
        .eq("persona_id", usuario.persona_id)
        .single();
      if (errorPersona || !dataPersona) {
        throw new Error("La persona no existe");
      }
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
        const usuarioCreado = await dataService.processData(usuario);
        res.status(201).json(usuarioCreado);
      }
    } catch (error) {
      res.status(500).json(error);
    }
  },
  async actualizar(req: Request, res: Response) {
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
      usuario.creado_por = dataUsuario.creado_por;
      usuario.actualizado_por = req.actualizado_por;

      if (isBase64DataUrl(usuario.url_foto_perfil || " ")) {
        const { mimeType, base64Data } = extractBase64Info(
          usuario.url_foto_perfil || " "
        );
        const buffer = Buffer.from(base64Data, "base64");
        const extension = getExtensionFromMime(mimeType);
        const fileName = `${randomUUID()}.${extension}`;
        const client_file = req.supabase;

        const { data, error } = await client_file.storage
          .from("user-profile")
          .upload(`private/${fileName}`, buffer, {
            contentType: mimeType,
            upsert: true,
          });
        if (error) throw error;
        usuario.url_foto_perfil = getURL(client_file,'user-profile',data.fullPath);
      }

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
            console.log('url',usuario.url_foto_perfil);

        await dataService.updateById(usuarioId, usuario);
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
  async generar_clave(req: Request, res: Response) {
    try {
      const usuarioId = parseInt(req.params.id);
      const { clave } = req.body;
      if (!clave) {
        throw new Error("La clave es requerida.");
      }
      const { error } = await client
        .from("usuarios")
        .update({ clave_generada: clave })
        .eq("usuario_id", usuarioId);

      if (error) {
        throw new Error(error.message);
      }

      res.status(200).json({ message: "clave generada con exito" });
    } catch (err) {
      const error = err as Error;
      console.error("Error al guardar el motoralerta:", error);
      res.status(500).json({ message: error.message || "Error inesperado" });
    }
  },

  async eliminar(req: Request, res: Response) {
    try {
      const usuarioId = parseInt(req.params.id);
      await dataService.deleteById(usuarioId);
      res.status(200).json({ message: "Usuario eliminado" });
    } catch (error) {
      res.status(500).json(error);
    }
  },
};
