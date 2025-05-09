import { Request, Response, NextFunction } from "express";
import { SupabaseClientService } from "../core/services/supabaseClient";
import { SupabaseClient } from "@supabase/supabase-js";
//import { getSecret, loginToVault } from "../core/services/valutClient";
let client: SupabaseClient;
(async () => {
  const supabaseService = new SupabaseClientService();
  client = supabaseService.getClient();
})();

// Middleware para extraer el ID del usuario desde el token
export const sessionAuth = async (
  req: Request & { userId?: string },
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      throw new Error("No token provided");
    }

    if (!client) {
      throw new Error("Supabase client not initialized");
    }

    const { data, error } = await client.auth.getUser(token);

    if (error || !data?.user) {
      throw new Error("Invalid token");
    }
    await client.from("usuarios").select().eq("auth_id", data.user.id);
    const { data: data_user, error: error_user } = await client
      .from("usuarios")
      .select()
      .eq("auth_id", data.user.id); // O usa [.in(...)] si es un array

    if (error_user) {
      console.error("Error al obtener usuarios:", error_user);
    }
    req.creado_por = data_user?.[0]?.usuario_id;
    req.actualizado_por = data_user?.[0]?.usuario_id;
    req.fecha_creacion = new Date().toISOString()
    next();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    res.status(500).send(error.message);
  }
};
