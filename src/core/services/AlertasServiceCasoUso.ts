import SupabaseClient from "@supabase/supabase-js/dist/module/SupabaseClient";
import { SupabaseClientService } from "./supabaseClient";
import { addDays, isAfter, isBefore } from "date-fns";
import { AlertStats } from "../modelo/home/AlertStats";

export class AlumnoServicioCasoUso {
     private supabaseService: SupabaseClientService;
      private client: SupabaseClient;
      private ALERT_TYPES = {
        SOS: 1,    // ID para alertas SOS
        DENUNCIA: 2, // ID para denuncias
        ALMA: 3     // ID para alertas ALMA
      };
      constructor() {
        this.supabaseService = new SupabaseClientService();
        this.client = this.supabaseService.getClient();
      }
      async getAlertStatsByType(
        alertTypeId: number,
        daysToExpire: number = 3
      ): Promise<AlertStats> {
        const now = new Date();
        const expirationThreshold = addDays(now, daysToExpire);
        
        // Obtener todas las alertas del tipo especificado
        const { data: alertas, error } = await this.client
          .from('alumnos_alertas')
          .select('*')
          .eq('alertas_tipo_alerta_tipo_id', alertTypeId);
      
        if (error) throw new Error(`Error obteniendo alertas tipo ${alertTypeId}`);
      
        const stats: AlertStats = {
          totales: 0,
          activos: 0,
          vencidos: 0,
          por_vencer: 0
        };
      
        if (!alertas) return stats;
      
        stats.totales = alertas.length;
      
        alertas.forEach(alerta => {
          const fechaVencimiento = new Date(alerta.fecha_resolucion);
          
          if (alerta.estado.toLowerCase() === 'resuelto') {
            return; // No contar alertas ya resueltas
          }
      
          stats.activos++;
      
          if (isAfter(now, fechaVencimiento)) {
            stats.vencidos++;
          } else if (isBefore(fechaVencimiento, expirationThreshold)) {
            stats.por_vencer++;
          }
        });
      
        return stats;
      }
}