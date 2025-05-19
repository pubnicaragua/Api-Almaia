/* eslint-disable @typescript-eslint/no-explicit-any */
import SupabaseClient from "@supabase/supabase-js/dist/module/SupabaseClient";
import { SupabaseClientService } from "./supabaseClient";
import { formatISO, startOfDay } from "date-fns";

export class AlumnoServicioCasoUso {
  private supabaseService: SupabaseClientService;
  private client: SupabaseClient;
  private id_colegio = 0;
  constructor(id_colegio: number) {
    this.supabaseService = new SupabaseClientService();
    this.client = this.supabaseService.getClient();
    this.id_colegio = id_colegio;
  }
  async obtenerAlumnosColegio() {
    const query = this.client
      .from("alumnos")
      .select("*")
      .eq("colegio_id", this.id_colegio);
    const { data, error } = await query;
    if (error) {
      throw new Error(`Error obteniendo  alumnos por colegio: ${error.message}`);
    }
    return data;
  }
  async obtenerCantidadAlumnos(colegioId: number) {
    const { count, error } = await this.client
      .from("alumnos")
      .select("*", { count: "exact", head: true })
      .eq("colegio_id", colegioId);
    if (error) {
      throw new Error(`Error obteniendo count de alumnos: ${error.message}`);
    }

    return count ?? 0;
  }
  async obntenerConteoporTabla(table: string, dateFilter: string) {
    const { count, error } = await this.client
      .from(table)
      .select("*", { count: "exact", head: true })
      .gte("fecha_creacion", dateFilter);

    if (error) throw new Error(`Error obteniendo count de ${table}`);
    return count ?? 0;
  }

  async calcularAlumnosActivos(sevenDaysAgo: string) {
    const [respuestasTexto, respuestasSeleccion] = await Promise.all([
      this.client
        .from("alumnos_respuestas")
        .select("alumno_id, fecha_creacion")
        .gte("fecha_creacion", sevenDaysAgo),
      this.client
        .from("alumno_respuesta_seleccion")
        .select("alumno_id, fecha_creacion")
        .gte("fecha_creacion", sevenDaysAgo),
    ]);

    return [
      ...(respuestasTexto.data ?? []),
      ...(respuestasSeleccion.data ?? []),
    ];
  }

  calcularAlumnosFrecuentes(responses: any[]) {
    const actividadPorAlumno: Record<number, Set<string>> = {};

    responses.forEach((resp) => {
      const alumnoId = resp.alumno_id;
      const fecha = formatISO(startOfDay(new Date(resp.fecha_creacion)), {
        representation: "date",
      });

      if (!actividadPorAlumno[alumnoId]) {
        actividadPorAlumno[alumnoId] = new Set();
      }

      actividadPorAlumno[alumnoId].add(fecha);
    });

    return Object.values(actividadPorAlumno).filter((dias) => dias.size >= 3)
      .length;
  }

  buildStatsResponse(
    totalAlumnos: number,
    alumnosActivos: number,
    alumnosFrecuentes: number,
    alumnosSeleccion: number
  ) {
    return {
      alumnos: {
        activos: alumnosActivos,
        inactivos: alumnosActivos - totalAlumnos,
        frecuentes: alumnosFrecuentes,
        totales: totalAlumnos + alumnosSeleccion,
      },
      sos_alma: {
        activos: 5,
        vencidos: 0,
        por_vencer: 2,
        totales: 13,
      },
      denuncias: {
        activos: 19,
        vencidos: 0,
        por_vencer: 3,
        totales: 24,
      },
      alertas_alma: {
        activos: 57,
        vencidos: 0,
        por_vencer: 6,
        totales: 82,
      },
    };
  }
}
