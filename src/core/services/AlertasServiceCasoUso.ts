import SupabaseClient from "@supabase/supabase-js/dist/module/SupabaseClient";
import { SupabaseClientService } from "./supabaseClient";
import { addDays, differenceInCalendarDays, isAfter, isBefore } from "date-fns";
import { AlertStats } from "../modelo/home/AlertStats";

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
}
