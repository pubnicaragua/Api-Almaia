import { SupabaseClient } from "@supabase/supabase-js";
import Joi from "joi";
import { SupabaseClientService } from "../../../core/services/supabaseClient";
import { Usuario } from "../../../core/modelo/auth/Usuario";
import { DataService } from "../DataService";
import { Request, Response } from "express";

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
const dataService: DataService<Usuario> = new DataService("usuarios");
export const UsuariosService = {
  async obtener(req: Request, res: Response) {
    try {
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
      const email = usuario.email
      const password = usuario.encripted_password
       const { data:dataAuth, error:errorAuth } = await client.auth.signUp({
       email,
        password,
      });

      if (errorAuth) {
         res.status(400).json({ message: errorAuth.message });
      }
      usuario.auth_id= dataAuth.user?.id
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
      Object.assign(usuario, req.body);
      usuario.actualizado_por = req.actualizado_por;
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
        const resultado = await dataService.updateById(usuarioId, usuario);
        res.status(200).json(resultado);
      }
    } catch (error) {
      res.status(500).json(error);
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
