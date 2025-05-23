import { Request, Response, NextFunction } from "express";
import { SupabaseClientService } from "../core/services/supabaseClient";
import { SupabaseClient } from "@supabase/supabase-js";
import { getSecret, loginToVault } from "../core/services/valutClient";
let client: SupabaseClient;
interface ClientSupabase {
  host: string;
  password: string;
}
(async () => {
  const token = await loginToVault();
  if (!token) {
    console.error("❌ No se pudo autenticar con Vault.");
    return;
  }

  const secret = await getSecret(token, "secret/data/database");
  if (!secret) {
    console.error("❌ No se pudo obtener el secreto.");
    return;
  }

  const client_credential: ClientSupabase = {
    host: secret.SUPABASE_HOST!,
    password: secret.SUPABASE_PASSWORD!,
  };

  const supabaseService = new SupabaseClientService(
    client_credential.host,
    client_credential.password
  );

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

    req.userId = data.user.id;
    next();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    res.status(500).send(error.message);
  }
};
