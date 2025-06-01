export type EstadisticaEmocionGrado = {
  curso_id: number;
  curso_nombre: string;
  grado_id: number;
  grado_nombre: string;
  respuesta_nombre: string;
  cantidad: number;
  porcentaje: number;
};
export type OutputEstadisticaEmocionGrado = {
  name: string;
  [respuesta: string]: number | string;
};