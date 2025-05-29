import { Emotion } from "../modelo/dashboard/Emotion";
import { emotionColors } from "../modelo/dashboard/EmotionColor";

export function mapEmotions(
  respuestas: { nombre: string; cantidad: number }[]
): Emotion[] {
  return respuestas.map((r) => ({
    name: r.nombre,
    value: r.cantidad,
    color: emotionColors[r.nombre] || "#000000", // color por defecto si no está
  }));
}
