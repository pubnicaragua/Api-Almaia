/* eslint-disable @typescript-eslint/no-explicit-any */
import SupabaseClient from "@supabase/supabase-js/dist/module/SupabaseClient";
import { SupabaseClientService } from "./supabaseClient";
import { addDays, differenceInCalendarDays, isAfter, isBefore } from "date-fns";
import { AlertStats } from "../modelo/home/AlertStats";
import { AlertaMapeada } from "../modelo/alerta/AlertaMapeada";
import { DonutData } from "../modelo/dashboard/DonutData";

export class AlertasServicioCasoUso {
  private supabaseService: SupabaseClientService;
  private client: SupabaseClient;
  constructor() {
    this.supabaseService = new SupabaseClientService();
    this.client = this.supabaseService.getClient();
  }
  async getAlertStatsByType(
    alertTypeId: number,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    daysToExpire: number = 3
  ): Promise<AlertStats> {
    const now = new Date();
    const { data: alertas_tipos, error: error_alertas_tipos } =
      await this.client
        .from("alertas_tipos")
        .select("*")
        .eq("alerta_tipo_id", alertTypeId)
        .single();
    const tiempo_gestion = alertas_tipos?.tiempo_resolucion ?? 0;
    if (error_alertas_tipos)
      throw new Error(`Error obteniendo alertas tipo ${alertTypeId}`);
    const expirationThreshold = addDays(now, tiempo_gestion);

    // Obtener todas las alertas del tipo especificado
    const { data: alertas, error } = await this.client
      .from("alumnos_alertas")
      .select("*")
      .eq("alertas_tipo_alerta_tipo_id", alertTypeId);

    if (error) throw new Error(`Error obteniendo alertas tipo ${alertTypeId}`);

    const stats: AlertStats = {
      totales: 0,
      activos: 0,
      vencidos: 0,
      por_vencer: 0,
    };

    if (!alertas) return stats;

    stats.totales = alertas.length;
    const diasAntesDeVencer = 3;

    alertas.forEach((alerta) => {
      const fechaVencimiento =
        alerta.fecha_resolucion === null
          ? new Date()
          : new Date(alerta.fecha_resolucion);

      if (alerta.estado.toLowerCase() === "resuelto") {
        return; // No contar alertas ya resueltas
      }

      stats.activos++;

      if (isAfter(now, fechaVencimiento)) {
        stats.vencidos++;
      } else if (isBefore(fechaVencimiento, expirationThreshold)) {
        const diferenciaDias = differenceInCalendarDays(fechaVencimiento, now);
        if (diferenciaDias <= diasAntesDeVencer && diferenciaDias >= 0) {
          stats.por_vencer++;
        }
      }
    });

    return stats;
  }

  async getAlertasDonutData(): Promise<DonutData[]> {
    const { data, error } = await this.client
      .from("alumnos_alertas")
      .select("estado");

    if (error) throw error;

    // Contar ocurrencias por estado
    const counts: Record<string, number> = {};
    data.forEach(({ estado }) => {
      const key = estado.toLowerCase();
      counts[key] = (counts[key] || 0) + 1;
    });

    const total = Object.values(counts).reduce((a, b) => a + b, 0);

    const donutData: DonutData[] = Object.entries(counts).map(
      ([estado, value]) => ({
        label: `${String(value).padStart(2, "0")} ${estadoLabels[estado]}`,
        value,
        percentage: `${((value / total) * 100).toFixed(1)}%`,
        color: colores[estado] || "#000000",
      })
    );

    return donutData;
  }
}
export function mapearAlertas(alertas: any[]): AlertaMapeada[] {
  return alertas.map((alerta) => {
    const { ...rest } = alerta;
    return {
      ...rest,
      persona_responsable_actual: alerta.personas,
    };
  });
}
export function mapearAlertaDetalle(alertas: any[]): any[] {
  console.log(alertas);

  return alertas.map((alerta) => {
    const { ...rest } = alerta;
    return {
      id: rest.alumno_alerta_id,
      student: {
        name: `${rest.alumnos.personas.nombres} ${rest.alumnos.personas.apellidos}`,
        course: rest.alumnos?.alumnos_cursos[0]?.cursos?.nombre_curso, // Este dato no está en la estructura original, se asume
        image: rest.alumnos.url_foto_perfil,
      },
      generationDate: new Date(rest.fecha_generada).toLocaleDateString("es-CL"),
      generationTime: new Date(rest.fecha_generada).toLocaleTimeString(
        "es-CL",
        { hour: "2-digit", minute: "2-digit" }
      ),
      responsible: {
        name: `${rest?.personas?.nombres || " "} ${
          rest?.personas?.apellidos || " "
        }`,
        role: rest?.personas?.usuarios[0]?.roles?.nombre, // Este dato no está en la estructura original, se asume
        image: rest.personas?.usuarios[0]?.url_foto_perfil || " ", // Este dato no está en la estructura original, se asume
      },
      isAnonymous: rest.alerta_origen_id === 1, // Asumiendo que 1 significa anónimo
      description: `Alerta generada por ${rest.alertas_reglas.nombre} con severidad ${rest.alertas_severidades.nombre}`,
      actions: rest.accion_tomada
        ? [
            {
              fecha: new Date(rest.fecha_actualizacion).toLocaleDateString(
                "es-CL"
              ),
              hora: new Date(rest.fecha_actualizacion).toLocaleTimeString(
                "es-CL",
                { hour: "2-digit", minute: "2-digit", hour12: true }
              ),
              usuarioResponsable: `${rest.personas.nombres} ${rest.personas.apellidos}`,
              accionRealizada: new Date(rest.accion_tomada).toLocaleDateString(
                "es-CL"
              ),
              fechaCompromiso: rest.fecha_generada,
              observaciones: "Acción registrada en el sistema",
            },
          ]
        : [],
    };
  });
}
const colores: Record<string, string> = {
  pendiente: "#facc15",
  nuevo: "#22c55e",
  atendido: "#3b82f6",
  aplazado: "#a855f7",
};

const estadoLabels: Record<string, string> = {
  pendiente: "Pendientes",
  nuevo: "Nuevos",
  atendido: "Atendidos",
  aplazado: "Aplazados",
};
