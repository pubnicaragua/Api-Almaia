/* eslint-disable @typescript-eslint/no-explicit-any */
import { AlertData } from "../modelo/dashboard/AlertData";
import { Emotion } from "../modelo/dashboard/Emotion";
import { emotionColors } from "../modelo/dashboard/EmotionColor";
import { patologiaColors } from "../modelo/dashboard/PatologiaColors";

export function mapEmotions(
  respuestas: { nombre: string; cantidad: number }[]
): Emotion[] {
  return respuestas.map((r) => ({
    name: r.nombre,
    value: r.cantidad,
    color: emotionColors[r.nombre] || "#000000", // color por defecto si no está
  }));
}
export function mapPatologia(
  respuestas: { diagnostico: string; cantidad: number }[]
): Emotion[] {
  return respuestas.map((r) => ({
    name: r.diagnostico,
    value: r.cantidad,
    color: patologiaColors[r.diagnostico] || "#000000", // color por defecto si no está
  }));
}
const monthMap: { [key: string]: string } = {
  '01': 'Ene',
  '02': 'Feb',
  '03': 'Mar',
  '04': 'Abr',
  '05': 'May',
  '06': 'Jun',
  '07': 'Jul',
  '08': 'Ago',
  '09': 'Sep',
  '10': 'Oct',
  '11': 'Nov',
  '12': 'Dic'
};
export function mapearGestorAlertasHoy(conteoAlertas:any){
  const data: AlertData[] = conteoAlertas.map((item: { mes: { split: (arg0: string) => [any]; }; alertas_atendidas: any; alertas_vencidas: any; }) => {
    const [month] = item.mes.split('-');
    return {
      month: monthMap[month] || item.mes,
      vencidas: item.alertas_atendidas,
      atendidas: item.alertas_vencidas
    };
  });
  return data
}