import { Request, Response } from "express";
import { AlertData } from "../../../core/modelo/dashboard/AlertData";
import { Emotion } from "../../../core/modelo/dashboard/Emotion";
import { SupabaseClientService } from "../../../core/services/supabaseClient";
import { SupabaseClient } from "@supabase/supabase-js";
import { mapearGestorAlertasHoy } from "../../../core/services/DashboardServiceCasoUso";

const supabaseService = new SupabaseClientService();
const client: SupabaseClient = supabaseService.getClient();
export const DashboardComparativaService = {
  getEmotionsDataCourse(req: Request, res: Response) {
    const data: Emotion[] = [
      { name: "Tristeza", value: 1500, color: "#3b82f6" },
      { name: "Felicidad", value: 3000, color: "#facc15" },
      { name: "Estrés", value: 1000, color: "#6b7280" },
      { name: "Ansiedad", value: 2500, color: "#fb923c" },
      { name: "Enojo", value: 800, color: "#ef4444" },
      { name: "Otros", value: 2000, color: "#6b7280" },
    ];
    res.json(data);
  },

  async obtenerGestorAlertasHoy(req: Request, res: Response) {
    const { colegio_id } = req.query;
    if (colegio_id !== undefined) {
      const { data: data_emociones, error } = await client.rpc(
        "obtener_estadisticas_alertas",
        {
          p_colegio_id: colegio_id || null,
        }
      );
      if (error) {
        console.error("Error al obtener cantidades:", error);
      } else {
        const data: AlertData[] = mapearGestorAlertasHoy(data_emociones);
        res.json(data);
      }
    }
  },  
  async obtenerGestorHistorial(req: Request, res: Response) {
    const { colegio_id } = req.query;
    if (colegio_id !== undefined) {
      const { data: data_emociones, error } = await client.rpc(
        "obtener_gestor_historial",
        {
          p_colegio_id: colegio_id || null,
        }
      );
      if (error) {
        console.error("Error al obtener cantidades:", error);
      } else {
        const data: AlertData[] = mapearGestorAlertasHoy(data_emociones);
        res.json(data);
      }
    }
  },
};
