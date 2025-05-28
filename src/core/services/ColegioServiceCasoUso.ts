/* eslint-disable @typescript-eslint/no-explicit-any */
import { SupabaseClient } from "@supabase/supabase-js";
import { SupabaseClientService } from "./supabaseClient";
import { contarAlertasPendientesPorColegio } from "./AlertasServiceCasoUso";
import { contarAlumnosPorColegio } from "./AlumnoServicioCasoUso";

const supabaseService = new SupabaseClientService();
const client: SupabaseClient = supabaseService.getClient();
export async function obtenerIdColegio(colegio_id: any, usuario_id: number) {
  if (colegio_id === undefined || colegio_id === 0) {
    const { data: usuario_colegio, error } = await client
      .from("usuarios_colegios")
      .select("colegio_id")
      .eq("usuario_id", usuario_id); // Permite que no haya ningún resultado
    if (usuario_colegio?.length === 0) {
      throw new Error("El usuario no posee colegio designado");
    }

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
type ColegioExtendido = {
  colegio_id: number;
  nombre: string;
  nombre_fantasia: string;
  tipo_colegio: string;
  dependencia: string;
  sitio_web: string;
  direccion: string;
  telefono_contacto: string;
  correo_electronico: string;
  creado_por: number;
  actualizado_por: number;
  fecha_creacion: string;
  fecha_actualizacion: string;
  activo: boolean;
  comuna_id: number;
  region_id: number;
  pais_id: number;
  alerts: number;
  students: number;
};





export async function mapearColegios(arrayOriginal: any): Promise<ColegioExtendido[]> {
  const supabaseService = new SupabaseClientService();
  const client: SupabaseClient = supabaseService.getClient();

  const resultados = await Promise.all(arrayOriginal.map(async (item: { colegio_id: number; colegios: { nombre: any; nombre_fantasia: any; tipo_colegio: any; dependencia: any; sitio_web: any; direccion: any; telefono_contacto: any; correo_electronico: any; comuna_id: any; region_id: any; pais_id: any; }; creado_por: any; actualizado_por: any; fecha_creacion: any; fecha_actualizacion: any; activo: any; }) => {

    return {
      colegio_id: item.colegio_id,
      nombre: item.colegios.nombre,
      nombre_fantasia: item.colegios.nombre_fantasia || "",
      tipo_colegio: item.colegios.tipo_colegio || "",
      dependencia: item.colegios.dependencia || "",
      sitio_web: item.colegios.sitio_web || "",
      direccion: item.colegios.direccion || "",
      telefono_contacto: item.colegios.telefono_contacto || "",
      correo_electronico: item.colegios.correo_electronico || "",
      creado_por: item.creado_por,
      actualizado_por: item.actualizado_por,
      fecha_creacion: item.fecha_creacion,
      fecha_actualizacion: item.fecha_actualizacion,
      activo: item.activo,
      comuna_id: item.colegios.comuna_id || 0,
      region_id: item.colegios.region_id || 0,
      pais_id: item.colegios.pais_id || 0,
      alerts: await contarAlertasPendientesPorColegio(client, item.colegio_id),
      students: await contarAlumnosPorColegio(client, item.colegio_id)
    };
  }));

  return resultados;
}

