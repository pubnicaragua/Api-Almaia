import { BaseModel } from "../BaseModel";

export class AlumnoActividad extends BaseModel {
    alumno_actividad_id: number;
    alumno_id: number;
    actividad_id: number;
    constructor(){
        super();
        this.alumno_actividad_id = 0;
        this.alumno_id = 0;
        this.actividad_id = 0;
    }
  }