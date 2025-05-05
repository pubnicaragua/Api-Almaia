import { BaseModel } from "../BaseModel";

export class AlumnoSalud extends BaseModel {
    alumno_salud_id: number;
    alumno_id: number;
    condicion_medica: string;
    tratamiento: string;
    observaciones: string;
    constructor(){
        super();
        this.alumno_salud_id = 0;
        this.alumno_id = 0;
        this.condicion_medica = "";
        this.tratamiento = "";
        this.observaciones = "";
    }

  }