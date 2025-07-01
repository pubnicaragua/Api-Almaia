/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import { SupabaseClientService } from "../../../core/services/supabaseClient";
import { AuditoriaesService } from "./AuditoriaService";
import { AuthApiError, SupabaseClient } from "@supabase/supabase-js"; // Asegúrate de importar esto si no está

// Interfaz para credenciales
import Joi from "joi";
const PasswordSchema = Joi.object({
  currentPassword: Joi.string().min(6).required(),
  newPassword: Joi.string().min(6).required(),
  token: Joi.string().min(6).required(),
  refreshToken: Joi.string().min(6).required(),
  confirmPassword: Joi.string().valid(Joi.ref("newPassword")).required(),
});
// Inicializar Supabase client
const supabaseService = new SupabaseClientService();


const client: SupabaseClient = supabaseService.getClient();
// Servicio de autenticación
export const AuthService = {
  async login(req: Request, res: Response) {
    const { email, password } = req.body;
    try {
      // console.log('Intentando iniciar sesión con:', email);
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
          fecha: new Date().toLocaleString(),
          descripcion: `Error de inicio de sesión para el usuario ${email}`,
          modulo_afectado: "auth",
          accion_realizada: "login",
          ip_origen: req.ip,
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

        console.log("Datos del usuario:", userData);  

      if (userError) {
        console.error("Error al buscar usuario:", userError);
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
          fecha: new Date().toLocaleString(),
          modulo_afectado: "auth",
          accion_realizada: "login",
          ip_origen: req.ip,
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

  async changePassword(req: Request, res: Response) {
    let responseSent = false; // Bandera para rastrear si se envió una respuesta

    try {
      // Validar la estructura de la solicitud
      const { error: validationError, value } = PasswordSchema.validate(
        req.body
      );

      if (validationError) {
        res.status(400).json({ error: validationError.details[0].message });
        responseSent = true; // Marcar respuesta como enviada
      }

      if (!responseSent) {
        // Establecer la sesión con Supabase
        const { error: setSessionError } = await client.auth.setSession({
          access_token: value.token,
          refresh_token: value.refreshToken,
        });

        if (setSessionError) {
          res.status(400).json({ error: setSessionError.message });
          responseSent = true; // Marcar respuesta como enviada
        }

        if (!responseSent) {
          // Cambiar la contraseña del usuario
          const { data: updateData, error: passwordError } =
            await client.auth.updateUser({
              password: value.newPassword,
            });

          if (passwordError) {
            res.status(400).json({ error: passwordError.message });
            responseSent = true; // Marcar respuesta como enviada
          }

          if (!responseSent) {
            // Respuesta exitosa
            res.status(200).json({
              message: "Contraseña cambiada exitosamente.",
              user: updateData,
            });
            responseSent = true; // Marcar respuesta como enviada
          }
        }
      }
    } catch (err) {
      if (!responseSent) {
        res.status(500).json({
          error: "Error interno del servidor.",
          details: (err as Error).message || "Ocurrió un error desconocido.",
        });
      }
    }
  },
  async updatePassword(req: Request, res: Response) {
    try {
      const { userId, newPassword } = req.body;
      if (!userId || !newPassword) {
        throw new Error("userId y newPassword son requeridos");
      }
      const { data: usuarioData, error: userError } = await client
        .from("usuarios")
        .select("email, auth_id")
        .eq("usuario_id", userId)
        .single();
      if (userError || !usuarioData) {
        throw new Error(userError?.message || "No se pudo obtener el usuario");
      }
      const { data, error: updateError } = await client.rpc(
        "cambiar_contrasena",
        {
          p_email: usuarioData.email,
          p_nueva_contrasena: newPassword,
        }
      );
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
