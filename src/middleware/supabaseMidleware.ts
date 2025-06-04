/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response, NextFunction } from "express";
import { createClient, SupabaseClient } from "@supabase/supabase-js";

const { SUPABASE_HOST, SUPABASE_PASSWORD } = process.env;

export const sessionAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      res.status(401).json({ error: "No token provided" });
    }
    if (!SUPABASE_HOST || !SUPABASE_PASSWORD) {
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

    const { data, error } = await client.auth.getUser();
    if (error || !data?.user) {
      res.status(401).json({ error: "Invalid token" });
    }

    const { data: data_user, error: error_user } = await client
      .from("usuarios")
      .select()
      .eq("auth_id", data.user?.id);

    if (error_user || !data_user?.[0]) {
      res.status(404).json({ error: "Usuario no encontrado" });
    }

    req.creado_por = data_user?.[0]?.usuario_id;
    req.actualizado_por = data_user?.[0]?.usuario_id;
    req.fecha_creacion = new Date().toISOString();
    req.user = data_user?.[0];
    // Puedes guardar el cliente con token si lo necesitas luego:
    req.supabase = client;

    next();
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
