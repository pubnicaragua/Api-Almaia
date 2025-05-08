/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { RecentAlert } from "../../../core/modelo/dashboard/RecentAlert";
import { DonutData } from "../../../core/modelo/dashboard/DonutData";
import { ImportantDate } from "../../../core/modelo/dashboard/ImportantDate";
import { Emotion } from "../../../core/modelo/dashboard/Emotion";
import { SupabaseClientService } from "../../../core/services/supabaseClient";
import { SupabaseClient } from "@supabase/supabase-js";
const supabaseService = new SupabaseClientService();
const client: SupabaseClient = supabaseService.getClient();
export const DashboardHomeService = {
  async getStatsCards(req: Request, res: Response, next: NextFunction) {
    try {
      // Total de alumnos
      const { count: totalAlumnos, error: alumnosError } = await client
        .from("alumnos")
        .select("*", { count: "exact", head: true });
  
      if (alumnosError) {
        console.error("Error obteniendo alumnos:", alumnosError);
        return res.status(500).json({ message: "Error obteniendo alumnos" });
      }
  
      // Simulaciones de los valores que aún no están siendo consultados directamente
      const response = {
        alumnos: {
          activos: 637,        // Aquí podrías hacer una consulta con filtro si lo deseas
          inactivos: 10,
          frecuentes: 510,
          totales: totalAlumnos ?? 0,
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
  
      res.json(response);
    } catch (err) {
      console.error("Error en getStatsCards:", err);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  },
  
  async getEmotionData(req: Request, res: Response, next:NextFunction) {
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
    const data: ImportantDate[] = [
      { event: "Pruebas Parciales", dateRange: "Abr 02 - Abr 07" },
      { event: "Reunión de Apoderados", dateRange: "Abr 02 - Abr 07" },
      { event: "Matrícula 2025", dateRange: "Abr 02 - Abr 07" },
      { event: "Semana santa", dateRange: "Abr 02 - Abr 07" },
      { event: "Pruebas Parciales", dateRange: "Abr 02 - Abr 07" },
      { event: "Pruebas Parciales", dateRange: "Abr 02 - Abr 07" },
      { event: "Pruebas Parciales", dateRange: "Abr 02 - Abr 07" },
    ];
    res.json(data);
  },

  // Función para alertas recientes
  async getRecentAlerts(req: Request, res: Response) {
    const data: RecentAlert[] = [
      {
        student: {
          name: "Carolina Espina",
          image: "/smiling-woman-garden.png",
        },
        alertType: "SOS Alma",
        date: "Abr 02 - 2024",
      },
      {
        student: { name: "Jaime Brito", image: "/young-man-city.png" },
        alertType: "Denuncias",
        date: "Mar 29 - 2024",
      },
      {
        student: { name: "Teresa Ulloa", image: "/smiling-woman-garden.png" },
        alertType: "IA",
        date: "Mar 27 - 2024",
      },
      {
        student: { name: "Carlos Araneda", image: "/young-man-city.png" },
        alertType: "SOS Alma",
        date: "Mar 26 - 2024",
      },
    ];
    res.json(data);
  },
};
