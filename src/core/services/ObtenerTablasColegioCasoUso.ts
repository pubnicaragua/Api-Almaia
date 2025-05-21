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
}: GenericFilterOptions) {
  // 1) Obtener los registros filtrados para sacar los IDs
  const { data: registrosFiltrados, error: errorFiltrado } = await client
    .from(tableFilter)
    .select("*")
    .eq(filterField, filterValue);

  if (errorFiltrado) {
    throw new Error(`Error consultando ${tableFilter}: ${errorFiltrado.message}`);
  }

  const ids = registrosFiltrados?.map((r: any) => r[idField]) ?? [];

  if (ids.length === 0) {
    // No hay registros que coincidan
    return [];
  }

  // 2) Consulta con `.in()` usando esos IDs y selectFields
  const { data: datosRelacionados, error: errorRelacionados } = await client
    .from(tableIn)
    .select(Array.isArray(selectFields) ? selectFields.join(",") : selectFields)
    .in(inField, ids);

  if (errorRelacionados) {
    throw new Error(`Error consultando ${tableIn}: ${errorRelacionados.message}`);
  }

  return datosRelacionados;
}