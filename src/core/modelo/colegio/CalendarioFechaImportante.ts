import { BaseModel } from "../BaseModel";

export class CalendarioFechaImportante extends BaseModel {
  calendario_fecha_importante_id: number;
  colegio_id: number;
  curso_id: number;
  calendario_escolar_id: number;
  titulo: string;
  descripcion: string;
  fecha: Date;
  tipo: string;
  constructor() {
    super();
    this.calendario_fecha_importante_id = 0;
    this.colegio_id = 0;
    this.curso_id = 0;
    this.calendario_escolar_id = 0;
    this.titulo = "";
    this.descripcion = "";
    this.fecha = new Date();
    this.tipo = "";
  }
}
