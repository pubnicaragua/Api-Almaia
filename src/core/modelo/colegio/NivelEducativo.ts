import { BaseModel } from "../BaseModel";

export class NivelEducativo extends BaseModel {
    nivel_educativo_id: number;
    nombre: string;
    constructor(){
        super();
        this.nivel_educativo_id = 0;
        this.nombre = "";
    }
  }