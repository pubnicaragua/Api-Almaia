/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { RecentAlert } from "../../../core/modelo/dashboard/RecentAlert";
import { DonutData } from "../../../core/modelo/dashboard/DonutData";
import { ImportantDate } from "../../../core/modelo/dashboard/ImportantDate";
import { Emotion } from "../../../core/modelo/dashboard/Emotion";
import { SupabaseClientService } from "../../../core/services/supabaseClient";
import { SupabaseClient } from "@supabase/supabase-js";
import { subDays, formatISO, startOfDay } from "date-fns";
import { AlumnoServicioCasoUso } from "../../../core/services/AlumnoServicioCasoUso";
import { AlertasServicioCasoUso } from "../../../core/services/AlertasServiceCasoUso";
import { ALERT_TYPES } from "../../../core/modelo/home/AlertType";
import { CalendarioFechaImportante } from "../../../core/modelo/colegio/CalendarioFechaImportante";
import { DataService } from "../DataService";
import { AlertStats } from "../../../core/modelo/home/AlertStats";
import { obtenerCalendarioPorColegio } from "../../../core/services/CalendarioEscolarCasoUso";
import { obtenerIdColegio } from "../../../core/services/ColegioServiceCasoUso";
import { mapEmotions, mapPatologia } from "../../../core/services/DashboardServiceCasoUso";

