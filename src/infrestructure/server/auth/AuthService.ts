/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import { SupabaseClientService } from "../../../core/services/supabaseClient";
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
      // Autenticar al usuario en Supabase Auth
      const { data: authData, error: authError } =
        await client.auth.signInWithPassword({
          email,
          password,
        });
      if (authError || !authData.user) {
        throw new Error(authError?.message || "Autenticación fallida");
      }
      res.status(200).json({
        token: authData.session?.access_token || "",
      });
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Error desconocido";
      res.status(500).json({
        message: "Error interno del servidor",
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

    const { data: usuario_data, error: error_usuario } = await client
      .from("usuarios")
      .select("auth_id")
      .eq("usuario_id", userId)
      .single();

    if (error_usuario || !usuario_data) {
      throw new Error(
        error_usuario?.message || "No se pudo obtener el usuario"
      );
    }

    const usuarioId = usuario_data.auth_id;

    if (!usuarioId) {
      throw new Error("El campo auth_id no está definido para este usuario");
    }

    const { data: usuarioAuth, error: errorAuth } =
      await req.supabaseAdmin.auth.admin.getUserById(usuarioId);

    if (errorAuth || !usuarioAuth) {
      throw new Error(
        errorAuth?.message || "No se encontró el usuario en Supabase Auth"
      );
    }

    if (usuarioAuth.user.app_metadata.provider !== "email") {
      throw new Error(
        "El usuario no fue creado con email y no permite actualizar contraseña"
      );
    }

    const { data, error: errorUpdate } =
      await req.supabaseAdmin.auth.admin.updateUserById(usuarioId, {
        password: newPassword,
      });

    if (errorUpdate) {
      throw new Error(errorUpdate.message);
    }

    res.status(200).json({
      message: "Contraseña actualizada correctamente",
      user: data,
    });

  } catch (err: any) {
    console.error("Error inesperado:", err);
    res.status(400).json({
      message: "Error al actualizar la contraseña",
      error: err.message || "Error interno del servidor",
    });
  }
}

};
