import { BaseModel } from "../BaseModel";

export class RespuestaPosible extends BaseModel {
    respuesta_posible_id: number;
    nombre: string;
    constructor(){
        super();
        this.respuesta_posible_id = 0;
        this.nombre = "";
    }
  }