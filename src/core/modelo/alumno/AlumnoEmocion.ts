import { BaseModel } from "../BaseModel";

export class AlumnoEmocion extends BaseModel {
  alumno_emocion_id: number;
  alumno_id: number;
  emocion_id: number;
  fecha: string;
  intensidad: number;
  constructor() {
    super();
    this.alumno_emocion_id = 0;
    this.alumno_id = 0;
    this.emocion_id = 0;
    this.fecha = "";
    this.intensidad = 0;
  }
}
