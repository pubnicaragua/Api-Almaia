import { BaseModel } from "./BaseModel";

export class CalendarioEscolar extends BaseModel {
    calendario_escolar_id: number;
    colegio_id: number;
    ano_escolar: number;
    fecha_inicio: Date;
    fecha_fin: Date;
    dias_habiles: number;
    constructor(){
        super();
        this.calendario_escolar_id = 0;
        this.colegio_id = 0;
        this.ano_escolar = 0;
        this.fecha_inicio = new Date();
        this.fecha_fin = new Date();
        this.dias_habiles = 0;
    }
  }