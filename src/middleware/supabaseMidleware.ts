/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response, NextFunction } from "express";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
const { SUPABASE_HOST, SUPABASE_PASSWORD, SUPABASE_PASSWORD_ADMIN } = process.env;

export const sessionAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      throw new Error("No token provided");
    }
    if (!SUPABASE_HOST || !SUPABASE_PASSWORD || !SUPABASE_PASSWORD_ADMIN) {
      throw new Error("Faltan variables de entorno de Supabase");
    }
    // 🔐 Crea cliente con token embebido
    const client: SupabaseClient = createClient(
      SUPABASE_HOST,
      SUPABASE_PASSWORD,
      {
        global: {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      }
    );

    const admin: SupabaseClient = createClient(
      SUPABASE_HOST,
      SUPABASE_PASSWORD_ADMIN,
      {
        global: {
          headers: {

            Authorization: `Bearer ${token}`,
          },
        },
      }
    );

    const { data, error } = await client.auth.getUser();
    if (error || !data?.user) {
      throw new Error("Invalid token");
    }

    const { data: data_user, error: error_user } = await client
      .from("usuarios")
      .select()
      .eq("auth_id", data.user?.id);

    if (error_user || !data_user?.[0]) {
      throw new Error("Usuario no encontrado");
    }

    req.creado_por = data_user?.[0]?.usuario_id;
    req.actualizado_por = data_user?.[0]?.usuario_id;
    req.fecha_creacion = new Date().toUTCString();
    req.user = data_user?.[0];
    req.supabase = client;
    req.supabaseAdmin = admin;
    next();
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
