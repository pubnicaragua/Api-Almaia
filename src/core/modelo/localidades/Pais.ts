import { BaseModel } from "../BaseModel";

export class Pais extends BaseModel {
    pais_id: number;
    nombre: string;
    constructor(){
        super();
        this.pais_id = 0;
        this.nombre = "";
    }
  }