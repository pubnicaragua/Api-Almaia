import { BaseModel } from "../BaseModel";

export class AlumnoRespuesta extends BaseModel {
    alumno_respuesta: number;
    alumno_id: number;
    pregunta_id: number;
    respuesta_posiblle_id: number;
    constructor(){
        super();
        this.alumno_respuesta = 0;
        this.alumno_id = 0;
        this.pregunta_id = 0;
        this.respuesta_posiblle_id = 0;
    }
  }
  