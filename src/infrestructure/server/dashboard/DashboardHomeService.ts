import { Request, Response } from "express";
import { RecentAlert } from "../../../core/modelo/dashboard/RecentAlert";
import { DonutData } from "../../../core/modelo/dashboard/DonutData";
import { ImportantDate } from "../../../core/modelo/dashboard/ImportantDate";
import { Emotion } from "../../../core/modelo/dashboard/Emotion";

export const DashboardHomeService = {
  async getStatsCards(res: Response) {
    const statCards = [
      {
        title: "Alumnos",
        count: 637,
        stats: [
          { label: "Inactivos", value: "19" },
          { label: "Frecuentes", value: "510" },
          { label: "Totales", value: "733" },
        ],
        className: "bg-gray-700", // Más intenso
        textColor: "text-white",
      },
      {
        title: "SOS Alma",
        count: 5,
        stats: [
          { label: "Vencidos", value: "0" },
          { label: "Por vencer", value: "2" },
          { label: "Totales", value: "13" },
        ],
        className: "bg-red-600", // Más intenso
        textColor: "text-white",
      },
      {
        title: "Denuncias",
        count: 19,
        stats: [
          { label: "Vencidos", value: "0" },
          { label: "Por vencer", value: "3" },
          { label: "Totales", value: "24" },
        ],
        className: "bg-purple-700", // Más intenso
        textColor: "text-white",
      },
      {
        title: "Alertas Alma",
        count: 57,
        stats: [
          { label: "Vencidos", value: "0" },
          { label: "Por vencer", value: "6" },
          { label: "Totales", value: "82" },
        ],
        className: "bg-yellow-500", // Más intenso
        textColor: "text-white",
      },
    ];
    res.json(statCards);
  },
async getEmotionData (req: Request, res: Response) {
    const data: Emotion[] = [
      { name: 'Tristeza', value: 1500, color: '#3b82f6' },
      { name: 'Felicidad', value: 3000, color: '#facc15' },
      { name: 'Estrés', value: 1000, color: '#6b7280' },
      { name: 'Ansiedad', value: 2500, color: '#fb923c' },
      { name: 'Enojo', value: 800, color: '#ef4444' },
      { name: 'Otros', value: 2000, color: '#a855f7' },
    ];
    res.json(data);
  },
  
  // Función para obtener emociones generales
  async getEmotionDataGeneral  (req: Request, res: Response)  {
    const data: Emotion[] = [
      { name: 'Tristeza', value: 2000, color: '#3b82f6' },
      { name: 'Felicidad', value: 4000, color: '#facc15' },
      { name: 'Estrés', value: 1800, color: '#6b7280' },
      { name: 'Ansiedad', value: 3200, color: '#fb923c' },
      { name: 'Enojo', value: 1200, color: '#ef4444' },
      { name: 'Otros', value: 2800, color: '#a855f7' },
    ];
    res.json(data);
  },
  
  // Función para datos de gráfico circular
  async getDonutData  (req: Request, res: Response) {
    const data: DonutData[] = [
      { label: '10 Pendientes', value: 10, percentage: '22.8%', color: '#facc15' },
      { label: '07 Nuevos', value: 7, percentage: '13.9%', color: '#22c55e' },
      { label: '39 Atendidos', value: 39, percentage: '52.1%', color: '#3b82f6' },
      { label: '05 Aplazados', value: 5, percentage: '11.2%', color: '#a855f7' },
    ];
    res.json(data);
  },
  
  // Función para fechas importantes
  async getImportantDates (req: Request, res: Response) {
    const data: ImportantDate[] = [
      { event: 'Pruebas Parciales', dateRange: 'Abr 02 - Abr 07' },
      { event: 'Reunión de Apoderados', dateRange: 'Abr 02 - Abr 07' },
      { event: 'Matrícula 2025', dateRange: 'Abr 02 - Abr 07' },
      { event: 'Semana santa', dateRange: 'Abr 02 - Abr 07' },
      { event: 'Pruebas Parciales', dateRange: 'Abr 02 - Abr 07' },
      { event: 'Pruebas Parciales', dateRange: 'Abr 02 - Abr 07' },
      { event: 'Pruebas Parciales', dateRange: 'Abr 02 - Abr 07' },
    ];
    res.json(data);
  },
  
  // Función para alertas recientes
 async getRecentAlerts (req: Request, res: Response)  {
    const data: RecentAlert[] = [
      {
        student: { name: 'Carolina Espina', image: '/smiling-woman-garden.png' },
        alertType: 'SOS Alma',
        date: 'Abr 02 - 2024',
      },
      {
        student: { name: 'Jaime Brito', image: '/young-man-city.png' },
        alertType: 'Denuncias',
        date: 'Mar 29 - 2024',
      },
      {
        student: { name: 'Teresa Ulloa', image: '/smiling-woman-garden.png' },
        alertType: 'IA',
        date: 'Mar 27 - 2024',
      },
      {
        student: { name: 'Carlos Araneda', image: '/young-man-city.png' },
        alertType: 'SOS Alma',
        date: 'Mar 26 - 2024',
      },
    ];
    res.json(data);
  },
};
