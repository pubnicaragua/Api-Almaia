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

const supabaseService = new SupabaseClientService();
const client: SupabaseClient = supabaseService.getClient();
const dataService: DataService<CalendarioFechaImportante> = new DataService(
  "calendarios_fechas_importantes",
  "calendario_fecha_importante_id"
);
export const DashboardHomeService = {
  async getStatsCards(req: Request, res: Response, next: NextFunction) {
    try {
      const { colegio_id_bd } = req.params;
      let colegio_id = parseInt(colegio_id_bd);
      const sevenDaysAgo = startOfDay(subDays(new Date(), 7)).toISOString();
      colegio_id = await obtenerIdColegio(colegio_id, req.user.usuario_id);
      const alumnoServicioCasoUso = new AlumnoServicioCasoUso(colegio_id);
      const calendario_escolar = obtenerCalendarioPorColegio(colegio_id);
      const alumnnos = alumnoServicioCasoUso.obtenerAlumnosColegio();
      const [totalAlumnos, alumnosActivos] = await Promise.all([
        alumnoServicioCasoUso.obtenerCantidadAlumnos(colegio_id),
        alumnoServicioCasoUso.obntenerConteoporTabla(
          "alumnos_respuestas",
          sevenDaysAgo
        ),
        alumnoServicioCasoUso.obntenerConteoporTabla(
          "alumno_respuesta_seleccion",
          sevenDaysAgo
        ),
      ]);
      // Obtener datos de actividad
      const responses = await alumnoServicioCasoUso.calcularAlumnosActivos(
        sevenDaysAgo
      );
      const alertas_services_caso_uso = new AlertasServicioCasoUso();
      const [sosStats, denunciaStats, amarillaStats, naranjaStats, rojaStats] =
        await Promise.all([
          alertas_services_caso_uso.getAlertStatsByType(ALERT_TYPES.SOS),
          alertas_services_caso_uso.getAlertStatsByType(ALERT_TYPES.DENUNCIA),
          alertas_services_caso_uso.getAlertStatsByType(ALERT_TYPES.ALMARILLA),
          alertas_services_caso_uso.getAlertStatsByType(ALERT_TYPES.NARANJA),
          alertas_services_caso_uso.getAlertStatsByType(ALERT_TYPES.ROJA),
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
    const data: Emotion[] = [
      { name: "Tristeza", value: 2000, color: "#3b82f6" },
      { name: "Felicidad", value: 4000, color: "#facc15" },
      { name: "Estrés", value: 1800, color: "#6b7280" },
      { name: "Ansiedad", value: 3200, color: "#fb923c" },
      { name: "Enojo", value: 1200, color: "#ef4444" },
      { name: "Otros", value: 2800, color: "#a855f7" },
    ];
    res.json(data);
  },

  // Función para datos de gráfico circular
  async getDonutData(req: Request, res: Response) {
    const data: DonutData[] = [
      {
        label: "10 Pendientes",
        value: 10,
        percentage: "22.8%",
        color: "#facc15",
      },
      { label: "07 Nuevos", value: 7, percentage: "13.9%", color: "#22c55e" },
      {
        label: "39 Atendidos",
        value: 39,
        percentage: "52.1%",
        color: "#3b82f6",
      },
      {
        label: "05 Aplazados",
        value: 5,
        percentage: "11.2%",
        color: "#a855f7",
      },
    ];
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
    const { data, error } = await client
      .from("alumnos_alertas")
      .select(
        "*,alumnos(alumno_id,url_foto_perfil,personas(persona_id,nombres,apellidos)),alertas_reglas(alerta_regla_id,nombre),alertas_origenes(alerta_origen_id,nombre),alertas_severidades(alerta_severidad_id,nombre),alertas_prioridades(alerta_prioridad_id,nombre),alertas_tipos(alerta_tipo_id,nombre)"
      )
      .gte(
        "fecha_generada",
        new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
      )
      .eq("activo", true) // Solo alertas activas
      .order("fecha_generada", { ascending: false }) // Más recientes primero
      .order("prioridad_id", { ascending: false }); // Prioridad alta primero

    if (error) {
      console.error("Error fetching alertas:", error);
    } else {
      console.log("Alertas recientes:", data);
      // Aquí puedes trabajar con los datos (mostrar en UI, etc.)
    }
    res.json(data);
  },
};
