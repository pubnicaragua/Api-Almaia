/* eslint-disable @typescript-eslint/no-explicit-any */
import SupabaseClient from "@supabase/supabase-js/dist/module/SupabaseClient";
import { SupabaseClientService } from "./supabaseClient";
import { formatISO, startOfDay } from "date-fns";

export class AlumnoServicioCasoUso {
  private supabaseService: SupabaseClientService;
  private client: SupabaseClient;
  constructor() {
    this.supabaseService = new SupabaseClientService();
    this.client = this.supabaseService.getClient();
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
        inactivos: totalAlumnos - alumnosActivos,
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
