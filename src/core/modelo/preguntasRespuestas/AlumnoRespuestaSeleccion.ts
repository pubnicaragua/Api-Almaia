import { BaseModel } from "../BaseModel";

export class AlumnoRespuestaSeleccion extends BaseModel {
    alumno_respuesta_id?: number;
    alumno_id: number;
    pregunta_id: number;
    respuesta_posible_id: number;
    constructor(){
        super();
        this.alumno_id = 0;
        this.pregunta_id = 0;
        this.respuesta_posible_id = 0;
    }
  }
  