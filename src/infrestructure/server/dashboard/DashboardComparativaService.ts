import { Request, Response } from "express";
import { AlertData } from "../../../core/modelo/dashboard/AlertData";
import { Emotion } from "../../../core/modelo/dashboard/Emotion";

export const DashboardComparativaService = {
     getEmotionsDataCourse(req: Request, res: Response) {
        const data: Emotion[] = [
          { name: 'Tristeza', value: 1500, color: '#3b82f6' },
          { name: 'Felicidad', value: 3000, color: '#facc15' },
          { name: 'Estrés', value: 1000, color: '#6b7280' },
          { name: 'Ansiedad', value: 2500, color: '#fb923c' },
          { name: 'Enojo', value: 800, color: '#ef4444' },
          { name: 'Otros', value: 2000, color: '#6b7280' },
        ];
        res.json(data);
      },
      
      
      getAlertsLineChartData  (req: Request, res: Response)  {
        const data: AlertData[] = [
          { month: 'Ene', courseA: 1200, courseB: 1500 },
          { month: 'Feb', courseA: 900, courseB: 1200 },
          { month: 'Mar', courseA: 1500, courseB: 1000 },
          { month: 'Abr', courseA: 2000, courseB: 1800 },
          { month: 'May', courseA: 3000, courseB: 2500 },
          { month: 'Jun', courseA: 2500, courseB: 2800 },
          { month: 'Jul', courseA: 2800, courseB: 3200 },
        ];
        res.json(data);
      }
}