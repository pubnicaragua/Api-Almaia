/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import { SupabaseClientService } from "../../../core/services/supabaseClient";
import { AuditoriaesService } from "./AuditoriaService";
import { createClient, AuthApiError, SupabaseClient } from "@supabase/supabase-js"; // Asegúrate de importar esto si no está
// Interfaz para credenciales
import Joi from "joi";
// Inicializar Supabase client
const supabaseService = new SupabaseClientService();


const client: SupabaseClient = supabaseService.getClient();
// Servicio de autenticación
export const AuthService = {
  async login(req: Request, res: Response) {
    const { email, password } = req.body;
    try {
      // Autenticar al usuario en Supabase Auth
      const { data: authData, error: authError } =
        await client.auth.signInWithPassword({
          email,
          password,
        });


      if (authError || !authData.user) {
        req.body = {
          isSend: false,
          tipo_auditoria_id: 1,
          colegio_id: 0,
          usuario_id: 0,
          fecha: new Date().toISOString(),
          descripcion: `Error de inicio de sesión para el usuario ${email}`,
          modulo_afectado: "auth",
          accion_realizada: "login",
          ip_origen: req.connection.remoteAddress || req.ip,
          referencia_id: 0, // Puedes ajustar esto según tu lógica
          model: "Usuarios",
        };
        await AuditoriaesService.guardar(req, res);
        throw new Error(authError?.message || "Autenticación fallida");
      }

      // Buscar el usuario en la tabla usuarios por email
      const { data: userData, error: userError } = await client
        .from("usuarios")
        .select(`
          usuario_id,
          intentos_inicio_sesion
          `)
        .eq("email", email)
        .single();

      if (userError) {
        console.error("[Auth] Error al buscar usuario:", userError);
      } else if (userData) {
        // Actualizar intentos de inicio de sesión y última fecha
        const { error: updateError } = await client
          .from("usuarios")
          .update({
            intentos_inicio_sesion: (userData.intentos_inicio_sesion || 0) + 1,
            ultimo_inicio_sesion: new Date(),
            fecha_actualizacion: new Date(),
            activo: true,
          })
          .eq("usuario_id", userData.usuario_id);

        req.body = {
          isSend: false,
          tipo_auditoria_id: 3,
          colegio_id: 0,
          usuario_id: userData.usuario_id,
          descripcion: `Inicio de sesión exitoso para el usuario ${email}`,
          fecha: new Date().toISOString(),
          modulo_afectado: "auth",
          accion_realizada: "login",
          ip_origen: req.connection.remoteAddress || req.ip,
          referencia_id: 2, // Puedes ajustar esto según tu lógica
          model: "Usuarios",
        };
        await AuditoriaesService.guardar(req, res);
        if (updateError) {
          console.error("Error al actualizar datos de login:", updateError);
        }
      }

      res.status(200).json({
        token: authData.session?.access_token || "",
      });
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Error desconocido";
      res.status(500).json({
        message: "Credenciales incorrectas:" + errorMessage,
        error: errorMessage,
      });
    }
  },

  async register(req: Request, res: Response) {
    const { email, password } = req.body;

    // Validación básica
    if (!email || !password) {
      res.status(400).json({ message: "Email y contraseña son requeridos." });
    }

    try {
      const { data, error } = await client.auth.signUp({
        email,
        password,
      });

      if (error) {
        res.status(400).json({ message: error.message });
      }

      res.status(200).json({
        message:
          "Usuario registrado exitosamente. Revisa tu correo para confirmar.",
        user: data.user,
      });
    } catch (err: any) {
      console.error("Error en el registro:", err);
      const message =
        err instanceof AuthApiError
          ? err.message
          : "Error interno del servidor";
      res.status(500).json({ message });
    }
  },


  async RestorePassword(req: Request, res: Response) {
    try {
      const passwordSchema = Joi.object({
        email: Joi.string().email().required(), // O usa email si lo prefieres
        newPassword: Joi.string().min(4).required(),
        pass: Joi.string().min(4).required(),
      });
      const { error, value } = passwordSchema.validate(req.body);

      if (error) {
        throw new Error(error.details[0].message);
      }
      const { email, newPassword, pass } = value;

      const admin = createClient(process.env.SUPABASE_HOST || '', process.env.SUPABASE_PASSWORD_ADMIN || '');

      const { data: usuario } = await admin.from("view_auth_users").select("*").eq("email", email).single();
      if (!usuario) throw new Error("Usuario no encontrado");

      const { data, error: updateError } = await admin.auth.admin.updateUserById(usuario.id, {
        password: newPassword,
      });
      if (updateError) throw new Error(updateError.message);

      res.status(200).json({
        message: "Contraseña actualizada correctamente",
        data: data,
      });
    } catch (err: any) {
      console.error("Error inesperado:", err);
      res.status(400).json({
        message: "Error al actualizar la contraseña",
        error: err.message || "Error interno del servidor",
      });
    }
  },
  async updatePassword(req: Request, res: Response) {
    try {
      const UUID = req?.user?.auth_id;
      const EMAIL = req?.user?.email;
      if (!UUID || !EMAIL) {
        throw new Error('Usuario no autorizado');
      };

      const admin = createClient(process.env.SUPABASE_HOST || '', process.env.SUPABASE_PASSWORD_ADMIN || '');
      
      const passwordSchema = Joi.object({
        newPassword: Joi.string().min(4).required(),
        currentPassword: Joi.string().min(4).required(),
      });

      const { error: schemeError, value: body } = passwordSchema.validate(req.body);
      const { newPassword, currentPassword } = body;

      if (schemeError) {
        throw new Error(schemeError.details[0].message);
      }
      // Intentar loguear al usuario con la contraseña actual
      const { data: DataPassword, error: ErrorLoginWithPassword } = await admin.auth.signInWithPassword({
        email: EMAIL,
        password: currentPassword
      });
      //si no se puede loguear con la contraseña actual, lanzar error
      if (ErrorLoginWithPassword) {
        throw new Error("Contraseña incorrecta");
      }

      //si la contraseña actual es correcta, actualizar la contraseña

      const { data, error: updateError } = await admin.auth.admin.updateUserById(UUID, {
        password: newPassword,
      });

      if (updateError) {
        throw new Error(updateError.message);
      }
      res.status(200).json({
        message: "Contraseña actualizada correctamente",
        data: data,
      });
    } catch (err: any) {
      console.error("Error inesperado:", err);
      res.status(400).json({
        message: "Error al actualizar la contraseña",
        error: err.message || "Error interno del servidor",
      });
    }
  },

};
