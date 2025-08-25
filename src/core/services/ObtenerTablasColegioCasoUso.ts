/* eslint-disable @typescript-eslint/no-explicit-any */
import { SupabaseClient } from "@supabase/supabase-js";
import { GenericFilterOptions } from "../modelo/GenericFilterOptions";
import { SupabaseClientService } from "./supabaseClient";
const supabaseService = new SupabaseClientService();
const client: SupabaseClient = supabaseService.getClient();
const CHUNK = 1000; // límite práctico de Supabase/PostgREST
export async function obtenerRelacionados({
  tableFilter,
  filterField,
  filterValue,
  idField,
  tableIn,
  inField,
  selectFields,
  orderBy,
  includeInactive = false, // nuevo flag
}: GenericFilterOptions & { orderBy?: { field: string; ascending: boolean }; includeInactive?: boolean }) {
  // 1) Obtener todos los IDs en chunks (no traer todo a la vez)
  let ids: any[] = [];
  let from = 0;
  while (true) {
    let q = client
      .from(tableFilter)
      .select(idField, { count: "exact" }) // Agregar conteo exacto
      .eq(filterField, filterValue)
      .range(from, from + CHUNK - 1);

    if (!includeInactive) q = q.eq("activo", true);

    const { data: page, error, count } = await q;
    if (error) throw new Error(`Error consultando ${tableFilter}: ${error.message}`);

    console.log(`Chunk desde ${from} hasta ${from + CHUNK - 1}:`, page?.length, "de", count); // Depuración

    if (!page || page.length === 0) break;

    ids = ids.concat(page.map((r: any) => r[idField]));
    if (page.length < CHUNK) break;
    from += CHUNK;
  }

  if (ids.length === 0) return [];

  // 2) Obtener los registros relacionados usando .in() en chunks
  const select = Array.isArray(selectFields) ? selectFields.join(",") : selectFields;
  let resultados: any[] = [];

  for (let i = 0; i < ids.length; i += CHUNK) {
    const chunk = ids.slice(i, i + CHUNK);
    let q2 = client.from(tableIn).select(select).in(inField, chunk);
    if (!includeInactive) q2 = q2.eq("activo", true);

    const { data: datosChunk, error: errorRelacionados } = await q2;
    if (errorRelacionados) throw new Error(`Error consultando ${tableIn}: ${errorRelacionados.message}`);

    console.log(`Chunk relacionado desde ${i} hasta ${i + CHUNK - 1}:`, datosChunk?.length); // Depuración

    if (Array.isArray(datosChunk)) resultados = resultados.concat(datosChunk);
  }

  // 3) Ordenar en memoria si el caller solicitó orderBy
  if (orderBy && resultados.length > 0) {
    const field = orderBy.field;
    const asc = orderBy.ascending;
    resultados.sort((a: any, b: any) => {
      const va = a?.[field];
      const vb = b?.[field];
      if (va == null && vb == null) return 0;
      if (va == null) return 1;
      if (vb == null) return -1;
      if (typeof va === "number" && typeof vb === "number") return (va - vb) * (asc ? 1 : -1);
      return String(va).localeCompare(String(vb)) * (asc ? 1 : -1);
    });
  }

  return resultados;
}
