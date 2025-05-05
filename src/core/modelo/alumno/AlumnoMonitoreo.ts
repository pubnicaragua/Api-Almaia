import { BaseModel } from "../BaseModel";

export class AlumnoMonitoreo extends BaseModel {
  alumno_monitoreo_id: number;
  alumno_id: number;
  fecha_accion: Date;
  tipo_accion: string;
  descripcion_accion: string;
  constructor() {
    super();
    this.alumno_monitoreo_id = 0;
    this.alumno_id = 0;
    this.fecha_accion = new Date();
    this.tipo_accion = "";
    this.descripcion_accion = "";
  }
}
