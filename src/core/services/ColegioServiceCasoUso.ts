import { SupabaseClient } from "@supabase/supabase-js";
import { SupabaseClientService } from "./supabaseClient";

const supabaseService = new SupabaseClientService();
const client: SupabaseClient = supabaseService.getClient();
export async function obtenerIdColegio(colegio_id:number,usuario_id:number){
 if (colegio_id !== undefined || colegio_id ==0) {
        const { data: usuario_colegio, error: errorUsuario_colegio } =
          await client
            .from("usuarios_colegios")
            .select("colegio_id")
            .eq("usuario_id", usuario_id)
            .single();
            if (errorUsuario_colegio) {
              throw new Error(errorUsuario_colegio.message);
            }
            colegio_id = usuario_colegio.colegio_id
      }
      return colegio_id
}