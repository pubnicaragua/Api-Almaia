/* eslint-disable @typescript-eslint/no-explicit-any */
import { SupabaseClient } from "@supabase/supabase-js";
import { SupabaseClientService } from "./supabaseClient";

const supabaseService = new SupabaseClientService();
const client: SupabaseClient = supabaseService.getClient();
export async function obtenerIdColegio(colegio_id: any, usuario_id: number) {
  if (colegio_id === undefined || colegio_id === 0) {
    const { data: usuario_colegio, error } = await client
      .from("usuarios_colegios")
      .select("colegio_id")
      .eq("usuario_id", usuario_id); // Permite que no haya ningún resultado
    if (error) {
      throw new Error(error.message);
    }

    if (usuario_colegio) {
      colegio_id = usuario_colegio[0]?.colegio_id;
    }
  }
console.log(colegio_id);

  return colegio_id;
}