const supabaseService = new SupabaseClientService();
const client: SupabaseClient = supabaseService.getClient();
const dataService: DataService<CalendarioFechaImportante> = new DataService(
  "calendarios_fechas_importantes",
  "calendario_fecha_importante_id"
);
export const DashboardHomeService = {
  async getStatsCards(req: Request, res: Response, next: NextFunction) {
    try {
      const { colegio_id: colegio_id_query } = req.query;
      let colegio_id = 0;
      const sevenDaysAgo = startOfDay(subDays(new Date(), 7)).toISOString();
      colegio_id = await obtenerIdColegio(
        colegio_id_query,
        req.user.usuario_id
      );
      const alumnoServicioCasoUso = new AlumnoServicioCasoUso(colegio_id);
      const calendario_escolar = obtenerCalendarioPorColegio(colegio_id);
      const alumnnos = await alumnoServicioCasoUso.obtenerAlumnosColegio();
      const [totalAlumnos, alumnosActivos] = await Promise.all([
        alumnoServicioCasoUso.obtenerCantidadAlumnos(colegio_id),
        alumnoServicioCasoUso.obtenerAlumnosActivos(colegio_id)
      ]);
      // Obtener datos de actividad
      const responses = await alumnoServicioCasoUso.calcularAlumnosActivos(
        sevenDaysAgo
      );
      const alertas_services_caso_uso = new AlertasServicioCasoUso();
      const [sosStats, denunciaStats, amarillaStats, naranjaStats, rojaStats] =
        await Promise.all([
          alertas_services_caso_uso.getAlertStatsByType(
            ALERT_TYPES.SOS,
            colegio_id
          ),
          alertas_services_caso_uso.getAlertStatsByType(
            ALERT_TYPES.DENUNCIA,
            colegio_id
          ),
          alertas_services_caso_uso.getAlertStatsByType(
            ALERT_TYPES.ALMARILLA,
            colegio_id
          ),
          alertas_services_caso_uso.getAlertStatsByType(
            ALERT_TYPES.NARANJA,
            colegio_id
          ),
          alertas_services_caso_uso.getAlertStatsByType(
            ALERT_TYPES.ROJA,
            colegio_id
          ),
        ]);
      const alumnosFrecuentes =
        alumnoServicioCasoUso.calcularAlumnosFrecuentes(responses);
      const almaStats: AlertStats = {
        totales:
          amarillaStats.totales + naranjaStats.totales + rojaStats.totales,
        activos:
          amarillaStats.activos + naranjaStats.activos + rojaStats.activos,
        vencidos:
          amarillaStats.vencidos + naranjaStats.vencidos + rojaStats.vencidos,
        por_vencer:
          amarillaStats.por_vencer +
          naranjaStats.por_vencer +
          rojaStats.por_vencer,
      };
      const response = {
        alumnos: {
          activos: alumnosActivos ?? 0,
          inactivos: (totalAlumnos ?? 0) - (alumnosActivos ?? 0),
          frecuentes: alumnosFrecuentes,
          totales: totalAlumnos ?? 0,
        },
        sos_alma: sosStats,
        denuncias: denunciaStats,
        alertas_alma: almaStats,
      };

      res.json(response);
    } catch (err) {
      console.error("Error en getStatsCards:", err);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  },
  async getEmotionData(req: Request, res: Response, next: NextFunction) {
    const data: Emotion[] = [
      { name: "Tristeza", value: 1500, color: "#3b82f6" },
      { name: "Felicidad", value: 3000, color: "#facc15" },
      { name: "Estrés", value: 1000, color: "#6b7280" },
      { name: "Ansiedad", value: 2500, color: "#fb923c" },
      { name: "Enojo", value: 800, color: "#ef4444" },
      { name: "Otros", value: 2000, color: "#a855f7" },
    ];
    res.json(data);
  },
  getEmotionsData(req: Request, res: Response) {
    const emotions = [
      { name: "Tristeza", value: 1500, color: "#29B6F6" },
      { name: "Felicidad", value: 3100, color: "#FFCA28" },
      { name: "Estrés", value: 950, color: "#757575" },
      { name: "Ansiedad", value: 2600, color: "#FFA726" },
      { name: "Enojo", value: 750, color: "#F44336" },
      { name: "Otros", value: 1900, color: "#BA68C8" },
    ];

    res.json({ emotions });
  },

  // Función para obtener emociones generales
  async getEmotionDataGeneral(req: Request, res: Response) {
    const { colegio_id, fecha_hasta } = req.query;
    let data;
    if (colegio_id !== undefined) {
      const { data: data_emociones, error } = await client.rpc(
        "obtener_cantidades_pregunta_3",
        {
          p_colegio_id: colegio_id || null,
          p_fecha_hasta: fecha_hasta || undefined,
        }
      );
      if (error) {
        console.error("Error al obtener cantidades:", error);
      } else {
        data = mapEmotions(data_emociones);
      }
    } else {
      const { data: data_emociones, error } = await client.rpc(
        "obtener_cantidades_pregunta_3"
      );
      if (error) {
        console.error("Error al obtener cantidades:", error);
      } else {
        data = mapEmotions(data_emociones);
      }
    }
    res.json(data);
  },

  async getEmotionDataPatologia(req: Request, res: Response) {
    const { colegio_id, fecha_hasta } = req.query;
    let data;
    if (colegio_id !== undefined) {
      const { data: data_emociones, error } = await client.rpc(
        "obtener_cantidades_por_diagnostico",
        {
          p_colegio_id: colegio_id || null,
          p_fecha_hasta: fecha_hasta || undefined,
          p_tipo_concepto: "Patologia"
        }
      );
      if (error) {
        console.error("Error al obtener cantidades:", error);
      } else {
        data = mapPatologia(data_emociones);
      }
    } else {
      const { data: data_emociones, error } = await client.rpc(
        "obtener_cantidades_por_diagnostico"
      );
      if (error) {
        console.error("Error al obtener cantidades:", error);
      } else {
        data = mapPatologia(data_emociones);
      }
    }
    res.json(data);
  },

  async getEmotionDataNeurodivergencia(req: Request, res: Response) {
    const { colegio_id, fecha_hasta } = req.query;
    let data;
    if (colegio_id !== undefined) {
      const { data: data_emociones, error } = await client.rpc(
        "obtener_cantidades_por_diagnostico",
        {
          p_colegio_id: colegio_id || null,
          p_fecha_hasta: fecha_hasta || undefined,
          p_tipo_concepto: "Neurodivergencia"
        }
      );
      if (error) {
        console.error("Error al obtener cantidades:", error);
      } else {
        data = mapPatologia(data_emociones);
      }
    } else {
      const { data: data_emociones, error } = await client.rpc(
        "obtener_cantidades_por_diagnostico",
        {
          p_tipo_concepto: "Neurodivergencia"
        }
      );
      if (error) {
        console.error("Error al obtener cantidades:", error);
      } else {
        data = mapPatologia(data_emociones);
      }
    }
    res.json(data);
  },

  // Función para datos de gráfico circular
  async getDonutData(req: Request, res: Response) {
    const alertas_services_caso_uso = new AlertasServicioCasoUso();
    const { colegio_id } = req.query;

    const data: DonutData[] =
      await alertas_services_caso_uso.getAlertasDonutData(colegio_id);
    res.json(data);
  },

  // Función para fechas importantes
  async getImportantDates(req: Request, res: Response) {
    const fechasImportantes = await dataService.getAll(
      [
        "*",
        "colegios(colegio_id,nombre)",
        "cursos(nombre_curso,grados(grado_id,nombre),niveles_educativos(nivel_educativo_id,nombre))",
        "calendarios_escolares(calendario_escolar_id,ano_escolar,fecha_inicio,fecha_fin,dias_habiles)",
      ],
      req.query
    );
    res.json(fechasImportantes);
  },

  // Función para alertas recientes
  async getRecentAlerts(req: Request, res: Response) {
  const {data, error } = await client.rpc('obtener_alertas_por_colegio',{
      p_colegio_id:req.query.colegio_id
    });
    if(error){
      console.error(error.message)
    }
    res.json(data);
  },
};
