/* eslint-disable @typescript-eslint/no-explicit-any */
import { ComparativaDato } from "../modelo/alumno/ComparativaDato";
import { AlertData } from "../modelo/dashboard/AlertData";
import { Emotion } from "../modelo/dashboard/Emotion";
import { emotionColors } from "../modelo/dashboard/EmotionColor";
import { EstadisticaEmocionGrado, EstadisticaPatologiaGrado, OutputEstadisticaEmocionGrado } from "../modelo/dashboard/EstadisticaEmocionGrado";
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

export function mapEmotionsPromedio(
  respuestas: {
    nombre: string;
    cantidad_alumno: number,
    proporcion_alumno: number,
    porcentaje_alumno: number,
    cantidad_global: number,
    proporcion_global: number,
    porcentaje_global: number
  }[]
): ComparativaDato[] {
  return respuestas.map((r) => ({
    name: r.nombre,
    alumno: r.proporcion_alumno,
    promedio: r.porcentaje_global, // color por defecto si no está
  } as any));
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
export const mapearEmocionGrado = (input: EstadisticaEmocionGrado[]): OutputEstadisticaEmocionGrado[] => {
  const grouped: { [curso_nombre: string]: OutputEstadisticaEmocionGrado } = {};

  input.forEach((item) => {
    const key = item.curso_nombre;

    if (!grouped[key]) {
      grouped[key] = { name: item.curso_nombre };
    }

    grouped[key][item.respuesta_nombre] = item.cantidad;
  });

  return Object.values(grouped);
};
export const mapearPatologiaGrado = (input: EstadisticaPatologiaGrado[]): OutputEstadisticaEmocionGrado[] => {
  const grouped: { [curso_nombre: string]: OutputEstadisticaEmocionGrado } = {};

  input.forEach((item) => {
    const key = item.curso_nombre;

    if (!grouped[key]) {
      grouped[key] = { name: item.curso_nombre };
    }

    grouped[key][item.diagnostico] = item.cantidad;
  });

  return Object.values(grouped);
};