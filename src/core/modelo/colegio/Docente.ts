import { BaseModel } from "../BaseModel";

export class Docente extends BaseModel {
    docente_id?: number;
    persona_id: number;
    colegio_id: number;
    especialidad: string;
    estado: string;
    constructor(){
        super();
        this.persona_id = 0;
        this.colegio_id = 0;
        this.especialidad = "";
        this.estado = "";
    }
  
  }