/* eslint-disable @typescript-eslint/no-explicit-any */
import { SupabaseClient } from "@supabase/supabase-js";
import { GenericFilterOptions } from "../modelo/GenericFilterOptions";
import { SupabaseClientService } from "./supabaseClient";
const supabaseService = new SupabaseClientService();
const client: SupabaseClient = supabaseService.getClient();
export async function obtenerRelacionados({  
  tableFilter,  
  filterField,  
  filterValue,  
  idField,  
  tableIn,  
  inField,  
  selectFields,  
  orderBy, // Nuevo parámetro opcional  
}: GenericFilterOptions & { orderBy?: { field: string, ascending: boolean } }) {  
  // 1) Obtener los registros filtrados para sacar los IDs  
  const { data: registrosFiltrados, error: errorFiltrado } = await client  
    .from(tableFilter)  
    .select("*")  
    .eq(filterField, filterValue)  
    .eq("activo", true);  
    
  if (errorFiltrado) {  
    throw new Error(  
      `Error consultando ${tableFilter}: ${errorFiltrado.message}`  
    );  
  }  
  
  const ids = registrosFiltrados?.map((r: any) => r[idField]) ?? [];  
  
  if (ids.length === 0) {  
    // No hay registros que coincidan  
    return [];  
  }  
  
  // 2) Consulta con `.in()` usando esos IDs y selectFields con ordenamiento opcional  
  let query = client  
    .from(tableIn)  
    .select(Array.isArray(selectFields) ? selectFields.join(",") : selectFields)  
    .eq("activo", true)  
    .in(inField, ids);  
  
  // Solo aplicar ordenamiento si se proporciona el parámetro  
  console.log('ordenar',orderBy);
  
  if (orderBy) {  
    query = query.order(orderBy.field, { ascending: orderBy.ascending });  
  }  
  
  const { data: datosRelacionados, error: errorRelacionados } = await query;  
  
  if (errorRelacionados) {  
    throw new Error(  
      `Error consultando ${tableIn}: ${errorRelacionados.message}`  
    );  
  }  
  
  return datosRelacionados;  
}
