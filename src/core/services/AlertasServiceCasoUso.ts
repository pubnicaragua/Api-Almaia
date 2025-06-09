/* eslint-disable @typescript-eslint/no-explicit-any */
import SupabaseClient from "@supabase/supabase-js/dist/module/SupabaseClient";
import { SupabaseClientService } from "./supabaseClient";
import { AlertStats } from "../modelo/home/AlertStats";
import { AlertaMapeada } from "../modelo/alerta/AlertaMapeada";
import { DonutData } from "../modelo/dashboard/DonutData";
import { obtenerRelacionados } from "./ObtenerTablasColegioCasoUso";

export class AlertasServicioCasoUso {
  private supabaseService: SupabaseClientService;
  private client: SupabaseClient;
  constructor() {
    this.supabaseService = new SupabaseClientService();
    this.client = this.supabaseService.getClient();
  }
 async getAlertStatsByType(
  alertTypeId: number,
  colegio_id: number = 0
): Promise<AlertStats> {
  try {
    // Validar parámetros
    if (!alertTypeId) {
      throw new Error('Se requiere un ID de tipo de alerta válido');
    }

    // Llamar a la función PostgreSQL
    const { data, error } = await this.client.rpc('obtener_estadisticas_alertas', {
      p_colegio_id: colegio_id !== 0 ? colegio_id : null,
      p_alerta_tipo_id: alertTypeId
    });

    if (error) {
      throw new Error(`Error al obtener estadísticas de alertas: ${error.message}`);
    }

    // La función RPC devuelve un array, tomamos el primer elemento
    const stats = data?.[0] || {
      totales: 0,
      activos: 0,
      vencidos: 0,
      por_vencer: 0
    };

    return {
      totales: Number(stats.totales) || 0,
      activos: Number(stats.activos) || 0,
      vencidos: Number(stats.vencidos) || 0,
      por_vencer: Number(stats.por_vencer) || 0
    };

  } catch (error) {
    console.error('Error en getAlertStatsByType:', error);
    throw error;
  }
}
  async getAlertasDonutData(colegio_id: any = 0): Promise<DonutData[]> {
    let data = null;
    if (colegio_id !== 0) {
      data = await obtenerRelacionados({
        tableFilter: "alumnos",
        filterField: "colegio_id",
        filterValue: colegio_id,
        idField: "alumno_id",
        tableIn: "alumnos_alertas",
        inField: "alumno_id",
        selectFields: `estado`,
      });
    } else {
      const { data: data_alertas, error } = await this.client
        .from("alumnos_alertas")
        .select("*");

      if (error) throw error;
      data = data_alertas;
    }

    // Contar ocurrencias por estado
    const counts: Record<string, number> = {};
    data.forEach((item) => {
      const key = String(item.estado).toLowerCase();
      counts[key] = (counts[key] || 0) + 1;
    });

    const total = Object.values(counts).reduce((a, b) => a + b, 0);

    const donutData: DonutData[] = Object.entries(counts).map(
      ([estado, value]) => ({
        label: `${String(value).padStart(2, "0")} ${estadoLabels[getEstadoKeyFromLabel(estado)|| 'pendiente']}`,
        value,
        percentage: `${((value / total) * 100).toFixed(1)}%`,
        color: colores[getEstadoKeyFromLabel(estado)|| 'pendiente'] || "#000000",
      })
    );

    return donutData;
  }
}
export function mapearAlertas(alertas: any[]): AlertaMapeada[] {
  return alertas.map((alerta) => {
    const { personas, ...rest } = alerta;
    return {
      ...rest,
      persona_responsable_actual: personas,
    };
  });
}
export function mapearAlertaDetalle(alertas: any[]): any[] {
  return alertas.map((alerta) => {
    const { ...rest } = alerta;
    return {
      id: rest.alumno_alerta_id,
      student: {
        alumno_id: rest.alumnos.alumno_id,
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
      description: `Alerta generada por ${rest?.alertas_reglas?.nombre} con severidad ${rest?.alertas_severidades?.nombre}`,
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
export async function contarAlertasPendientesPorColegio(
  client: SupabaseClient,
  colegioId: number
): Promise<number> {
  try {
    // 1. Obtener los IDs de alumnos que pertenecen al colegio
    const { data: alumnos, error: errorAlumnos } = await client
      .from("alumnos")
      .select("alumno_id")
      .eq("colegio_id", colegioId);

    if (errorAlumnos) throw errorAlumnos;

    const alumnoIds = alumnos?.map((a) => a.alumno_id) || [];

    if (alumnoIds.length === 0) {
      return 0; // No hay alumnos en el colegio
    }

    // 2. Contar las alertas pendientes de esos alumnos
    const { count, error: errorAlertas } = await client
      .from("alumnos_alertas")
      .select("*", { count: "exact", head: true })
      .eq("estado", "pendiente")
      .in("alumno_id", alumnoIds);

    if (errorAlertas) throw errorAlertas;

    return count || 0;
  } catch (error) {
    console.error("Error en contarAlertasPendientesPorColegio:", error);
    throw new Error("No se pudo contar las alertas pendientes.");
  }
}export async function contarAlertasPorColegio(
  client: SupabaseClient,
  colegioId: number
): Promise<number> {
  try {
    // 1. Obtener los IDs de alumnos que pertenecen al colegio
    const { data: alumnos, error: errorAlumnos } = await client
      .from("alumnos")
      .select("alumno_id")
      .eq("colegio_id", colegioId);

    if (errorAlumnos) throw errorAlumnos;

    const alumnoIds = alumnos?.map((a) => a.alumno_id) || [];

    if (alumnoIds.length === 0) {
      return 0; // No hay alumnos en el colegio
    }

    // 2. Contar las alertas pendientes de esos alumnos
    const { count, error: errorAlertas } = await client
      .from("alumnos_alertas")
      .select("*", { count: "exact", head: true })
      .in("alumno_id", alumnoIds);

    if (errorAlertas) throw errorAlertas;

    return count || 0;
  } catch (error) {
    console.error("Error en contarAlertasPendientesPorColegio:", error);
    throw new Error("No se pudo contar las alertas pendientes.");
  }
}

const colores: Record<string, string> = {
  pendiente: "#facc15",  // Amarillo: esperando acción
  asignada: "#22c55e",   // Verde: ya tiene responsable
  reasignado: "#3b82f6", // Azul: ha cambiado de responsable
  resuelta: "#10b981",   // Verde más claro: solucionado
  curso: "#0ea5e9",      // Azul claro: en proceso
  cerrada: "#6b7280",    // Gris: ya finalizado
  anulada: "#ef4444",    // Rojo: cancelado
};

const estadoLabels: Record<string, string> = {
  pendiente: "Pendientes",
  asignada: "Asignado",
  reasignado: " Reasignado",
  resuelta: "Resuelta",
  curso: "En curso",
  cerrada: "Cerrada",
  anulada: "Anulada",
};
function getEstadoKeyFromLabel(label: string): string | undefined {
  const lowerLabel = label.toLowerCase().trim();
  return Object.entries(estadoLabels).find(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    ([_, value]) => value.toLowerCase() === lowerLabel
  )?.[0];
}